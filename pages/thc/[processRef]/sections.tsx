import { Paragraph } from "lbh-frontend-react/components";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { StoreValue } from "remultiform/database";
import { TaskList, TaskListStatus } from "../../../components/TaskList";
import { TenancySummary } from "../../../components/TenancySummary";
import getProcessRef from "../../../helpers/getProcessRef";
import useDataValue from "../../../helpers/useDataValue";
import useValidateData from "../../../helpers/useValidateData";
import { tenantNotPresent } from "../../../helpers/yesNoNotPresentRadio";
import MainLayout from "../../../layouts/MainLayout";
import PageSlugs, { urlObjectForSlug } from "../../../steps/PageSlugs";
import PageTitles from "../../../steps/PageTitles";
import ExternalDatabaseSchema from "../../../storage/ExternalDatabaseSchema";
import ProcessDatabaseSchema, {
  ProcessRef,
} from "../../../storage/ProcessDatabaseSchema";
import Storage from "../../../storage/Storage";

interface Status {
  loading: boolean;
  status: TaskListStatus | undefined;
  errors: Error[] | undefined;
}

const useIdAndResidencyStatus = (
  processRef: ProcessRef | undefined,
  residentData:
    | StoreValue<ExternalDatabaseSchema["schema"], "residents">
    | undefined
): Status => {
  const tenantsPresent = useDataValue(
    Storage.ProcessContext,
    "tenantsPresent",
    processRef,
    (values) => (processRef !== undefined ? values[processRef] : undefined)
  );

  const allTenantIds = residentData?.tenants.map((tenant) => tenant.id);
  const presentTenantIds = tenantsPresent.result;

  const started = useValidateData(
    Storage.ProcessContext,
    ["tenantsPresent"],
    processRef,
    (valueSets) => {
      const tenantsPresentSet = valueSets.tenantsPresent;

      if (tenantsPresentSet === undefined || processRef === undefined) {
        return false;
      }

      const tenantsPresent = tenantsPresentSet[processRef];

      const completedFirstStep = tenantsPresent !== undefined;

      return completedFirstStep;
    }
  );

  const idCompleted = useValidateData(
    Storage.ResidentContext,
    ["id"],
    presentTenantIds,
    (valueSets) => {
      const idSet = valueSets.id;

      if (idSet === undefined) {
        return false;
      }

      const allCompletedRequiredStep =
        Object.values(idSet).length === presentTenantIds?.length &&
        Object.values(idSet).every(
          (id) => id?.type && id.type !== tenantNotPresent.value
        );

      return allCompletedRequiredStep;
    }
  );

  const residencyCompleted = useValidateData(
    Storage.ResidentContext,
    ["residency"],
    allTenantIds,
    (valueSets) => {
      const residencySet = valueSets.residency;

      if (residencySet === undefined) {
        return false;
      }

      const allCompletedRequiredStep =
        Object.values(residencySet).length === allTenantIds?.length &&
        Object.values(residencySet).every((residency) => residency?.type);

      return allCompletedRequiredStep;
    }
  );

  const loading =
    tenantsPresent.loading ||
    started.loading ||
    idCompleted.loading ||
    residencyCompleted.loading;

  const errors = [];

  if (tenantsPresent.error) {
    errors.push(tenantsPresent.error);
  }

  if (started.error) {
    errors.push(started.error);
  }

  if (idCompleted.error) {
    errors.push(idCompleted.error);
  }

  if (residencyCompleted.error) {
    errors.push(residencyCompleted.error);
  }

  // Note that we don't check the last step like we do for other sections, as
  // no step after residency creates an empty object when submitting without
  // answering any questions.
  return {
    loading,
    status: loading
      ? undefined
      : started.result
      ? idCompleted.result && residencyCompleted.result
        ? TaskListStatus.Completed
        : TaskListStatus.Started
      : TaskListStatus.NotStarted,
    errors: errors.length > 0 ? errors : undefined,
  };
};

const useHouseholdStatus = (processRef: ProcessRef | undefined): Status => {
  const started = useValidateData(
    Storage.ProcessContext,
    ["household"],
    processRef,
    (valueSets) => {
      const householdSet = valueSets.household;

      if (householdSet === undefined || processRef === undefined) {
        return false;
      }

      const household = householdSet[processRef];
      const completedFirstStep = household?.documents !== undefined;

      return completedFirstStep;
    }
  );

  const completed = useValidateData(
    Storage.ProcessContext,
    ["household"],
    processRef,
    (valueSets) => {
      const householdSet = valueSets.household;

      if (householdSet === undefined || processRef === undefined) {
        return false;
      }

      const household = householdSet[processRef];
      const completedLastStep = household?.otherProperty !== undefined;

      return completedLastStep;
    }
  );

  const loading = started.loading || completed.loading;

  const errors = [];

  if (started.error) {
    errors.push(started.error);
  }

  if (completed.error) {
    errors.push(completed.error);
  }

  return {
    loading,
    status: loading
      ? undefined
      : started.result
      ? completed.result
        ? TaskListStatus.Completed
        : TaskListStatus.Started
      : TaskListStatus.NotStarted,
    errors: errors.length > 0 ? errors : undefined,
  };
};

