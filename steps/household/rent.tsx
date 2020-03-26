import {
  FieldsetLegend,
  Heading,
  HeadingLevels,
  Paragraph,
} from "lbh-frontend-react/components";
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
import {
  TextAreaDetails,
  TextAreaDetailsProps,
} from "../../components/TextAreaDetails";
import { getRadioLabelFromValue } from "../../helpers/getRadioLabelFromValue";
import keyFromSlug from "../../helpers/keyFromSlug";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import yesNoRadios from "../../helpers/yesNoRadios";
import { Note } from "../../storage/DatabaseSchema";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const rentArrearsRadios = [
  {
    label: "Yes, but the tenant is waiting for Housing Benefit Payment",
    value: "yes waiting for payment",
  },
  {
    label: "Yes, but tenant has an action plan to clear arrears",
    value: "yes has plan",
  },
  {
    label: "Yes, but tenant doesn't have an action plan to clear arrears",
    value: "yes has no plan",
  },
  {
    label: "No, tenant does not have arrears",
    value: "no",
  },
];

const housingBenefitRadios = [
  {
    label: "Yes, and payments received",
    value: "yes payments received",
  },
  {
    label: "Yes, but payments not yet received",
    value: "yes payments not received",
  },
  {
    label: "Yes, but application declined",
    value: "yes application declined",
  },
  {
    label: "No, but would like to apply (phone: 020 8356 3399)",
    value: "no wants to apply",
  },
  {
    label: "No, and does not want to apply",
    value: "no does not want to apply",
  },
];

const questions = {
  "rent-arrears-type": "Are there rent arrears on the account?",
  "has-applied-for-housing-benefit":
    "Has Housing Benefit / Universal Credit been applied for?",
  "contact-income-officer":
    "Would the tenant like to be put in contact with the Income Officer?",
};

