import formatDate from "date-fns/format";
import { PageAnnouncement, SummaryList } from "lbh-frontend-react/components";
import { useRouter } from "next/router";
import React from "react";
import failedAttemptReasonCheckboxes from "../helpers/failedAttemptReasonCheckboxes";
import getProcessRef from "../helpers/getProcessRef";
import useDataValue from "../helpers/useDataValue";
import Storage from "../storage/Storage";

const PreviousAttemptsAnnouncement: React.FunctionComponent = () => {
  const router = useRouter();
  const processRef = getProcessRef(router);

  const firstFailedAttempt = useDataValue(
    Storage.ProcessContext,
    "unableToEnter",
    processRef,
    (values) =>
      processRef ? values[processRef]?.firstFailedAttempt : undefined
  );

  const firstDate =
    firstFailedAttempt.result?.date &&
    formatDate(new Date(firstFailedAttempt.result?.date), "d MMMM yyyy");
  const firstValue = firstFailedAttempt.result?.value || [];
  const firstNotes = firstFailedAttempt.result?.notes;

  const firstReasons = failedAttemptReasonCheckboxes
    .filter((checkbox) => firstValue.includes(checkbox.value))
    .map((checkbox) => checkbox.label)
    .join(", ");

  return (
    <PageAnnouncement title="Previous attempts">
      <SummaryList
        rows={[
          {
            key: "First attempt",
            value: firstFailedAttempt.loading ? (
              "Loading..."
            ) : (
              <>
                {firstDate}: {firstReasons}
                {firstNotes === undefined || (
                  <>
                    <br />
                    {firstNotes}
                  </>
                )}
              </>
            ),
          },
        ]}
      />
    </PageAnnouncement>
  );
};

export default PreviousAttemptsAnnouncement;
