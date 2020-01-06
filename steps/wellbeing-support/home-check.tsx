import { FieldsetLegend } from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentWrapper,
  DynamicComponent,
  StaticComponent
} from "remultiform/component-wrapper";
import { Paragraph } from "lbh-frontend-react/components/typography/Paragraph";

import { makeSubmit } from "../../components/makeSubmit";
import ProcessStepDefinition from "../../components/ProcessStepDefinition";
import { RadioButtons } from "../../components/RadioButtons";
import DatabaseSchema from "../../storage/DatabaseSchema";
import processRef from "../../storage/processRef";

import PageSlugs, { hrefForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step: ProcessStepDefinition = {
  title: PageTitles.HomeCheck,
  heading:
    "Are you doing a Home Check as part of the Tenancy and Household Check?",
  step: {
    slug: PageSlugs.HomeCheck,
    nextSlug: PageSlugs.Submit,
    Submit: makeSubmit({
      href: hrefForSlug(PageSlugs.Submit),
      value: "Save and continue"
    }),
    componentWrappers: [
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "paragraph-1",
          Component: Paragraph,
          props: {
            children:
              "The Wellbeing support section is the Home Check part of the Tenancy and Household Check process. It includes questions about health, disability, anti social behaviour and referrals."
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
            radios: [
              {
                label: "Yes",
                value: "yes"
              },
              {
                label: "No",
                value: "no"
              }
            ]
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "homeCheck">({
            storeName: "homeCheck",
            key: processRef,
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
