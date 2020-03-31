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
import { getRadioLabelFromValue } from "../../helpers/getRadioLabelFromValue";
import keyFromSlug from "../../helpers/keyFromSlug";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import yesNoRadios from "../../helpers/yesNoRadios";
import { Note } from "../../storage/DatabaseSchema";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const questions = {
  "has-access": "Does the tenant have access to the roof?",
  "items-stored-on-roof": "Are items being stored on the roof?",
};

const step: ProcessStepDefinition<ProcessDatabaseSchema, "property"> = {
  title: PageTitles.Roof,
  heading: "Roof access",
  review: {
    rows: [
      {
        label: questions["has-access"],
        values: {
          "has-access": {
            renderValue(hasAccess: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, hasAccess);
            },
          },
        },
      },
      {
        label: questions["items-stored-on-roof"],
        values: {
          "items-stored-on-roof": {
            renderValue(itemsStoredOnRoof: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, itemsStoredOnRoof);
            },
          },
          "roof-notes": {
            renderValue(roofNotes: Note): React.ReactNode {
              return roofNotes.value;
            },
          },
        },
      },
    ],
  },
  step: {
    slug: PageSlugs.Roof,
    nextSlug: PageSlugs.Loft,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
        value: "Save and continue",
      }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "has-access",
          Component: RadioButtons,
          props: {
            name: "has-access",
            legend: (
              <FieldsetLegend>
                Does the tenant have access to the roof?
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
            property: ["roof", "hasAccess"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "items-stored-on-roof",
          Component: RadioButtons,
          props: {
            name: "items-stored-on-roof",
            legend: (
              <FieldsetLegend>
                {questions["items-stored-on-roof"]}
              </FieldsetLegend>
            ) as React.ReactNode,
            radios: yesNoRadios,
          },
          renderWhen(stepValues: {
            "has-access"?: ComponentValue<ProcessDatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-access"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["roof", "itemsStoredOnRoof"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "roof-notes",
          Component: PostVisitActionInput,
          props: {
            label: {
              value: "Add note about roof if necessary.",
            },
            name: "roof-notes",
          } as PostVisitActionInputProps,
          renderWhen(stepValues: {
            "has-access"?: ComponentValue<ProcessDatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-access"] === "yes";
          },
          defaultValue: { value: "", isPostVisitAction: false },
          emptyValue: { value: "", isPostVisitAction: false },
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["roof", "notes"],
          }),
        })
      ),
    ],
  },
};

export default step;
