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
import { TextArea, TextAreaProps } from "../../components/TextArea";
import keyFromSlug from "../../helpers/keyFromSlug";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const step = {
  title: PageTitles.Roof,
  heading: "Roof access",
  step: {
    slug: PageSlugs.Roof,
    nextSlug: PageSlugs.Loft,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
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
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
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
            "has-access"?: ComponentValue<ProcessDatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-access"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
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
              value: "Add note about roof if necessary."
            },
            name: "roof-notes",
            includeCheckbox: true
          } as TextAreaProps,
          renderWhen(stepValues: {
            "has-access"?: ComponentValue<ProcessDatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-access"] === "yes";
          },
          defaultValue: { value: "", isPostVisitAction: false },
          emptyValue: { value: "", isPostVisitAction: false },
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["roof", "notes"]
          })
        })
      )
    ]
  }
};

export default step;
