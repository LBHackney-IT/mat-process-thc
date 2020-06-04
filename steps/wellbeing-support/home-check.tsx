import { FieldsetLegend } from "lbh-frontend-react/components";
import { Paragraph } from "lbh-frontend-react/components/typography/Paragraph";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentValue,
  ComponentWrapper,
  DynamicComponent,
  StaticComponent,
} from "remultiform/component-wrapper";
import { makeSubmit } from "../../components/makeSubmit";
import { RadioButtons } from "../../components/RadioButtons";
import { getRadioLabelFromValue } from "../../helpers/getRadioLabelFromValue";
import keyFromSlug from "../../helpers/keyFromSlug";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import yesNoRadios from "../../helpers/yesNoRadios";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const questions = {
  "home-check": "Do you want to include a Home Check?",
};

const step: ProcessStepDefinition<ProcessDatabaseSchema, "homeCheck"> = {
  title: PageTitles.HomeCheck,
  heading: "Home Check",
  errors: {
    required: {
      "home-check":
        "You must specify whether or not to include a Home Check in this Tenancy and Household Check",
    },
  },
  review: {
    rows: [
      {
        label: questions["home-check"],
        values: {
          "home-check": {
            renderValue(homeCheck: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, homeCheck);
            },
          },
        },
      },
    ],
  },
  step: {
    slug: PageSlugs.HomeCheck,
    nextSlug(stepValues: {
      "home-check"?: ComponentValue<ProcessDatabaseSchema, "homeCheck">;
    }): string {
      return stepValues["home-check"] === "yes"
        ? PageSlugs.Health
        : PageSlugs.Sections;
    },
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
        value: "Save and continue",
      }),
    componentWrappers: [
      ComponentWrapper.wrapStatic<ProcessDatabaseSchema, "homeCheck">(
        new StaticComponent({
          key: "paragraph-1",
          Component: Paragraph,
          props: {
            children:
              "The wellbeing support section is the Home Check part of the Tenancy and Household Check process. It includes questions about health, disability and support needs.",
          },
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "home-check",
          Component: RadioButtons,
          props: {
            name: "home-check",
            legend: (
              <FieldsetLegend>{questions["home-check"]}</FieldsetLegend>
            ) as React.ReactNode,
            radios: yesNoRadios,
          },
          required: true,
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "homeCheck"
          >({
            storeName: "homeCheck",
            key: keyFromSlug(),
            property: ["value"],
          }),
        })
      ),
      ComponentWrapper.wrapStatic<ProcessDatabaseSchema, "homeCheck">(
        new StaticComponent({
          key: "paragraph-2",
          Component: Paragraph,
          props: {
            children:
              "Note: if you are not including a Home Check, the wellbeing support section does not need to be completed.",
          },
        })
      ),
    ],
  },
};

export default step;
