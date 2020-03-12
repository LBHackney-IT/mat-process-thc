import { FieldsetLegend } from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentValue,
  ComponentWrapper,
  DynamicComponent
} from "remultiform/component-wrapper";
import { ImageInput } from "../../components/ImageInput";
import { makeSubmit } from "../../components/makeSubmit";
import { RadioButtons } from "../../components/RadioButtons";
import { TextArea, TextAreaProps } from "../../components/TextArea";
import keyFromSlug from "../../helpers/keyFromSlug";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const step = {
  title: PageTitles.Garden,
  heading: "Garden",
  step: {
    slug: PageSlugs.Garden,
    nextSlug: PageSlugs.Repairs,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
        value: "Save and continue"
      }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "has-garden",
          Component: RadioButtons,
          props: {
            name: "has-garden",
            legend: (
              <FieldsetLegend>Does the property have a garden?</FieldsetLegend>
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
            property: ["garden", "hasGarden"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "garden-type",
          Component: RadioButtons,
          props: {
            name: "garden-type",
            legend: (
              <FieldsetLegend>
                Is the garden private or communal?
              </FieldsetLegend>
            ) as React.ReactNode,
            radios: [
              {
                label: "Private",
                value: "private"
              },
              {
                label: "Communal",
                value: "communal"
              },
              {
                label: "Not sure",
                value: "not sure"
              }
            ]
          },
          renderWhen(stepValues: {
            "has-garden"?: ComponentValue<ProcessDatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-garden"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["garden", "type"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "is-maintained",
          Component: RadioButtons,
          props: {
            name: "is-maintained",
            legend: (
              <FieldsetLegend>Is the garden being maintained?</FieldsetLegend>
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
            "garden-type"?: ComponentValue<ProcessDatabaseSchema, "property">;
          }): boolean {
            return (
              stepValues["garden-type"] === "private" ||
              stepValues["garden-type"] === "not sure"
            );
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["garden", "isMaintained"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "garden-images",
          Component: ImageInput,
          props: {
            label: "Take photos of garden if necessary",
            name: "garden-images",
            hintText: "You can take up to 3 different photos" as
              | string
              | null
              | undefined,
            maxCount: 3 as number | null | undefined
          },
          renderWhen(stepValues: {
            "has-garden"?: ComponentValue<ProcessDatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-garden"] === "yes";
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["garden", "images"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "garden-notes",
          Component: TextArea,
          props: {
            label: {
              value: "Add note about garden if necessary."
            },
            name: "garden-notes",
            includeCheckbox: true
          } as TextAreaProps,
          renderWhen(stepValues: {
            "has-garden"?: ComponentValue<ProcessDatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-garden"] === "yes";
          },
          defaultValue: { value: "", isPostVisitAction: false },
          emptyValue: { value: "", isPostVisitAction: false },
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["garden", "notes"]
          })
        })
      )
    ]
  }
};

export default step;
