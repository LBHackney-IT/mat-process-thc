import { FieldsetLegend } from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentValue,
  ComponentWrapper,
  DynamicComponent
} from "remultiform/component-wrapper";
import { makeSubmit } from "../../components/makeSubmit";
import { RadioButtons } from "../../components/RadioButtons";
import { TextArea, TextAreaProps } from "../../components/TextArea";
import { getRadioLabelFromValue } from "../../helpers/getRadioLabelFromValue";
import keyFromSlug from "../../helpers/keyFromSlug";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import yesNoRadios from "../../helpers/yesNoRadios";
import { Note } from "../../storage/DatabaseSchema";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const questions = {
  "has-placed":
    "Has the tenant placed door mats or potted plants in communal areas?",
  "further-action-required": "Is further action required?"
};

const step: ProcessStepDefinition<ProcessDatabaseSchema, "property"> = {
  title: PageTitles.DoorMats,
  heading: "Door mats or potted plants",
  review: {
    rows: [
      {
        label: questions["has-placed"],
        values: {
          "has-placed": {
            renderValue(hasPlaced: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, hasPlaced);
            }
          }
        }
      },
      {
        label: questions["further-action-required"],
        values: {
          "further-action-required": {
            renderValue(furtherActionRequired: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, furtherActionRequired);
            }
          },
          "door-mats-notes": {
            renderValue(doorMatsNotes: Note): React.ReactNode {
              return doorMatsNotes.value;
            }
          }
        }
      }
    ]
  },
  step: {
    slug: PageSlugs.DoorMats,
    nextSlug: PageSlugs.CommunalAreas,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
        value: "Save and continue"
      }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "has-placed",
          Component: RadioButtons,
          props: {
            name: "has-placed",
            legend: (
              <FieldsetLegend>{questions["has-placed"]}</FieldsetLegend>
            ) as React.ReactNode,
            radios: yesNoRadios
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["doorMats", "hasPlaced"]
          })
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
            radios: yesNoRadios
          },
          renderWhen(stepValues: {
            "has-placed"?: ComponentValue<ProcessDatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-placed"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["doorMats", "furtherActionRequired"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "door-mats-notes",
          Component: TextArea,
          props: {
            label: {
              value: "Add note about door mats / potted plants if necessary."
            },
            name: "door-mats-notes",
            includeCheckbox: true
          } as TextAreaProps,
          renderWhen(stepValues: {
            "has-placed"?: ComponentValue<ProcessDatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-placed"] === "yes";
          },
          defaultValue: { value: "", isPostVisitAction: false },
          emptyValue: { value: "", isPostVisitAction: false },
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["doorMats", "notes"]
          })
        })
      )
    ]
  }
};

export default step;
