import {
  FieldsetLegend,
  Heading,
  HeadingLevels,
  LabelProps,
  Paragraph,
  Textarea,
} from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentValue,
  ComponentWrapper,
  DynamicComponent,
  makeDynamic,
  StaticComponent,
} from "remultiform/component-wrapper";
import { CurrentTenantNames } from "../../components/CurrentTenantNames";
import { makeSubmit } from "../../components/makeSubmit";
import {
  PostVisitActionInputDetails,
  PostVisitActionInputDetailsProps,
} from "../../components/PostVisitActionInputDetails";
import { RadioButtons } from "../../components/RadioButtons";
import { ReviewNotes } from "../../components/ReviewNotes";
import { TextInput } from "../../components/TextInput";
import { getRadioLabelFromValue } from "../../helpers/getRadioLabelFromValue";
import keyFromSlug from "../../helpers/keyFromSlug";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import slugForRepeatingStep from "../../helpers/slugForRepeatingStep";
import yesNoRadios from "../../helpers/yesNoRadios";
import { Notes } from "../../storage/DatabaseSchema";
import ResidentDatabaseSchema from "../../storage/ResidentDatabaseSchema";
import Storage from "../../storage/Storage";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const questions = {
  "carer-needed": "Does the tenant have a carer?",
  "carer-type": "Who provides the care?",
  "carer-live-in": "Does the carer live in the property?",
  "carer-details": "Carer details",
};

const carerTypeRadios = [
  {
    label: "A registered carer",
    value: "registered",
  },
  {
    label: "A voluntary arrangement, e.g. a family member",
    value: "voluntary",
  },
];

