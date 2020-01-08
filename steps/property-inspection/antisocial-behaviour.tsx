import {
  FieldsetLegend,
  Paragraph,
  List,
  ListTypes,
  ListProps
} from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentWrapper,
  DynamicComponent,
  StaticComponent
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
  title: PageTitles.AntisocialBehaviour,
  heading: "Does the tenant understand about anti social behaviour?",
  step: {
    slug: PageSlugs.AntisocialBehaviour,
    nextSlug: PageSlugs.Submit,
    Submit: makeSubmit({
      href: hrefForSlug(PageSlugs.Submit),
      value: "Save and continue"
    }),
    componentWrappers: [
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "paragraph-1",
          Component: Paragraph,
          props: {
            children: `Anti social behaviour is defined as "behaviour by a 
            person which causes, or is likely to cause, harassment, alarm or 
            distress to one or more persons not of the same household as the 
            person".`
          }
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "paragraph-2",
          Component: Paragraph,
          props: {
            children: `Examples include:`
          }
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "paragraph-2-list",
          Component: List,
          props: {
            items: [
              "noise such as: persistent loud music, banging, shouting",
              "ongoing leaks",
              "neighbour disputes"
            ],
            type: ListTypes.Bullet
          } as ListProps
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "tenant-understands",
          Component: RadioButtons,
          props: {
            name: "tenant-understands",
            legend: (
              <FieldsetLegend>
                Does the tenant understand about anti social behaviour?
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
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "property">({
            storeName: "property",
            key: processRef,
            property: ["antisocialBehaviour", "tenantUnderstands"]
          })
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "paragraph-3",
          Component: Paragraph,
          props: {
            children: `Explain about anti social behaviour and give examples.`
          }
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "antisocial-behaviour-notes",
          Component: TextArea,
          props: {
            label: {
              value: (
                <>
                  Add note about anti social behaviour <b>by</b> or
                  <b> against</b> tenant if necessary.
                </>
              ) as React.ReactNode | null
            },
            name: "antisocial-behaviour-notes"
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "property">({
            storeName: "property",
            key: processRef,
            property: ["antisocialBehaviour", "notes"]
          })
        })
      )
    ]
  }
};

export default step;