const step: ProcessStepDefinition<ProcessDatabaseSchema, "household"> = {
  title: PageTitles.Rent,
  heading: "Rent, housing benefits, and income officer",
  review: {
    rows: [
      {
        label: questions["rent-arrears-type"],
        values: {
          "rent-arrears-type": {
            renderValue(type: string): React.ReactNode {
              return getRadioLabelFromValue(rentArrearsRadios, type);
            },
          },
          "rent-arrears-notes": {
            renderValue(rentArrearsNotes: Note): React.ReactNode {
              return rentArrearsNotes.value;
            },
          },
        },
      },
      {
        label: questions["has-applied-for-housing-benefit"],
        values: {
          "has-applied-for-housing-benefit": {
            renderValue(hasAppliedForHousingBenefit: string): React.ReactNode {
              return getRadioLabelFromValue(
                housingBenefitRadios,
                hasAppliedForHousingBenefit
              );
            },
          },
          "housing-benefits-notes": {
            renderValue(housingBenefitNotes: Note): React.ReactNode {
              return housingBenefitNotes.value;
            },
          },
        },
      },
      {
        label: questions["contact-income-officer"],
        values: {
          "contact-income-officer": {
            renderValue(contactIncomeOfficer: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, contactIncomeOfficer);
            },
          },
          "income-officer-notes": {
            renderValue(incomeOfficerNotes: Note): React.ReactNode {
              return incomeOfficerNotes.value;
            },
          },
        },
      },
    ],
  },
  step: {
    slug: PageSlugs.Rent,
    nextSlug: PageSlugs.OtherProperty,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
        value: "Save and continue",
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
                  {questions["rent-arrears-type"]}
                </Heading>
              </FieldsetLegend>
            ) as React.ReactNode,
            radios: rentArrearsRadios,
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "household"
          >({
            storeName: "household",
            key: keyFromSlug(),
            property: ["rentArrears", "type"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "rent-arrears-notes",
          Component: TextAreaDetails,
          props: {
            summary: "Add notes about rent arrears if necessary",
            label: { value: "Notes" },
            name: "rent-arrears-notes",
            includeCheckbox: true,
          } as TextAreaDetailsProps,
          defaultValue: { value: "", isPostVisitAction: false },
          emptyValue: { value: "", isPostVisitAction: false },
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "household"
          >({
            storeName: "household",
            key: keyFromSlug(),
            property: ["rentArrears", "notes"],
          }),
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
                  {questions["has-applied-for-housing-benefit"]}
                </Heading>
              </FieldsetLegend>
            ) as React.ReactNode,
            radios: housingBenefitRadios,
          },
          renderWhen(stepValues: {
            "rent-arrears-type"?: ComponentValue<
              ProcessDatabaseSchema,
              "household"
            >;
          }): boolean {
            return (
              stepValues["rent-arrears-type"] === "yes has plan" ||
              stepValues["rent-arrears-type"] === "yes has no plan" ||
              stepValues["rent-arrears-type"] === "no"
            );
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "household"
          >({
            storeName: "household",
            key: keyFromSlug(),
            property: ["housingBenefits", "hasApplied"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "housing-benefits-notes",
          Component: TextAreaDetails,
          props: {
            summary: "Add details about Housing Benefit if necessary",
            label: { value: "Notes" },
            name: "housing-benefits-notes",
            includeCheckbox: true,
          } as TextAreaDetailsProps,
          renderWhen(stepValues: {
            "rent-arrears-type"?: ComponentValue<
              ProcessDatabaseSchema,
              "household"
            >;
          }): boolean {
            return (
              stepValues["rent-arrears-type"] === "yes has plan" ||
              stepValues["rent-arrears-type"] === "yes has no plan" ||
              stepValues["rent-arrears-type"] === "no"
            );
          },
          defaultValue: { value: "", isPostVisitAction: false },
          emptyValue: { value: "", isPostVisitAction: false },
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "household"
          >({
            storeName: "household",
            key: keyFromSlug(),
            property: ["housingBenefits", "notes"],
          }),
        })
      ),
      ComponentWrapper.wrapStatic<ProcessDatabaseSchema, "household">(
        new StaticComponent({
          key: "income-officer-heading",
          Component: Heading,
          props: {
            level: HeadingLevels.H2,
            children: "Does the tenant know about the Income Officer role?",
          },
          renderWhen(stepValues: {
            "rent-arrears-type"?: ComponentValue<
              ProcessDatabaseSchema,
              "household"
            >;
          }): boolean {
            return Boolean(stepValues["rent-arrears-type"]);
          },
        })
      ),
      ComponentWrapper.wrapStatic<ProcessDatabaseSchema, "household">(
        new StaticComponent({
          key: "income-officer-paragraph",
          Component: Paragraph,
          props: {
            children:
              "The Income Officer can provide advice and assistance on debt management, housing benefit, and other welfare benefits.",
          },
          renderWhen(stepValues: {
            "rent-arrears-type"?: ComponentValue<
              ProcessDatabaseSchema,
              "household"
            >;
          }): boolean {
            return Boolean(stepValues["rent-arrears-type"]);
          },
        })
      ),
      ComponentWrapper.wrapStatic<ProcessDatabaseSchema, "household">(
        new StaticComponent({
          key: "income-officer-phone-number",
          Component: Paragraph,
          props: {
            children: "Income Services: 020 8356 3100",
          },
          renderWhen(stepValues: {
            "rent-arrears-type"?: ComponentValue<
              ProcessDatabaseSchema,
              "household"
            >;
          }): boolean {
            return Boolean(stepValues["rent-arrears-type"]);
          },
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
                  {questions["contact-income-officer"]}
                </Heading>
              </FieldsetLegend>
            ) as React.ReactNode,
            radios: yesNoRadios,
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
            key: keyFromSlug(),
            property: ["incomeOfficer", "wantsToContact"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "income-officer-notes",
          Component: TextAreaDetails,
          props: {
            summary: "Add details about the Income Officer if necessary",
            label: { value: "Notes" },
            name: "income-officer-notes",
            includeCheckbox: true,
          } as TextAreaDetailsProps,
          renderWhen(stepValues: {
            "rent-arrears-type"?: ComponentValue<
              ProcessDatabaseSchema,
              "household"
            >;
          }): boolean {
            return Boolean(stepValues["rent-arrears-type"]);
          },
          defaultValue: { value: "", isPostVisitAction: false },
          emptyValue: { value: "", isPostVisitAction: false },
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "household"
          >({
            storeName: "household",
            key: keyFromSlug(),
            property: ["incomeOfficer", "notes"],
          }),
        })
      ),
    ],
  },
};

export default step;
