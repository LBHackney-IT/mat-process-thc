import {
  Heading,
  HeadingLevels,
  Paragraph
} from "lbh-frontend-react/components";
import { NextPage } from "next";
import React, { createContext } from "react";
import { useAsync } from "react-async-hook";
import { Database, StoreMap } from "remultiform/database";
import { DatabaseContext, useDatabase } from "remultiform/database-context";

import { TaskList } from "../components/TaskList";
import { TenancySummary } from "../components/TenancySummary";
import MainLayout from "../layouts/MainLayout";
import PageSlugs, { hrefForSlug } from "../steps/PageSlugs";
import PageTitles from "../steps/PageTitles";
import DatabaseSchema from "storage/DatabaseSchema";
import processRef from "../storage/processRef";
import Storage from "../storage/Storage";

export const SectionsPage: NextPage = () => {
  const database = useDatabase(
    Storage.Context ||
      // This is a bit of a hack to get around `Storage.Context` being
      // undefined on the server, while still obeying the rules of hooks.
      ({
        context: createContext<Database<DatabaseSchema> | undefined>(undefined)
      } as DatabaseContext<DatabaseSchema>)
  );
  const idAndResidencyComplete = useAsync(
    async (db: typeof database) => {
      if (!db) {
        throw new Error("No database to check for status");
      }

      let result = true;

      await db.transaction(
        ["id", "residency", "tenant"],
        async (
          stores: StoreMap<
            DatabaseSchema["schema"],
            ("id" | "residency" | "tenant")[]
          >
        ) => {
          const id = await stores.id.get(processRef);
          const residency = await stores.residency.get(processRef);
          const tenant = await stores.tenant.get(processRef);

          result =
            id !== undefined && residency !== undefined && tenant !== undefined;
        }
      );

      return result;
    },
    [database]
  );

  return (
    <MainLayout title={PageTitles.Sections}>
      <Heading level={HeadingLevels.H1}>
        Tenancy and Household Check sections
      </Heading>

      <TenancySummary
        address="1 Mare Street, London, E8 3AA"
        tenants={["Jane Doe", "John Doe"]}
        tenureType="Introductory"
        startDate="1 January 2019"
      />

      {idAndResidencyComplete.loading ? (
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
                status: idAndResidencyComplete.result ? "Completed" : undefined,
                "data-testid": "start-id"
              },
              {
                name: "Household",
                href: hrefForSlug(PageSlugs.Submit),
                status: idAndResidencyComplete.result ? undefined : "",
                "data-testid": "start-household"
              },
              {
                name: "Property inspection",
                href: hrefForSlug(PageSlugs.Rooms),
                status: idAndResidencyComplete.result ? undefined : "",
                "data-testid": "start-property"
              },
              {
                name: "Wellbeing support",
                href: hrefForSlug(PageSlugs.Submit),
                status: idAndResidencyComplete.result ? undefined : "",
                "data-testid": "start-wellbeing"
              },
              {
                name: "Review and submit",
                href: hrefForSlug(PageSlugs.Submit),
                status: idAndResidencyComplete.result ? undefined : "",
                "data-testid": "start-review"
              }
            ]}
          />
        </>
      )}
    </MainLayout>
  );
};

export default SectionsPage;
