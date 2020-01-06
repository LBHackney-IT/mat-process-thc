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
  title: PageTitles.CommunalAreas,
  heading: "Has the tenant left combustible items in communal areas?",
  step: {
    slug: PageSlugs.CommunalAreas,
    nextSlug: PageSlugs.Pets,
    Submit: makeSubmit({
      href: hrefForSlug(PageSlugs.Pets),
      value: "Save and continue"
    }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "has-left-combustible-items",
          Component: RadioButtons,
          props: {
            name: "has-left-combustible-items",
            legend: (
              <FieldsetLegend>
                Has the tenant left combustible items in communal areas?
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
            property: ["communalAreas", "hasLeftCombustibleItems"]
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
            "has-left-combustible-items"?: ComponentValue<
              DatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["has-left-combustible-items"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "property">({
            storeName: "property",
            key: processRef,
            property: ["communalAreas", "furtherActionRequired"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "communal-areas-notes",
          Component: TextArea,
          props: {
            label: {
              value: "Add note about door mats / potted plants if necessary." as
                | React.ReactNode
                | null
                | undefined
            },
            name: "communal-areas-notes"
          },
          renderWhen(stepValues: {
            "has-left-combustible-items"?: ComponentValue<
              DatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["has-left-combustible-items"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "property">({
            storeName: "property",
            key: processRef,
            property: ["communalAreas", "notes"]
          })
        })
      )
    ]
  }
};

export default step;
