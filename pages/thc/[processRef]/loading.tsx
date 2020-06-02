import {
  Button,
  ErrorMessage,
  Heading,
  HeadingLevels,
  Paragraph,
} from "lbh-frontend-react/components";
import { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { nullAsUndefined } from "null-as-undefined";
import React, { useMemo, useState } from "react";
import { useAsync } from "react-async-hook";
import ProgressBar from "../../../components/ProgressBar";
import { TenancySummary } from "../../../components/TenancySummary";
import useApi from "../../../helpers/api/useApi";
import useApiWithStorage, {
  UseApiWithStorageReturn,
} from "../../../helpers/api/useApiWithStorage";
import basePath from "../../../helpers/basePath";
import getMatApiData from "../../../helpers/getMatApiData";
import getProcessRef from "../../../helpers/getProcessRef";
import isClient from "../../../helpers/isClient";
import isClosed from "../../../helpers/isClosed";
import isManager from "../../../helpers/isManager";
import isServer from "../../../helpers/isServer";
import titleCase from "../../../helpers/titleCase";
import urlsForRouter from "../../../helpers/urlsForRouter";
import usePrecacheAll from "../../../helpers/usePrecacheAll";
import MainLayout from "../../../layouts/MainLayout";
import PageSlugs, { urlObjectForSlug } from "../../../steps/PageSlugs";
import PageTitles from "../../../steps/PageTitles";
import ExternalDatabaseSchema from "../../../storage/ExternalDatabaseSchema";
import { ProcessJson } from "../../../storage/ProcessDatabaseSchema";
import { ResidentRef } from "../../../storage/ResidentDatabaseSchema";
import Storage from "../../../storage/Storage";

const useFetchProcessJson = (): {
  loading: boolean;
  result?: ProcessJson;
  error?: Error;
} => {
  const router = useRouter();

  const processRef = getProcessRef(router);

  const processData = useApi<{ processData: ProcessJson }>({
    endpoint: `/v1/processes/${processRef}/processData`,
    jwt: {
      sessionStorageKey:
        isClient && processRef ? `${processRef}:processApiJwt` : undefined,
    },
    execute: Boolean(processRef),
  });

  return {
    loading: processData.loading,
    error: processData.error,
    result: processData.result?.processData,
  };
};

const useFetchImages = (
  processData: ProcessJson["processData"] | undefined
): {
  loading: boolean;
  result?: { id: string; ext: string; image: string }[];
  error?: Error;
  fetchedImageCount: number;
  expectedImageCount: number;
} => {
  const router = useRouter();

  const processRef = getProcessRef(router);

  const jwt =
    isClient && processRef
      ? nullAsUndefined(sessionStorage.getItem(`${processRef}:processApiJwt`))
      : undefined;

  let images:
    | ReturnType<typeof Storage.getImagesToFetch>
    | undefined = undefined;

  if (processData) {
    images = Storage.getImagesToFetch(processData);
  }

  const [fetchedImageCount, setFetchedImageCount] = useState(0);

  const imageResults = useAsync(async () => {
    if (isServer) {
      return;
    }

    if (!images) {
      return;
    }

    if (!processRef) {
      throw new Error("Process ref is missing from session storage");
    }

    if (!jwt) {
      throw new Error("JWT is missing from session storage");
    }

    return Promise.all(
      images.map(async ({ id, ext }) => {
        const path = `${basePath}/api/v1/processes/${processRef}/images/${id}/${ext}?jwt=${jwt}}`;
        let response: Response;
        try {
          response = await fetch(path, { method: "GET" });
        } catch (err) {
          throw new Error(`Fetch failed for ${path}`);
        }
        const responseBody = await response.text();

        let image: { base64Image: string } | undefined = undefined;

        try {
          image = JSON.parse(responseBody);
        } catch (err) {
          if (err.name !== "SyntaxError") {
            throw err;
          }
        }

        if (!response.ok) {
          console.error(`${response.status}: ${response.statusText}`);

          throw new Error("Error accessing API");
        }

        if (image === undefined) {
          console.error(responseBody);

          throw new Error("Invalid JSON response from API");
        }

        setFetchedImageCount((count) => count + 1);

        return { id, ext, image: image.base64Image };
      })
    );
  }, [processRef, jwt, JSON.stringify(images)]);

  return {
    loading: isServer || imageResults.loading || !images,
    result: images ? imageResults.result : undefined,
    error: imageResults.error,
    fetchedImageCount,
    expectedImageCount: images ? images.length : 0,
  };
};

const useFetchProcessJsonWithImages = (): {
  loading: boolean;
  result?: ProcessJson;
  error?: Error;
  completedStepCount: number;
  expectedStepCount: number;
} => {
  const processJson = useFetchProcessJson();
  const images = useFetchImages(processJson.result?.processData);

  const processJsonWithImages = useMemo(() => {
    let loading = true;
    let error: Error | undefined;
    let result: ProcessJson | undefined = undefined;

    if (
      !processJson.loading &&
      !processJson.error &&
      processJson.result &&
      processJson.result.processData &&
      !images.loading &&
      !images.error &&
      images.result
    ) {
      try {
        if (images.result.length) {
          let processDataString = JSON.stringify(
            processJson.result.processData
          );

          for (const { id, ext, image } of images.result) {
            processDataString = processDataString.replace(
              new RegExp(`image:${id}\\.${ext}`, "g"),
              image
            );
          }

          result = {
            ...processJson.result,
            processData: JSON.parse(processDataString),
          };
        } else {
          result = processJson.result;
        }
      } catch (err) {
        error = err;
      }

      loading = false;
    }

    return { loading, result, error };
  }, [
    processJson.loading,
    processJson.error,
    processJson.result,
    images.loading,
    images.error,
    images.result,
  ]);

  const loading =
    processJson.loading || images.loading || processJsonWithImages.loading;
  const error =
    processJson.error || images.error || processJsonWithImages.error;

  return {
    loading,
    result: loading || error ? undefined : processJsonWithImages.result,
    error,
    completedStepCount:
      images.fetchedImageCount +
      (processJson.loading ? 0 : 1) +
      (processJsonWithImages.loading ? 0 : 1),
    expectedStepCount: images.expectedImageCount + 2,
  };
};

const useFetchAndStoreProcessJson = (): {
  loading: boolean;
  result?: boolean;
  error?: Error;
  completedStepCount: number;
  expectedStepCount: number;
} => {
  const router = useRouter();

  const processRef = getProcessRef(router);

  const processJson = useFetchProcessJsonWithImages();

  const offlineSync = useAsync(async () => {
    if (
      !processRef ||
      processJson.loading ||
      processJson.error ||
      !processJson.result
    ) {
      return;
    }

    // The steps still use the hardcoded `processRef`, so we need to also use
    // it, even though we're using the correct value to fetch from the
    // backend.
    return Storage.updateProcessData(processRef, processJson.result);
  }, [
    processRef,
    processJson.loading,
    processJson.error,
    JSON.stringify(processJson.result),
  ]);

  const loading = processJson.loading || offlineSync.loading;
  const error = processJson.error || offlineSync.error;

  return {
    loading,
    result: loading ? undefined : offlineSync.result,
    error,
    completedStepCount:
      processJson.completedStepCount + (offlineSync.loading ? 0 : 1),
    expectedStepCount: processJson.expectedStepCount + 1,
  };
};

const useFetchResidentData = (): UseApiWithStorageReturn<
  ExternalDatabaseSchema,
  "residents"
> => {
  const router = useRouter();

  const processRef = getProcessRef(router);
  const data = getMatApiData(processRef);

  return useApiWithStorage({
    endpoint: "/v1/residents",
    query: { data },
    jwt: {
      sessionStorageKey:
        isClient && processRef ? `${processRef}:matApiJwt` : undefined,
    },
    execute: Boolean(processRef),
    parse(data: {
      results: {
        contactId: ResidentRef;
        dateOfBirth: string;
        fullAddressDisplay: string;
        fullName: string;
        relationship: string;
        responsible: boolean;
      }[];
    }) {
      const fullAddress = data.results[0].fullAddressDisplay;
      const address = fullAddress
        .split("\n")
        .map((line) => titleCase(line.replace("\r", "")));

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const cityAndPostcodeParts = address.pop()!.split(" ");

      const cityAndPostcode = [
        cityAndPostcodeParts.slice(0, -2).join(" "),
        `${cityAndPostcodeParts[cityAndPostcodeParts.length - 2]} ${
          cityAndPostcodeParts[cityAndPostcodeParts.length - 1]
        }`.toUpperCase(),
      ];

      address.push(...cityAndPostcode);

      const tenants = data.results
        .filter((contact) => contact.responsible)
        .map((contact) => ({
          id: contact.contactId,
          fullName: contact.fullName,
          dateOfBirth: new Date(contact.dateOfBirth),
        }))
        .sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0));

      const householdMembers = data.results
        .filter((contact) => !contact.responsible)
        .map((contact) => ({
          id: contact.contactId,
          fullName: contact.fullName,
          dateOfBirth: new Date(contact.dateOfBirth),
          relationship: contact.relationship || "Not available",
        }))
        .sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0));

      return {
        address,
        tenants,
        householdMembers,
      };
    },
    databaseContext: Storage.ExternalContext,
    databaseMap: {
      storeName: "residents",
      key: processRef,
    },
  });
};

