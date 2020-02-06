import {
  Paragraph,
  Heading,
  HeadingLevels,
  FieldsetLegend
} from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentWrapper,
  DynamicComponent,
  ComponentValue,
  StaticComponent
} from "remultiform/component-wrapper";

import { makeSubmit } from "../../components/makeSubmit";
import { RadioButtons } from "../../components/RadioButtons";
import { TextAreaDetails } from "../../components/TextAreaDetails";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import processRef from "../../storage/processRef";

import PageSlugs, { urlObjectForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step = {
  title: PageTitles.Rent,
  heading: "Rent, housing benefits, and income officer",
  step: {
    slug: PageSlugs.Rent,
    nextSlug: PageSlugs.OtherProperty,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        url: urlObjectForSlug(nextSlug),
        value: "Save and continue"
      }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "rent-arrears-type",
          Component: RadioButtons,
          props: {
            name: "rent-arrears-type",
            legend: (
              <FieldsetLegend>
                <Heading level={HeadingLevels.H2}>
                  Are there rent arrears on the account?
                </Heading>
              </FieldsetLegend>
            ) as React.ReactNode,
            radios: [
              {
                label: "Yes, but tenant is waiting for Housing Benefit payment",
                value: "yes waiting for payment"
              },
              {
                label: "Yes, but tenant has an action plan to clear arrears",
                value: "yes has plan"
              },
              {
                label:
                  "Yes, but tenant doesn't have an action plan to clear arrears",
                value: "yes has no plan"
              },
              {
                label: "No, tenant does not have arrears",
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
            property: ["rentArrears", "type"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "rent-arrears-notes",
          Component: TextAreaDetails,
          props: {
            summary: "Add notes about rent arrears if necessary" as React.ReactNode,
            label: { value: "Notes" } as {
              id?: string;
              value: React.ReactNode;
            },
            name: "rent-arrears-notes"
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "household"
          >({
            storeName: "household",
            key: processRef,
            property: ["rentArrears", "notes"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "has-applied-for-housing-benefit",
          Component: RadioButtons,
          props: {
            name: "has-applied-for-housing-benefit",
            legend: (
              <FieldsetLegend>
                <Heading level={HeadingLevels.H2}>
                  Has Housing Benefit / Universal Credit been applied for?
                </Heading>
              </FieldsetLegend>
            ) as React.ReactNode,
            radios: [
              {
                label: "Yes, and payments received",
                value: "yes payments received"
              },
              {
                label: "Yes, but payments not yet received",
                value: "yes payments not received"
              },
              {
                label: "Yes, but application declined",
                value: "yes application declined"
              },
              {
                label: "No, but would like to apply (phone: 020 8356 3399)",
                value: "no wants to apply"
              },
              {
                label: "No, and does not want to apply",
                value: "no does not want to apply"
              }
            ]
          },
          renderWhen(stepValues: {
            "rent-arrears-type"?: ComponentValue<
              ProcessDatabaseSchema,
              "household"
            >;
          }): boolean {
            return (
              stepValues["rent-arrears-type"] === "yes has plan" ||
              stepValues["rent-arrears-type"] === "yes has no plan"
            );
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "household"
          >({
            storeName: "household",
            key: processRef,
            property: ["housingBenefits", "hasApplied"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "housing-benefits-notes",
          Component: TextAreaDetails,
          props: {
            summary: "Add details about Housing Benefit if necessary" as React.ReactNode,
            label: { value: "Notes" } as {
              id?: string;
              value: React.ReactNode;
            },
            name: "housing-benefits-notes"
          },
          renderWhen(stepValues: {
            "rent-arrears-type"?: ComponentValue<
              ProcessDatabaseSchema,
              "household"
            >;
          }): boolean {
            return (
              stepValues["rent-arrears-type"] === "yes has plan" ||
              stepValues["rent-arrears-type"] === "yes has no plan"
            );
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "household"
          >({
            storeName: "household",
            key: processRef,
            property: ["housingBenefits", "notes"]
          })
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "income-officer-heading",
          Component: Heading,
          props: {
            level: HeadingLevels.H2,
            children: "Does the tenant know about the Income Officer role?"
          },
          renderWhen(stepValues: {
            "rent-arrears-type"?: ComponentValue<
              ProcessDatabaseSchema,
              "household"
            >;
          }): boolean {
            return Boolean(stepValues["rent-arrears-type"]);
          }
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "income-officer-paragraph",
          Component: Paragraph,
          props: {
            children:
              "The Income Officer can provide advice and assistance on debt management, housing benefit, and other welfare benefits."
          },
          renderWhen(stepValues: {
            "rent-arrears-type"?: ComponentValue<
              ProcessDatabaseSchema,
              "household"
            >;
          }): boolean {
            return Boolean(stepValues["rent-arrears-type"]);
          }
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "income-officer-phone-number",
          Component: Paragraph,
          props: {
            children: "Income Services: 020 8356 3100"
          },
          renderWhen(stepValues: {
            "rent-arrears-type"?: ComponentValue<
              ProcessDatabaseSchema,
              "household"
            >;
          }): boolean {
            return Boolean(stepValues["rent-arrears-type"]);
          }
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "contact-income-officer",
          Component: RadioButtons,
          props: {
            name: "contact-income-officer",
            legend: (
              <FieldsetLegend>
                <Heading level={HeadingLevels.H3}>
                  Would the tenant like to be put in contact with the Income
                  Officer?
                </Heading>
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
            "rent-arrears-type"?: ComponentValue<
              ProcessDatabaseSchema,
              "household"
            >;
          }): boolean {
            return Boolean(stepValues["rent-arrears-type"]);
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "household"
          >({
            storeName: "household",
            key: processRef,
            property: ["incomeOfficer", "wantsToContact"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "income-officer-notes",
          Component: TextAreaDetails,
          props: {
            summary: "Add details about the Income Officer if necessary" as React.ReactNode,
            label: { value: "Notes" } as {
              id?: string;
              value: React.ReactNode;
            },
            name: "income-officer-notes"
          },
          renderWhen(stepValues: {
            "rent-arrears-type"?: ComponentValue<
              ProcessDatabaseSchema,
              "household"
            >;
          }): boolean {
            return Boolean(stepValues["rent-arrears-type"]);
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "household"
          >({
            storeName: "household",
            key: processRef,
            property: ["incomeOfficer", "notes"]
          })
        })
      )
    ]
  }
};

export default step;
