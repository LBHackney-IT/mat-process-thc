import {
  Button,
  List,
  Heading,
  HeadingLevels,
  Paragraph
} from "lbh-frontend-react/components";
import { NextPage } from "next";
import NextLink from "next/link";
import { nullAsUndefined } from "null-as-undefined";
import React from "react";
import { useAsync } from "react-async-hook";

import { TenancySummary } from "../components/TenancySummary";
import useApi from "../helpers/api/useApi";
import useApiWithStorage, {
  UseApiWithStorageReturn
} from "../helpers/api/useApiWithStorage";
import getProcessRef from "../helpers/getProcessRef";
import titleCase from "../helpers/titleCase";
import urlsForRouter from "../helpers/urlsForRouter";
import MainLayout from "../layouts/MainLayout";
import PageSlugs, { urlObjectForSlug } from "../steps/PageSlugs";
import PageTitles from "../steps/PageTitles";
import ExternalDatabaseSchema from "../storage/ExternalDatabaseSchema";
import Storage from "../storage/Storage";
import tmpProcessRef from "../storage/processRef";

const useFetchResidentData = (
  processRef: string | undefined
): UseApiWithStorageReturn<ExternalDatabaseSchema, "residents"> => {
  let data: string | undefined;

  if (process.browser) {
    data = nullAsUndefined(sessionStorage.getItem(`${processRef}:matApiData`));
  }

  return useApiWithStorage({
    endpoint: `${process.env.BASE_PATH}/api/v1/residents`,
    query: { data },
    jwt: { sessionStorageKey: `${processRef}:matApiJwt` },
    execute: Boolean(processRef),
    parse(data) {
      const fullAddress = data.results[0].fullAddressDisplay as string;
      const address = fullAddress
        .split("\n")
        .map(line => titleCase(line.replace("\r", "")));

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const cityAndPostcodeParts = address.pop()!.split(" ");

      const cityAndPostcode = [
        cityAndPostcodeParts.slice(0, -2).join(" "),
        `${cityAndPostcodeParts[cityAndPostcodeParts.length - 2]} ${
          cityAndPostcodeParts[cityAndPostcodeParts.length - 1]
        }`.toUpperCase()
      ];

      address.push(...cityAndPostcode);

      const tenants = data.results
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((contact: any) => contact.responsible)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((contact: any) => ({
          fullName: contact.fullName as string
        }));

      const householdMembers = data.results
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((contact: any) => !contact.responsible)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((contact: any) => ({
          fullName: contact.fullName as string
        }));

      return {
        address,
        tenants,
        householdMembers
      };
    },
    databaseContext: Storage.ExternalContext,
    databaseMap: {
      storeName: "residents",
      key: processRef
    }
  });
};

const useFetchTenancyData = (
  processRef: string | undefined
): UseApiWithStorageReturn<ExternalDatabaseSchema, "tenancy"> => {
  let data: string | undefined;

  if (process.browser) {
    data = nullAsUndefined(sessionStorage.getItem(`${processRef}:matApiData`));
  }

  return useApiWithStorage({
    endpoint: `${process.env.BASE_PATH}/api/v1/tenancies`,
    query: { data },
    jwt: { sessionStorageKey: `${processRef}:matApiJwt` },
    execute: Boolean(processRef),
    parse(data) {
      const tenureType = data.results.tenuretype as string;
      const tenancyStartDate = data.results.tenancyStartDate as string;

      return {
        tenureType,
        startDate: new Date(tenancyStartDate)
      };
    },
    databaseContext: Storage.ExternalContext,
    databaseMap: {
      storeName: "tenancy",
      key: processRef
    }
  });
};

export const LoadingPage: NextPage = () => {
  const processRef = getProcessRef();

  const processData = useApi({
    endpoint: `${process.env.BASE_PATH}/api/v1/process/${processRef}/processData`,
    jwt: { sessionStorageKey: `${processRef}:processApiJwt` },
    execute: Boolean(processRef)
  });

  const residentData = useFetchResidentData(processRef);
  const tenancyData = useFetchTenancyData(processRef);

  const offlineProcessDataStatus = useAsync(async () => {
    if (processData.loading) {
      return;
    }

    if (!processRef || !processData.result || !processData.result.processData) {
      return;
    }

    // The steps still use the hardcoded `processRef`, so we need to also use
    // it, even though we're using the correct value to fetch from the
    // backend.
    return Storage.updateProcessData(
      tmpProcessRef,
      processData.result.processData
    );
  }, [processRef, processData.loading, JSON.stringify(processData.result)]);

  const loading =
    processData.loading ||
    residentData.loading ||
    tenancyData.loading ||
    offlineProcessDataStatus.loading;
  const errored =
    !loading &&
    Boolean(
      processData.error ||
        residentData.error ||
        tenancyData.error ||
        offlineProcessDataStatus.error
    );
  const ready =
    !loading &&
    !errored &&
    processData.result &&
    residentData.result &&
    tenancyData.result &&
    offlineProcessDataStatus.result !== undefined;

  if (processData.error) {
    // We should give the user some way to recover from this. Perhaps we should
    // retry in this case and dedupe the error?
    console.error(processData.error);
  }

  if (residentData.error) {
    // We should give the user some way to recover from this. Perhaps we should
    // retry in this case and dedupe the error?
    console.error(residentData.error);
  }

  if (tenancyData.error) {
    // We should give the user some way to recover from this. Perhaps we should
    // retry in this case and dedupe the error?
    console.error(tenancyData.error);
  }

  if (offlineProcessDataStatus.error) {
    // We should give the user some way to recover from this. Perhaps we should
    // retry in this case and dedupe the error?
    console.error(offlineProcessDataStatus.error);
  }

  const progressItems = [
    `Fetching any answers previously saved to the Hub... ${
      processData.loading
        ? "Loading"
        : processData.error
        ? "Error"
        : processData.result
        ? "Loaded"
        : "N/A"
    }`,
    `Fetching and saving resident information... ${
      residentData.loading
        ? "Loading"
        : residentData.error
        ? "Error"
        : residentData.result
        ? "Saved"
        : "N/A"
    }`,
    `Fetching and saving tenancy information... ${
      tenancyData.loading
        ? "Loading"
        : tenancyData.error
        ? "Error"
        : tenancyData.result
        ? "Saved"
        : "N/A"
    }`
  ] as React.ReactNode[];

  if (processData.result) {
    progressItems.push(
      `Updating offline storage of process data... ${
        offlineProcessDataStatus.loading
          ? "Updating"
          : offlineProcessDataStatus.error
          ? "Error"
          : offlineProcessDataStatus.result
          ? "Updated"
          : "Process on device is more recent than in Hub"
      }`
    );
  }

  const { href, as } = urlsForRouter(urlObjectForSlug(PageSlugs.VisitAttempt));

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
            ? residentData.result.tenants.map(tenant => tenant.fullName)
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
            : undefined
        }}
      />

      <Heading level={HeadingLevels.H2}>Previsit setup</Heading>
      <Paragraph>
        The system is currently updating the information you need for this
        process so that you can work offline or online.
      </Paragraph>
      <Paragraph>
        Please wait until the &lsquo;Go&rsquo; button is available to be clicked
        before proceeding.
      </Paragraph>

      <List items={progressItems} />
      {errored && (
        <Paragraph>
          Something went really wrong. Please contact support.
        </Paragraph>
      )}

      <NextLink href={href} as={as}>
        <Button disabled={!ready} data-testid="submit">
          {ready ? "Go" : "Loading..."}
        </Button>
      </NextLink>
    </MainLayout>
  );
};

export default LoadingPage;