const useFetchTenancyData = (): UseApiWithStorageReturn<
  ExternalDatabaseSchema,
  "tenancy"
> => {
  const router = useRouter();

  const processRef = getProcessRef(router);
  const data = getMatApiData(processRef);

  return useApiWithStorage({
    endpoint: "/v1/tenancies",
    query: { data },
    jwt: {
      sessionStorageKey:
        isClient && processRef ? `${processRef}:matApiJwt` : undefined,
    },
    execute: Boolean(processRef),
    parse(data: {
      results: {
        tenuretype: string;
        tenancyStartDate: string;
        currentBalance: string;
      };
    }) {
      const tenureType = data.results.tenuretype;
      const tenancyStartDate = data.results.tenancyStartDate;
      const currentBalance = data.results.currentBalance;

      return {
        tenureType,
        startDate: new Date(tenancyStartDate),
        currentBalance,
      };
    },
    databaseContext: Storage.ExternalContext,
    databaseMap: {
      storeName: "tenancy",
      key: processRef,
    },
  });
};

const useOfficerData = (): UseApiWithStorageReturn<
  ExternalDatabaseSchema,
  "officer"
> => {
  const router = useRouter();

  const processRef = getProcessRef(router);
  const data = getMatApiData(processRef);

  return useApiWithStorage({
    endpoint: "/v1/officer",
    query: { data },
    jwt: {
      sessionStorageKey:
        isClient && processRef ? `${processRef}:matApiJwt` : undefined,
    },
    execute: Boolean(processRef),
    parse(data: { fullName: string }) {
      return { fullName: data.fullName };
    },
    databaseContext: Storage.ExternalContext,
    databaseMap: {
      storeName: "officer",
      key: processRef,
    },
  });
};

