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
  "can-enter-all-rooms": "Can you enter all rooms within the property?"
};

const step: ProcessStepDefinition<ProcessDatabaseSchema, "property"> = {
  title: PageTitles.Rooms,
  heading: "Room access",
  review: {
    rows: [
      {
        label: questions["can-enter-all-rooms"],
        values: {
          "can-enter-all-rooms": {
            renderValue(ableToEnterAll: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, ableToEnterAll);
            }
          },
          "room-entry-notes": {
            renderValue(whichRooms: Note): React.ReactNode {
              return whichRooms.value;
            }
          }
        }
      }
    ]
  },
  step: {
    slug: PageSlugs.Rooms,
    nextSlug: PageSlugs.LaminatedFlooring,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
        value: "Save and continue"
      }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "can-enter-all-rooms",
          Component: RadioButtons,
          props: {
            name: "can-enter-all-rooms",
            legend: (
              <FieldsetLegend>
                {questions["can-enter-all-rooms"]}
              </FieldsetLegend>
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
            property: ["rooms", "canEnterAll"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "room-entry-notes",
          Component: TextArea,
          props: {
            label: {
              value: "Add note about access if necessary."
            },
            name: "room-entry-notes",
            includeCheckbox: true
          } as TextAreaProps,
          renderWhen(stepValues: {
            "can-enter-all-rooms"?: ComponentValue<
              ProcessDatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["can-enter-all-rooms"] === "no";
          },
          defaultValue: { value: "", isPostVisitAction: false },
          emptyValue: { value: "", isPostVisitAction: false },
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["rooms", "notes"]
          })
        })
      )
    ]
  }
};

export default step;
