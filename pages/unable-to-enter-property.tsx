import {
  Heading,
  HeadingLevels,
  Fieldset,
  FieldsetLegend
} from "lbh-frontend-react/components";
import { NextPage } from "next";
import React, { createContext } from "react";
import { useAsync } from "react-async-hook";
import { Database } from "remultiform/database";
import { DatabaseContext, useDatabase } from "remultiform/database-context";

import { Checkboxes } from "../components/Checkboxes";
import { TenancySummary } from "../components/TenancySummary";
import MainLayout from "../layouts/MainLayout";
import PageTitles from "../steps/PageTitles";
import ExternalDatabaseSchema from "../storage/ExternalDatabaseSchema";
import processRef from "../storage/processRef";
import Storage from "../storage/Storage";

export const UnableToEnterProperty: NextPage = () => {
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

  return (
    <MainLayout title={PageTitles.UnableToEnterProperty}>
      <Heading level={HeadingLevels.H1}>Unable to enter property</Heading>

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

      <Fieldset
        legend={
          <FieldsetLegend>
            Why were you unable to enter the property? Did you observe anything
            of concern?
          </FieldsetLegend>
        }
      >
        <Checkboxes
          checkboxes={[
            {
              label: "Tenant not in",
              value: "tenant not in"
            }
          ]}
        ></Checkboxes>
      </Fieldset>
    </MainLayout>
  );
};

export default UnableToEnterProperty;
