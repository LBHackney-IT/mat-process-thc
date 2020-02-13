import formatDate from "date-fns/format";
import {
  FieldsetLegend,
  Heading,
  HeadingLevels
} from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentValue,
  ComponentWrapper,
  DynamicComponent,
  StaticComponent
} from "remultiform/component-wrapper";
import { DateInput } from "../../components/DateInput";
import { makeSubmit } from "../../components/makeSubmit";
import { RadioButtons } from "../../components/RadioButtons";
import { TextArea, TextAreaProps } from "../../components/TextArea";
import {
  TextAreaDetails,
  TextAreaDetailsProps
} from "../../components/TextAreaDetails";
import { TextInput } from "../../components/TextInput";
import keyFromSlug from "../../helpers/keyFromSlug";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import yesNoRadios from "../../helpers/yesNoRadios";
import { Note } from "../../storage/DatabaseSchema";
import ResidentDatabaseSchema from "../../storage/ResidentDatabaseSchema";
import Storage from "../../storage/Storage";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const questions = {
  "carer-needed": "Does the tenant have a carer?",
  "carer-type": "Who provides the care?",
  "carer-live-in": "Does the carer live in the property?",
  "carer-details": "Carer details"
};

const carerTypeRadios = [
  {
    label: "A registered carer",
    value: "registered"
  },
  {
    label: "A voluntary arrangement, e.g. a family member",
    value: "voluntary"
  }
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
              return yesNoRadios.find(({ value }) => value === needed)?.label;
            }
          }
        }
      },
      {
        label: questions["carer-type"],
        values: {
          "carer-type": {
            renderValue(type: string): React.ReactNode {
              return carerTypeRadios.find(({ value }) => value === type)?.label;
            }
          }
        }
      },
      {
        label: questions["carer-live-in"],
        values: {
          "carer-live-in": {
            renderValue(liveIn: string): React.ReactNode {
              return yesNoRadios.find(({ value }) => value === liveIn)?.label;
            }
          },
          "carer-live-in-start-date": {
            renderValue(startDate: {
              month?: number;
              year?: number;
            }): React.ReactNode {
              return startDate.year
                ? `Since ${
                    startDate.month
                      ? formatDate(
                          new Date(startDate.year, startDate.month - 1),
                          "MMMM yyyy"
                        )
                      : startDate.year
                  }`
                : null;
            }
          }
        }
      },
      {
        label: questions["carer-details"],
        values: {
          "carer-full-name": {
            renderValue(name: string): React.ReactNode {
              return name;
            }
          },
          "carer-relationship": {
            renderValue(relationship: string): React.ReactNode {
              return relationship;
            }
          },
          "carer-phone-number": {
            renderValue(phone: string): React.ReactNode {
              return phone;
            }
          },
          "carer-address": {
            renderValue(address: string): React.ReactNode {
              return address;
            }
          },
          "carer-notes": {
            renderValue(notes: string): React.ReactNode {
              return notes;
            }
          }
        }
      }
    ]
  },
  step: {
    slug: PageSlugs.Carer,
    nextSlug: PageSlugs.Verify,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
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
              <FieldsetLegend>{questions["carer-needed"]}</FieldsetLegend>
            ) as React.ReactNode,
            radios: yesNoRadios
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ResidentDatabaseSchema,
            "carer"
          >({
            storeName: "carer",
            key: keyFromSlug(),
            property: ["hasCarer"]
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
              <FieldsetLegend>{questions["carer-type"]}</FieldsetLegend>
            ) as React.ReactNode,
            radios: carerTypeRadios
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
            key: keyFromSlug(),
            property: ["type"]
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
              <FieldsetLegend>{questions["carer-live-in"]}</FieldsetLegend>
            ) as React.ReactNode,
            radios: yesNoRadios
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
            key: keyFromSlug(),
            property: ["isLiveIn"]
          })
        })
      ),
      ComponentWrapper.wrapStatic<ResidentDatabaseSchema, "carer">(
        new StaticComponent({
          key: "carer-live-in-start-date-heading",
          Component: FieldsetLegend,
          props: {
            children: "When did the carer start living in the property?"
          },
          renderWhen(stepValues: {
            "carer-live-in"?: ComponentValue<ResidentDatabaseSchema, "carer">;
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
            "carer-live-in"?: ComponentValue<ResidentDatabaseSchema, "carer">;
          }): boolean {
            return stepValues["carer-live-in"] === "yes";
          },
          defaultValue: {},
          emptyValue: {} as { month?: number; year?: number },
          databaseMap: new ComponentDatabaseMap<
            ResidentDatabaseSchema,
            "carer"
          >({
            storeName: "carer",
            key: keyFromSlug(),
            property: ["liveInStartDate"]
          })
        })
      ),
      ComponentWrapper.wrapStatic<ResidentDatabaseSchema, "carer">(
        new StaticComponent({
          key: "carer-details-heading",
          Component: Heading,
          props: {
            level: HeadingLevels.H2,
            children: questions["carer-details"]
          },
          renderWhen(stepValues: {
            "carer-needed"?: ComponentValue<ResidentDatabaseSchema, "carer">;
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
            key: keyFromSlug(),
            property: ["fullName"]
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
            key: keyFromSlug(),
            property: ["relationship"]
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
            key: keyFromSlug(),
            property: ["phoneNumber"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "carer-address",
          Component: TextArea,
          props: {
            name: "carer-address",
            label: {
              value: "Address"
            },
            rows: 4 as number | undefined
          } as TextAreaProps,
          renderWhen(stepValues: {
            "carer-live-in"?: ComponentValue<ResidentDatabaseSchema, "carer">;
          }): boolean {
            return stepValues["carer-live-in"] === "no";
          },
          defaultValue: { value: "", isPostVisitAction: false },
          emptyValue: { value: "", isPostVisitAction: false },
          databaseMap: new ComponentDatabaseMap<
            ResidentDatabaseSchema,
            "carer"
          >({
            storeName: "carer",
            key: keyFromSlug(),
            property: ["address"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "carer-notes",
          Component: TextAreaDetails,
          props: {
            summary: "Add note about carer if necessary",
            label: { value: "Notes" },
            name: "carer-notes",
            includeCheckbox: true
          } as TextAreaDetailsProps,
          renderWhen(stepValues: {
            "carer-needed"?: ComponentValue<ResidentDatabaseSchema, "carer">;
          }): boolean {
            return stepValues["carer-needed"] === "yes";
          },
          defaultValue: { value: "", isPostVisitAction: false },
          emptyValue: { value: "", isPostVisitAction: false },
          databaseMap: new ComponentDatabaseMap<
            ResidentDatabaseSchema,
            "carer"
          >({
            storeName: "carer",
            key: keyFromSlug(),
            property: ["notes"]
          })
        })
      )
    ]
  }
};

export default step;
