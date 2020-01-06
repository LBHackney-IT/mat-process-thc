import {
  Heading,
  HeadingLevels,
  Paragraph
} from "lbh-frontend-react/components";
import { NextPage } from "next";
import React, { createContext } from "react";
import { useAsync } from "react-async-hook";
import { Database } from "remultiform/database";
import { DatabaseContext, useDatabase } from "remultiform/database-context";

import { TaskList } from "../components/TaskList";
import { TenancySummary } from "../components/TenancySummary";
import useProcessSectionComplete from "../helpers/useProcessSectionComplete";
import MainLayout from "../layouts/MainLayout";
import PageSlugs, { hrefForSlug } from "../steps/PageSlugs";
import PageTitles from "../steps/PageTitles";
import ExternalDatabaseSchema from "../storage/ExternalDatabaseSchema";
import processRef from "../storage/processRef";
import Storage from "../storage/Storage";

export const SectionsPage: NextPage = () => {
  const database = useDatabase(
    Storage.ExternalContext ||
      // This is a bit of a hack to get around contexts being
      // undefined on the server, while still obeying the rules of hooks.
      ({
        context: createContext<Database<ExternalDatabaseSchema> | undefined>(
          undefined
        )
      } as DatabaseContext<ExternalDatabaseSchema>)
  );
  const tenancyData = useAsync(
    async (db: Database<ExternalDatabaseSchema> | undefined) =>
      db?.get("tenancy", processRef),
    [database]
  );
  const contactsData = useAsync(
    async (db: Database<ExternalDatabaseSchema> | undefined) =>
      db?.get("contacts", processRef),
    [database]
  );
  const idAndResidencyComplete = useProcessSectionComplete(processRef, [
    "id",
    "residency",
    "tenant"
  ]);

  return (
    <MainLayout title={PageTitles.Sections}>
      <Heading level={HeadingLevels.H1}>
        Tenancy and Household Check sections
      </Heading>

      <TenancySummary
        details={{
          address: contactsData.result
            ? contactsData.result.address
            : contactsData.error
            ? ["Error"]
            : undefined,
          tenants: contactsData.result
            ? contactsData.result.tenants.map(tenant => tenant.fullName)
            : contactsData.error
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

      {idAndResidencyComplete.loading || wellbeingComplete.loading ? (
        <Paragraph>Checking process status...</Paragraph>
      ) : (
        <>
          <Paragraph>
            {idAndResidencyComplete.result
              ? "Please complete the remaining sections."
              : "To begin the check, verify the tenant's ID and proof of residency."}
          </Paragraph>

          <TaskList
            items={[
              {
                name: "ID, residency, and tenant information",
                href: hrefForSlug(PageSlugs.Id),
                status: idAndResidencyComplete.result ? "Completed" : undefined
              },
              {
                name: "Household",
                href: hrefForSlug(PageSlugs.Submit),
                status: idAndResidencyComplete.result ? undefined : ""
              },
              {
                name: "Property inspection",
                href: hrefForSlug(PageSlugs.Rooms),
                status: idAndResidencyComplete.result ? undefined : ""
              },
              {
                name: "Wellbeing support",
                href: hrefForSlug(PageSlugs.Submit),
                status: idAndResidencyComplete.result ? undefined : ""
              },
              {
                name: "Review and submit",
                href: hrefForSlug(PageSlugs.Submit),
                status: idAndResidencyComplete.result ? undefined : ""
              }
            ]}
          />
        </>
      )}
    </MainLayout>
  );
};

export default SectionsPage;
