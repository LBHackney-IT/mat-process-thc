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
import { Checkboxes } from "../../components/Checkboxes";
import { TextArea } from "../../components/TextArea";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import processRef from "../../storage/processRef";

import PageSlugs, { urlObjectForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step = {
  title: PageTitles.Disability,
  heading: "Disability",
  step: {
    slug: PageSlugs.Disability,
    nextSlug: PageSlugs.SupportNeeds,
    Submit: makeSubmit({
      url: urlObjectForSlug(PageSlugs.SupportNeeds),
      value: "Save and continue"
    }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "disability",
          Component: RadioButtons,
          props: {
            name: "disability",
            legend: (
              <FieldsetLegend>
                Does anyone in the household have a disability?
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
            "disability"
          >({
            storeName: "disability",
            key: processRef,
            property: ["value"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "who-disability",
          Component: Checkboxes,
          props: {
            name: "who-disability",
            legend: (
              <FieldsetLegend>Who has a disability?</FieldsetLegend>
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
            disability?: ComponentValue<ProcessDatabaseSchema, "disability">;
          }): boolean {
            return stepValues["disability"] === "yes";
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "disability"
          >({
            storeName: "disability",
            key: processRef,
            property: ["whoDisability"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "pip-or-dla",
          Component: RadioButtons,
          props: {
            name: "pip-or-dla",
            legend: (
              <FieldsetLegend>
                Does anyone in the household get Personal Independence Payment
                (PIP) or Disability Living Allowance (DLA)?
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
          renderWhen(stepValues: {
            disability?: ComponentValue<ProcessDatabaseSchema, "disability">;
          }): boolean {
            return stepValues["disability"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "disability"
          >({
            storeName: "disability",
            key: processRef,
            property: ["pipOrDLA"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "who-pip",
          Component: Checkboxes,
          props: {
            name: "who-pip",
            legend: (
              <FieldsetLegend>Who gets PIP?</FieldsetLegend>
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
            "pip-or-dla"?: ComponentValue<ProcessDatabaseSchema, "disability">;
          }): boolean {
            return stepValues["pip-or-dla"] === "yes";
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "disability"
          >({
            storeName: "disability",
            key: processRef,
            property: ["whoPIP"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "who-dla",
          Component: Checkboxes,
          props: {
            name: "who-dla",
            legend: (
              <FieldsetLegend>Who gets DLA?</FieldsetLegend>
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
            "pip-or-dla"?: ComponentValue<ProcessDatabaseSchema, "disability">;
          }): boolean {
            return stepValues["pip-or-dla"] === "yes";
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "disability"
          >({
            storeName: "disability",
            key: processRef,
            property: ["whoDLA"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "disability-notes",
          Component: TextArea,
          props: {
            name: "disability-notes",
            label: {
              value: "Add note about any disability concerns if necessary."
            } as { id?: string; value?: React.ReactNode },
            rows: 4 as number | undefined
          },
          renderWhen(stepValues: {
            disability?: ComponentValue<ProcessDatabaseSchema, "disability">;
          }): boolean {
            return stepValues["disability"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "disability"
          >({
            storeName: "disability",
            key: processRef,
            property: ["notes"]
          })
        })
      )
    ]
  }
};

export default step;
