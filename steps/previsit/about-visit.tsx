import {
  Fieldset,
  FieldsetLegend
} from "lbh-frontend-react/components/Fieldset";
import React from "react";
import {
  DatabaseMap,
  ComponentWrapper,
  DynamicComponent
} from "remultiform/component-wrapper";

import { makeSubmit } from "../../components/makeSubmit";
import ProcessStepDefinition from "../../components/ProcessStepDefinition";
import { RadioButtons } from "../../components/RadioButtons";
import { TextArea } from "../../components/TextArea";

import DatabaseSchema from "../../storage/DatabaseSchema";
import processId from "../../storage/processId";

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
          // eslint-disable-next-line react/display-name
          Component: (props): React.ReactElement => (
            <Fieldset
              legend={
                <FieldsetLegend>Is this an unnanounced visit?</FieldsetLegend>
              }
            >
              <RadioButtons {...props} />
            </Fieldset>
          ),
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
          databaseMap: new DatabaseMap<DatabaseSchema, "unannouncedVisit">({
            storeName: "unannouncedVisit",
            key: processId
          }),
          emptyValue: undefined
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "unannounced-visit-notes-textarea",
          Component: TextArea,
          props: {
            label: "Explain why this visit is pre-arranged.",
            name: "unannounced-visit-notes"
          },
          databaseMap: new DatabaseMap<DatabaseSchema, "unannouncedVisitNotes">(
            {
              storeName: "unannouncedVisitNotes",
              key: processId
            }
          ),
          emptyValue: "",
          renderWhen: (values): boolean =>
            values["unannounced-visit-radios"] === "yes"
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
          databaseMap: new DatabaseMap<DatabaseSchema, "insideProperty">({
            storeName: "insideProperty",
            key: processId
          }),
          emptyValue: undefined
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "inside-property-notes-textarea",
          Component: TextArea,
          props: {
            label: "Explain why this visit is outside of tenant's home.",
            name: "inside-property-notes"
          },
          databaseMap: new DatabaseMap<DatabaseSchema, "insidePropertyNotes">({
            storeName: "insidePropertyNotes",
            key: processId
          }),
          emptyValue: "",
          renderWhen: (values): boolean =>
            values["inside-property-radios"] === "no"
        })
      )
    ]
  }
};

export default step;
