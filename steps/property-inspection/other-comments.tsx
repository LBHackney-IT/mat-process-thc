import ProcessStepDefinition from "helpers/ProcessStepDefinition";
import {
  List,
  ListProps,
  ListTypes,
  Paragraph,
} from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentWrapper,
  DynamicComponent,
  StaticComponent,
} from "remultiform/component-wrapper";
import { ImageInput } from "../../components/ImageInput";
import { makeSubmit } from "../../components/makeSubmit";
import {
  PostVisitActionInput,
  PostVisitActionInputProps,
} from "../../components/PostVisitActionInput";
import { ReviewNotes } from "../../components/ReviewNotes";
import keyFromSlug from "../../helpers/keyFromSlug";
import { Notes } from "../../storage/DatabaseSchema";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const step: ProcessStepDefinition<ProcessDatabaseSchema, "property"> = {
  title: PageTitles.OtherComments,
  heading: "Other comments",
  review: {
    rows: [
      {
        label:
          "Add notes about any other comments or points to investigate for the property",
        values: {
          "other-comments-notes": {
            renderValue(notes: Notes): React.ReactNode {
              if (notes.length === 0) {
                return;
              }

              return <ReviewNotes notes={notes} />;
            },
          },
        },
        images: "other-comments-images",
      },
    ],
  },
  step: {
    slug: PageSlugs.OtherComments,
    nextSlug: PageSlugs.Sections,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
        value: "Save and continue",
      }),
    componentWrappers: [
      ComponentWrapper.wrapStatic<ProcessDatabaseSchema, "property">(
        new StaticComponent({
          key: "paragraph-1",
          Component: Paragraph,
          props: {
            children:
              "Include notes to record other subjects discussed with tenant or issues not included in the form:",
          },
        })
      ),
      ComponentWrapper.wrapStatic<ProcessDatabaseSchema, "property">(
        new StaticComponent({
          key: "paragraph-1-list",
          Component: List,
          props: {
            items: [
              "hoarding",
              "signs of sub-letting (only record what you observe eg locks on bedroom doors)",
              "any further questions from the tenant about their home, estate or facilities",
              "Tenant and Resident Association",
            ],
            type: ListTypes.Bullet,
          } as ListProps,
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
            maxCount: 5 as number | null | undefined,
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["otherComments", "images"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "other-comments-notes",
          Component: PostVisitActionInput,
          props: {
            label: {
              value:
                "Add notes about any other comments or points to investigate for the property",
            },
            name: "other-comments-notes",
          } as PostVisitActionInputProps,
          defaultValue: [] as Notes,
          emptyValue: [] as Notes,
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["otherComments", "notes"],
          }),
        })
      ),
    ],
  },
};

export default step;
