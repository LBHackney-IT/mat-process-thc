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
import { RadioButtons } from "../../components/RadioButtons";
import { TextArea, TextAreaProps } from "../../components/TextArea";
import { getRadioLabelFromValue } from "../../helpers/getRadioLabelFromValue";
import keyFromSlug from "../../helpers/keyFromSlug";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import yesNoRadios from "../../helpers/yesNoRadios";
import { Note } from "../../storage/DatabaseSchema";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const questions = {
  "has-damage": "Are there any signs of damage caused to the property?",
};

const step: ProcessStepDefinition<ProcessDatabaseSchema, "property"> = {
  title: PageTitles.Damage,
  heading: "Damage",
  review: {
    rows: [
      {
        label: questions["has-damage"],
        values: {
          "has-damage": {
            renderValue(hasDamage: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, hasDamage);
            },
          },
          "damage-notes": {
            renderValue(damageNotes: Note): React.ReactNode {
              return damageNotes.value;
            },
          },
        },
        images: "damage-images",
      },
    ],
  },
  step: {
    slug: PageSlugs.Damage,
    nextSlug: PageSlugs.Roof,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
        value: "Save and continue",
      }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "has-damage",
          Component: RadioButtons,
          props: {
            name: "has-damage",
            legend: (
              <FieldsetLegend>{questions["has-damage"]}</FieldsetLegend>
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
            property: ["damage", "hasDamage"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "damage-images",
          Component: ImageInput,
          props: {
            label: "Take photos of damage",
            name: "damage-images",
            hintText: "You can take up to 5 different photos" as
              | string
              | null
              | undefined,
            maxCount: 5 as number | null | undefined,
          },
          renderWhen(stepValues: {
            "has-damage"?: ComponentValue<ProcessDatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-damage"] === "yes";
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["damage", "images"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "damage-notes",
          Component: TextArea,
          props: {
            label: {
              value:
                "Add note about damage including how it was caused and location in property.",
            },
            name: "damage-notes",
            includeCheckbox: true,
          } as TextAreaProps,
          renderWhen(stepValues: {
            "has-damage"?: ComponentValue<ProcessDatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-damage"] === "yes";
          },
          defaultValue: { value: "", isPostVisitAction: false },
          emptyValue: { value: "", isPostVisitAction: false },
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["damage", "notes"],
          }),
        })
      ),
    ],
  },
};

export default step;
