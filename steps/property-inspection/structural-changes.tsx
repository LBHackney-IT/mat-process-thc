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
  "has-structural-changes":
    "Have any structural changes been made within the property since it was originally let?",
  "changes-authorised": "Have the structural changes been authorised?"
};

const step: ProcessStepDefinition<ProcessDatabaseSchema, "property"> = {
  title: PageTitles.StructuralChanges,
  heading: "Structural changes",
  review: {
    rows: [
      {
        label: questions["has-structural-changes"],
        values: {
          "has-structural-changes": {
            renderValue(structuralChanges: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, structuralChanges);
            }
          },
          "structural-changes-notes": {
            renderValue(notes: Note): React.ReactNode {
              return notes.value;
            }
          }
        },
        images: "structural-changes-images"
      },
      {
        label: questions["changes-authorised"],
        values: {
          "changes-authorised": {
            renderValue(changesAuthorised: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, changesAuthorised);
            }
          }
        }
      }
    ]
  },
  step: {
    slug: PageSlugs.StructuralChanges,
    nextSlug: PageSlugs.Damage,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
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
                {questions["has-structural-changes"]}
              </FieldsetLegend>
            ) as React.ReactNode,
            radios: yesNoRadios
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
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
              <FieldsetLegend>{questions["changes-authorised"]}</FieldsetLegend>
            ) as React.ReactNode,
            radios: yesNoRadios
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
            key: keyFromSlug(),
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
            key: keyFromSlug(),
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
            },
            name: "structural-changes-notes",
            includeCheckbox: true
          } as TextAreaProps,
          renderWhen(stepValues: {
            "has-structural-changes"?: ComponentValue<
              ProcessDatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["has-structural-changes"] === "yes";
          },
          defaultValue: { value: "", isPostVisitAction: false },
          emptyValue: { value: "", isPostVisitAction: false },
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["structuralChanges", "notes"]
          })
        })
      )
    ]
  }
};

export default step;
