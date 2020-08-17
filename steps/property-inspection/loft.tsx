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
  "has-access-to-loft": "Does the tenant have access to loft space?",
  "items-stored-in-loft": "Are items being stored in the loft space?",
};

const step: ProcessStepDefinition<ProcessDatabaseSchema, "property"> = {
  title: PageTitles.Loft,
  heading: "Loft access",
  review: {
    rows: [
      {
        label: questions["has-access-to-loft"],
        values: {
          "has-access-to-loft": {
            renderValue(hasAccess: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, hasAccess);
            },
          },
        },
      },
      {
        label: questions["items-stored-in-loft"],
        values: {
          "items-stored-in-loft": {
            renderValue(storingItems: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, storingItems);
            },
          },
          "loft-notes": {
            renderValue(notes: Notes): React.ReactNode {
              if (notes.length === 0) {
                return;
              }

              return <ReviewNotes notes={notes} />;
            },
          },
        },
      },
    ],
  },
  step: {
    slug: PageSlugs.Loft,
    nextSlug: PageSlugs.Garden,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
        value: "Save and continue",
      }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "has-access-to-loft",
          Component: RadioButtons,
          props: {
            name: "has-access-to-loft",
            legend: (
              <FieldsetLegend>
                <Heading level={HeadingLevels.H3}>
                  {questions["has-access-to-loft"]}
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
            property: ["loft", "hasAccess"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "items-stored-in-loft",
          Component: RadioButtons,
          props: {
            name: "items-stored-in-loft",
            legend: (
              <FieldsetLegend>
                <Heading level={HeadingLevels.H3}>
                  {questions["items-stored-in-loft"]}
                </Heading>
              </FieldsetLegend>
            ) as React.ReactNode,
            radios: yesNoRadios,
          },
          renderWhen(stepValues: {
            "has-access-to-loft"?: ComponentValue<
              ProcessDatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["has-access-to-loft"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["loft", "itemsStored"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "loft-notes",
          Component: PostVisitActionInput,
          props: {
            label: {
              value: "Add note about loft space if necessary.",
            },
            name: "loft-notes",
          } as PostVisitActionInputProps,
          renderWhen(stepValues: {
            "has-access-to-loft"?: ComponentValue<
              ProcessDatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["has-access-to-loft"] === "yes";
          },
          defaultValue: [] as Notes,
          emptyValue: [] as Notes,
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["loft", "notes"],
          }),
        })
      ),
    ],
  },
};

export default step;
