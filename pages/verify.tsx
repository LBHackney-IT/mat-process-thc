import formatDate from "date-fns/format";
import {
  Heading,
  HeadingLevels,
  Link,
  Paragraph
} from "lbh-frontend-react/components";
import { NextPage } from "next";
import React from "react";
import { Table } from "../components/Table";
import { TenancySummary } from "../components/TenancySummary";
import useData from "../helpers/useData";
import MainLayout from "../layouts/MainLayout";
import PageSlugs, { urlObjectForSlug } from "../steps/PageSlugs";
import PageTitles from "../steps/PageTitles";
import ExternalDatabaseSchema from "../storage/ExternalDatabaseSchema";
import Storage from "../storage/Storage";

export const VerifyPage: NextPage = () => {
  const tenancyData = useData(Storage.ExternalContext, "tenancy");
  const residentData = useData(Storage.ExternalContext, "residents");

  const tableRows = (
    residentData.result || {
      tenants: [] as ExternalDatabaseSchema["schema"]["residents"]["value"]["tenants"]
    }
  ).tenants
    .map(tenant => {
      return {
        id: tenant.id,
        name: tenant.fullName,
        dateOfBirth: tenant.dateOfBirth
      };
    })
    .map(tenant => {
      return [
        tenant.name,
        formatDate(tenant.dateOfBirth, "d MMMM yyyy"),
        "Unverified",
        "Unverified",
        <Link
          key="verify-link"
          href={urlObjectForSlug(PageSlugs.Id, tenant.id).pathname}
        >
          Verify
        </Link>
      ];
    });

  return (
    <MainLayout title={PageTitles.Verify} heading="Verify tenant details">
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

      <Paragraph>
        For this section, tenants will need to provide proof of ID and
        residency.
      </Paragraph>
      <Paragraph>
        If any tenants are not present for this visit, only proof of residency
        is required for those tenants.
      </Paragraph>

      <Heading level={HeadingLevels.H2}>Select a tenant to check</Heading>

      <Table
        headings={["Tenant", "Date of birth", "ID", "Residency", "Actions"]}
        rows={tableRows}
      />
    </MainLayout>
  );
};

export default VerifyPage;
