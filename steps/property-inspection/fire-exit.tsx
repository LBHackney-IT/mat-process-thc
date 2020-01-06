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
import DatabaseSchema from "../../storage/DatabaseSchema";
import processRef from "../../storage/processRef";

import PageSlugs, { hrefForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step: ProcessStepDefinition = {
  title: PageTitles.FireExit,
  heading: "Does the property have a secondary fire exit?",
  step: {
    slug: PageSlugs.FireExit,
    nextSlug: PageSlugs.SmokeAlarm,
    Submit: makeSubmit({
      href: hrefForSlug(PageSlugs.SmokeAlarm),
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
              <FieldsetLegend>
                Does the property have a secondary fire exit?
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
              <FieldsetLegend>Is it accessible and easy to use?</FieldsetLegend>
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
            "has-fire-exit"?: ComponentValue<DatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-fire-exit"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "property">({
            storeName: "property",
            key: processRef,
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
              value: "Add note about the fire exit if necessary." as
                | React.ReactNode
                | null
                | undefined
            },
            name: "fire-exit-notes"
          },
          renderWhen(stepValues: {
            "has-fire-exit"?: ComponentValue<DatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-fire-exit"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "property">({
            storeName: "property",
            key: processRef,
            property: ["fireExit", "notes"]
          })
        })
      )
    ]
  }
};

export default step;
