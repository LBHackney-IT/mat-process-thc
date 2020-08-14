import {
  FieldsetLegend,
  Heading,
  HeadingLevels,
} from "lbh-frontend-react/components";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { StoreValue, TransactionMode } from "remultiform/database";
import { Checkboxes } from "../../../components/Checkboxes";
import { makeSubmit } from "../../../components/makeSubmit";
import { PostVisitActionInput } from "../../../components/PostVisitActionInput";
import { RadioButtons } from "../../../components/RadioButtons";
import ResidentCheckboxes from "../../../components/ResidentCheckboxes";
import { TenancySummary } from "../../../components/TenancySummary";
import getProcessRef from "../../../helpers/getProcessRef";
import useDatabase from "../../../helpers/useDatabase";
import useDataSet from "../../../helpers/useDataSet";
import useDataValue from "../../../helpers/useDataValue";
import yesNoRadios from "../../../helpers/yesNoRadios";
import MainLayout from "../../../layouts/MainLayout";
import PageSlugs from "../../../steps/PageSlugs";
import PageTitles from "../../../steps/PageTitles";
import {
  disabilityCheckboxes,
  disabilityQuestions,
} from "../../../steps/wellbeing-support/disability";
import ProcessDatabaseSchema from "../../../storage/ProcessDatabaseSchema";
import ResidentDatabaseSchema, {
  ResidentRef,
} from "../../../storage/ResidentDatabaseSchema";
import Storage from "../../../storage/Storage";

