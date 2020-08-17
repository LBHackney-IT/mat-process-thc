import formatDate from "date-fns/format";
import {
  Paragraph,
  Textarea,
  Heading,
  HeadingLevels,
} from "lbh-frontend-react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { ReviewSection } from "../../../components/ReviewSection";
import { TenancySummary } from "../../../components/TenancySummary";
import getProcessRef from "../../../helpers/getProcessRef";
import useDataValue from "../../../helpers/useDataValue";
import useReviewSectionRows from "../../../helpers/useReviewSectionRows";
import firstFailedAttempt from "../../../steps/unable-to-enter/first-failed-attempt";
import fourthFailedAttempt from "../../../steps/unable-to-enter/fourth-failed-attempt";
import secondFailedAttempt from "../../../steps/unable-to-enter/second-failed-attempt";
import thirdFailedAttempt from "../../../steps/unable-to-enter/third-failed-attempt";
import Storage from "../../../storage/Storage";
import { ProcessStage } from "helpers/ProcessStage";
import useDatabase from "../../../helpers/useDatabase";
import MainLayout from "../../../layouts/MainLayout";
import PageTitles from "../../../steps/PageTitles";
import ManagerApprovedButton from "components/managerApprovedButton";
import { approveProcess } from "helpers/transferProcess";

const UnableToEnterManagerReviewPage: NextPage = () => {
  const router = useRouter();
  const processRef = getProcessRef(router);
  const processDatabase = useDatabase(Storage.ProcessContext);

  const managerComments = useDataValue(
    Storage.ProcessContext,
    "managerComments",
    processRef,
    (values) => (processRef ? values[processRef] : undefined)
  );

  const [managerComment, setManagerComment] = useState<string>("");

  useEffect(() => {
    if (managerComments.result !== undefined) {
      setManagerComment(managerComments.result.unableToEnterManagerReview);
    }
  }, [managerComments.result]);

  const comments = Object.assign(
    {
      managerReview: "",
      unableToEnterManagerReview: "",
    },
    managerComments.result,
    {
      unableToEnterManagerReview: managerComment,
    }
  );

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

  const submittedDate = useDataValue(
    Storage.ProcessContext,
    "submitted",
    processRef,
    (values) => (processRef ? values[processRef] : undefined)
  );

  const submittedDateValue = submittedDate.result
    ? formatDate(new Date(submittedDate.result), "d MMMM yyyy")
    : "Loading...";

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

  const allTenantNames = tenantsValue.map(({ fullName }) => fullName);

  return (
    <MainLayout
      title={PageTitles.UnableToEnterManagerReview}
      heading="Review Tenancy and Household Check"
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
      <Heading level={HeadingLevels.H2}>Declaration</Heading>
      <Paragraph>
        I confirm that the information I have given for the purposes of this
        form is true and accurate. I understand that giving false information
        may amount to fraud and would put my tenancy at risk with the result
        that I may lose my home.
      </Paragraph>
      <Paragraph>Date of submission: {submittedDateValue}</Paragraph>
      <Textarea
        name="manager-comment"
        label={{
          children: (
            <Heading level={HeadingLevels.H2}>Manager&apos;s comment</Heading>
          ),
        }}
        onChange={(textValue: string): void => setManagerComment(textValue)}
        value={managerComment}
        rows={4}
      />
      <ManagerApprovedButton
        disabled={!processRef || !processDatabase.result}
        onSubmit={async (): Promise<boolean> => {
          if (!processRef || !processDatabase.result) {
            return false;
          }

          await approveProcess(router);

          await processDatabase.result.put(
            "managerComments",
            processRef,
            comments
          );

          return true;
        }}
        status={ProcessStage.Approved}
      />

      <style jsx>{`
        .mat-tenancy-summary img {
          margin-right: 2em;
        }

        :global(.lbh-button--warning) {
          margin-left: 1em;
        }

        .signature {
          border: 2px solid #0b0c0c;
        }
      `}</style>
    </MainLayout>
  );
};

export default UnableToEnterManagerReviewPage;
