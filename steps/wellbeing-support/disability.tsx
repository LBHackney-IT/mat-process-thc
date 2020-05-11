import router from "next/router";
import React from "react";
import { ComponentDatabaseMap } from "remultiform/component-wrapper";
import { StoreValue } from "remultiform/database";
import ResidentDatabaseSchema, {
  ResidentRef,
} from "storage/ResidentDatabaseSchema";
import { ReviewNotes } from "../../components/ReviewNotes";
import { getCheckboxLabelsFromValues } from "../../helpers/getCheckboxLabelsFromValues";
import getProcessRef from "../../helpers/getProcessRef";
import { getRadioLabelFromValue } from "../../helpers/getRadioLabelFromValue";
import keyFromSlug from "../../helpers/keyFromSlug";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import yesNoRadios from "../../helpers/yesNoRadios";
import { Notes } from "../../storage/DatabaseSchema";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import Storage from "../../storage/Storage";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

export const disabilityQuestions = {
  disability: "Does anyone in the household have a disability?",
  "who-disability": "Who has a disability?",
  "pip-or-dla":
    "Does anyone in the household get Personal Independence Payment (PIP) or Disability Living Allowance (DLA)?",
  "who-pip": "Who gets PIP?",
  "who-dla": "Who gets DLA?",
};

export const disabilityCheckboxes = [
  {
    label: "Hearing",
    value: "hearing",
  },
  {
    label: "Vision",
    value: "vision",
  },
  {
    label: "Mobility",
    value: "mobility",
  },
  {
    label: "Speech",
    value: "speech",
  },
  {
    label: "Mental illness",
    value: "mental illness",
  },
  {
    label: "Learning difficuties",
    value: "learning difficulties",
  },
  {
    label: "Physical co-ordination",
    value: "physical coordination",
  },
  {
    label: "Reduced physical capability",
    value: "reduced physical capability",
  },
  {
    label: "Physical disability",
    value: "physical disability",
  },
  {
    label: "Long term illness",
    value: "illness",
  },
  {
    label: "Other disability",
    value: "other",
  },
  {
    label: "Prefer not to say",
    value: "prefer not to say",
  },
];

