import formatDate from "date-fns/format";
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
import yesNoRadios from "../../helpers/yesNoRadios";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import processRef from "../../storage/processRef";

import PageSlugs, { urlObjectForSlug } from "../PageSlugs";
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

const step: ProcessStepDefinition<ProcessDatabaseSchema, "tenant"> = {
  title: PageTitles.Carer,
  heading: "Carer",
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
              month?: string;
              year?: string;
            }): React.ReactNode {
              return startDate.year
                ? `Since ${
                    startDate.month
                      ? formatDate(
                          new Date(
                            parseInt(startDate.year),
                            parseInt(startDate.month) - 1
                          ),
                          "MMMM yyyy"
                        )
                      : startDate.year
                  }`
                : undefined;
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
    nextSlug: PageSlugs.Sections,
    Submit: makeSubmit({
      url: urlObjectForSlug(PageSlugs.Sections),
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
            ProcessDatabaseSchema,
            "tenant"
          >({
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
              <FieldsetLegend>{questions["carer-type"]}</FieldsetLegend>
            ) as React.ReactNode,
            radios: carerTypeRadios
          },
          renderWhen(stepValues: {
            "carer-needed"?: ComponentValue<ProcessDatabaseSchema, "tenant">;
          }): boolean {
            return stepValues["carer-needed"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "tenant"
          >({
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
              <FieldsetLegend>{questions["carer-live-in"]}</FieldsetLegend>
            ) as React.ReactNode,
            radios: yesNoRadios
          },
          renderWhen(stepValues: {
            "carer-needed"?: ComponentValue<ProcessDatabaseSchema, "tenant">;
          }): boolean {
            return stepValues["carer-needed"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "tenant"
          >({
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
            "carer-live-in"?: ComponentValue<ProcessDatabaseSchema, "tenant">;
          }): boolean {
            return stepValues["carer-live-in"] === "yes";
          }
        })
      ) as ComponentWrapper<ProcessDatabaseSchema, "tenant">,
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "carer-live-in-start-date",
          Component: DateInput,
          props: {
            name: "carer-live-in-start-date"
          },
          renderWhen(stepValues: {
            "carer-live-in"?: ComponentValue<ProcessDatabaseSchema, "tenant">;
          }): boolean {
            return stepValues["carer-live-in"] === "yes";
          },
          defaultValue: {},
          emptyValue: {} as { month?: number; year?: number },
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "tenant"
          >({
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
            children: questions["carer-details"]
          },
          renderWhen(stepValues: {
            "carer-needed"?: ComponentValue<ProcessDatabaseSchema, "tenant">;
          }): boolean {
            return stepValues["carer-needed"] === "yes";
          }
        })
      ) as ComponentWrapper<ProcessDatabaseSchema, "tenant">,
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "carer-full-name",
          Component: TextInput,
          props: {
            name: "carer-full-name",
            label: "Full name"
          },
          renderWhen(stepValues: {
            "carer-needed"?: ComponentValue<ProcessDatabaseSchema, "tenant">;
          }): boolean {
            return stepValues["carer-needed"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "tenant"
          >({
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
            "carer-needed"?: ComponentValue<ProcessDatabaseSchema, "tenant">;
          }): boolean {
            return stepValues["carer-needed"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "tenant"
          >({
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
            "carer-needed"?: ComponentValue<ProcessDatabaseSchema, "tenant">;
          }): boolean {
            return stepValues["carer-needed"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "tenant"
          >({
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
            label: {
              value: "Address"
            } as { id?: string; value?: React.ReactNode },
            rows: 4 as number | undefined
          },
          renderWhen(stepValues: {
            "carer-live-in"?: ComponentValue<ProcessDatabaseSchema, "tenant">;
          }): boolean {
            return stepValues["carer-live-in"] === "no";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "tenant"
          >({
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
            summary: "Add note about carer if necessary" as React.ReactNode,
            name: "carer-notes"
          },
          renderWhen(stepValues: {
            "carer-needed"?: ComponentValue<ProcessDatabaseSchema, "tenant">;
          }): boolean {
            return stepValues["carer-needed"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "tenant"
          >({
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
