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
  "has-laminated-flooring": "Is there any laminated flooring in the property?",
  "has-permission": "Is there permission for laminated flooring?",
};

const step: ProcessStepDefinition<ProcessDatabaseSchema, "property"> = {
  title: PageTitles.LaminatedFlooring,
  heading: "Laminated flooring",
  review: {
    rows: [
      {
        label: questions["has-laminated-flooring"],
        values: {
          "has-laminated-flooring": {
            renderValue(hasLaminatedFlooring: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, hasLaminatedFlooring);
            },
          },
          "laminated-flooring-notes": {
            renderValue(notes: Notes): React.ReactNode {
              if (notes.length === 0) {
                return;
              }

              return <ReviewNotes notes={notes} />;
            },
          },
        },
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
        images: "laminated-flooring-images",
      },
    ],
  },
  step: {
    slug: PageSlugs.LaminatedFlooring,
    nextSlug: PageSlugs.StructuralChanges,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
        value: "Save and continue",
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
                {questions["has-laminated-flooring"]}
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
            property: ["laminatedFlooring", "hasLaminatedFlooring"],
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
            key: keyFromSlug(),
            property: ["laminatedFlooring", "hasPermission"],
          }),
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
            maxCount: 5 as number | null | undefined,
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
            key: keyFromSlug(),
            property: ["laminatedFlooring", "images"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "laminated-flooring-notes",
          Component: PostVisitActionInput,
          props: {
            label: {
              value: "Add note about laminated flooring if necessary.",
            },
            name: "laminated-flooring-notes",
          } as PostVisitActionInputProps,
          renderWhen(stepValues: {
            "has-laminated-flooring"?: ComponentValue<
              ProcessDatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["has-laminated-flooring"] === "yes";
          },
          defaultValue: [] as Notes,
          emptyValue: [] as Notes,
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["laminatedFlooring", "notes"],
          }),
        })
      ),
    ],
  },
};

export default step;
