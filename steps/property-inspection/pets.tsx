import { FieldsetLegend, Paragraph, Link } from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentValue,
  ComponentWrapper,
  DynamicComponent,
  StaticComponent,
} from "remultiform/component-wrapper";
import { Checkboxes, CheckboxesProps } from "../../components/Checkboxes";
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

const petRadios = [
  {
    label: "Amphibian (e.g. frog, newt, salamander, toad)",
    value: "amphibian",
  },
  {
    label: "Bird",
    value: "bird",
  },
  {
    label: "Cat",
    value: "cat",
  },
  {
    label: "Chicken",
    value: "chicken",
  },
  {
    label: "Dog",
    value: "dog",
  },
  {
    label: "Domestic rodent (e.g. gerbil, hamster, mouse, rat)",
    value: "domestic rodent",
  },
  {
    label: "Fish",
    value: "fish",
  },
  {
    label: "Invertebrate (e.g. crab, insect, spider, worm)",
    value: "invertebrate",
  },
  {
    label: "Rabbit",
    value: "rabbit",
  },
  {
    label: "Reptile (e.g. lizard, snake, tortoise, turtle)",
    value: "reptile",
  },
  {
    label: "Other",
    value: "other",
  },
];

const questions = {
  "has-pets": "Are there any pets in the property?",
  "pet-type": "What type of pets?",
  "has-permission": "Has permission been given to keep pets?",
};

const step: ProcessStepDefinition<ProcessDatabaseSchema, "property"> = {
  title: PageTitles.Pets,
  heading: "Pets",
  review: {
    rows: [
      {
        label: questions["has-pets"],
        values: {
          "has-pets": {
            renderValue(hasPets: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, hasPets);
            },
          },
          "pet-type": {
            renderValue(types: string): React.ReactNode {
              return petRadios
                .filter(({ value }) => types.includes(value))
                .map(({ label }) => label)
                .join(", ");
            },
          },
          "pets-notes": {
            renderValue(notes: Notes): React.ReactNode {
              if (notes.length === 0) {
                return;
              }

              return <ReviewNotes notes={notes} />;
            },
          },
        },
        images: "other-comments-images",
      },
      {
        label: questions["has-permission"],
        values: {
          "has-permission": {
            renderValue(hasPermission: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, hasPermission);
            },
          },
        },
        images: "pets-permission-images",
      },
    ],
  },
  step: {
    slug: PageSlugs.Pets,
    nextSlug: PageSlugs.AntisocialBehaviour,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
        value: "Save and continue",
      }),
    componentWrappers: [
      ComponentWrapper.wrapStatic<ProcessDatabaseSchema, "property">(
        new StaticComponent({
          key: "paragraph-1",
          Component: Paragraph,
          props: {
            children: (
              <>
                Guidance on pets is covered in{" "}
                <Link
                  key="pet-guidance"
                  href="https://hackney.gov.uk/your-tenancy-agreement"
                  target="_blank"
                >
                  Your Tenancy conditions: section 4.21 - 4.22
                </Link>{" "}
                (online only, opens in a new tab).
              </>
            ),
          },
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "has-pets",
          Component: RadioButtons,
          props: {
            name: "has-pets",
            legend: (
              <FieldsetLegend>{questions["has-pets"]}</FieldsetLegend>
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
            property: ["pets", "hasPets"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "pet-type",
          Component: Checkboxes,
          props: {
            name: "pet-type",
            legend: (
              <FieldsetLegend>{questions["pet-type"]}</FieldsetLegend>
            ) as React.ReactNode,
            checkboxes: petRadios,
          } as CheckboxesProps,
          renderWhen(stepValues: {
            "has-pets"?: ComponentValue<ProcessDatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-pets"] === "yes";
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["pets", "petTypes"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "has-permission",
          Component: RadioButtons,
          props: {
            name: "has-permission",
            legend: (
              <FieldsetLegend>{questions["has-permission"]}</FieldsetLegend>
            ) as React.ReactNode,
            radios: yesNoRadios,
          },
          renderWhen(stepValues: {
            "has-pets"?: ComponentValue<ProcessDatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-pets"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["pets", "hasPermission"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "pets-permission-images",
          Component: ImageInput,
          props: {
            label: "Take photo of permission document",
            name: "pets-permission-images",
            maxCount: 1 as number | null | undefined,
          },
          renderWhen(stepValues: {
            "has-pets"?: ComponentValue<ProcessDatabaseSchema, "property">;
            "has-permission"?: ComponentValue<
              ProcessDatabaseSchema,
              "property"
            >;
          }): boolean {
            return (
              stepValues["has-pets"] === "yes" &&
              stepValues["has-permission"] === "yes"
            );
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["pets", "images"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "pets-notes",
          Component: PostVisitActionInput,
          props: {
            label: {
              value: "Add note about pets if necessary.",
            },
            name: "pets-notes",
          } as PostVisitActionInputProps,
          renderWhen(stepValues: {
            "has-pets"?: ComponentValue<ProcessDatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-pets"] === "yes";
          },
          defaultValue: [] as Notes,
          emptyValue: [] as Notes,
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["pets", "notes"],
          }),
        })
      ),
    ],
  },
};

export default step;
