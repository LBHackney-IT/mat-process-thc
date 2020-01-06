import {
  FieldsetLegend,
  Heading,
  HeadingLevels
} from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentWrapper,
  ComponentValue,
  DynamicComponent,
  StaticComponent
} from "remultiform/component-wrapper";

import { DateInput } from "../../components/DateInput";
import { makeSubmit } from "../../components/makeSubmit";
import { RadioButtons } from "../../components/RadioButtons";
import { TextArea } from "../../components/TextArea";
import { TextAreaDetails } from "../../components/TextAreaDetails";
import { TextInput } from "../../components/TextInput";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import DatabaseSchema from "../../storage/DatabaseSchema";
import processRef from "../../storage/processRef";

import PageSlugs, { hrefForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step: ProcessStepDefinition = {
  title: PageTitles.Carer,
  heading: "Carer",
  step: {
    slug: PageSlugs.Carer,
    nextSlug: PageSlugs.Rooms,
    Submit: makeSubmit({
      href: hrefForSlug(PageSlugs.Rooms),
      value: "Save and continue"
    }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "carer-needed",
          Component: RadioButtons,
          props: {
            name: "carer-needed",
            legend: (
              <FieldsetLegend>Does the tenant have a carer?</FieldsetLegend>
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
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "tenant">({
            storeName: "tenant",
            key: processRef,
            property: ["carer", "hasCarer"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "carer-type",
          Component: RadioButtons,
          props: {
            name: "carer-type",
            legend: (
              <FieldsetLegend>Who provides the care?</FieldsetLegend>
            ) as React.ReactNode,
            radios: [
              {
                label: "A registered carer",
                value: "registered"
              },
              {
                label: "A voluntary arrangement, e.g. a family member",
                value: "voluntary"
              }
            ]
          },
          renderWhen(stepValues: {
            "carer-needed"?: ComponentValue<DatabaseSchema, "tenant">;
          }): boolean {
            return stepValues["carer-needed"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "tenant">({
            storeName: "tenant",
            key: processRef,
            property: ["carer", "type"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "carer-live-in",
          Component: RadioButtons,
          props: {
            name: "carer-live-in",
            legend: (
              <FieldsetLegend>
                Does the carer live in the property?
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
            "carer-needed"?: ComponentValue<DatabaseSchema, "tenant">;
          }): boolean {
            return stepValues["carer-needed"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "tenant">({
            storeName: "tenant",
            key: processRef,
            property: ["carer", "isLiveIn"]
          })
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "carer-live-in-start-date-heading",
          Component: FieldsetLegend,
          props: {
            children: "When did the carer start living in the property?"
          },
          renderWhen(stepValues: {
            "carer-live-in"?: ComponentValue<DatabaseSchema, "tenant">;
          }): boolean {
            return stepValues["carer-live-in"] === "yes";
          }
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "carer-live-in-start-date",
          Component: DateInput,
          props: {
            name: "carer-live-in-start-date"
          },
          renderWhen(stepValues: {
            "carer-live-in"?: ComponentValue<DatabaseSchema, "tenant">;
          }): boolean {
            return stepValues["carer-live-in"] === "yes";
          },
          defaultValue: {},
          emptyValue: {} as { month?: number; year?: number },
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "tenant">({
            storeName: "tenant",
            key: processRef,
            property: ["carer", "liveInStartDate"]
          })
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "carer-details-heading",
          Component: Heading,
          props: {
            level: HeadingLevels.H2,
            children: "Carer details"
          },
          renderWhen(stepValues: {
            "carer-needed"?: ComponentValue<DatabaseSchema, "tenant">;
          }): boolean {
            return stepValues["carer-needed"] === "yes";
          }
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "carer-full-name",
          Component: TextInput,
          props: {
            name: "carer-full-name",
            label: "Full name"
          },
          renderWhen(stepValues: {
            "carer-needed"?: ComponentValue<DatabaseSchema, "tenant">;
          }): boolean {
            return stepValues["carer-needed"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "tenant">({
            storeName: "tenant",
            key: processRef,
            property: ["carer", "fullName"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "carer-relationship",
          Component: TextInput,
          props: {
            name: "carer-relationship",
            label: "Relationship to tenant or 'Not related'"
          },
          renderWhen(stepValues: {
            "carer-needed"?: ComponentValue<DatabaseSchema, "tenant">;
          }): boolean {
            return stepValues["carer-needed"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "tenant">({
            storeName: "tenant",
            key: processRef,
            property: ["carer", "relationship"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "carer-phone-number",
          Component: TextInput,
          props: {
            name: "carer-phone-number",
            label: "Phone number"
          },
          renderWhen(stepValues: {
            "carer-needed"?: ComponentValue<DatabaseSchema, "tenant">;
          }): boolean {
            return stepValues["carer-needed"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "tenant">({
            storeName: "tenant",
            key: processRef,
            property: ["carer", "phoneNumber"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "carer-address",
          Component: TextArea,
          props: {
            name: "carer-address",
            label: { value: "Address" as React.ReactNode | null | undefined },
            rows: 4 as number | null | undefined
          },
          renderWhen(stepValues: {
            "carer-live-in"?: ComponentValue<DatabaseSchema, "tenant">;
          }): boolean {
            return stepValues["carer-live-in"] === "no";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "tenant">({
            storeName: "tenant",
            key: processRef,
            property: ["carer", "address"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "carer-notes",
          Component: TextAreaDetails,
          props: {
            summary: "Add note about carer if necessary",
            name: "carer-notes"
          },
          renderWhen(stepValues: {
            "carer-needed"?: ComponentValue<DatabaseSchema, "tenant">;
          }): boolean {
            return stepValues["carer-needed"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "tenant">({
            storeName: "tenant",
            key: processRef,
            property: ["carer", "notes"]
          })
        })
      )
    ]
  }
};

export default step;
