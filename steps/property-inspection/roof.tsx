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
  title: PageTitles.Roof,
  heading: "Does the tenant have access to the roof?",
  step: {
    slug: PageSlugs.Roof,
    nextSlug: PageSlugs.Submit,
    Submit: makeSubmit({
      href: hrefForSlug(PageSlugs.Submit),
      value: "Save and continue"
    }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "has-access",
          Component: RadioButtons,
          props: {
            name: "has-access",
            legend: (
              <FieldsetLegend>
                Does the tenant have access to the roof?
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
            property: ["roof", "hasAccess"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "items-stored-on-roof",
          Component: RadioButtons,
          props: {
            name: "items-stored-on-roof",
            legend: (
              <FieldsetLegend>
                Are items being stored on the roof?
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
          renderWhen(stepValues: {
            "has-access"?: ComponentValue<DatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-access"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "property">({
            storeName: "property",
            key: processRef,
            property: ["roof", "itemsStoredOnRoof"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "roof-notes",
          Component: TextArea,
          props: {
            label: {
              value: "Add note about roof if necessary." as
                | string
                | null
                | undefined
            },
            name: "roof-notes"
          },
          renderWhen(stepValues: {
            "has-access"?: ComponentValue<DatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-access"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "property">({
            storeName: "property",
            key: processRef,
            property: ["roof", "notes"]
          })
        })
      )
    ]
  }
};

export default step;
