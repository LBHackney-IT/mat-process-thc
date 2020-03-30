import ProcessStepDefinition from "helpers/ProcessStepDefinition";
import { FieldsetLegend } from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentValue,
  ComponentWrapper,
  DynamicComponent,
} from "remultiform/component-wrapper";
import { makeSubmit } from "../../components/makeSubmit";
import { RadioButtons } from "../../components/RadioButtons";
import { TextArea, TextAreaProps } from "../../components/TextArea";
import { getRadioLabelFromValue } from "../../helpers/getRadioLabelFromValue";
import keyFromSlug from "../../helpers/keyFromSlug";
import yesNoRadios from "../../helpers/yesNoRadios";
import { Note } from "../../storage/DatabaseSchema";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const questions = {
  "is-storing-materials":
    "Is the tenant storing materials in their home that can catch fire, other than those needed for normal household use?",
  "further-action-required": "Is further action required?",
};

const step: ProcessStepDefinition<ProcessDatabaseSchema, "property"> = {
  title: PageTitles.StoringMaterials,
  heading: "Storing materials",
  review: {
    rows: [
      {
        label: questions["is-storing-materials"],
        values: {
          "is-storing-materials": {
            renderValue(isStoringMaterials: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, isStoringMaterials);
            },
          },
        },
      },
      {
        label: questions["further-action-required"],
        values: {
          "further-action-required": {
            renderValue(furtherActionRequired: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, furtherActionRequired);
            },
          },
          "stored-materials-notes": {
            renderValue(notes: Note): React.ReactNode {
              return notes.value;
            },
          },
        },
      },
    ],
  },
  step: {
    slug: PageSlugs.StoringMaterials,
    nextSlug: PageSlugs.FireExit,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
        value: "Save and continue",
      }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "is-storing-materials",
          Component: RadioButtons,
          props: {
            name: "is-storing-materials",
            legend: (
              <FieldsetLegend>
                {questions["is-storing-materials"]}
              </FieldsetLegend>
            ) as React.ReactNode,
            radios: yesNoRadios,
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["storingMaterials", "isStoringMaterials"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "further-action-required",
          Component: RadioButtons,
          props: {
            name: "further-action-required",
            legend: (
              <FieldsetLegend>
                {questions["further-action-required"]}
              </FieldsetLegend>
            ) as React.ReactNode,
            radios: yesNoRadios,
          },
          renderWhen(stepValues: {
            "is-storing-materials"?: ComponentValue<
              ProcessDatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["is-storing-materials"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["storingMaterials", "furtherActionRequired"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "stored-materials-notes",
          Component: TextArea,
          props: {
            label: {
              value: "Add note about the stored materials if necessary.",
            },
            name: "stored-materials-notes",
            includeCheckbox: true,
          } as TextAreaProps,
          renderWhen(stepValues: {
            "is-storing-materials"?: ComponentValue<
              ProcessDatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["is-storing-materials"] === "yes";
          },
          defaultValue: { value: "", isPostVisitAction: false },
          emptyValue: { value: "", isPostVisitAction: false },
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["storingMaterials", "notes"],
          }),
        })
      ),
    ],
  },
};

export default step;
