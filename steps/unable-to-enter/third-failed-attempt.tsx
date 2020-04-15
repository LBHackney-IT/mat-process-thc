import { makeSubmit } from "components/makeSubmit";
import { Heading } from "lbh-frontend-react";
import {
  FieldsetLegend,
  HeadingLevels,
  LabelProps,
  List,
  PageAnnouncement,
  Textarea,
} from "lbh-frontend-react/components";
import React from "react";
import { TransactionMode } from "remultiform/database";
import {
  ComponentDatabaseMap,
  ComponentWrapper,
  DynamicComponent,
  makeDynamic,
  StaticComponent,
} from "remultiform/dist/esm/component-wrapper";
import PageSlugs from "steps/PageSlugs";
import PageTitles from "steps/PageTitles";
import { Checkboxes, CheckboxesProps } from "../../components/Checkboxes";
import keyFromSlug from "../../helpers/keyFromSlug";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import Storage from "../../storage/Storage";

const storeThirdVisitDate = async (): Promise<void> => {
  const db = await Storage.ProcessContext?.database;

  if (!db) {
    console.error("Unable to find process database");

    return;
  }

  const processRef = keyFromSlug()();
  const date = new Date().toISOString();

  //   const date: React.FunctionComponent<Omit<
  //   CheckboxesProps,
  //   "checkboxes"
  // >> = (props) => {
  //   const router = useRouter();

  //   const processRef = getProcessRef(router);
  //   const date = useDataValue(
  //     Storage.ProcessContext,
  //     "unableToEnter",
  //     processRef,
  //     (values) => (processRef ? values[processRef] : undefined)
  //   )
  //   console.log(date)

  // return (
  //   <Checkboxes
  //     {...props}
  //     required
  //     checkboxes={
  //       date.result
  //         ? date.result.map(() => ({
  //             label: firstFailedAttempt.date,
  //             value
  //           }))
  //         : []
  //     }
  //   />

  // const dateValue = date.result ? date.result : "loading";

  await db.transaction(
    ["unableToEnter"],
    async (stores) => {
      const unableToEnter =
        (await stores.unableToEnter.get(processRef)) ||
        ({} as ProcessDatabaseSchema["schema"]["unableToEnter"]["value"]);

      await stores.unableToEnter.put(processRef, {
        ...unableToEnter,
        thirdFailedAttempt: {
          ...unableToEnter.thirdFailedAttempt,
          date,
        },
      });
    },
    TransactionMode.ReadWrite
  );
};

const PreviousFailedAttemptsAnnouncement: React.FunctionComponent = () => {
  // const router = useRouter();
  // const processRef = getProcessRef(router);
  // const date = useDataValue(
  //   Storage.ProcessContext,
  //   "unableToEnter",
  //   processRef,
  //   (values) => (processRef ? values[processRef] : undefined)
  // );
  // const dateValue = date.result ? date.result : "loading";

  // console.log(date.result?.firstFailedAttempt);
  return (
    <PageAnnouncement title={"Previous attempt"}>
      <List key="one" items={["First failed attempt"]}></List>
    </PageAnnouncement>
  );
};

const step = {
  title: PageTitles.ThirdFailedAttempt,
  heading: "Unable to enter the property",
  step: {
    slug: PageSlugs.ThirdFailedAttempt,
    nextSlug: PageSlugs.Pause,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit([
        {
          slug: nextSlug as PageSlugs | undefined,
          value: "Save and continue",
          afterSubmit: storeThirdVisitDate,
        },
        {
          cancel: true,
          value: "Cancel",
        },
      ]),
    componentWrappers: [
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "one",
          Component: PreviousFailedAttemptsAnnouncement,
          props: {},
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "third-attempt-heading",
          Component: Heading,
          props: {
            level: HeadingLevels.H2,
            children: "Third attempt",
          },
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "why-unable-to-enter",
          Component: Checkboxes,
          props: {
            name: "why-unable-to-enter",
            legend: (
              <FieldsetLegend>
                Why were you unable to enter the property? Did you observe
                anything of concern?
              </FieldsetLegend>
            ) as React.ReactNode,
            checkboxes: [
              {
                label: "Tenant not in",
                value: "tenant not in",
              },
              {
                label: "Not safe to enter property",
                value: "not safe",
              },
              {
                label: "Property may be abandoned",
                value: "abandoned",
              },
              {
                label: "There are signs of subletting",
                value: "subletting",
              },
              {
                label: "Other",
                value: "other",
              },
            ],
          } as CheckboxesProps,
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "unableToEnter"
          >({
            storeName: "unableToEnter",
            key: keyFromSlug(),
            property: ["thirdFailedAttempt", "value"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "third-attempt-notes",
          Component: makeDynamic(
            Textarea,
            {
              value: "value",
              onValueChange: "onChange",
              required: "required",
              disabled: "disabled",
            },
            (value) => value
          ),
          props: {
            name: "third-attempt-notes",
            label: {
              children: "If necessary, add any additional notes.",
            } as LabelProps,
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "unableToEnter"
          >({
            storeName: "unableToEnter",
            key: keyFromSlug(false),
            property: ["thirdFailedAttempt", "notes"],
          }),
        })
      ),
    ],
  },
};

export default step;
