import { FieldsetLegend } from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentValue,
  ComponentWrapper,
  DynamicComponent
} from "remultiform/component-wrapper";
import { makeSubmit } from "../../components/makeSubmit";
import { RadioButtons } from "../../components/RadioButtons";
import { TextArea } from "../../components/TextArea";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import processRef from "../../storage/processRef";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const step = {
  title: PageTitles.AboutVisit,
  heading: "About the visit",
  step: {
    slug: PageSlugs.AboutVisit,
    nextSlug: PageSlugs.Sections,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
        value: "Save and continue"
      }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "unannounced-visit",
          Component: RadioButtons,
          props: {
            name: "unannounced-visit",
            legend: (
              <FieldsetLegend>Is this an unannounced visit?</FieldsetLegend>
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
            "isUnannouncedVisit"
          >({
            storeName: "isUnannouncedVisit",
            key: processRef,
            property: ["value"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "unannounced-visit-notes",
          Component: TextArea,
          props: {
            label: {
              value: "Explain why this visit was pre-arranged."
            } as { id?: string; value: React.ReactNode },
            name: "unannounced-visit-notes"
          },
          renderWhen(stepValues: {
            "unannounced-visit"?: ComponentValue<
              ProcessDatabaseSchema,
              "isVisitInside"
            >;
          }): boolean {
            return stepValues["unannounced-visit"] === "no";
          },
          defaultValue: { value: "", isPostVisitAction: false },
          emptyValue: { value: "", isPostVisitAction: false },
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "isUnannouncedVisit"
          >({
            storeName: "isUnannouncedVisit",
            key: processRef,
            property: ["notes"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "inside-property",
          Component: RadioButtons,
          props: {
            name: "inside-property",
            legend: (
              <FieldsetLegend>
                Is it taking place inside a tenant&apos;s home?
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
            "isVisitInside"
          >({
            storeName: "isVisitInside",
            key: processRef,
            property: ["value"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "inside-property-notes",
          Component: TextArea,
          props: {
            label: {
              value:
                "Explain why this visit is not happening inside a tenant's home."
            } as { id?: string; value: React.ReactNode },
            name: "inside-property-notes"
          },
          renderWhen(stepValues: {
            "inside-property"?: ComponentValue<
              ProcessDatabaseSchema,
              "isVisitInside"
            >;
          }): boolean {
            return stepValues["inside-property"] === "no";
          },
          defaultValue: { value: "", isPostVisitAction: false },
          emptyValue: { value: "", isPostVisitAction: false },
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "isVisitInside"
          >({
            storeName: "isVisitInside",
            key: processRef,
            property: ["notes"]
          })
        })
      )
    ]
  }
};

export default step;
