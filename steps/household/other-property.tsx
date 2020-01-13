import { FieldsetLegend } from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentWrapper,
  DynamicComponent,
  ComponentValue
} from "remultiform/component-wrapper";

import { makeSubmit } from "../../components/makeSubmit";
import { RadioButtons } from "../../components/RadioButtons";
import { TextArea } from "../../components/TextArea";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import processRef from "../../storage/processRef";

import PageSlugs, { urlObjectForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step: ProcessStepDefinition = {
  title: PageTitles.OtherProperty,
  heading: "Other property",
  step: {
    slug: PageSlugs.OtherProperty,
    nextSlug: PageSlugs.Sections,
    Submit: makeSubmit({
      url: urlObjectForSlug(PageSlugs.Sections),
      value: "Save and continue"
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
                Does the tenant(s) own or rent any other property?
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
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "household"
          >({
            storeName: "household",
            key: processRef,
            property: ["otherProperty", "hasOtherProperty"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "other-property-notes",
          Component: TextArea,
          props: {
            label: {
              value: "Provide details: with / without mortgage, address of property" as
                | React.ReactNode
                | undefined
            },
            name: "other-property-notes"
          },
          renderWhen(stepValues: {
            "has-other-property"?: ComponentValue<
              ProcessDatabaseSchema,
              "household"
            >;
          }): boolean {
            return stepValues["has-other-property"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "household"
          >({
            storeName: "household",
            key: processRef,
            property: ["otherProperty", "notes"]
          })
        })
      )
    ]
  }
};

export default step;
