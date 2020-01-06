import { FieldsetLegend } from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentValue,
  ComponentWrapper,
  DynamicComponent
} from "remultiform/component-wrapper";

import { makeSubmit } from "../../components/makeSubmit";
import ProcessStepDefinition from "../../components/ProcessStepDefinition";
import { RadioButtons } from "../../components/RadioButtons";
import { TextArea } from "../../components/TextArea";
import DatabaseSchema from "../../storage/DatabaseSchema";
import processRef from "../../storage/processRef";

import PageSlugs, { hrefForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step: ProcessStepDefinition = {
  title: PageTitles.Rooms,
  heading: "Can you enter all rooms within the property?",
  step: {
    slug: PageSlugs.Rooms,
    nextSlug: PageSlugs.LaminatedFlooring,
    Submit: makeSubmit({
      href: hrefForSlug(PageSlugs.LaminatedFlooring),
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
                Can you enter all rooms within the property?
              </FieldsetLegend>
            ) as React.ReactNode,
            radios: [
              {
                label: "Yes",
                value: "yes"
              },
              {
                label: "No",
                value: "no"
              }
            ]
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "property">({
            storeName: "property",
            key: processRef,
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
              value: "Add note about access if necessary." as
                | string
                | null
                | undefined
            },
            name: "room-entry-notes"
          },
          renderWhen(stepValues: {
            "can-enter-all-rooms"?: ComponentValue<DatabaseSchema, "property">;
          }): boolean {
            return stepValues["can-enter-all-rooms"] === "no";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "property">({
            storeName: "property",
            key: processRef,
            property: ["rooms", "notes"]
          })
        })
      )
    ]
  }
};

export default step;