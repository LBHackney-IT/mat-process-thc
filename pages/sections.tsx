import {
  Heading,
  HeadingLevels,
  Paragraph
} from "lbh-frontend-react/components";
import { NextPage } from "next";
import React from "react";

import { TaskList } from "../components/TaskList";
import { TenancySummary } from "../components/TenancySummary";
import useData from "../helpers/useData";
import useProcessSectionComplete from "../helpers/useProcessSectionComplete";
import MainLayout from "../layouts/MainLayout";
import PageSlugs, { urlObjectForSlug } from "../steps/PageSlugs";
import PageTitles from "../steps/PageTitles";
import Storage from "../storage/Storage";

export const SectionsPage: NextPage = () => {
  const tenancyData = useData(Storage.ExternalContext, "tenancy");
  const residentData = useData(Storage.ExternalContext, "residents");
  const idAndResidencyComplete = useProcessSectionComplete([
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
                url: urlObjectForSlug(PageSlugs.Id),
                status: idAndResidencyComplete.result ? "Completed" : undefined
              },
              {
                name: "Household",
                url: urlObjectForSlug(PageSlugs.Household),
                status: idAndResidencyComplete.result ? undefined : ""
              },
              {
                name: "Property inspection",
                url: urlObjectForSlug(PageSlugs.Rooms),
                status: idAndResidencyComplete.result ? undefined : ""
              },
              {
                name: "Wellbeing support",
                url: urlObjectForSlug(PageSlugs.HomeCheck),
                status: idAndResidencyComplete.result ? undefined : ""
              },
              {
                name: "Review and submit",
                url: urlObjectForSlug(PageSlugs.Submit),
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
