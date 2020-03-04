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
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import processRef from "../../storage/processRef";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const step = {
  title: PageTitles.SmokeAlarm,
  heading: "Smoke alarm",
  step: {
    slug: PageSlugs.SmokeAlarm,
    nextSlug: PageSlugs.MetalGates,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
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
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
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
            "has-smoke-alarm"?: ComponentValue<
              ProcessDatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["has-smoke-alarm"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
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
              value: "Add note about the smoke alarm if necessary."
            } as { id?: string; value: React.ReactNode },
            name: "smoke-alarm-notes"
          },
          renderWhen(stepValues: {
            "has-smoke-alarm"?: ComponentValue<
              ProcessDatabaseSchema,
              "property"
            >;
          }): boolean {
            return (
              stepValues["has-smoke-alarm"] === "yes" ||
              stepValues["has-smoke-alarm"] === "no"
            );
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
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
