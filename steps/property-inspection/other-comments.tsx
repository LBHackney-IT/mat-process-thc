import {
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

import { ImageInput } from "../../components/ImageInput";
import { makeSubmit } from "../../components/makeSubmit";
import { TextArea } from "../../components/TextArea";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import DatabaseSchema from "../../storage/DatabaseSchema";
import processRef from "../../storage/processRef";

import PageSlugs, { hrefForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step: ProcessStepDefinition = {
  title: PageTitles.OtherComments,
  heading:
    "Are there any other comments or points to investigate for the property?",
  step: {
    slug: PageSlugs.OtherComments,
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
            children: `Include notes to record other subjects discussed with 
            tenant or issues not included in the form:
            `
          }
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "paragraph-1-list",
          Component: List,
          props: {
            items: [
              "hoarding",
              `signs of sub-letting (only record what you observe eg locks on 
              bedroom doors)`,
              `any further questions from the tenant about their home, estate 
              or facilities`,
              "Tenant and Resident Association"
            ],
            type: ListTypes.Bullet
          } as ListProps
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "other-comments-images",
          Component: ImageInput,
          props: {
            label: "Take photo of any other issues",
            name: "other-comments-images",
            maxCount: 3
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "property">({
            storeName: "property",
            key: processRef,
            property: ["otherComments", "images"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "other-comments-notes",
          Component: TextArea,
          props: {
            label: {
              value: `Add notes about any other comments or points to 
              investigate for the property` as React.ReactNode | null
            },
            name: "other-comments-notes"
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "property">({
            storeName: "property",
            key: processRef,
            property: ["otherComments", "notes"]
          })
        })
      )
    ]
  }
};

export default step;
