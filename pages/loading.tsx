import {
  Button,
  List,
  Heading,
  HeadingLevels,
  Paragraph
} from "lbh-frontend-react/components";
import { NextPage } from "next";
import Link from "next/link";
import React from "react";
import { useAsync } from "react-async-hook";
import { StoreValue } from "remultiform/database";

import useExternalApi from "../api/useExternalApi";
import useProcessApi from "../api/useProcessApi";
import { TenancySummary } from "../components/TenancySummary";
import titleCase from "../helpers/titleCase";
import MainLayout from "../layouts/MainLayout";
import PageSlugs, { hrefForSlug } from "../steps/PageSlugs";
import PageTitles from "../steps/PageTitles";
import ExternalDatabaseSchema from "../storage/ExternalDatabaseSchema";
import processRef from "../storage/processRef";
import Storage from "../storage/Storage";

export const LoadingPage: NextPage = () => {
  const processData = useProcessApi({
    endpoint: `/v1/processData/${processRef}`
  });

  const tenancyData = useExternalApi<
    ExternalDatabaseSchema,
    "tenancy" | "contacts",
    [
      StoreValue<ExternalDatabaseSchema["schema"], "tenancy">,
      StoreValue<ExternalDatabaseSchema["schema"], "contacts">
    ]
  >(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.MAT_API_URL!,
    "eyJhbGciOiJIUzI1NiIsImtpZCI6IkhTMjU2IiwidHlwIjoiSldUIn0.eyJzdWIiOiIiLCJqdGkiOiIiLCJhcGlDbGFpbSI6Int9IiwibmJmIjowLCJleHAiOjE2MDcxNzQxODYsImlhdCI6MTU3NTU1MTc4NiwiaXNzIjoiT3V0c3lzdGVtcyIsImF1ZCI6Ik1hbmFnZUFUZW5hbmN5In0.57HICIXuIf3lGgTq1WEJ-HMbusaIWAqia8XimEUKNcg",
    [
      {
        endpoint: "/v1/Accounts/AccountDetailsByContactId",
        query: { contactid: "b6e72c28-7957-e811-8126-70106faa6a31" },
        parse(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: any
        ): StoreValue<ExternalDatabaseSchema["schema"], "tenancy"> {
          const tenureType = data.results.tenuretype as string;
          const tenancyStartDate = data.results.tenancyStartDate as string;

          return {
            tenureType,
            startDate: new Date(tenancyStartDate)
          };
        },
        databaseContext: Storage.ExternalContext,
        databaseMap: {
          storeName: "tenancy" as "tenancy",
          key: processRef
        }
      },
      {
        endpoint: "/v1/Contacts/GetContactsByUprn",
        query: { urpn: "100023017996" },
        parse(data): StoreValue<ExternalDatabaseSchema["schema"], "contacts"> {
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
          storeName: "contacts" as "contacts",
          key: processRef
        }
      }
    ]
  );

  const offlineProcessDataStatus = useAsync(
    async (process: typeof processData.result) => {
      if (!process) {
        return;
      }

      if (!process.processData) {
        return false;
      }

      return Storage.updateProcessData(processRef, process.processData);
    },
    [processData.result]
  );

  const loading =
    processData.loading ||
    tenancyData.loading ||
    offlineProcessDataStatus.loading;
  const errored =
    !loading &&
    Boolean(
      processData.error || tenancyData.error || offlineProcessDataStatus.error
    );
  const ready =
    !loading &&
    !errored &&
    processData.result &&
    tenancyData.result &&
    offlineProcessDataStatus.result !== undefined;

  if (processData.error) {
    // We should give the user some way to recover from this. Perhaps we should
    // retry in this case and dedupe the error?
    console.error(processData.error);
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

  return (
    <MainLayout
      title={PageTitles.Loading}
      heading="Tenancy and Household Check"
    >
      <TenancySummary
        details={{
          address: tenancyData.result
            ? tenancyData.result[1] && tenancyData.result[1].address
            : tenancyData.error
            ? ["Error"]
            : undefined,
          tenants: tenancyData.result
            ? tenancyData.result[1] &&
              tenancyData.result[1].tenants.map(tenant => tenant.fullName)
            : tenancyData.error
            ? ["Error"]
            : undefined,
          tenureType: tenancyData.result
            ? tenancyData.result[0] && tenancyData.result[0].tenureType
            : tenancyData.error
            ? "Error"
            : undefined,
          startDate: tenancyData.result
            ? tenancyData.result[0] && tenancyData.result[0].startDate
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

      <Link href={hrefForSlug(PageSlugs.VisitAttempt)}>
        <Button disabled={!ready} data-testid="submit">
          {ready ? "Go" : "Loading..."}
        </Button>
      </Link>
    </MainLayout>
  );
};

export default LoadingPage;
