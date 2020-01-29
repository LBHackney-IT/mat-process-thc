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

import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import processRef from "../../storage/processRef";

import PageSlugs, { urlObjectForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step = {
  title: PageTitles.StructuralChanges,
  heading: "Structural changes",
  step: {
    slug: PageSlugs.StructuralChanges,
    nextSlug: PageSlugs.Damage,
    Submit: makeSubmit({
      url: urlObjectForSlug(PageSlugs.Damage),
      value: "Save and continue"
    }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "has-structural-changes",
          Component: RadioButtons,
          props: {
            name: "has-structural-changes",
            legend: (
              <FieldsetLegend>
                Have any structural changes been made within the property since
                it was originally let?
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
            property: ["structuralChanges", "hasStructuralChanges"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "changes-authorised",
          Component: RadioButtons,
          props: {
            name: "changes-authorised",
            legend: (
              <FieldsetLegend>
                Have the structural changes been authorised?
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
            "has-structural-changes"?: ComponentValue<
              ProcessDatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["has-structural-changes"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: processRef,
            property: ["structuralChanges", "changesAuthorised"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "structural-changes-images",
          Component: ImageInput,
          props: {
            label: "Take photos of structural changes and any documents",
            name: "structural-changes-images",
            hintText: "You can take up to 5 different photos" as
              | string
              | null
              | undefined,
            maxCount: 5 as number | null | undefined
          },
          renderWhen(stepValues: {
            "has-structural-changes"?: ComponentValue<
              ProcessDatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["has-structural-changes"] === "yes";
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: processRef,
            property: ["structuralChanges", "images"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "structural-changes-notes",
          Component: TextArea,
          props: {
            label: {
              value:
                "Add note about structural changes including when it was done and location in property."
            } as { id?: string; value?: React.ReactNode },
            name: "structural-changes-notes"
          },
          renderWhen(stepValues: {
            "has-structural-changes"?: ComponentValue<
              ProcessDatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["has-structural-changes"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: processRef,
            property: ["structuralChanges", "notes"]
          })
        })
      )
    ]
  }
};

export default step;
