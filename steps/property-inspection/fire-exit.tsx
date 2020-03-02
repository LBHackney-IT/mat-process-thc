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
  "has-fire-exit": "Does the property have a secondary fire exit?",
  "is-accessible": "Is it accessible and easy to use?"
};

const step: ProcessStepDefinition<ProcessDatabaseSchema, "property"> = {
  title: PageTitles.FireExit,
  heading: "Fire exit",
  review: {
    rows: [
      {
        label: questions["has-fire-exit"],
        values: {
          "has-fire-exit": {
            renderValue(hasFireExit: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, hasFireExit);
            }
          }
        }
      },
      {
        label: questions["is-accessible"],
        values: {
          "is-accessible": {
            renderValue(isAccessible: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, isAccessible);
            }
          },
          "fire-exit-notes": {
            renderValue(fireExitNotes: Note): React.ReactNode {
              return fireExitNotes.value;
            }
          }
        }
      }
    ]
  },
  step: {
    slug: PageSlugs.FireExit,
    nextSlug: PageSlugs.SmokeAlarm,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
        value: "Save and continue"
      }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "has-fire-exit",
          Component: RadioButtons,
          props: {
            name: "has-fire-exit",
            legend: (
              <FieldsetLegend>{questions["has-fire-exit"]}</FieldsetLegend>
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
            property: ["fireExit", "hasFireExit"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "is-accessible",
          Component: RadioButtons,
          props: {
            name: "is-accessible",
            legend: (
              <FieldsetLegend>{questions["is-accessible"]}</FieldsetLegend>
            ) as React.ReactNode,
            radios: yesNoRadios
          },
          renderWhen(stepValues: {
            "has-fire-exit"?: ComponentValue<ProcessDatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-fire-exit"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["fireExit", "isAccessible"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "fire-exit-notes",
          Component: TextArea,
          props: {
            label: {
              value: "Add note about the fire exit if necessary."
            },
            name: "fire-exit-notes",
            includeCheckbox: true
          } as TextAreaProps,
          renderWhen(stepValues: {
            "has-fire-exit"?: ComponentValue<ProcessDatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-fire-exit"] === "yes";
          },
          defaultValue: { value: "", isPostVisitAction: false },
          emptyValue: { value: "", isPostVisitAction: false },
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["fireExit", "notes"]
          })
        })
      )
    ]
  }
};

export default step;
