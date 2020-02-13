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
import {
  TextAreaWithCheckbox,
  TextAreaWithCheckboxProps
} from "../../components/TextAreaWithCheckbox";

import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import processRef from "../../storage/processRef";

import PageSlugs, { urlObjectForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step = {
  title: PageTitles.OtherComments,
  heading: "Other comments",
  step: {
    slug: PageSlugs.OtherComments,
    nextSlug: PageSlugs.Sections,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        url: urlObjectForSlug(nextSlug),
        value: "Save and continue"
      }),
    componentWrappers: [
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "paragraph-1",
          Component: Paragraph,
          props: {
            children:
              "Include notes to record other subjects discussed with tenant or issues not included in the form:"
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
              "signs of sub-letting (only record what you observe eg locks on bedroom doors)",
              "any further questions from the tenant about their home, estate or facilities",
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
            label: "Take photos of any other issues",
            name: "other-comments-images",
            hintText: "You can take up to 5 different photos." as
              | string
              | null
              | undefined,
            maxCount: 5 as number | null | undefined
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: processRef,
            property: ["otherComments", "images"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "other-comments-notes",
          Component: TextAreaWithCheckbox,
          props: {
            label: {
              value:
                "Add notes about any other comments or points to investigate for the property"
            },
            name: "other-comments-notes",
            includeCheckbox: true
          } as TextAreaWithCheckboxProps,
          defaultValue: { value: "", isPostVisitAction: false },
          emptyValue: { value: "", isPostVisitAction: false },
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
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
