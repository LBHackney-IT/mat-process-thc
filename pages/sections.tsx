import { Paragraph } from "lbh-frontend-react/components";
import { NextPage } from "next";
import React from "react";

import { TaskList, TaskListStatus } from "../components/TaskList";
import { TenancySummary } from "../components/TenancySummary";
import getProcessRef from "../helpers/getProcessRef";
import useDataValue from "../helpers/useDataValue";
import useValidateData from "../helpers/useValidateData";
import MainLayout from "../layouts/MainLayout";
import PageSlugs, { urlObjectForSlug } from "../steps/PageSlugs";
import PageTitles from "../steps/PageTitles";
import Storage from "../storage/Storage";
import tmpProcessRef from "../storage/processRef";

export const SectionsPage: NextPage = () => {
  const processRef = getProcessRef();
  const tenancyData = useDataValue(
    Storage.ExternalContext,
    "tenancy",
    processRef,
    values => (processRef ? values[processRef] : undefined)
  );
  const residentData = useDataValue(
    Storage.ExternalContext,
    "residents",
    processRef,
    values => (processRef ? values[processRef] : undefined)
  );
  const idAndResidencyStarted = useValidateData(
    Storage.ProcessContext,
    ["tenantsPresent"],
    tmpProcessRef
  );
  const idAndResidencyComplete = useValidateData(
    Storage.ResidentContext,
    ["id", "residency", "photo", "nextOfKin", "carer"],
    residentData.result?.tenants.map(tenant => tenant.id)
  );
  const householdStarted = useValidateData(
    Storage.ProcessContext,
    ["household"],
    tmpProcessRef,
    valueSets => {
      const householdSet = valueSets.household;

      if (householdSet === undefined) {
        return false;
      }

      const household = householdSet[tmpProcessRef];

      return household !== undefined && household.documents !== undefined;
    }
  );
  const householdComplete = useValidateData(
    Storage.ProcessContext,
    ["household"],
    tmpProcessRef
  );
  const propertyInspectionStarted = useValidateData(
    Storage.ProcessContext,
    ["property"],
    tmpProcessRef,
    valueSets => {
      const propertySet = valueSets.property;

      if (propertySet === undefined) {
        return false;
      }

      const property = propertySet[tmpProcessRef];

      return property !== undefined && property.rooms !== undefined;
    }
  );
  const propertyInspectionComplete = useValidateData(
    Storage.ProcessContext,
    ["property"],
    tmpProcessRef,
    valueSets => {
      const propertySet = valueSets.property;

      if (propertySet === undefined) {
        return false;
      }

      const property = propertySet[tmpProcessRef];

      return (
        property !== undefined &&
        Object.entries(property).every(
          ([key, value]) => key === "outside" || value !== undefined
        )
      );
    }
  );
  const wellbeingSupportStarted = useValidateData(
    Storage.ProcessContext,
    ["homeCheck"],
    tmpProcessRef,
    valueSets => {
      const homeCheckSet = valueSets.homeCheck;

      if (homeCheckSet === undefined) {
        return false;
      }

      const homeCheck = homeCheckSet[tmpProcessRef];

      return homeCheck !== undefined;
    }
  );
  const wellbeingSupportComplete = useValidateData(
    Storage.ProcessContext,
    ["homeCheck", "healthConcerns", "disability"],
    tmpProcessRef,
    valueSets => {
      const homeCheckSet = valueSets.homeCheck;

      if (homeCheckSet === undefined) {
        return false;
      }

      const homeCheck = homeCheckSet[tmpProcessRef];

      return (
        homeCheck !== undefined &&
        (homeCheck.value === "no" ||
          Object.values(valueSets).every(valueSet =>
            Object.values(valueSet || {}).every(value => value !== undefined)
          ))
      );
    }
  );

  return (
    <MainLayout
      title={PageTitles.Sections}
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
                url: urlObjectForSlug(PageSlugs.PresentForCheck),
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
                url: urlObjectForSlug(PageSlugs.Review),
                status:
                  idAndResidencyComplete.result &&
                  householdComplete.result &&
                  propertyInspectionComplete.result &&
                  wellbeingSupportComplete.result
                    ? TaskListStatus.NotStarted
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
