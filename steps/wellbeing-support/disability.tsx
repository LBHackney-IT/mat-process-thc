import { FieldsetLegend } from "lbh-frontend-react/components";
import router from "next/router";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentValue,
  ComponentWrapper,
  DynamicComponent,
} from "remultiform/component-wrapper";
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
  disability: "Does anyone in the household have a disability?",
  "who-disability": "Who has a disability?",
  "pip-or-dla":
    "Does anyone in the household get Personal Independence Payment (PIP) or Disability Living Allowance (DLA)?",
  "who-pip": "Who gets PIP?",
  "who-dla": "Who gets DLA?",
};

const step: ProcessStepDefinition<ProcessDatabaseSchema, "disability"> = {
  title: PageTitles.Disability,
  heading: "Disability",
  review: {
    rows: [
      {
        label: questions["disability"],
        values: {
          disability: {
            renderValue(anyDisability: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, anyDisability);
            },
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
          },
          "disability-notes": {
            renderValue(notes: Notes): React.ReactNode {
              return <ReviewNotes notes={notes} />;
            },
          },
        },
      },
      {
        label: questions["pip-or-dla"],
        values: {
          "pip-or-dla": {
            renderValue(pipOrDLA: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, pipOrDLA);
            },
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
          },
        },
      },
    ],
  },
  step: {
    slug: PageSlugs.Disability,
    nextSlug: PageSlugs.SupportNeeds,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
        value: "Save and continue",
      }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "disability",
          Component: RadioButtons,
          props: {
            name: "disability",
            legend: (
              <FieldsetLegend>{questions["disability"]}</FieldsetLegend>
            ) as React.ReactNode,
            radios: yesNoRadios,
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "disability"
          >({
            storeName: "disability",
            key: keyFromSlug(),
            property: ["value"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "who-disability",
          Component: ResidentCheckboxes,
          props: {
            name: "who-disability",
            legend: (
              <FieldsetLegend>{questions["who-disability"]}</FieldsetLegend>
            ) as React.ReactNode,
          },
          renderWhen(stepValues: {
            disability?: ComponentValue<ProcessDatabaseSchema, "disability">;
          }): boolean {
            return stepValues["disability"] === "yes";
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "disability"
          >({
            storeName: "disability",
            key: keyFromSlug(),
            property: ["whoDisability"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "pip-or-dla",
          Component: RadioButtons,
          props: {
            name: "pip-or-dla",
            legend: (
              <FieldsetLegend>{questions["pip-or-dla"]}</FieldsetLegend>
            ) as React.ReactNode,
            radios: yesNoRadios,
          },
          renderWhen(stepValues: {
            disability?: ComponentValue<ProcessDatabaseSchema, "disability">;
          }): boolean {
            return stepValues["disability"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "disability"
          >({
            storeName: "disability",
            key: keyFromSlug(),
            property: ["pipOrDLA"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "who-pip",
          Component: ResidentCheckboxes,
          props: {
            name: "who-pip",
            legend: (
              <FieldsetLegend>{questions["who-pip"]}</FieldsetLegend>
            ) as React.ReactNode,
          },
          renderWhen(stepValues: {
            disability?: ComponentValue<ProcessDatabaseSchema, "disability">;
            "pip-or-dla"?: ComponentValue<ProcessDatabaseSchema, "disability">;
          }): boolean {
            return (
              stepValues["disability"] === "yes" &&
              stepValues["pip-or-dla"] === "yes"
            );
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "disability"
          >({
            storeName: "disability",
            key: keyFromSlug(),
            property: ["whoPIP"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "who-dla",
          Component: ResidentCheckboxes,
          props: {
            name: "who-dla",
            legend: (
              <FieldsetLegend>{questions["who-dla"]}</FieldsetLegend>
            ) as React.ReactNode,
          },
          renderWhen(stepValues: {
            disability?: ComponentValue<ProcessDatabaseSchema, "disability">;
            "pip-or-dla"?: ComponentValue<ProcessDatabaseSchema, "disability">;
          }): boolean {
            return (
              stepValues["disability"] === "yes" &&
              stepValues["pip-or-dla"] === "yes"
            );
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "disability"
          >({
            storeName: "disability",
            key: keyFromSlug(),
            property: ["whoDLA"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "disability-notes",
          Component: PostVisitActionInput,
          props: {
            name: "disability-notes",
            label: {
              value: "Add note about any disability concerns if necessary.",
            },
            rows: 4,
          } as PostVisitActionInputProps,
          renderWhen(stepValues: {
            disability?: ComponentValue<ProcessDatabaseSchema, "disability">;
          }): boolean {
            return stepValues["disability"] === "yes";
          },
          defaultValue: [] as Notes,
          emptyValue: [] as Notes,
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "disability"
          >({
            storeName: "disability",
            key: keyFromSlug(),
            property: ["notes"],
          }),
        })
      ),
    ],
  },
};

export default step;
