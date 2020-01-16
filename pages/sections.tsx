import {
  Heading,
  HeadingLevels,
  Paragraph
} from "lbh-frontend-react/components";
import { NextPage } from "next";
import React from "react";

import { TaskList, TaskListStatus } from "../components/TaskList";
import { TenancySummary } from "../components/TenancySummary";
import useData from "../helpers/useData";
import useProcessSectionComplete from "../helpers/useProcessSectionComplete";
import MainLayout from "../layouts/MainLayout";
import PageSlugs, { urlObjectForSlug } from "../steps/PageSlugs";
import PageTitles from "../steps/PageTitles";
import Storage from "../storage/Storage";
import { StoreValue } from "remultiform/database";
import ProcessDatabaseSchema from "../storage/ProcessDatabaseSchema";

const idResidencyStartedValidator = (
  values: (
    | StoreValue<ProcessDatabaseSchema["schema"], "id" | "residency" | "tenant">
    | undefined
  )[]
): boolean => values.some(v => v !== undefined);

const propertyInspectionCompleteValidator = (
  values: (
    | StoreValue<ProcessDatabaseSchema["schema"], "property">
    | undefined
  )[]
): boolean => {
  const v = values[0] as { outside: object; rooms: object };
  return v !== undefined && v.outside !== undefined && v.rooms !== undefined;
};

const wellbeingStartedValidator = (
  values: (
    | StoreValue<
        ProcessDatabaseSchema["schema"],
        "homeCheck" | "healthConcerns" | "disability"
      >
    | undefined
  )[]
): boolean => values.some(v => v !== undefined);

const wellbeingCompleteValidator = (
  values: (
    | StoreValue<
        ProcessDatabaseSchema["schema"],
        "homeCheck" | "healthConcerns" | "disability"
      >
    | undefined
  )[]
): boolean => {
  const v = values[0] as { value: string } | undefined;
  if (v && v.value == "no") {
    return true;
  } else {
    return values.every(v => v !== undefined);
  }
};

export const SectionsPage: NextPage = () => {
  const tenancyData = useData(Storage.ExternalContext, "tenancy");
  const residentData = useData(Storage.ExternalContext, "residents");
  const idAndResidencyComplete = useProcessSectionComplete([
    "id",
    "residency",
    "tenant"
  ]);
  const idAndResidencyStarted = useProcessSectionComplete(
    ["id", "residency", "tenant"],
    idResidencyStartedValidator
  );
  const householdStarted = { result: false };
  const householdComplete = { result: false };
  const propertyInspectionStarted = useProcessSectionComplete(["property"]);
  const propertyInspectionComplete = useProcessSectionComplete(
    ["property"],
    propertyInspectionCompleteValidator
  );
  const wellbeingSupportStarted = useProcessSectionComplete(
    ["homeCheck", "healthConcerns", "disability"],
    wellbeingStartedValidator
  );
  const wellbeingSupportComplete = useProcessSectionComplete(
    ["homeCheck", "healthConcerns", "disability"],
    wellbeingCompleteValidator
  );
  const reviewStarted = { result: false };
  const reviewComplete = { result: false };

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
                status: idAndResidencyComplete.result
                  ? TaskListStatus.Completed
                  : idAndResidencyStarted.result
                  ? TaskListStatus.Started
                  : TaskListStatus.NotStarted
              },
              {
                name: "Household",
                url: urlObjectForSlug(PageSlugs.Household),
                status: idAndResidencyComplete.result
                  ? householdComplete.result
                    ? TaskListStatus.Completed
                    : householdStarted.result
                    ? TaskListStatus.Started
                    : TaskListStatus.NotStarted
                  : TaskListStatus.Unavailable
              },
              {
                name: "Property inspection",
                url: urlObjectForSlug(PageSlugs.Rooms),
                status: idAndResidencyComplete.result
                  ? propertyInspectionComplete.result
                    ? TaskListStatus.Completed
                    : propertyInspectionStarted.result
                    ? TaskListStatus.Started
                    : TaskListStatus.NotStarted
                  : TaskListStatus.Unavailable
              },
              {
                name: "Wellbeing support",
                url: urlObjectForSlug(PageSlugs.HomeCheck),
                status: idAndResidencyComplete.result
                  ? wellbeingSupportComplete.result
                    ? TaskListStatus.Completed
                    : wellbeingSupportStarted.result
                    ? TaskListStatus.Started
                    : TaskListStatus.NotStarted
                  : TaskListStatus.Unavailable
              },
              {
                name: "Review and submit",
                url: urlObjectForSlug(PageSlugs.Submit),
                status: idAndResidencyComplete.result
                  ? reviewComplete.result
                    ? TaskListStatus.Completed
                    : reviewStarted.result
                    ? TaskListStatus.Started
                    : TaskListStatus.NotStarted
                  : TaskListStatus.Unavailable
              }
            ]}
          />
        </>
      )}
    </MainLayout>
  );
};

export default SectionsPage;
