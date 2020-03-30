import { FieldsetLegend } from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentValue,
  ComponentWrapper,
  DynamicComponent,
} from "remultiform/component-wrapper";
import { Checkboxes, CheckboxesProps } from "../../components/Checkboxes";
import { makeSubmit } from "../../components/makeSubmit";
import { RadioButtons } from "../../components/RadioButtons";
import { TextArea, TextAreaProps } from "../../components/TextArea";
import { getRadioLabelFromValue } from "../../helpers/getRadioLabelFromValue";
import householdMemberCheckboxes from "../../helpers/householdMemberCheckboxes";
import keyFromSlug from "../../helpers/keyFromSlug";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import yesNoRadios from "../../helpers/yesNoRadios";
import { Note } from "../../storage/DatabaseSchema";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
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
            renderValue(whoDisability: string[]): React.ReactNode {
              return whoDisability
                .map((who) => {
                  return getRadioLabelFromValue(householdMemberCheckboxes, who);
                })
                .join(", ");
            },
          },
          "disability-notes": {
            renderValue(notes: Note): React.ReactNode {
              return notes.value;
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
            renderValue(whoPIP: string[]): React.ReactNode {
              return whoPIP
                .map((who) =>
                  getRadioLabelFromValue(householdMemberCheckboxes, who)
                )
                .join(", ");
            },
          },
        },
      },
      {
        label: "Who gets DLA?",
        values: {
          "who-dla": {
            renderValue(whoDLA: string[]): React.ReactNode {
              return whoDLA
                .map((who) =>
                  getRadioLabelFromValue(householdMemberCheckboxes, who)
                )
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
          Component: Checkboxes,
          props: {
            name: "who-disability",
            legend: (
              <FieldsetLegend>{questions["who-disability"]}</FieldsetLegend>
            ) as React.ReactNode,
            checkboxes: householdMemberCheckboxes,
          } as CheckboxesProps,
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
          Component: Checkboxes,
          props: {
            name: "who-pip",
            legend: (
              <FieldsetLegend>{questions["who-pip"]}</FieldsetLegend>
            ) as React.ReactNode,
            checkboxes: householdMemberCheckboxes,
          } as CheckboxesProps,
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
          Component: Checkboxes,
          props: {
            name: "who-dla",
            legend: (
              <FieldsetLegend>{questions["who-dla"]}</FieldsetLegend>
            ) as React.ReactNode,
            checkboxes: householdMemberCheckboxes,
          } as CheckboxesProps,
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
          Component: TextArea,
          props: {
            name: "disability-notes",
            label: {
              value: "Add note about any disability concerns if necessary.",
            },
            rows: 4,
            includeCheckbox: true,
          } as TextAreaProps,
          renderWhen(stepValues: {
            disability?: ComponentValue<ProcessDatabaseSchema, "disability">;
          }): boolean {
            return stepValues["disability"] === "yes";
          },
          defaultValue: { value: "", isPostVisitAction: false },
          emptyValue: { value: "", isPostVisitAction: false },
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
