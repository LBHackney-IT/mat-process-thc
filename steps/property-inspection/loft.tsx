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
  title: PageTitles.Loft,
  heading: "Loft access",
  step: {
    slug: PageSlugs.Loft,
    nextSlug: PageSlugs.Garden,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
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
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
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
            "has-access-to-loft"?: ComponentValue<
              ProcessDatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["has-access-to-loft"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
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
              value: "Add note about loft space if necessary."
            } as { id?: string; value: React.ReactNode },
            name: "loft-notes"
          },
          renderWhen(stepValues: {
            "has-access-to-loft"?: ComponentValue<
              ProcessDatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["has-access-to-loft"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
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
