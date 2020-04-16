import formatDate from "date-fns/format";
import failedAttemptReasonCheckboxes from "helpers/failedAttemptReasonCheckboxes";
import { Heading } from "lbh-frontend-react";
import {
  FieldsetLegend,
  HeadingLevels,
  LabelProps,
  List,
  PageAnnouncement,
  Textarea,
} from "lbh-frontend-react/components";
import { useRouter } from "next/router";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentWrapper,
  DynamicComponent,
  makeDynamic,
  StaticComponent,
} from "remultiform/component-wrapper";
import { TransactionMode } from "remultiform/database";
import { Checkboxes, CheckboxesProps } from "../../components/Checkboxes";
import { makeSubmit } from "../../components/makeSubmit";
import getProcessRef from "../../helpers/getProcessRef";
import keyFromSlug from "../../helpers/keyFromSlug";
import useDataValue from "../../helpers/useDataValue";
import PageSlugs from "../../steps/PageSlugs";
import PageTitles from "../../steps/PageTitles";
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
  const router = useRouter();
  const processRef = getProcessRef(router);
  const firstFailedAttempt = useDataValue(
    Storage.ProcessContext,
    "unableToEnter",
    processRef,
    (values) =>
      processRef ? values[processRef]?.firstFailedAttempt : undefined
  );
  const dateString =
    firstFailedAttempt.loading || !firstFailedAttempt.result?.date
      ? "Loading..."
      : formatDate(new Date(firstFailedAttempt.result?.date), "d MMMM yyyy");

  const reasonValue =
    firstFailedAttempt.loading || !firstFailedAttempt.result?.value
      ? "Loading..."
      : firstFailedAttempt.result?.value;

  // const dateSecondString =
  // secondFailedAttempt.loading || !secondFailedAttempt.result?.date
  //   ? "Loading..."
  //   : formatDate(new Date(secondFailedAttempt.result?.date), "d MMMM yyyy");

  // const reasonSecondValue =
  //   secondFailedAttempt.loading || !secondFailedAttempt.result?.value
  //     ? "Loading..."
  //     : secondFailedAttempt.result?.value;

  const reasonLabel = failedAttemptReasonCheckboxes
    .filter((checkbox) => reasonValue.includes(checkbox.value))
    .map((checkbox) => checkbox.label);

  // const reasonSecondLabel = failedAttemptReasonCheckboxes
  // .filter((checkbox) => reasonSecondValue.includes(checkbox.value))
  // .map((checkbox) => checkbox.label);

  return (
    <PageAnnouncement title={"Previous attempt"}>
      <List
        items={[
          <React.Fragment key="first">
            First failed attempt: {dateString}
          </React.Fragment>,
          <React.Fragment key="second">
            Reason: <List items={reasonLabel.map((label) => label)} />
          </React.Fragment>,
        ]}
      />
      <List
        items={[
          <React.Fragment key="first">
            Second failed attempt: {dateString}
          </React.Fragment>,
          <React.Fragment key="second">
            Reason: <List items={reasonLabel.map((label) => label)} />
          </React.Fragment>,
        ]}
      />
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
