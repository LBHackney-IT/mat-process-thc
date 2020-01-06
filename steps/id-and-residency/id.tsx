import { FieldsetLegend } from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentWrapper,
  DynamicComponent
} from "remultiform/component-wrapper";

import { ImageInput } from "../../components/ImageInput";
import { makeSubmit } from "../../components/makeSubmit";
import ProcessStepDefinition from "../../components/ProcessStepDefinition";
import { RadioButtons } from "../../components/RadioButtons";
import { TextAreaDetails } from "../../components/TextAreaDetails";
import DatabaseSchema from "../../storage/DatabaseSchema";
import processRef from "../../storage/processRef";

import PageSlugs, { hrefForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step: ProcessStepDefinition = {
  title: PageTitles.Id,
  heading: "Verify proof of ID",
  step: {
    slug: PageSlugs.Id,
    nextSlug: PageSlugs.Residency,
    Submit: makeSubmit({
      href: hrefForSlug(PageSlugs.Residency),
      value: "Save and continue"
    }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "id-type",
          Component: RadioButtons,
          props: {
            name: "id-type",
            legend: (
              <FieldsetLegend>What type of ID?</FieldsetLegend>
            ) as React.ReactNode,
            radios: [
              {
                label: "Valid passport",
                value: "valid passport"
              },
              {
                label: "Driving license",
                value: "driving passport"
              },
              {
                label: "Freedom pass",
                value: "freedom pass"
              },
              {
                label: "Photographic work ID",
                value: "photographic work id"
              },
              {
                label: "Photographic student ID",
                value: "photographic student id"
              },
              {
                label: "Unable to verify ID",
                value: "no id"
              }
            ]
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "id">({
            storeName: "id",
            key: processRef,
            property: ["type"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "id-proof-images",
          Component: ImageInput,
          props: {
            label: "Take photo of ID",
            name: "id-proof-images",
            buttonText: "Take photo of ID",
            hintText: "You can take up to 3 different photos for ID verification." as
              | string
              | null
              | undefined,
            maxCount: 3
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "id">({
            storeName: "id",
            key: processRef,
            property: ["images"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "id-notes",
          Component: TextAreaDetails,
          props: {
            summary: "Add note about ID if necessary",
            name: "id-notes"
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "id">({
            storeName: "id",
            key: processRef,
            property: ["notes"]
          })
        })
      )
    ]
  }
};

export default step;