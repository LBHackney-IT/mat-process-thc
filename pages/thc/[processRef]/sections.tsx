import { Paragraph } from "lbh-frontend-react/components";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { TaskList, TaskListStatus } from "../../../components/TaskList";
import { TenancySummary } from "../../../components/TenancySummary";
import getProcessRef from "../../../helpers/getProcessRef";
import useDataValue from "../../../helpers/useDataValue";
import useValidateData from "../../../helpers/useValidateData";
import MainLayout from "../../../layouts/MainLayout";
import PageSlugs, { urlObjectForSlug } from "../../../steps/PageSlugs";
import PageTitles from "../../../steps/PageTitles";
import Storage from "../../../storage/Storage";

export const SectionsPage: NextPage = () => {
  const router = useRouter();

  const processRef = getProcessRef(router);

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
    processRef
  );
  const idAndResidencyComplete = useValidateData(
    Storage.ResidentContext,
    ["id", "residency", "photo", "nextOfKin", "carer"],
    residentData.result?.tenants.map(tenant => tenant.id)
  );
  const householdStarted = useValidateData(
    Storage.ProcessContext,
    ["household"],
    processRef,
    valueSets => {
      const householdSet = valueSets.household;

      if (householdSet === undefined || processRef === undefined) {
        return false;
      }

      const household = householdSet[processRef];

      return household !== undefined && household.documents !== undefined;
    }
  );
  const householdComplete = useValidateData(
    Storage.ProcessContext,
    ["household"],
    processRef
  );
  const propertyInspectionStarted = useValidateData(
    Storage.ProcessContext,
    ["property"],
    processRef,
    valueSets => {
      const propertySet = valueSets.property;

      if (propertySet === undefined || processRef === undefined) {
        return false;
      }

      const property = propertySet[processRef];

      return property !== undefined && property.rooms !== undefined;
    }
  );
  const propertyInspectionComplete = useValidateData(
    Storage.ProcessContext,
    ["property"],
    processRef,
    valueSets => {
      const propertySet = valueSets.property;

      if (propertySet === undefined || processRef === undefined) {
        return false;
      }

      const property = propertySet[processRef];

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
    processRef,
    valueSets => {
      const homeCheckSet = valueSets.homeCheck;

      if (homeCheckSet === undefined || processRef === undefined) {
        return false;
      }

      const homeCheck = homeCheckSet[processRef];

      return homeCheck !== undefined;
    }
  );
  const wellbeingSupportComplete = useValidateData(
    Storage.ProcessContext,
    ["homeCheck", "healthConcerns", "disability"],
    processRef,
    valueSets => {
      const homeCheckSet = valueSets.homeCheck;

      if (homeCheckSet === undefined || processRef === undefined) {
        return false;
      }

      const homeCheck = homeCheckSet[processRef];

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
      pausable
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
                url: urlObjectForSlug(router, PageSlugs.PresentForCheck),
                status: idAndResidencyComplete.result
                  ? TaskListStatus.Completed
                  : idAndResidencyStarted.result
                  ? TaskListStatus.Started
                  : TaskListStatus.NotStarted
              },
              {
                name: "Household",
                url: urlObjectForSlug(router, PageSlugs.Household),
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
                url: urlObjectForSlug(router, PageSlugs.Rooms),
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
                url: urlObjectForSlug(router, PageSlugs.HomeCheck),
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
                url: urlObjectForSlug(router, PageSlugs.Review),
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
