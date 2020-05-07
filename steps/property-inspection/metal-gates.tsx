import { FieldsetLegend } from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentValue,
  ComponentWrapper,
  DynamicComponent,
} from "remultiform/component-wrapper";
import { ImageInput } from "../../components/ImageInput";
import { makeSubmit } from "../../components/makeSubmit";
import {
  PostVisitActionInput,
  PostVisitActionInputProps,
} from "../../components/PostVisitActionInput";
import { RadioButtons } from "../../components/RadioButtons";
import { ReviewNotes } from "../../components/ReviewNotes";
import { getRadioLabelFromValue } from "../../helpers/getRadioLabelFromValue";
import keyFromSlug from "../../helpers/keyFromSlug";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import yesNoRadios from "../../helpers/yesNoRadios";
import { Notes } from "../../storage/DatabaseSchema";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const questions = {
  "has-metal-gates":
    "Has the tenant had metal gates erected across front entrance doors?",
  "combustible-items-behind-gates":
    "Are there combustible items behind the metal gates?",
  "further-action-required": "Is further action required?",
};

const step: ProcessStepDefinition<ProcessDatabaseSchema, "property"> = {
  title: PageTitles.MetalGates,
  heading: "Metal gates",
  review: {
    rows: [
      {
        label: questions["has-metal-gates"],
        values: {
          "has-metal-gates": {
            renderValue(hasMetalGates: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, hasMetalGates);
            },
          },
        },
      },
      {
        label: questions["combustible-items-behind-gates"],
        values: {
          "combustible-items-behind-gates": {
            renderValue(combustiblesBehindGates: string): React.ReactNode {
              return getRadioLabelFromValue(
                yesNoRadios,
                combustiblesBehindGates
              );
            },
          },
        },
      },
      {
        label: questions["further-action-required"],
        values: {
          "further-action-required": {
            renderValue(combustiblesBehindGates: string): React.ReactNode {
              return getRadioLabelFromValue(
                yesNoRadios,
                combustiblesBehindGates
              );
            },
          },
          "metal-gates-notes": {
            renderValue(notes: Notes): React.ReactNode {
              if (notes.length === 0) {
                return;
              }

              return <ReviewNotes notes={notes} />;
            },
          },
        },
        images: "metal-gate-images",
      },
    ],
  },
  step: {
    slug: PageSlugs.MetalGates,
    nextSlug: PageSlugs.DoorMats,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
        value: "Save and continue",
      }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "has-metal-gates",
          Component: RadioButtons,
          props: {
            name: "has-metal-gates",
            legend: (
              <FieldsetLegend>{questions["has-metal-gates"]}</FieldsetLegend>
            ) as React.ReactNode,
            radios: yesNoRadios,
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["metalGates", "hasMetalGates"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "combustible-items-behind-gates",
          Component: RadioButtons,
          props: {
            name: "combustible-items-behind-gates",
            legend: (
              <FieldsetLegend>
                {questions["combustible-items-behind-gates"]}
              </FieldsetLegend>
            ) as React.ReactNode,
            radios: yesNoRadios,
          },
          renderWhen(stepValues: {
            "has-metal-gates"?: ComponentValue<
              ProcessDatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["has-metal-gates"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["metalGates", "combustibleItemsBehind"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "further-action-required",
          Component: RadioButtons,
          props: {
            name: "further-action-required",
            legend: (
              <FieldsetLegend>
                {questions["further-action-required"]}
              </FieldsetLegend>
            ) as React.ReactNode,
            radios: yesNoRadios,
          },
          renderWhen(stepValues: {
            "has-metal-gates"?: ComponentValue<
              ProcessDatabaseSchema,
              "property"
            >;
            "combustible-items-behind-gates"?: ComponentValue<
              ProcessDatabaseSchema,
              "property"
            >;
          }): boolean {
            return (
              stepValues["has-metal-gates"] === "yes" &&
              stepValues["combustible-items-behind-gates"] === "yes"
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
            property: ["metalGates", "furtherActionRequired"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "metal-gate-images",
          Component: ImageInput,
          props: {
            label: "Take a photo of any metal gates",
            name: "metal-gate-images",
            hintText: "You can take up to 3 different photos of metal gates." as
              | string
              | null
              | undefined,
            maxCount: 3 as number | null | undefined,
          },
          renderWhen(stepValues: {
            "has-metal-gates"?: ComponentValue<
              ProcessDatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["has-metal-gates"] === "yes";
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["metalGates", "images"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "metal-gates-notes",
          Component: PostVisitActionInput,
          props: {
            label: {
              value:
                "Add note about metal gates / combustible items if necessary.",
            },
            name: "metal-gates-notes",
          } as PostVisitActionInputProps,
          renderWhen(stepValues: {
            "has-metal-gates"?: ComponentValue<
              ProcessDatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["has-metal-gates"] === "yes";
          },
          defaultValue: [] as Notes,
          emptyValue: [] as Notes,
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["metalGates", "notes"],
          }),
        })
      ),
    ],
  },
};

export default step;
