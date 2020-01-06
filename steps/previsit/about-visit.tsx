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

const step: ProcessStepDefinition = {
  title: "About visit",
  heading: "About the visit",
  step: {
    slug: "about-visit",
    nextSlug: "sections",
    Submit: makeSubmit({
      href: "/sections",
      value: "Save and continue"
    }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "unannounced-visit-radios",
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
            name: "unannounced-visit-radios",
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
          key: "unannounced-visit-notes-textarea",
          Component: TextArea,
          props: {
            label: "Explain why this visit was pre-arranged.",
            name: "unannounced-visit-notes"
          },
          renderWhen(stepValues: {
            "unannounced-visit-radios"?: ComponentValue<
              DatabaseSchema,
              "isVisitInside"
            >;
          }): boolean {
            return stepValues["unannounced-visit-radios"] === "no";
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
          key: "inside-property-radios",
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
            name: "inside-property-radios",
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
          key: "inside-property-notes-textarea",
          Component: TextArea,
          props: {
            label:
              "Explain why this visit is not happening inside a tenant's home.",
            name: "inside-property-notes"
          },
          renderWhen(stepValues: {
            "inside-property-radios"?: ComponentValue<
              DatabaseSchema,
              "isVisitInside"
            >;
          }): boolean {
            return stepValues["inside-property-radios"] === "no";
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
