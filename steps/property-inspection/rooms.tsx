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
import { TextArea } from "../../components/TextArea";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import processRef from "../../storage/processRef";

import PageSlugs, { urlObjectForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step: ProcessStepDefinition = {
  title: PageTitles.Rooms,
  heading: "Can you enter all rooms within the property?",
  step: {
    slug: PageSlugs.Rooms,
    nextSlug: PageSlugs.LaminatedFlooring,
    Submit: makeSubmit({
      url: urlObjectForSlug(PageSlugs.LaminatedFlooring),
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
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
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
              value: "Add note about access if necessary."
            } as { id?: string; value?: React.ReactNode },
            name: "room-entry-notes"
          },
          renderWhen(stepValues: {
            "can-enter-all-rooms"?: ComponentValue<
              ProcessDatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["can-enter-all-rooms"] === "no";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
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