const step: ProcessStepDefinition<ResidentDatabaseSchema, "carer"> = {
  title: PageTitles.Carer,
  heading: "Carer",
  context: Storage.ResidentContext,
  review: {
    rows: [
      {
        label: questions["carer-needed"],
        values: {
          "carer-needed": {
            renderValue(needed: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, needed);
            },
          },
        },
      },
      {
        label: questions["carer-type"],
        values: {
          "carer-type": {
            renderValue(type: string): React.ReactNode {
              return getRadioLabelFromValue(carerTypeRadios, type);
            },
          },
        },
      },
      {
        label: questions["carer-live-in"],
        values: {
          "carer-live-in": {
            renderValue(liveIn: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, liveIn);
            },
          },
          "carer-live-in-start-date": {
            renderValue(dateString: string): React.ReactNode {
              return dateString;
            },
          },
        },
      },
      {
        label: questions["carer-details"],
        values: {
          "carer-full-name": {
            renderValue(name: string): React.ReactNode {
              return name;
            },
          },
          "carer-relationship": {
            renderValue(relationship: string): React.ReactNode {
              return relationship;
            },
          },
          "carer-phone-number": {
            renderValue(phone: string): React.ReactNode {
              return phone;
            },
          },
          "carer-address": {
            renderValue(address: string): React.ReactNode {
              return address;
            },
          },
          "carer-notes": {
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
    slug: PageSlugs.Carer,
    nextSlug: slugForRepeatingStep(PageSlugs.OtherSupport),
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
        value: "Save and continue",
      }),
    componentWrappers: [
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "previous-attempts",
          Component: CurrentTenantNames,
          props: {},
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "carer-needed",
          Component: RadioButtons,
          props: {
            name: "carer-needed",
            legend: (
              <FieldsetLegend>{questions["carer-needed"]}</FieldsetLegend>
            ) as React.ReactNode,
            radios: yesNoRadios,
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ResidentDatabaseSchema,
            "carer"
          >({
            storeName: "carer",
            key: keyFromSlug(true),
            property: ["hasCarer"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "carer-type",
          Component: RadioButtons,
          props: {
            name: "carer-type",
            legend: (
              <FieldsetLegend>{questions["carer-type"]}</FieldsetLegend>
            ) as React.ReactNode,
            radios: carerTypeRadios,
          },
          renderWhen(stepValues: {
            "carer-needed"?: ComponentValue<ResidentDatabaseSchema, "carer">;
          }): boolean {
            return stepValues["carer-needed"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ResidentDatabaseSchema,
            "carer"
          >({
            storeName: "carer",
            key: keyFromSlug(true),
            property: ["type"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "carer-live-in",
          Component: RadioButtons,
          props: {
            name: "carer-live-in",
            legend: (
              <FieldsetLegend>{questions["carer-live-in"]}</FieldsetLegend>
            ) as React.ReactNode,
            radios: yesNoRadios,
          },
          renderWhen(stepValues: {
            "carer-needed"?: ComponentValue<ResidentDatabaseSchema, "carer">;
          }): boolean {
            return stepValues["carer-needed"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ResidentDatabaseSchema,
            "carer"
          >({
            storeName: "carer",
            key: keyFromSlug(true),
            property: ["isLiveIn"],
          }),
        })
      ),
      ComponentWrapper.wrapStatic<ResidentDatabaseSchema, "carer">(
        new StaticComponent({
          key: "carer-live-in-start-date-heading",
          Component: Heading,
          props: {
            level: HeadingLevels.H3,
            children: "When did the carer start living in the property?",
          },
          renderWhen(stepValues: {
            "carer-needed"?: ComponentValue<ResidentDatabaseSchema, "carer">;
            "carer-live-in"?: ComponentValue<ResidentDatabaseSchema, "carer">;
          }): boolean {
            return (
              stepValues["carer-needed"] === "yes" &&
              stepValues["carer-live-in"] === "yes"
            );
          },
        })
      ),
      ComponentWrapper.wrapStatic<ResidentDatabaseSchema, "carer">(
        new StaticComponent({
          key: "carer-live-in-start-date-example",
          Component: Paragraph,
          props: {
            children:
              "Record at least month and year if possible eg MM / YYYY.",
          },
          renderWhen(stepValues: {
            "carer-needed"?: ComponentValue<ResidentDatabaseSchema, "carer">;
            "carer-live-in"?: ComponentValue<ResidentDatabaseSchema, "carer">;
          }): boolean {
            return (
              stepValues["carer-needed"] === "yes" &&
              stepValues["carer-live-in"] === "yes"
            );
          },
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "carer-live-in-start-date",
          Component: TextInput,
          props: {
            name: "carer-live-in-start-date",
            label: "",
          },
          renderWhen(stepValues: {
            "carer-needed"?: ComponentValue<ResidentDatabaseSchema, "carer">;
            "carer-live-in"?: ComponentValue<ResidentDatabaseSchema, "carer">;
          }): boolean {
            return (
              stepValues["carer-needed"] === "yes" &&
              stepValues["carer-live-in"] === "yes"
            );
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ResidentDatabaseSchema,
            "carer"
          >({
            storeName: "carer",
            key: keyFromSlug(true),
            property: ["liveInStartDate"],
          }),
        })
      ),
      ComponentWrapper.wrapStatic<ResidentDatabaseSchema, "carer">(
        new StaticComponent({
          key: "carer-details-heading",
          Component: Heading,
          props: {
            level: HeadingLevels.H2,
            children: questions["carer-details"],
          },
          renderWhen(stepValues: {
            "carer-needed"?: ComponentValue<ResidentDatabaseSchema, "carer">;
          }): boolean {
            return stepValues["carer-needed"] === "yes";
          },
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "carer-full-name",
          Component: TextInput,
          props: {
            name: "carer-full-name",
            label: "Full name",
          },
          renderWhen(stepValues: {
            "carer-needed"?: ComponentValue<ResidentDatabaseSchema, "carer">;
          }): boolean {
            return stepValues["carer-needed"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ResidentDatabaseSchema,
            "carer"
          >({
            storeName: "carer",
            key: keyFromSlug(true),
            property: ["fullName"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "carer-relationship",
          Component: TextInput,
          props: {
            name: "carer-relationship",
            label: "Relationship to tenant or 'Not related'",
          },
          renderWhen(stepValues: {
            "carer-needed"?: ComponentValue<ResidentDatabaseSchema, "carer">;
          }): boolean {
            return stepValues["carer-needed"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ResidentDatabaseSchema,
            "carer"
          >({
            storeName: "carer",
            key: keyFromSlug(true),
            property: ["relationship"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "carer-phone-number",
          Component: TextInput,
          props: {
            name: "carer-phone-number",
            label: "Phone number",
          },
          renderWhen(stepValues: {
            "carer-needed"?: ComponentValue<ResidentDatabaseSchema, "carer">;
          }): boolean {
            return stepValues["carer-needed"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ResidentDatabaseSchema,
            "carer"
          >({
            storeName: "carer",
            key: keyFromSlug(true),
            property: ["phoneNumber"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "carer-address",
          Component: makeDynamic(
            Textarea,
            {
              value: "value",
              onValueChange: "onChange",
              required: "required",
              disabled: "disabled",
            },
            (value) => value
          ),
          props: {
            name: "carer-address",
            label: {
              children: "Address",
            } as LabelProps,
            rows: 4 as number | undefined,
          },
          renderWhen(stepValues: {
            "carer-needed"?: ComponentValue<ResidentDatabaseSchema, "carer">;
            "carer-live-in"?: ComponentValue<ResidentDatabaseSchema, "carer">;
          }): boolean {
            return (
              stepValues["carer-needed"] === "yes" &&
              stepValues["carer-live-in"] !== "yes"
            );
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ResidentDatabaseSchema,
            "carer"
          >({
            storeName: "carer",
            key: keyFromSlug(true),
            property: ["address"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "carer-notes",
          Component: PostVisitActionInputDetails,
          props: {
            summary: "Add note about carer if necessary",
            label: { value: "Notes" },
            name: "carer-notes",
          } as PostVisitActionInputDetailsProps,
          renderWhen(stepValues: {
            "carer-needed"?: ComponentValue<ResidentDatabaseSchema, "carer">;
          }): boolean {
            return stepValues["carer-needed"] === "yes";
          },
          defaultValue: [] as Notes,
          emptyValue: [] as Notes,
          databaseMap: new ComponentDatabaseMap<
            ResidentDatabaseSchema,
            "carer"
          >({
            storeName: "carer",
            key: keyFromSlug(true),
            property: ["notes"],
          }),
        })
      ),
    ],
  },
};

export default step;
