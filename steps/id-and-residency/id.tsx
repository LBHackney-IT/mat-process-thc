import { FieldsetLegend } from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentWrapper,
  DynamicComponent
} from "remultiform/component-wrapper";

import { ImageInput } from "../../components/ImageInput";
import { makeSubmit } from "../../components/makeSubmit";
import { RadioButtons } from "../../components/RadioButtons";
import { TextAreaDetails } from "../../components/TextAreaDetails";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import processRef from "../../storage/processRef";

import PageSlugs, { urlObjectForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const idTypeRadios = [
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
];

const step: ProcessStepDefinition<ProcessDatabaseSchema, "id"> = {
  title: PageTitles.Id,
  heading: "Verify proof of ID",
  review: {
    rows: [
      {
        label: "Proof of ID",
        values: {
          "id-type": {
            renderValue(type: string): React.ReactNode {
              return idTypeRadios.find(({ value }) => value === type)?.label;
            }
          },
          "id-notes": {
            renderValue(notes: string): React.ReactNode {
              return notes;
            }
          }
        },
        images: "id-images"
      }
    ]
  },
  step: {
    slug: PageSlugs.Id,
    nextSlug: PageSlugs.Residency,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        url: urlObjectForSlug(nextSlug),
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
            radios: idTypeRadios
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<ProcessDatabaseSchema, "id">({
            storeName: "id",
            key: processRef,
            property: ["type"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "id-images",
          Component: ImageInput,
          props: {
            label: "Take photo of ID",
            name: "id-images",
            buttonText: "Take photo of ID",
            hintText: "You can take up to 3 different photos for ID verification." as
              | string
              | null
              | undefined,
            maxCount: 3 as number | null | undefined
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<ProcessDatabaseSchema, "id">({
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
            summary: "Add note about ID if necessary" as React.ReactNode,
            label: { value: "Notes" } as {
              id?: string;
              value: React.ReactNode;
            },
            name: "id-notes"
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<ProcessDatabaseSchema, "id">({
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
