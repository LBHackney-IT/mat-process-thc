import formatDate from "date-fns/format";
import {
  PageAnnouncement,
  Paragraph,
  SummaryList,
} from "lbh-frontend-react/components";
import { useRouter } from "next/router";
import React from "react";
import failedAttemptReasonCheckboxes from "../helpers/failedAttemptReasonCheckboxes";
import getProcessRef from "../helpers/getProcessRef";
import useDataValue from "../helpers/useDataValue";
import Storage from "../storage/Storage";

const Value: React.FunctionComponent<{
  date?: string;
  reasons?: string[];
  notes?: string;
}> = (props) => {
  const date = props.date && formatDate(new Date(props.date), "d MMMM yyyy");
  const reasons = props.reasons || [];
  const notes = props.notes;

  const reason = failedAttemptReasonCheckboxes
    .filter((checkbox) => reasons.includes(checkbox.value))
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
      {notes && (
        <span>
          <br />
          {notes}
        </span>
      )}
    </Paragraph>
  );
};

const PreviousAttemptsAnnouncement: React.FunctionComponent = () => {
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
          reasons={unableToEnter.result?.firstFailedAttempt?.value}
          notes={unableToEnter.result?.firstFailedAttempt?.notes}
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
          reasons={unableToEnter.result?.secondFailedAttempt?.value}
          notes={unableToEnter.result?.secondFailedAttempt?.notes}
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