export const LoadingPage: NextPage = () => {
  const router = useRouter();
  const processDataSyncStatus = useFetchAndStoreProcessJson();
  const residentData = useFetchResidentData();
  const tenancyData = useFetchTenancyData();
  const officerData = useOfficerData();
  const precacheProcessPages = usePrecacheAll();

  const extraResults = [
    residentData,
    tenancyData,
    officerData,
    precacheProcessPages,
  ];

  const loading =
    processDataSyncStatus.loading ||
    extraResults.some((result) => result.loading);
  const errored =
    Boolean(processDataSyncStatus.error) ||
    extraResults.some((result) => result.error);
  const ready =
    !loading &&
    !errored &&
    processDataSyncStatus.result !== undefined &&
    extraResults.every((result) => result.result !== undefined);

  for (const result of [processDataSyncStatus, ...extraResults]) {
    if (result.error) {
      // We should give the user some way to recover from this. Perhaps we
      // should retry in this case and dedupe the error?
      console.error(result.error);
    }
  }

  const progress =
    (extraResults.filter(
      (result) =>
        !result.loading && !result.error && result.result !== undefined
    ).length +
      processDataSyncStatus.completedStepCount) /
    (extraResults.length + processDataSyncStatus.expectedStepCount);

  const isInManagerStage = isManager(router);
  const isInClosedStage = isClosed(router);

  const nextSlug = isInManagerStage
    ? PageSlugs.ManagerReview
    : isInClosedStage
    ? PageSlugs.ClosedReview
    : PageSlugs.Outside;

  const { href, as } = urlsForRouter(
    router,
    urlObjectForSlug(router, nextSlug)
  );

  const button = (
    <Button
      disabled={!ready || !href.pathname || !as.pathname}
      data-testid="submit"
    >
      {ready ? "Go" : "Loading..."}
    </Button>
  );

  return (
    <MainLayout
      title={PageTitles.Loading}
      heading="Tenancy and Household Check"
    >
      <TenancySummary
        details={{
          address: residentData.result
            ? residentData.result.address
            : residentData.error
            ? ["Error"]
            : undefined,
          tenants: residentData.result
            ? residentData.result.tenants.map((tenant) => tenant.fullName)
            : residentData.error
            ? ["Error"]
            : undefined,
          tenureType: tenancyData.result
            ? tenancyData.result.tenureType
            : tenancyData.error
            ? "Error"
            : undefined,
          startDate: tenancyData.result
            ? tenancyData.result.startDate
            : tenancyData.error
            ? "Error"
            : undefined,
        }}
      />

      {errored && (
        <ErrorMessage>
          Something went wrong. Please try reopening this process from your
          worktray.
        </ErrorMessage>
      )}

      <Heading level={HeadingLevels.H2}>Loading</Heading>
      <Paragraph>
        {isInManagerStage || isInClosedStage
          ? "The system is fetching the information you need for this process."
          : "The system is updating the information you need for this process so that you can go offline at any point."}
      </Paragraph>

      <ProgressBar
        progress={progress}
        incompleteLabel={errored ? "Error" : "Loading..."}
        completeLabel={
          errored
            ? "Error"
            : processDataSyncStatus.result
            ? "Ready (updated)"
            : "Ready (no update needed)"
        }
      />

      {href.pathname && as.pathname ? (
        <NextLink href={href} as={as}>
          {button}
        </NextLink>
      ) : (
        button
      )}
    </MainLayout>
  );
};

export default LoadingPage;
