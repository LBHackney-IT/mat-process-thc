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
import {
  TextAreaWithCheckbox,
  TextAreaWithCheckboxProps
} from "../../components/TextAreaWithCheckbox";

import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import processRef from "../../storage/processRef";

import PageSlugs, { urlObjectForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step = {
  title: PageTitles.DoorMats,
  heading: "Door mats or potted plants",
  step: {
    slug: PageSlugs.DoorMats,
    nextSlug: PageSlugs.CommunalAreas,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        url: urlObjectForSlug(nextSlug),
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
                Has the tenant placed door mats or potted plants in communal
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
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
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
            key: processRef,
            property: ["doorMats", "furtherActionRequired"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "door-mats-notes",
          Component: TextAreaWithCheckbox,
          props: {
            label: {
              value: "Add note about door mats / potted plants if necessary."
            },
            name: "door-mats-notes",
            includeCheckbox: true
          } as TextAreaWithCheckboxProps,
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
            key: processRef,
            property: ["doorMats", "notes"]
          })
        })
      )
    ]
  }
};

export default step;
