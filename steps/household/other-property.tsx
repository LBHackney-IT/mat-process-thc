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
  "has-other-property": "Does the tenant(s) own or rent any other property?",
};
const step: ProcessStepDefinition<ProcessDatabaseSchema, "household"> = {
  title: PageTitles.OtherProperty,
  heading: "Other property",
  review: {
    rows: [
      {
        label: questions["has-other-property"],
        values: {
          "has-other-property": {
            renderValue(hasOtherProperty: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, hasOtherProperty);
            },
          },
          "other-property-notes": {
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
    slug: PageSlugs.OtherProperty,
    nextSlug: PageSlugs.Sections,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
        value: "Save and continue",
      }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "has-other-property",
          Component: RadioButtons,
          props: {
            name: "has-other-property",
            legend: (
              <FieldsetLegend>
                <Heading level={HeadingLevels.H3}>
                  {questions["has-other-property"]}
                </Heading>
              </FieldsetLegend>
            ) as React.ReactNode,
            radios: yesNoRadios,
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "household"
          >({
            storeName: "household",
            key: keyFromSlug(),
            property: ["otherProperty", "hasOtherProperty"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "other-property-notes",
          Component: PostVisitActionInput,
          props: {
            label: {
              value:
                "Provide details: with / without mortgage, address of property",
            },
            name: "other-property-notes",
          } as PostVisitActionInputProps,
          renderWhen(stepValues: {
            "has-other-property"?: ComponentValue<
              ProcessDatabaseSchema,
              "household"
            >;
          }): boolean {
            return stepValues["has-other-property"] === "yes";
          },
          defaultValue: [] as Notes,
          emptyValue: [] as Notes,
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "household"
          >({
            storeName: "household",
            key: keyFromSlug(),
            property: ["otherProperty", "notes"],
          }),
        })
      ),
    ],
  },
};

export default step;
