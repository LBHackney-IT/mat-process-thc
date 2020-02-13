import { FieldsetLegend } from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentWrapper,
  ComponentValue,
  DynamicComponent
} from "remultiform/component-wrapper";

import { makeSubmit } from "../../components/makeSubmit";

import { RadioButtons } from "../../components/RadioButtons";
import { Checkboxes, CheckboxesProps } from "../../components/Checkboxes";
import {
  TextAreaWithCheckbox,
  TextAreaWithCheckboxProps
} from "../../components/TextAreaWithCheckbox";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import processRef from "../../storage/processRef";

import PageSlugs, { urlObjectForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step = {
  title: PageTitles.Health,
  heading: "Health concerns",
  step: {
    slug: PageSlugs.Health,
    nextSlug: PageSlugs.Disability,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        url: urlObjectForSlug(nextSlug),
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
          } as CheckboxesProps,
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
          } as CheckboxesProps,
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
          Component: TextAreaWithCheckbox,
          props: {
            name: "health-notes",
            label: {
              value: "Add note about any health concerns if necessary."
            },
            rows: 4,
            includeCheckbox: true
          } as TextAreaWithCheckboxProps,
          renderWhen(stepValues: {
            "health-concerns"?: ComponentValue<
              ProcessDatabaseSchema,
              "healthConcerns"
            >;
          }): boolean {
            return stepValues["health-concerns"] === "yes";
          },
          defaultValue: { value: "", isPostVisitAction: false },
          emptyValue: { value: "", isPostVisitAction: false },
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
