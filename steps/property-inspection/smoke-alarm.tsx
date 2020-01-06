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
  title: PageTitles.SmokeAlarm,
  heading: "Is there is a hard wired smoke alarm in the property?",
  step: {
    slug: PageSlugs.SmokeAlarm,
    nextSlug: PageSlugs.MetalGates,
    Submit: makeSubmit({
      href: hrefForSlug(PageSlugs.MetalGates),
      value: "Save and continue"
    }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "has-smoke-alarm",
          Component: RadioButtons,
          props: {
            name: "has-smoke-alarm",
            legend: (
              <FieldsetLegend>
                Is there is a hard wired smoke alarm in the property?
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
            property: ["smokeAlarm", "hasSmokeAlarm"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "is-working",
          Component: RadioButtons,
          props: {
            name: "is-working",
            legend: (
              <FieldsetLegend>Does it work when tested?</FieldsetLegend>
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
            "has-smoke-alarm"?: ComponentValue<DatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-smoke-alarm"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "property">({
            storeName: "property",
            key: processRef,
            property: ["smokeAlarm", "isWorking"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "smoke-alarm-notes",
          Component: TextArea,
          props: {
            label: {
              value: "Add note about the smoke alarm if necessary." as
                | string
                | null
                | undefined
            },
            name: "smoke-alarm-notes"
          },
          renderWhen(stepValues: {
            "has-smoke-alarm"?: ComponentValue<DatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-smoke-alarm"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "property">({
            storeName: "property",
            key: processRef,
            property: ["smokeAlarm", "notes"]
          })
        })
      )
    ]
  }
};

export default step;