const step: ProcessStepDefinition<ProcessDatabaseSchema, "disability"> = {
  title: PageTitles.Disability,
  heading: "Disability",
  review: {
    rows: [
      {
        label: disabilityQuestions["disability"],
        values: {
          disability: {
            renderValue(anyDisability: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, anyDisability);
            },
            databaseMap: new ComponentDatabaseMap<
              ProcessDatabaseSchema,
              "disability"
            >({
              storeName: "disability",
              key: keyFromSlug(),
              property: ["value"],
            }),
          },
          "who-disability": {
            async renderValue(
              whoDisability: string[]
            ): Promise<React.ReactNode> {
              const db = await Storage.ExternalContext?.database;

              if (!db) {
                return;
              }

              const processRef = getProcessRef(router);

              if (!processRef) {
                return;
              }

              const { tenants, householdMembers } =
                (await db.get("residents", processRef)) || {};

              return [...(tenants || []), ...(householdMembers || [])]
                .filter(({ id }) => whoDisability.includes(id))
                .map(({ fullName }) => fullName)
                .join(", ");
            },
            databaseMap: new ComponentDatabaseMap<
              ProcessDatabaseSchema,
              "disability"
            >({
              storeName: "disability",
              key: keyFromSlug(),
              property: ["whoDisability"],
            }),
          },
          "disability-notes": {
            renderValue(notes: Notes): React.ReactNode {
              if (notes.length === 0) {
                return;
              }

              return <ReviewNotes notes={notes} />;
            },
            databaseMap: new ComponentDatabaseMap<
              ProcessDatabaseSchema,
              "disability"
            >({
              storeName: "disability",
              key: keyFromSlug(),
              property: ["notes"],
            }),
          },
        },
      },
      {
        label: "What disabilities do those residents have?",
        values: {
          "what-disability": {
            async renderValue(): Promise<React.ReactNode> {
              const externalDatabase = await Storage.ExternalContext?.database;
              const residentDatabase = await Storage.ResidentContext?.database;

              if (!externalDatabase || !residentDatabase) {
                return;
              }

              const processRef = getProcessRef(router);

              if (!processRef) {
                return;
              }

              const { tenants, householdMembers } =
                (await externalDatabase.get("residents", processRef)) || {};
              const residents = [
                ...(tenants || []),
                ...(householdMembers || []),
              ];

              let disabilitiesByResident:
                | {
                    id: ResidentRef;
                    disabilities:
                      | StoreValue<
                          ResidentDatabaseSchema["schema"],
                          "disabilities"
                        >
                      | undefined;
                  }[]
                | undefined;

              await residentDatabase.transaction(
                ["disabilities"],
                async (stores) => {
                  const { disabilities } = stores;

                  disabilitiesByResident = await Promise.all(
                    residents.map(async ({ id }) => ({
                      id,
                      disabilities: await disabilities.get(id),
                    }))
                  );
                }
              );

              if (
                !disabilitiesByResident ||
                disabilitiesByResident.length === 0 ||
                disabilitiesByResident.every(
                  ({ disabilities }) => disabilities?.what === undefined
                )
              ) {
                return;
              }

              return (
                <>
                  {disabilitiesByResident
                    .filter(({ disabilities }) => Boolean(disabilities?.what))
                    .map(({ id, disabilities }) => {
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      const { fullName } = residents.find(
                        (resident) => resident.id === id
                      )!;
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      const { what } = disabilities!;

                      return (
                        <div key={id}>
                          <strong>{fullName}</strong>:{" "}
                          {getCheckboxLabelsFromValues(
                            disabilityCheckboxes,
                            what
                          )}
                        </div>
                      );
                    })}
                </>
              );
            },
          },
        },
      },
      {
        label: disabilityQuestions["pip-or-dla"],
        values: {
          "pip-or-dla": {
            renderValue(pipOrDLA: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, pipOrDLA);
            },
            databaseMap: new ComponentDatabaseMap<
              ProcessDatabaseSchema,
              "disability"
            >({
              storeName: "disability",
              key: keyFromSlug(),
              property: ["pipOrDLA"],
            }),
          },
        },
      },
      {
        label: "Who gets PIP?",
        values: {
          "who-pip": {
            async renderValue(whoPIP: string[]): Promise<React.ReactNode> {
              const db = await Storage.ExternalContext?.database;

              if (!db) {
                return;
              }

              const processRef = getProcessRef(router);

              if (!processRef) {
                return;
              }

              const { tenants, householdMembers } =
                (await db.get("residents", processRef)) || {};

              return [...(tenants || []), ...(householdMembers || [])]
                .filter(({ id }) => whoPIP.includes(id))
                .map(({ fullName }) => fullName)
                .join(", ");
            },
            databaseMap: new ComponentDatabaseMap<
              ProcessDatabaseSchema,
              "disability"
            >({
              storeName: "disability",
              key: keyFromSlug(),
              property: ["whoPIP"],
            }),
          },
        },
      },
      {
        label: "Who gets DLA?",
        values: {
          "who-dla": {
            async renderValue(whoDLA: string[]): Promise<React.ReactNode> {
              const db = await Storage.ExternalContext?.database;

              if (!db) {
                return;
              }

              const processRef = getProcessRef(router);

              if (!processRef) {
                return;
              }

              const { tenants, householdMembers } =
                (await db.get("residents", processRef)) || {};

              return [...(tenants || []), ...(householdMembers || [])]
                .filter(({ id }) => whoDLA.includes(id))
                .map(({ fullName }) => fullName)
                .join(", ");
            },
            databaseMap: new ComponentDatabaseMap<
              ProcessDatabaseSchema,
              "disability"
            >({
              storeName: "disability",
              key: keyFromSlug(),
              property: ["whoDLA"],
            }),
          },
        },
      },
    ],
  },
  step: {
    slug: PageSlugs.Disability,
    componentWrappers: [],
  },
};

export default step;
