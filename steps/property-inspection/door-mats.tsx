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
  title: PageTitles.DoorMats,
  heading:
    "Has the tenant placed door mats and/or potted plants in communal areas?",
  step: {
    slug: PageSlugs.DoorMats,
    nextSlug: PageSlugs.CommunalAreas,
    Submit: makeSubmit({
      href: hrefForSlug(PageSlugs.CommunalAreas),
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
              <FieldsetLegend>
                Has the tenant placed door mats and/or potted plants in communal
                areas?
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
              <FieldsetLegend>Is further action required?</FieldsetLegend>
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
          renderWhen(stepValues: {
            "has-placed"?: ComponentValue<DatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-placed"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "property">({
            storeName: "property",
            key: processRef,
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
              value: "Add note about door mats / potted plants if necessary." as
                | React.ReactNode
                | null
                | undefined
            },
            name: "door-mats-notes"
          },
          renderWhen(stepValues: {
            "has-placed"?: ComponentValue<DatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-placed"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "property">({
            storeName: "property",
            key: processRef,
            property: ["doorMats", "notes"]
          })
        })
      )
    ]
  }
};

export default step;
