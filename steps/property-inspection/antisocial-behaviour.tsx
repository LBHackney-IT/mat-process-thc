import {
  FieldsetLegend,
  List,
  ListProps,
  ListTypes,
  Paragraph
} from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentWrapper,
  DynamicComponent,
  StaticComponent
} from "remultiform/component-wrapper";
import { makeSubmit } from "../../components/makeSubmit";
import { RadioButtons } from "../../components/RadioButtons";
import { TextArea, TextAreaProps } from "../../components/TextArea";
import keyFromSlug from "../../helpers/keyFromSlug";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const step = {
  title: PageTitles.AntisocialBehaviour,
  heading: "Antisocial behaviour",
  step: {
    slug: PageSlugs.AntisocialBehaviour,
    nextSlug: PageSlugs.OtherComments,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
        value: "Save and continue"
      }),
    componentWrappers: [
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "paragraph-1",
          Component: Paragraph,
          props: {
            children: `Antisocial behaviour is defined as "behaviour by a 
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
                Have you discussed antisocial behaviour with the tenant?
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
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["antisocialBehaviour", "tenantUnderstands"]
          })
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "paragraph-3",
          Component: Paragraph,
          props: {
            children: `Explain about antisocial behaviour and give examples.`
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
                  Add note about antisocial behaviour <b>by</b> or{" "}
                  <b>against</b> tenant if necessary.
                </>
              )
            },
            name: "antisocial-behaviour-notes",
            includeCheckbox: true
          } as TextAreaProps,
          defaultValue: { value: "", isPostVisitAction: false },
          emptyValue: { value: "", isPostVisitAction: false },
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["antisocialBehaviour", "notes"]
          })
        })
      )
    ]
  }
};

export default step;
