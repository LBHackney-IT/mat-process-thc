import formatDate from "date-fns/format";
import {
  PageAnnouncement,
  Paragraph,
  SummaryList,
} from "lbh-frontend-react/components";
import { useRouter } from "next/router";
import React from "react";
import failedAttemptActionCheckboxes from "../helpers/failedAttemptActionCheckboxes";
import failedAttemptReasonCheckboxes from "../helpers/failedAttemptReasonCheckboxes";
import getProcessRef from "../helpers/getProcessRef";
import useDataValue from "../helpers/useDataValue";
import Storage from "../storage/Storage";

const Value: React.FunctionComponent<{
  date?: string;
  reasons?: string[];
  actions?: string[];
  notes?: string;
}> = (props) => {
  const date = props.date && formatDate(new Date(props.date), "d MMMM yyyy");
  const reasons = props.reasons || [];
  const actions = props.actions || [];
  const notes = props.notes;

  const reason = failedAttemptReasonCheckboxes
    .filter((checkbox) => reasons.includes(checkbox.value))
    .map((checkbox) => checkbox.label)
    .join(", ");

  const action = failedAttemptActionCheckboxes
    .filter((checkbox) => actions.includes(checkbox.value))
    .map((checkbox) => checkbox.label)
    .join(", ");

  return (
    <Paragraph>
      <span>{date}</span>
      {reason && (
        <span>
          <br />
          {reason}
        </span>
      )}
      {action && (
        <span>
          <br />
          {action}
        </span>
      )}
      {notes && (
        <span>
          <br />
          {notes}
        </span>
      )}
    </Paragraph>
  );
};

const PreviousAttemptsAnnouncement: React.FunctionComponent<{
  summary?: boolean;
}> = (props) => {
  const { summary } = props;
  const router = useRouter();
  const processRef = getProcessRef(router);

  const unableToEnter = useDataValue(
    Storage.ProcessContext,
    "unableToEnter",
    processRef,
    (values) => (processRef ? values[processRef] : undefined)
  );

  const madeFirstAttempt = Boolean(
    unableToEnter.result?.firstFailedAttempt?.date
  );

  if (!madeFirstAttempt) {
    return null;
  }

  const rows = [
    {
      key: "First attempt",
      value: (
        <Value
          date={unableToEnter.result?.firstFailedAttempt?.date}
          reasons={
            summary
              ? unableToEnter.result?.firstFailedAttempt?.value
              : undefined
          }
          notes={
            summary
              ? unableToEnter.result?.firstFailedAttempt?.notes
              : undefined
          }
        />
      ),
    },
  ];

  const madeSecondAttempt = Boolean(
    unableToEnter.result?.secondFailedAttempt?.date
  );

  if (madeSecondAttempt) {
    rows.push({
      key: "Second attempt",
      value: (
        <Value
          date={unableToEnter.result?.secondFailedAttempt?.date}
          reasons={
            summary
              ? unableToEnter.result?.secondFailedAttempt?.value
              : undefined
          }
          notes={
            summary
              ? unableToEnter.result?.secondFailedAttempt?.notes
              : undefined
          }
        />
      ),
    });
  }

  const madeThirdAttempt = Boolean(
    unableToEnter.result?.thirdFailedAttempt?.date
  );

  if (madeThirdAttempt) {
    rows.push({
      key: "Third attempt",
      value: (
        <Value
          date={unableToEnter.result?.thirdFailedAttempt?.date}
          reasons={
            summary
              ? unableToEnter.result?.thirdFailedAttempt?.reasons
              : undefined
          }
          actions={
            summary
              ? unableToEnter.result?.thirdFailedAttempt?.actions
              : undefined
          }
          notes={
            summary
              ? unableToEnter.result?.thirdFailedAttempt?.notes
              : undefined
          }
        />
      ),
    });
  }

  const madeFourthAttempt = Boolean(
    unableToEnter.result?.fourthFailedAttempt?.date
  );

  if (madeFourthAttempt) {
    rows.push({
      key: "Fourth attempt (by appointment)",
      value: (
        <Value
          date={unableToEnter.result?.fourthFailedAttempt?.date}
          reasons={
            summary
              ? unableToEnter.result?.fourthFailedAttempt?.reasons
              : undefined
          }
          notes={
            summary
              ? unableToEnter.result?.fourthFailedAttempt?.notes
              : undefined
          }
        />
      ),
    });
  }

  return (
    <PageAnnouncement title="Previous attempts">
      {unableToEnter.loading ? "Loading..." : <SummaryList rows={rows} />}
    </PageAnnouncement>
  );
};

export default PreviousAttemptsAnnouncement;
