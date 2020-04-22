import formatDate from "date-fns/format";
import { Heading } from "lbh-frontend-react";
import {
  FieldsetLegend,
  HeadingLevels,
  LabelProps,
  PageAnnouncement,
  SummaryList,
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
import { Checkboxes, CheckboxesProps } from "../../components/Checkboxes";
import { makeSubmit } from "../../components/makeSubmit";
import failedAttemptReasonCheckboxes from "../../helpers/failedAttemptReasonCheckboxes";
import getProcessRef from "../../helpers/getProcessRef";
import keyFromSlug from "../../helpers/keyFromSlug";
import {
  FailedAttempts,
  persistUnableToEnterDate,
} from "../../helpers/persistUnableToEnterDate";
import useDataValue from "../../helpers/useDataValue";
import PageSlugs from "../../steps/PageSlugs";
import PageTitles from "../../steps/PageTitles";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import Storage from "../../storage/Storage";

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

  const reasons = failedAttemptReasonCheckboxes
    .filter((checkbox) => reasonValue.includes(checkbox.value))
    .map((checkbox) => checkbox.label);

  return (
    <PageAnnouncement title="Previous attempts">
      <Heading level={HeadingLevels.H4}>First attempt</Heading>
      <SummaryList
        rows={[
          {
            key: "Date",
            value: dateString,
          },
          {
            key: "Reasons",
            value: reasons.join(", "),
          },
        ]}
      />
    </PageAnnouncement>
  );
};

const step = {
  title: PageTitles.SecondFailedAttempt,
  heading: "Unable to enter the property",
  step: {
    slug: PageSlugs.SecondFailedAttempt,
    nextSlug: PageSlugs.Pause,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit([
        {
          slug: nextSlug as PageSlugs | undefined,
          value: "Save and continue",
          afterSubmit: (): Promise<void> =>
            persistUnableToEnterDate(FailedAttempts.Second),
        },
        {
          cancel: true,
          value: "Cancel",
        },
      ]),
    componentWrappers: [
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "second-attempt-heading",
          Component: Heading,
          props: {
            level: HeadingLevels.H2,
            children: "Second attempt",
          },
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "one",
          Component: PreviousFailedAttemptsAnnouncement,
          props: {},
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
            checkboxes: failedAttemptReasonCheckboxes,
          } as CheckboxesProps,
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "unableToEnter"
          >({
            storeName: "unableToEnter",
            key: keyFromSlug(),
            property: ["secondFailedAttempt", "value"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "second-attempt-notes",
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
            name: "second-attempt-notes",
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
            property: ["secondFailedAttempt", "notes"],
          }),
        })
      ),
    ],
  },
};

export default step;
