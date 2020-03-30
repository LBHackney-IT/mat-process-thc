import { FieldsetLegend } from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentValue,
  ComponentWrapper,
  DynamicComponent,
} from "remultiform/component-wrapper";
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
            renderValue(otherPropertyNotes: Note): React.ReactNode {
              return otherPropertyNotes.value;
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
              <FieldsetLegend>{questions["has-other-property"]}</FieldsetLegend>
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
          Component: TextArea,
          props: {
            label: {
              value:
                "Provide details: with / without mortgage, address of property",
            },
            name: "other-property-notes",
            includeCheckbox: true,
          } as TextAreaProps,
          renderWhen(stepValues: {
            "has-other-property"?: ComponentValue<
              ProcessDatabaseSchema,
              "household"
            >;
          }): boolean {
            return stepValues["has-other-property"] === "yes";
          },
          defaultValue: { value: "", isPostVisitAction: false },
          emptyValue: { value: "", isPostVisitAction: false },
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
