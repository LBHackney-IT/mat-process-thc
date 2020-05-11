import { FieldsetLegend } from "lbh-frontend-react/components";
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
import { ReviewNotes } from "../../components/ReviewNotes";
import { getRadioLabelFromValue } from "../../helpers/getRadioLabelFromValue";
import keyFromSlug from "../../helpers/keyFromSlug";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import yesNoRadios from "../../helpers/yesNoRadios";
import { Notes } from "../../storage/DatabaseSchema";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const questions = {
  "has-left-combustible-items":
    "Has the tenant left combustible items in communal areas?",
  "further-action-required": "Is further action required?",
};

const step: ProcessStepDefinition<ProcessDatabaseSchema, "property"> = {
  title: PageTitles.CommunalAreas,
  heading: "Combustible items in communal areas",
  review: {
    rows: [
      {
        label: questions["has-left-combustible-items"],
        values: {
          "has-left-combustible-items": {
            renderValue(leftCombustibleItems: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, leftCombustibleItems);
            },
          },
          "communal-areas-notes": {
            renderValue(notes: Notes): React.ReactNode {
              if (notes.length === 0) {
                return;
              }

              return <ReviewNotes notes={notes} />;
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
        },
      },
    ],
  },
  step: {
    slug: PageSlugs.CommunalAreas,
    nextSlug: PageSlugs.Pets,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
        value: "Save and continue",
      }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "has-left-combustible-items",
          Component: RadioButtons,
          props: {
            name: "has-left-combustible-items",
            legend: (
              <FieldsetLegend>
                {questions["has-left-combustible-items"]}
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
            property: ["communalAreas", "hasLeftCombustibleItems"],
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
            "has-left-combustible-items"?: ComponentValue<
              ProcessDatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["has-left-combustible-items"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["communalAreas", "furtherActionRequired"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "communal-areas-notes",
          Component: PostVisitActionInput,
          props: {
            label: {
              value:
                "Add note about combustible items in communal areas if necessary.",
            },
            name: "communal-areas-notes",
          } as PostVisitActionInputProps,
          renderWhen(stepValues: {
            "has-left-combustible-items"?: ComponentValue<
              ProcessDatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["has-left-combustible-items"] === "yes";
          },
          defaultValue: [] as Notes,
          emptyValue: [] as Notes,
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["communalAreas", "notes"],
          }),
        })
      ),
    ],
  },
};

export default step;
