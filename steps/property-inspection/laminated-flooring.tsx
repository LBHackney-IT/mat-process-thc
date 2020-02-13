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
import {
  TextAreaWithCheckbox,
  TextAreaWithCheckboxProps
} from "../../components/TextAreaWithCheckbox";

import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import processRef from "../../storage/processRef";

import PageSlugs, { urlObjectForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step = {
  title: PageTitles.LaminatedFlooring,
  heading: "Laminated flooring",
  step: {
    slug: PageSlugs.LaminatedFlooring,
    nextSlug: PageSlugs.StructuralChanges,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        url: urlObjectForSlug(nextSlug),
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
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
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
              ProcessDatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["has-laminated-flooring"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
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
            label: "Take a photo of laminated flooring and any documents",
            name: "laminated-flooring-images",
            hintText: "You can take up to 5 different photos" as
              | string
              | null
              | undefined,
            maxCount: 5 as number | null | undefined
          },
          renderWhen(stepValues: {
            "has-laminated-flooring"?: ComponentValue<
              ProcessDatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["has-laminated-flooring"] === "yes";
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: processRef,
            property: ["laminatedFlooring", "images"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "laminated-flooring-notes",
          Component: TextAreaWithCheckbox,
          props: {
            label: {
              value: "Add note about laminated flooring if necessary."
            },
            name: "laminated-flooring-notes",
            includeCheckbox: true
          } as TextAreaWithCheckboxProps,
          renderWhen(stepValues: {
            "has-laminated-flooring"?: ComponentValue<
              ProcessDatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["has-laminated-flooring"] === "yes";
          },
          defaultValue: { value: "", isPostVisitAction: false },
          emptyValue: { value: "", isPostVisitAction: false },
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
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
