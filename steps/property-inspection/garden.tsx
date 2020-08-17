import {
  FieldsetLegend,
  Heading,
  HeadingLevels,
} from "lbh-frontend-react/components";
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

const gardenTypeRadios = [
  {
    label: "Private",
    value: "private",
  },
  {
    label: "Communal",
    value: "communal",
  },
  {
    label: "Not sure",
    value: "not sure",
  },
];

const questions = {
  "has-garden": "Does the property have a garden?",
  "garden-type": "Is the garden private or communal?",
  "is-maintained": "Is the garden being maintained",
};

const step: ProcessStepDefinition<ProcessDatabaseSchema, "property"> = {
  title: PageTitles.Garden,
  heading: "Garden",
  review: {
    rows: [
      {
        label: questions["has-garden"],
        values: {
          "has-garden": {
            renderValue(hasGarden: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, hasGarden);
            },
          },
        },
      },
      {
        label: questions["garden-type"],
        values: {
          "garden-type": {
            renderValue(type: string): React.ReactNode {
              return getRadioLabelFromValue(gardenTypeRadios, type);
            },
          },
        },
      },
      {
        label: questions["is-maintained"],
        values: {
          "is-maintained": {
            renderValue(isMaintained: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, isMaintained);
            },
          },
          "garden-notes": {
            renderValue(notes: Notes): React.ReactNode {
              if (notes.length === 0) {
                return;
              }

              return <ReviewNotes notes={notes} />;
            },
          },
        },
        images: "garden-images",
      },
    ],
  },
  step: {
    slug: PageSlugs.Garden,
    nextSlug: PageSlugs.Repairs,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
        value: "Save and continue",
      }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "has-garden",
          Component: RadioButtons,
          props: {
            name: "has-garden",
            legend: (
              <FieldsetLegend>
                <Heading level={HeadingLevels.H3}>
                  {questions["has-garden"]}
                </Heading>
              </FieldsetLegend>
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
            property: ["garden", "hasGarden"],
          }),
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
                <Heading level={HeadingLevels.H3}>
                  {questions["garden-type"]}
                </Heading>
              </FieldsetLegend>
            ) as React.ReactNode,
            radios: gardenTypeRadios,
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
            property: ["garden", "type"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "is-maintained",
          Component: RadioButtons,
          props: {
            name: "is-maintained",
            legend: (
              <FieldsetLegend>
                <Heading level={HeadingLevels.H3}>
                  {questions["is-maintained"]}
                </Heading>
              </FieldsetLegend>
            ) as React.ReactNode,
            radios: yesNoRadios,
          },
          renderWhen(stepValues: {
            "has-garden"?: ComponentValue<ProcessDatabaseSchema, "property">;
            "garden-type"?: ComponentValue<ProcessDatabaseSchema, "property">;
          }): boolean {
            return (
              stepValues["has-garden"] === "yes" &&
              (stepValues["garden-type"] === "private" ||
                stepValues["garden-type"] === "not sure")
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
            property: ["garden", "isMaintained"],
          }),
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
            maxCount: 3 as number | null | undefined,
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
            property: ["garden", "images"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "garden-notes",
          Component: PostVisitActionInput,
          props: {
            label: {
              value: "Add note about garden if necessary.",
            },
            name: "garden-notes",
          } as PostVisitActionInputProps,
          renderWhen(stepValues: {
            "has-garden"?: ComponentValue<ProcessDatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-garden"] === "yes";
          },
          defaultValue: [] as Notes,
          emptyValue: [] as Notes,
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["garden", "notes"],
          }),
        })
      ),
    ],
  },
};

export default step;
