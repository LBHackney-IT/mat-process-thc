import { FieldsetLegend } from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentWrapper,
  ComponentValue,
  DynamicComponent
} from "remultiform/component-wrapper";

import { makeSubmit } from "../../components/makeSubmit";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import { RadioButtons } from "../../components/RadioButtons";
import { Checkboxes } from "../../components/Checkboxes";
import { TextArea } from "../../components/TextArea";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import processRef from "../../storage/processRef";

import PageSlugs, { urlObjectForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step: ProcessStepDefinition = {
  title: PageTitles.Health,
  heading: "Health concerns",
  step: {
    slug: PageSlugs.Health,
    nextSlug: PageSlugs.Disability,
    Submit: makeSubmit({
      url: urlObjectForSlug(PageSlugs.Disability),
      value: "Save and continue"
    }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "health-concerns",
          Component: RadioButtons,
          props: {
            name: "health-concerns",
            legend: (
              <FieldsetLegend>
                Does anyone in the household have any health concerns?
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
            "healthConcerns"
          >({
            storeName: "healthConcerns",
            key: processRef,
            property: ["value"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "health-concerns-who",
          Component: Checkboxes,
          props: {
            name: "health-concerns-who",
            legend: (
              <FieldsetLegend>
                Who has health concerns? (THIS NEEDS TO BE DYNAMIC)
              </FieldsetLegend>
            ) as React.ReactNode,
            checkboxes: [
              {
                label: "Tenant 1",
                value: "tenant 1"
              },
              {
                label: "Tenant 2",
                value: "tenant 2"
              },
              {
                label: "Household member 3",
                value: "household member 3"
              },
              {
                label: "Household member 4",
                value: "household member 4"
              }
            ]
          },
          renderWhen(stepValues: {
            "health-concerns"?: ComponentValue<
              ProcessDatabaseSchema,
              "healthConcerns"
            >;
          }): boolean {
            return stepValues["health-concerns"] === "yes";
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "healthConcerns"
          >({
            storeName: "healthConcerns",
            key: processRef,
            property: ["who"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "health-concerns-more-info",
          Component: Checkboxes,
          props: {
            name: "health-concerns-more-info",
            legend: (
              <FieldsetLegend>
                Are they interested in more information or to be linked to our
                support services for:
              </FieldsetLegend>
            ) as React.ReactNode,
            checkboxes: [
              {
                label: "Childhood obesity",
                value: "childhood obesity"
              },
              {
                label: "Dementia",
                value: "dementia"
              },
              {
                label: "Mental health",
                value: "mental health"
              },
              {
                label: "Smoking",
                value: "smoking"
              }
            ]
          },
          renderWhen(stepValues: {
            "health-concerns"?: ComponentValue<
              ProcessDatabaseSchema,
              "healthConcerns"
            >;
          }): boolean {
            return stepValues["health-concerns"] === "yes";
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "healthConcerns"
          >({
            storeName: "healthConcerns",
            key: processRef,
            property: ["moreInfo"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "health-notes",
          Component: TextArea,
          props: {
            name: "health-notes",
            label: {
              value: "Add note about any health concerns if necessary." as React.ReactNode
            },
            rows: 4 as number | undefined
          },
          renderWhen(stepValues: {
            "health-concerns"?: ComponentValue<
              ProcessDatabaseSchema,
              "healthConcerns"
            >;
          }): boolean {
            return stepValues["health-concerns"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "healthConcerns"
          >({
            storeName: "healthConcerns",
            key: processRef,
            property: ["notes"]
          })
        })
      )
    ]
  }
};

export default step;
