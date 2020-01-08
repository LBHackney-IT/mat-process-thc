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
import ProcessStepDefinition from "../../components/ProcessStepDefinition";
import { RadioButtons } from "../../components/RadioButtons";
import { TextArea } from "../../components/TextArea";
import DatabaseSchema from "../../storage/DatabaseSchema";
import processRef from "../../storage/processRef";

import PageSlugs, { hrefForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step: ProcessStepDefinition = {
  title: PageTitles.StructuralChanges,
  heading:
    "Have any structural changes been made within the property since it was originally let?",
  step: {
    slug: PageSlugs.StructuralChanges,
    nextSlug: PageSlugs.Damage,
    Submit: makeSubmit({
      href: hrefForSlug(PageSlugs.Damage),
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
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "property">({
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
              DatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["has-structural-changes"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "property">({
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
            maxCount: 5
          },
          renderWhen(stepValues: {
            "has-structural-changes"?: ComponentValue<
              DatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["has-structural-changes"] === "yes";
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "property">({
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
              value: "Add note about structural changes including when it was done and location in property." as
                | React.ReactNode
                | null
                | undefined
            },
            name: "structural-changes-notes"
          },
          renderWhen(stepValues: {
            "has-structural-changes"?: ComponentValue<
              DatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["has-structural-changes"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "property">({
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
