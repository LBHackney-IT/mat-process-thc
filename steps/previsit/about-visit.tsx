import {
  Fieldset,
  FieldsetLegend
} from "lbh-frontend-react/components/Fieldset";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentValue,
  ComponentWrapper,
  DynamicComponent
} from "remultiform/component-wrapper";

import { makeSubmit } from "../../components/makeSubmit";
import ProcessStepDefinition from "../../components/ProcessStepDefinition";
import { RadioButtons } from "../../components/RadioButtons";
import { TextArea } from "../../components/TextArea";
import DatabaseSchema from "../../storage/DatabaseSchema";
import processRef from "../../storage/processRef";

import PageSlugs, { hrefForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step: ProcessStepDefinition = {
  title: PageTitles.AboutVisit,
  heading: "About the visit",
  step: {
    slug: PageSlugs.AboutVisit,
    nextSlug: PageSlugs.Sections,
    Submit: makeSubmit({
      href: hrefForSlug(PageSlugs.Sections),
      value: "Save and continue"
    }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "unannounced-visit",
          Component(props): React.ReactElement {
            return (
              <Fieldset
                legend={
                  <FieldsetLegend>Is this an unnanounced visit?</FieldsetLegend>
                }
              >
                <RadioButtons {...props} />
              </Fieldset>
            );
          },
          props: {
            name: "unannounced-visit",
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
            DatabaseSchema,
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
            label: "Explain why this visit was pre-arranged.",
            name: "unannounced-visit-notes"
          },
          renderWhen(stepValues: {
            "unannounced-visit"?: ComponentValue<
              DatabaseSchema,
              "isVisitInside"
            >;
          }): boolean {
            return stepValues["unannounced-visit"] === "no";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            DatabaseSchema,
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
          // eslint-disable-next-line react/display-name
          Component: (props): React.ReactElement => (
            <Fieldset
              legend={
                <FieldsetLegend>
                  Is it taking place inside a tenant&apos;s home?
                </FieldsetLegend>
              }
            >
              <RadioButtons {...props} />
            </Fieldset>
          ),
          props: {
            name: "inside-property",
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
            DatabaseSchema,
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
            label:
              "Explain why this visit is not happening inside a tenant's home.",
            name: "inside-property-notes"
          },
          renderWhen(stepValues: {
            "inside-property"?: ComponentValue<DatabaseSchema, "isVisitInside">;
          }): boolean {
            return stepValues["inside-property"] === "no";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            DatabaseSchema,
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
