import { FieldsetLegend } from "lbh-frontend-react/components";
import { Paragraph } from "lbh-frontend-react/components/typography/Paragraph";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentValue,
  ComponentWrapper,
  DynamicComponent,
  StaticComponent
} from "remultiform/component-wrapper";
import { makeSubmit } from "../../components/makeSubmit";
import { RadioButtons } from "../../components/RadioButtons";
import keyFromSlug from "../../helpers/keyFromSlug";
import yesNoRadios from "../../helpers/yesNoRadios";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const step = {
  title: PageTitles.HomeCheck,
  heading: "Home Check",
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
        value: "Save and continue"
      }),
    componentWrappers: [
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "paragraph-1",
          Component: Paragraph,
          props: {
            children:
              "The Wellbeing support section is the Home Check part of the Tenancy and Household Check process. It includes questions about health, disability, antisocial behaviour, and referrals."
          }
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "home-check",
          Component: RadioButtons,
          props: {
            name: "home-check",
            legend: (
              <FieldsetLegend>
                Do you want to include a Home Check?
              </FieldsetLegend>
            ) as React.ReactNode,
            radios: yesNoRadios
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "homeCheck"
          >({
            storeName: "homeCheck",
            key: keyFromSlug(),
            property: ["value"]
          })
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "paragraph-2",
          Component: Paragraph,
          props: {
            children:
              "Note: If you are not including a Home Check, the Wellbeing support section does not need to be completed."
          }
        })
      )
    ]
  }
};

export default step;
