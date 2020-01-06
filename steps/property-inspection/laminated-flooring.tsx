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
import DatabaseSchema from "../../storage/DatabaseSchema";
import processRef from "../../storage/processRef";

import PageSlugs, { hrefForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step: ProcessStepDefinition = {
  title: PageTitles.LaminatedFlooring,
  heading: "Is there any laminated flooring in the property?",
  step: {
    slug: PageSlugs.LaminatedFlooring,
    nextSlug: PageSlugs.StructuralChanges,
    Submit: makeSubmit({
      href: hrefForSlug(PageSlugs.StructuralChanges),
      value: "Save and continue"
    }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "has-laminated-flooring",
          Component: RadioButtons,
          props: {
            name: "has-laminated-flooring",
            legend: (
              <FieldsetLegend>
                Is there any laminated flooring in the property?
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
            property: ["laminatedFlooring", "hasLaminatedFlooring"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "has-permission",
          Component: RadioButtons,
          props: {
            name: "has-permission",
            legend: (
              <FieldsetLegend>
                Is there permission for laminated flooring?
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
            "has-laminated-flooring"?: ComponentValue<
              DatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["has-laminated-flooring"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "property">({
            storeName: "property",
            key: processRef,
            property: ["laminatedFlooring", "hasPermission"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "laminated-flooring-images",
          Component: ImageInput,
          props: {
            label: "Take a photo of laminated flooring and any document(s)",
            name: "laminated-flooring-images",
            hintText: "You can take up to 5 different photos" as
              | string
              | null
              | undefined,
            maxCount: 5
          },
          renderWhen(stepValues: {
            "has-laminated-flooring"?: ComponentValue<
              DatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["has-laminated-flooring"] === "yes";
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "property">({
            storeName: "property",
            key: processRef,
            property: ["laminatedFlooring", "images"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "laminated-flooring-notes",
          Component: TextArea,
          props: {
            label: {
              value: "Add note about laminated flooring if necessary." as
                | React.ReactNode
                | null
                | undefined
            },
            name: "laminated-flooring-notes"
          },
          renderWhen(stepValues: {
            "has-laminated-flooring"?: ComponentValue<
              DatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["has-laminated-flooring"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "property">({
            storeName: "property",
            key: processRef,
            property: ["laminatedFlooring", "notes"]
          })
        })
      )
    ]
  }
};

export default step;
