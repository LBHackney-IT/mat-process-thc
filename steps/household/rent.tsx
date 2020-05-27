import {
  FieldsetLegend,
  Heading,
  HeadingLevels,
  Link,
  Paragraph,
} from "lbh-frontend-react/components";
import { useRouter } from "next/router";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentValue,
  ComponentWrapper,
  DynamicComponent,
  StaticComponent,
} from "remultiform/component-wrapper";
import { makeSubmit } from "../../components/makeSubmit";
import {
  PostVisitActionInputDetails,
  PostVisitActionInputDetailsProps,
} from "../../components/PostVisitActionInputDetails";
import { RadioButtons } from "../../components/RadioButtons";
import { ReviewNotes } from "../../components/ReviewNotes";
import getProcessRef from "../../helpers/getProcessRef";
import { getRadioLabelFromValue } from "../../helpers/getRadioLabelFromValue";
import keyFromSlug from "../../helpers/keyFromSlug";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import useDataValue from "../../helpers/useDataValue";
import yesNoRadios from "../../helpers/yesNoRadios";
import { Notes } from "../../storage/DatabaseSchema";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import Storage from "../../storage/Storage";
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

const CurrentBalance: React.FunctionComponent = () => {
  const router = useRouter();
  const processRef = getProcessRef(router);

  const currentBalance = useDataValue(
    Storage.ExternalContext,
    "tenancy",
    processRef,
    (values) => (processRef ? values[processRef]?.currentBalance : undefined)
  );

  const tenancyUrl = process.env.TENANCY_URL;

  const currentBalanceValue = currentBalance.result
    ? `${
        Math.sign(parseFloat(currentBalance.result)) > 0 ? "- " : ""
      }£${Math.abs(parseFloat(currentBalance.result))}`
    : "Loading...";

  return (
    <>
      <Paragraph>
        <strong>Current rent balance: {currentBalanceValue}</strong>
      </Paragraph>
      {tenancyUrl && (
        <>
          <Paragraph className="rent-details">
            <Link href={tenancyUrl} target="_blank">
              Full rent account details
            </Link>{" "}
            (opens in a new tab)
          </Paragraph>
          <style jsx>{`
            :global(.rent-details) {
              margin-top: 0;
            }
          `}</style>
        </>
      )}
    </>
  );
};

const step: ProcessStepDefinition<ProcessDatabaseSchema, "household"> = {
  title: PageTitles.Rent,
  heading: "Rent, housing benefit and income officer role",
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
            renderValue(notes: Notes): React.ReactNode {
              if (notes.length === 0) {
                return;
              }

              return <ReviewNotes notes={notes} />;
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
            renderValue(notes: Notes): React.ReactNode {
              if (notes.length === 0) {
                return;
              }

              return <ReviewNotes notes={notes} />;
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
            renderValue(notes: Notes): React.ReactNode {
              if (notes.length === 0) {
                return;
              }

              return <ReviewNotes notes={notes} />;
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
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "current-balance",
          Component: CurrentBalance,
          props: {},
        })
      ),
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
          Component: PostVisitActionInputDetails,
          props: {
            summary: "Add notes about rent arrears if necessary",
            label: { value: "Notes" },
            name: "rent-arrears-notes",
          } as PostVisitActionInputDetailsProps,
          defaultValue: [] as Notes,
          emptyValue: [] as Notes,
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
          Component: PostVisitActionInputDetails,
          props: {
            summary: "Add details about Housing Benefit if necessary",
            label: { value: "Notes" },
            name: "housing-benefits-notes",
          } as PostVisitActionInputDetailsProps,
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
          defaultValue: [] as Notes,
          emptyValue: [] as Notes,
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
          Component: PostVisitActionInputDetails,
          props: {
            summary: "Add details about the Income Officer if necessary",
            label: { value: "Notes" },
            name: "income-officer-notes",
          } as PostVisitActionInputDetailsProps,
          renderWhen(stepValues: {
            "rent-arrears-type"?: ComponentValue<
              ProcessDatabaseSchema,
              "household"
            >;
          }): boolean {
            return Boolean(stepValues["rent-arrears-type"]);
          },
          defaultValue: [] as Notes,
          emptyValue: [] as Notes,
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
