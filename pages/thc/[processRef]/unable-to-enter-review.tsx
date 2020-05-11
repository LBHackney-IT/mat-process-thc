import formatDate from "date-fns/format";
import { Paragraph, Textarea } from "lbh-frontend-react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { TransactionMode } from "remultiform/database";
import { makeSubmit } from "../../../components/makeSubmit";
import { ReviewSection } from "../../../components/ReviewSection";
import { TenancySummary } from "../../../components/TenancySummary";
import getProcessRef from "../../../helpers/getProcessRef";
import useDatabase from "../../../helpers/useDatabase";
import useDataValue from "../../../helpers/useDataValue";
import useReviewSectionRows from "../../../helpers/useReviewSectionRows";
import MainLayout from "../../../layouts/MainLayout";
import PageSlugs from "../../../steps/PageSlugs";
import PageTitles from "../../../steps/PageTitles";
import firstFailedAttempt from "../../../steps/unable-to-enter/first-failed-attempt";
import fourthFailedAttempt from "../../../steps/unable-to-enter/fourth-failed-attempt";
import secondFailedAttempt from "../../../steps/unable-to-enter/second-failed-attempt";
import thirdFailedAttempt from "../../../steps/unable-to-enter/third-failed-attempt";
import ProcessDatabaseSchema from "../../../storage/ProcessDatabaseSchema";
import Storage from "../../../storage/Storage";

const UnableToEnterReviewPage: NextPage = () => {
  const router = useRouter();

  const processRef = getProcessRef(router);

  const tenants = useDataValue(
    Storage.ExternalContext,
    "residents",
    processRef,
    (values) => (processRef ? values[processRef]?.tenants : undefined)
  );

  const tenantsValue = tenants.result || [];

  const address = useDataValue(
    Storage.ExternalContext,
    "residents",
    processRef,
    (values) => (processRef ? values[processRef]?.address : undefined)
  );

  const tenureType = useDataValue(
    Storage.ExternalContext,
    "tenancy",
    processRef,
    (values) => (processRef ? values[processRef]?.tenureType : undefined)
  );

  const tenancyStartDate = useDataValue(
    Storage.ExternalContext,
    "tenancy",
    processRef,
    (values) => (processRef ? values[processRef]?.startDate : undefined)
  );

  const failedAttempts = useDataValue(
    Storage.ProcessContext,
    "unableToEnter",
    processRef,
    (values) => (processRef ? values[processRef] : undefined)
  );

  const formatDateWithTime = (date: string): string => {
    return formatDate(new Date(date), "HH:mm 'on' d MMMM yyyy");
  };

  const firstFailedAttemptDate = failedAttempts.result
    ? formatDateWithTime(failedAttempts.result.firstFailedAttempt.date)
    : "Loading...";
  const secondFailedAttemptDate = failedAttempts.result
    ? formatDateWithTime(failedAttempts.result.secondFailedAttempt.date)
    : "Loading...";
  const thirdFailedAttemptDate = failedAttempts.result
    ? formatDateWithTime(failedAttempts.result.thirdFailedAttempt.date)
    : "Loading...";
  const fourthFailedAttemptDate = failedAttempts.result
    ? formatDateWithTime(failedAttempts.result.fourthFailedAttempt.date)
    : "Loading...";

  const firstFailedAttemptReviewSection = useReviewSectionRows(
    Storage.ProcessContext,
    [firstFailedAttempt],
    true
  );

  const secondFailedAttemptReviewSection = useReviewSectionRows(
    Storage.ProcessContext,
    [secondFailedAttempt],
    true
  );

  const thirdFailedAttemptReviewSection = useReviewSectionRows(
    Storage.ProcessContext,
    [thirdFailedAttempt],
    true
  );

  const fourthFailedAttemptReviewSection = useReviewSectionRows(
    Storage.ProcessContext,
    [fourthFailedAttempt],
    true
  );

  const processDatabase = useDatabase(Storage.ProcessContext);

  const [otherNotes, setOtherNotes] = useState("");

  const allTenantNames = tenantsValue.map(({ fullName }) => fullName);

  const SubmitButton = makeSubmit({
    slug: PageSlugs.Submit,
    value: "Save and finish process",
  });

  return (
    <MainLayout
      title={PageTitles.UnableToEnterReview}
      heading="Submit Tenancy and Household Check"
    >
      <React.Fragment>
        <TenancySummary
          details={{
            address: address.result,
            tenants: allTenantNames,
            tenureType: tenureType.result,
            startDate: tenancyStartDate.result,
          }}
        />
      </React.Fragment>
      <Paragraph>
        Four attempts have been made to do a Tenancy and Household Check. The
        actions taken at each attempt have been recorded.
      </Paragraph>
      <ReviewSection
        heading={`First failed attempt: ${firstFailedAttemptDate}`}
        loading={firstFailedAttemptReviewSection.loading}
        rows={firstFailedAttemptReviewSection.result}
      />
      <ReviewSection
        heading={`Second failed attempt: ${secondFailedAttemptDate}`}
        loading={secondFailedAttemptReviewSection.loading}
        rows={secondFailedAttemptReviewSection.result}
      />
      <ReviewSection
        heading={`Third failed attempt: ${thirdFailedAttemptDate}`}
        loading={thirdFailedAttemptReviewSection.loading}
        rows={thirdFailedAttemptReviewSection.result}
      />
      <ReviewSection
        heading={`Fourth failed attempt: ${fourthFailedAttemptDate}`}
        loading={fourthFailedAttemptReviewSection.loading}
        rows={fourthFailedAttemptReviewSection.result}
      />
      <Textarea
        name="other-notes"
        label={{
          children: "Add any additional notes if necessary.",
        }}
        onChange={(textValue: string): void => setOtherNotes(textValue)}
        value={otherNotes}
        rows={4}
      />

      <SubmitButton
        disabled={!processRef || !processDatabase.result}
        onSubmit={async (): Promise<boolean> => {
          if (!processRef || !processDatabase.result) {
            return false;
          }

          await processDatabase.result.transaction(
            ["unableToEnter"],
            async (stores) => {
              const unableToEnter =
                (await stores.unableToEnter.get(processRef)) ||
                ({} as ProcessDatabaseSchema["schema"]["unableToEnter"]["value"]);

              await stores.unableToEnter.put(processRef, {
                ...unableToEnter,
                otherNotes,
              });
            },
            TransactionMode.ReadWrite
          );

          return true;
        }}
      />
    </MainLayout>
  );
};

export default UnableToEnterReviewPage;
