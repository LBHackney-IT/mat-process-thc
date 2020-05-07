import {
  FieldsetLegend,
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
import { makeSubmit } from "../../components/makeSubmit";
import {
  PostVisitActionInput,
  PostVisitActionInputProps,
} from "../../components/PostVisitActionInput";
import { RadioButtons } from "../../components/RadioButtons";
import { ReviewNotes } from "../../components/ReviewNotes";
import { getRadioLabelFromValue } from "../../helpers/getRadioLabelFromValue";
import keyFromSlug from "../../helpers/keyFromSlug";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import yesNoRadios from "../../helpers/yesNoRadios";
import { Notes } from "../../storage/DatabaseSchema";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const questions = {
  "tenant-understands":
    "Have you discussed antisocial behaviour with the tenant?",
};

const step: ProcessStepDefinition<ProcessDatabaseSchema, "property"> = {
  title: PageTitles.AntisocialBehaviour,
  heading: "Antisocial behaviour",
  review: {
    rows: [
      {
        label: questions["tenant-understands"],
        values: {
          "tenant-understands": {
            renderValue(tenantUnderstands: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, tenantUnderstands);
            },
          },
          "antisocial-behaviour-notes": {
            renderValue(notes: Notes): React.ReactNode {
              if (notes.length === 0) {
                return;
              }

              return <ReviewNotes notes={notes} />;
            },
          },
        },
      },
    ],
  },
  step: {
    slug: PageSlugs.AntisocialBehaviour,
    nextSlug: PageSlugs.OtherComments,
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
            children: `Antisocial behaviour is defined as "behaviour by a 
            person which causes, or is likely to cause, harassment, alarm or 
            distress to one or more persons not of the same household as the 
            person".`,
          },
        })
      ),
      ComponentWrapper.wrapStatic<ProcessDatabaseSchema, "property">(
        new StaticComponent({
          key: "paragraph-2",
          Component: Paragraph,
          props: {
            children: `Examples include:`,
          },
        })
      ),
      ComponentWrapper.wrapStatic<ProcessDatabaseSchema, "property">(
        new StaticComponent({
          key: "paragraph-2-list",
          Component: List,
          props: {
            items: [
              "noise such as: persistent loud music, banging, shouting",
              "ongoing leaks",
              "neighbour disputes",
            ],
            type: ListTypes.Bullet,
          } as ListProps,
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "tenant-understands",
          Component: RadioButtons,
          props: {
            name: "tenant-understands",
            legend: (
              <FieldsetLegend>{questions["tenant-understands"]}</FieldsetLegend>
            ) as React.ReactNode,
            radios: yesNoRadios,
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["antisocialBehaviour", "tenantUnderstands"],
          }),
        })
      ),
      ComponentWrapper.wrapStatic<ProcessDatabaseSchema, "property">(
        new StaticComponent({
          key: "paragraph-3",
          Component: Paragraph,
          props: {
            children: `Explain about antisocial behaviour and give examples.`,
          },
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "antisocial-behaviour-notes",
          Component: PostVisitActionInput,
          props: {
            label: {
              value: (
                <>
                  Add note about antisocial behaviour <b>by</b> or{" "}
                  <b>against</b> tenant if necessary.
                </>
              ),
            },
            name: "antisocial-behaviour-notes",
          } as PostVisitActionInputProps,
          defaultValue: [] as Notes,
          emptyValue: [] as Notes,
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["antisocialBehaviour", "notes"],
          }),
        })
      ),
    ],
  },
};

export default step;