export const DisabilityPage: NextPage = () => {
  const processDatabase = useDatabase(Storage.ProcessContext);
  const residentDatabase = useDatabase(Storage.ResidentContext);
  const router = useRouter();
  const [disabilityDataUpdates, setDisabilityDataUpdates] = useState<
    Partial<StoreValue<ProcessDatabaseSchema["schema"], "disability">>
  >({});
  const [
    residentDisabilityDataUpdates,
    setResidentDisabilityDataUpdates,
  ] = useState<
    {
      [ref in ResidentRef]?: StoreValue<
        ResidentDatabaseSchema["schema"],
        "disabilities"
      >;
    }
  >({});

  const processRef = getProcessRef(router);

  const tenancyData = useDataValue(
    Storage.ExternalContext,
    "tenancy",
    processRef,
    (values) => (processRef ? values[processRef] : undefined)
  );
  const externalResidentData = useDataValue(
    Storage.ExternalContext,
    "residents",
    processRef,
    (values) => (processRef ? values[processRef] : undefined)
  );

  const residents = [
    ...(externalResidentData.result?.tenants || []),
    ...(externalResidentData.result?.householdMembers || []),
  ];
  const residentIds = residents.map((resident) => resident.id);

  const disabilityData = useDataValue(
    Storage.ProcessContext,
    "disability",
    processRef,
    (values) => (processRef ? values[processRef] : undefined)
  );
  const residentDisabilityData = useDataSet(
    Storage.ResidentContext,
    "disabilities",
    residentIds
  );

  const disabled = disabilityData.loading || residentDisabilityData.loading;

  const disabilityPresent =
    (disabilityDataUpdates?.value || disabilityData.result?.value) === "yes";
  const havePipOrDLA =
    (disabilityDataUpdates?.pipOrDLA || disabilityData.result?.pipOrDLA) ===
    "yes";

  const disabledResidentIds =
    disabilityDataUpdates?.whoDisability ||
    disabilityData.result?.whoDisability ||
    [];
  const disabledResidents = residents.filter((resident) =>
    disabledResidentIds.includes(resident.id)
  );

  const Submit = makeSubmit({
    slug: PageSlugs.SupportNeeds,
    value: "Save and continue",
  });

  return (
    <MainLayout title={PageTitles.Disability} heading="Disability" pausable>
      <TenancySummary
        details={{
          address: externalResidentData.result
            ? externalResidentData.result.address
            : externalResidentData.error
            ? ["Error"]
            : undefined,
          tenants: externalResidentData.result
            ? externalResidentData.result.tenants.map(
                (tenant) => tenant.fullName
              )
            : externalResidentData.error
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

      <RadioButtons
        name="disability"
        legend={
          <FieldsetLegend>
            <Heading level={HeadingLevels.H3}>
              {disabilityQuestions["disability"]}
            </Heading>
          </FieldsetLegend>
        }
        radios={yesNoRadios}
        disabled={disabled}
        required={false}
        value={
          disabilityDataUpdates?.value || disabilityData.result?.value || ""
        }
        onValueChange={(value): void => {
          setDisabilityDataUpdates((state) => ({ ...state, value }));
        }}
      />

      {disabilityPresent && (
        <>
          <ResidentCheckboxes
            name="who-disability"
            legend={
              <FieldsetLegend>
                <Heading level={HeadingLevels.H3}>
                  {disabilityQuestions["who-disability"]}
                </Heading>
              </FieldsetLegend>
            }
            disabled={disabled}
            required={false}
            value={disabledResidentIds}
            onValueChange={(whoDisability): void => {
              setDisabilityDataUpdates((state) => ({
                ...state,
                whoDisability,
              }));
            }}
          />

          {externalResidentData.loading
            ? "Loading..."
            : disabledResidents.map(({ id, fullName }) => (
                <Checkboxes
                  key={id}
                  name={`what-disabilities-${id}`}
                  legend={
                    <FieldsetLegend>
                      <Heading level={HeadingLevels.H3}>
                        How is {fullName} disabled?
                      </Heading>
                    </FieldsetLegend>
                  }
                  checkboxes={disabilityCheckboxes}
                  disabled={disabled}
                  required={false}
                  value={
                    residentDisabilityDataUpdates[id]?.what ||
                    (residentDisabilityData.result || {})[id]?.what ||
                    []
                  }
                  onValueChange={(value): void => {
                    setResidentDisabilityDataUpdates((state) => ({
                      ...state,
                      [id]: { ...state[id], what: value },
                    }));
                  }}
                />
              ))}

          <RadioButtons
            name="pip-or-dla"
            legend={
              <FieldsetLegend>
                <Heading level={HeadingLevels.H3}>
                  {disabilityQuestions["pip-or-dla"]}
                </Heading>
              </FieldsetLegend>
            }
            radios={yesNoRadios}
            disabled={disabled}
            required={false}
            value={
              disabilityDataUpdates?.pipOrDLA ||
              disabilityData.result?.pipOrDLA ||
              ""
            }
            onValueChange={(pipOrDLA): void => {
              setDisabilityDataUpdates((state) => ({ ...state, pipOrDLA }));
            }}
          />

          {havePipOrDLA && (
            <>
              <ResidentCheckboxes
                name="who-pip"
                legend={
                  <FieldsetLegend>
                    <Heading level={HeadingLevels.H3}>
                      {disabilityQuestions["who-pip"]}
                    </Heading>
                  </FieldsetLegend>
                }
                disabled={disabled}
                required={false}
                value={
                  disabilityDataUpdates?.whoPIP ||
                  disabilityData.result?.whoPIP ||
                  []
                }
                onValueChange={(whoPIP): void => {
                  setDisabilityDataUpdates((state) => ({ ...state, whoPIP }));
                }}
              />

              <ResidentCheckboxes
                name="who-dla"
                legend={
                  <FieldsetLegend>
                    <Heading level={HeadingLevels.H3}>
                      {disabilityQuestions["who-dla"]}
                    </Heading>
                  </FieldsetLegend>
                }
                disabled={disabled}
                required={false}
                value={
                  disabilityDataUpdates?.whoDLA ||
                  disabilityData.result?.whoDLA ||
                  []
                }
                onValueChange={(whoDLA): void => {
                  setDisabilityDataUpdates((state) => ({ ...state, whoDLA }));
                }}
              />
            </>
          )}

          <PostVisitActionInput
            name="disability-notes"
            label={{
              value: "Add note about any disability concerns if necessary.",
            }}
            rows={4}
            disabled={disabled}
            required={false}
            value={
              disabilityDataUpdates?.notes || disabilityData.result?.notes || []
            }
            onValueChange={(notes): void => {
              setDisabilityDataUpdates((state) => ({ ...state, notes }));
            }}
          />
        </>
      )}

      <Submit
        disabled={
          disabilityData.loading ||
          residentDisabilityData.loading ||
          !processRef ||
          !processDatabase.result ||
          !residentDatabase.result
        }
        onSubmit={async (): Promise<boolean> => {
          if (
            disabilityData.loading ||
            residentDisabilityData.loading ||
            !processRef ||
            !processDatabase.result ||
            !residentDatabase.result
          ) {
            return false;
          }

          await processDatabase.result.transaction(
            ["disability"],
            async (stores) => {
              const data = await stores.disability.get(processRef);

              await stores.disability.put(processRef, {
                ...data,
                ...disabilityData.result,
                ...disabilityDataUpdates,
              } as StoreValue<ProcessDatabaseSchema["schema"], "disability">);
            },
            TransactionMode.ReadWrite
          );

          await residentDatabase.result.transaction(
            ["disabilities"],
            async (stores) => {
              for (const id of residentIds) {
                const data = await stores.disabilities.get(id);

                await stores.disabilities.put(id, {
                  ...data,
                  ...((residentDisabilityData.result || {})[id] || []),
                  ...(residentDisabilityDataUpdates[id] || []),
                } as StoreValue<ResidentDatabaseSchema["schema"], "disabilities">);
              }
            },
            TransactionMode.ReadWrite
          );

          return true;
        }}
      />
    </MainLayout>
  );
};

export default DisabilityPage;
