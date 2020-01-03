import {
  Heading,
  HeadingLevels
} from "lbh-frontend-react/components/typography/Heading";
import { Paragraph } from "lbh-frontend-react/components/typography/Paragraph";
import { NextPage } from "next";
import React from "react";

import { TaskList } from "../components/TaskList";
import { TenancySummary } from "../components/TenancySummary";
import MainLayout from "../layouts/MainLayout";
import PageSlugs, { hrefForSlug } from "../steps/PageSlugs";
import PageTitles from "../steps/PageTitles";

export const SectionsPage: NextPage = () => {
  // This needs to be derived from the current state of the process data.
  const idCheckCompleted = false;

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
      <Paragraph>
        {idCheckCompleted
          ? "Please complete the remaining sections."
          : "To begin the check, verify the tenant's ID and proof of residency."}
      </Paragraph>
      <TaskList
        items={[
          {
            name: "ID, residency, and tenant information",
            href: hrefForSlug(PageSlugs.Submit),
            status: idCheckCompleted ? "Completed" : undefined,
            "data-testid": "start-id"
          },
          {
            name: "Household",
            href: hrefForSlug(PageSlugs.Submit),
            status: idCheckCompleted ? undefined : "",
            "data-testid": "start-household"
          },
          {
            name: "Property inspection",
            href: hrefForSlug(PageSlugs.Submit),
            status: idCheckCompleted ? undefined : "",
            "data-testid": "start-property"
          },
          {
            name: "Wellbeing support",
            href: hrefForSlug(PageSlugs.Submit),
            status: idCheckCompleted ? undefined : "",
            "data-testid": "start-wellbeing"
          },
          {
            name: "Review and submit",
            href: hrefForSlug(PageSlugs.Submit),
            status: idCheckCompleted ? undefined : "",
            "data-testid": "start-review"
          }
        ]}
      />
    </MainLayout>
  );
};

export default SectionsPage;