const usePropertyInspectionStatus = (
  processRef: ProcessRef | undefined
): Status => {
  const started = useValidateData(
    Storage.ProcessContext,
    ["property"],
    processRef,
    (valueSets) => {
      const propertySet = valueSets.property;

      if (propertySet === undefined || processRef === undefined) {
        return false;
      }

      const property = propertySet[processRef];
      const completedFirstStep = property?.rooms !== undefined;

      return completedFirstStep;
    }
  );

  const completed = useValidateData(
    Storage.ProcessContext,
    ["property"],
    processRef,
    (valueSets) => {
      const propertySet = valueSets.property;

      if (propertySet === undefined || processRef === undefined) {
        return false;
      }

      const property = propertySet[processRef];
      const completedLastStep = property?.otherComments !== undefined;

      return completedLastStep !== undefined;
    }
  );

  const loading = started.loading || completed.loading;

  const errors = [];

  if (started.error) {
    errors.push(started.error);
  }

  if (completed.error) {
    errors.push(completed.error);
  }

  return {
    loading,
    status: loading
      ? undefined
      : started.result
      ? completed.result
        ? TaskListStatus.Completed
        : TaskListStatus.Started
      : TaskListStatus.NotStarted,
    errors: errors.length > 0 ? errors : undefined,
  };
};

const useWellbeingSupportStatus = (
  processRef: ProcessRef | undefined
): Status => {
  const started = useValidateData(
    Storage.ProcessContext,
    ["homeCheck"],
    processRef,
    (valueSets) => {
      const homeCheckSet = valueSets.homeCheck;

      if (homeCheckSet === undefined || processRef === undefined) {
        return false;
      }

      const homeCheck = homeCheckSet[processRef];
      const completedFirstStep = homeCheck !== undefined;

      return completedFirstStep;
    }
  );

  const completed = useValidateData(
    Storage.ProcessContext,
    ["homeCheck", "supportNeeds"],
    processRef,
    (valueSets) => {
      const homeCheckSet = valueSets.homeCheck;
      const supportNeedsSet = valueSets.supportNeeds;

      if (
        homeCheckSet === undefined ||
        supportNeedsSet === undefined ||
        processRef === undefined
      ) {
        return false;
      }

      const homeCheck = homeCheckSet[processRef] as
        | StoreValue<ProcessDatabaseSchema["schema"], "homeCheck">
        | undefined;
      const supportNeeds = supportNeedsSet[processRef];
      const completedLastStep =
        homeCheck?.value === "no" || supportNeeds !== undefined;

      return completedLastStep;
    }
  );

  const loading = started.loading || completed.loading;

  const errors = [];

  if (started.error) {
    errors.push(started.error);
  }

  if (completed.error) {
    errors.push(completed.error);
  }

  return {
    loading: started.loading || completed.loading,
    status: loading
      ? undefined
      : started.result
      ? completed.result
        ? TaskListStatus.Completed
        : TaskListStatus.Started
      : TaskListStatus.NotStarted,
    errors: errors.length > 0 ? errors : undefined,
  };
};

export const SectionsPage: NextPage = () => {
  const router = useRouter();

  const processRef = getProcessRef(router);

  const tenancyData = useDataValue(
    Storage.ExternalContext,
    "tenancy",
    processRef,
    (values) => (processRef ? values[processRef] : undefined)
  );
  const residentData = useDataValue(
    Storage.ExternalContext,
    "residents",
    processRef,
    (values) => (processRef ? values[processRef] : undefined)
  );

  const idAndResidencyStatus = useIdAndResidencyStatus(
    processRef,
    residentData.result
  );
  const householdStatus = useHouseholdStatus(processRef);
  const propertyInspectionStatus = usePropertyInspectionStatus(processRef);
  const wellbeingSupportStatus = useWellbeingSupportStatus(processRef);

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
            ? residentData.result.tenants.map((tenant) => tenant.fullName)
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
            : undefined,
        }}
      />

      {idAndResidencyStatus.loading ? (
        <Paragraph>Checking process status...</Paragraph>
      ) : (
        <>
          <Paragraph>
            {idAndResidencyStatus.status === TaskListStatus.Completed
              ? "Please complete the remaining sections."
              : "To begin the check, verify the tenant's ID and proof of residency."}
          </Paragraph>

          <TaskList
            items={[
              {
                name: "ID, residency, and tenant information",
                url: urlObjectForSlug(router, PageSlugs.PresentForCheck),
                status: idAndResidencyStatus.status,
              },
              {
                name: "Household",
                url: urlObjectForSlug(router, PageSlugs.Household),
                status:
                  idAndResidencyStatus.status === TaskListStatus.Completed
                    ? householdStatus.status
                    : TaskListStatus.Unavailable,
              },
              {
                name: "Property inspection",
                url: urlObjectForSlug(router, PageSlugs.Rooms),
                status:
                  idAndResidencyStatus.status === TaskListStatus.Completed
                    ? propertyInspectionStatus.status
                    : TaskListStatus.Unavailable,
              },
              {
                name: "Wellbeing support",
                url: urlObjectForSlug(router, PageSlugs.HomeCheck),
                status:
                  idAndResidencyStatus.status === TaskListStatus.Completed
                    ? wellbeingSupportStatus.status
                    : TaskListStatus.Unavailable,
              },
              {
                name: "Review and submit",
                url: urlObjectForSlug(router, PageSlugs.Review),
                status:
                  idAndResidencyStatus.status === TaskListStatus.Completed
                    ? TaskListStatus.NotStarted
                    : TaskListStatus.Unavailable,
              },
            ]}
          />
        </>
      )}
    </MainLayout>
  );
};

export default SectionsPage;
