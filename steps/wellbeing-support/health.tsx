import { FieldsetLegend } from "lbh-frontend-react/components";
import router from "next/router";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentValue,
  ComponentWrapper,
  DynamicComponent,
} from "remultiform/component-wrapper";
import { Checkboxes } from "../../components/Checkboxes";
import { makeSubmit } from "../../components/makeSubmit";
import {
  PostVisitActionInput,
  PostVisitActionInputProps,
} from "../../components/PostVisitActionInput";
import { RadioButtons } from "../../components/RadioButtons";
import ResidentCheckboxes from "../../components/ResidentCheckboxes";
import { ReviewNotes } from "../../components/ReviewNotes";
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

const questions = {
  "health-concerns": "Does anyone in the household have any health concerns?",
  "health-concerns-who": "Who has health concerns?",
  "health-concerns-more-info":
    "Are they interested in more information or to be linked to our support services for:",
};

const healthConcernsCheckboxes = [
  {
    label: "Childhood obesity",
    value: "childhood obesity",
  },
  {
    label: "Dementia",
    value: "dementia",
  },
  {
    label: "Mental health",
    value: "mental health",
  },
  {
    label: "Smoking",
    value: "smoking",
  },
];

const step: ProcessStepDefinition<ProcessDatabaseSchema, "healthConcerns"> = {
  title: PageTitles.Health,
  heading: "Health concerns",
  review: {
    rows: [
      {
        label: questions["health-concerns"],
        values: {
          "health-concerns": {
            renderValue(healthConcerns: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, healthConcerns);
            },
          },
        },
      },
      {
        label: questions["health-concerns-who"],
        values: {
          "health-concerns-who": {
            async renderValue(whoConcerns: string[]): Promise<React.ReactNode> {
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
                .filter(({ id }) => whoConcerns.includes(id))
                .map(({ fullName }) => fullName)
                .join(", ");
            },
          },
        },
      },
      {
        label: questions["health-concerns-more-info"],
        values: {
          "health-concerns-more-info": {
            renderValue(moreInfo: string[]): React.ReactNode {
              return moreInfo
                .map((info: string) => {
                  return getRadioLabelFromValue(healthConcernsCheckboxes, info);
                })
                .join(", ");
            },
          },
          "health-notes": {
            renderValue(notes: Notes): React.ReactNode {
              if (notes.length === 0) {
                return;
              }

              return <ReviewNotes notes={notes} />;
            },
          },
        },
      },
    ],
  },
  step: {
    slug: PageSlugs.Health,
    nextSlug: PageSlugs.Disability,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
        value: "Save and continue",
      }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "health-concerns",
          Component: RadioButtons,
          props: {
            name: "health-concerns",
            legend: (
              <FieldsetLegend>{questions["health-concerns"]}</FieldsetLegend>
            ) as React.ReactNode,
            radios: yesNoRadios,
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "healthConcerns"
          >({
            storeName: "healthConcerns",
            key: keyFromSlug(),
            property: ["value"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "health-concerns-who",
          Component: ResidentCheckboxes,
          props: {
            name: "health-concerns-who",
            legend: (
              <FieldsetLegend>
                {questions["health-concerns-who"]}
              </FieldsetLegend>
            ) as React.ReactNode,
          },
          renderWhen(stepValues: {
            "health-concerns"?: ComponentValue<
              ProcessDatabaseSchema,
              "healthConcerns"
            >;
          }): boolean {
            return stepValues["health-concerns"] === "yes";
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "healthConcerns"
          >({
            storeName: "healthConcerns",
            key: keyFromSlug(),
            property: ["who"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "health-concerns-more-info",
          Component: Checkboxes,
          props: {
            name: "health-concerns-more-info",
            legend: (
              <FieldsetLegend>
                {questions["health-concerns-more-info"]}
              </FieldsetLegend>
            ) as React.ReactNode,
            checkboxes: healthConcernsCheckboxes,
          },
          renderWhen(stepValues: {
            "health-concerns"?: ComponentValue<
              ProcessDatabaseSchema,
              "healthConcerns"
            >;
          }): boolean {
            return stepValues["health-concerns"] === "yes";
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "healthConcerns"
          >({
            storeName: "healthConcerns",
            key: keyFromSlug(),
            property: ["moreInfo"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "health-notes",
          Component: PostVisitActionInput,
          props: {
            name: "health-notes",
            label: {
              value: "Add note about any health concerns if necessary.",
            },
            rows: 4,
          } as PostVisitActionInputProps,
          renderWhen(stepValues: {
            "health-concerns"?: ComponentValue<
              ProcessDatabaseSchema,
              "healthConcerns"
            >;
          }): boolean {
            return stepValues["health-concerns"] === "yes";
          },
          defaultValue: [] as Notes,
          emptyValue: [] as Notes,
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "healthConcerns"
          >({
            storeName: "healthConcerns",
            key: keyFromSlug(),
            property: ["notes"],
          }),
        })
      ),
    ],
  },
};

export default step;
