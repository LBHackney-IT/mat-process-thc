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
  title: PageTitles.Loft,
  heading: "Does the tenant have access to loft space?",
  step: {
    slug: PageSlugs.Loft,
    nextSlug: PageSlugs.Garden,
    Submit: makeSubmit({
      href: hrefForSlug(PageSlugs.Garden),
      value: "Save and continue"
    }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "has-access-to-loft",
          Component: RadioButtons,
          props: {
            name: "has-access-to-loft",
            legend: (
              <FieldsetLegend>
                Does the tenant have access to loft space?
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
            property: ["loft", "hasAccess"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "items-stored-in-loft",
          Component: RadioButtons,
          props: {
            name: "items-stored-in-loft",
            legend: (
              <FieldsetLegend>
                Are items being stored in the loft space?
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
            "has-access-to-loft"?: ComponentValue<DatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-access-to-loft"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "property">({
            storeName: "property",
            key: processRef,
            property: ["loft", "itemsStored"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "loft-notes",
          Component: TextArea,
          props: {
            label: {
              value: "Add note about loft space if necessary." as
                | React.ReactNode
                | null
                | undefined
            },
            name: "loft-notes"
          },
          renderWhen(stepValues: {
            "has-access-to-loft"?: ComponentValue<DatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-access-to-loft"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "property">({
            storeName: "property",
            key: processRef,
            property: ["loft", "notes"]
          })
        })
      )
    ]
  }
};

export default step;
