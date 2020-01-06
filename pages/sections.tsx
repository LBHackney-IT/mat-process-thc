import {
  Heading,
  HeadingLevels,
  Paragraph
} from "lbh-frontend-react/components";
import { NextPage } from "next";
import React from "react";

import { TaskList } from "../components/TaskList";
import { TenancySummary } from "../components/TenancySummary";
import useProcessSectionComplete from "../helpers/useProcessSectionComplete";
import MainLayout from "../layouts/MainLayout";
import PageSlugs, { hrefForSlug } from "../steps/PageSlugs";
import PageTitles from "../steps/PageTitles";
import processRef from "../storage/processRef";

export const SectionsPage: NextPage = () => {
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
