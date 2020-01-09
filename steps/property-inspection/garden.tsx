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
import { TextArea } from "../../components/TextArea";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import processRef from "../../storage/processRef";

import PageSlugs, { urlObjectForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step: ProcessStepDefinition = {
  title: PageTitles.Garden,
  heading: "Does the property have a garden?",
  step: {
    slug: PageSlugs.Garden,
    nextSlug: PageSlugs.StoringMaterials,
    Submit: makeSubmit({
      url: urlObjectForSlug(PageSlugs.StoringMaterials),
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
            key: processRef,
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
            key: processRef,
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
            return stepValues["garden-type"] === ("private" || "not sure");
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: processRef,
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
            maxCount: 3
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
            key: processRef,
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
              value: "Add note about upkeep of garden if necessary." as
                | React.ReactNode
                | null
                | undefined
            },
            name: "garden-notes"
          },
          renderWhen(stepValues: {
            "is-maintained"?: ComponentValue<ProcessDatabaseSchema, "property">;
          }): boolean {
            return stepValues["is-maintained"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: processRef,
            property: ["garden", "notes"]
          })
        })
      )
    ]
  }
};

export default step;
