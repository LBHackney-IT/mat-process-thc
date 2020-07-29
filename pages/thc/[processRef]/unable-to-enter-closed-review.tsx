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
import useReviewSectionRows from "../../../helpers/useReviewSectionRows";
import firstFailedAttempt from "../../../steps/unable-to-enter/first-failed-attempt";
import fourthFailedAttempt from "../../../steps/unable-to-enter/fourth-failed-attempt";
import secondFailedAttempt from "../../../steps/unable-to-enter/second-failed-attempt";
import thirdFailedAttempt from "../../../steps/unable-to-enter/third-failed-attempt";
import Storage from "../../../storage/Storage";
import MainLayout from "../../../layouts/MainLayout";
import PageTitles from "../../../steps/PageTitles";
import { makeSubmit } from "../../../components/makeSubmit";
import PageSlugs from "../../../steps/PageSlugs";
import useDataValue from "../../../helpers/useDataValue";
import Thumbnail from "../../../components/Thumbnail";
import useDatabase from "helpers/useDatabase";
import isManager from "helpers/isManager";

const UnableToEnterClosedReviewPage: NextPage = () => {
  const router = useRouter();
  const processRef = getProcessRef(router);
  const processDatabase = useDatabase(Storage.ProcessContext);
  const isInManagerStage = isManager(router);

  const managerComment = useDataValue(
    Storage.ProcessContext,
    "managerComment",
    processRef,
    (values) => (processRef ? values[processRef] : undefined)
  );

  const [managerCommentState, setManagerCommentState] = useState("");
  useEffect(() => {
    if (managerComment.result !== undefined) {
      setManagerCommentState(managerComment.result);
    }
  }, [managerComment.result]);

  const tenants = useDataValue(
    Storage.ExternalContext,
    "residents",
    processRef,
    (values) => (processRef ? values[processRef]?.tenants : undefined)
  );

  const tenantsValue = tenants.result || [];

  const tenantIdsPresentForCheck = useDataValue(
    Storage.ProcessContext,
    "tenantsPresent",
    processRef,
    (values) => (processRef ? values[processRef] : undefined)
  );
  const tenantIdsPresentForCheckValue = tenantIdsPresentForCheck.result || [];

  const address = useDataValue(
    Storage.ExternalContext,
    "residents",
    processRef,
    (values) => (processRef ? values[processRef]?.address : undefined)
  );

  const allTenantNames = tenantsValue.map(({ fullName }) => fullName);

  const officerFullName = useDataValue(
    Storage.ExternalContext,
    "officer",
    processRef,
    (values) => (processRef ? values[processRef]?.fullName : undefined)
  );
  const officerFullNameValue = officerFullName.result || "Loading...";

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

  const tenantsPresent = tenantsValue.filter((tenant) =>
    tenantIdsPresentForCheckValue.includes(tenant.id)
  );
  const presentTenantNames = tenantsPresent.map(({ fullName }) => fullName);
  const outsidePropertyImages = useDataValue(
    Storage.ProcessContext,
    "property",
    processRef,
    (values) => (processRef ? values[processRef]?.outside : undefined)
  );
  const outsidePropertyImageThumbnails = outsidePropertyImages.result
    ? outsidePropertyImages.result.images.map((image) => (
        <Thumbnail
          key={image}
          src={image}
          alt={"Thumbnail of an uploaded image"}
        />
      ))
    : [];
  const extraRows = [
    { key: "Outside property", value: outsidePropertyImageThumbnails },
    { key: "Completed by", value: officerFullNameValue },
    { key: "Date completed", value: submittedDateValue },
    {
      key: "Present for check",
      value:
        presentTenantNames.length > 0
          ? presentTenantNames.join(", ")
          : "Loading...",
    },
  ].filter(({ value }) => value.length > 0);

  const SubmitButton = makeSubmit({
    slug: PageSlugs.Pause,
    value: "Exit process",
  });

  return (
    <MainLayout
      title={PageTitles.UnableToEnterClosedReview}
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
          extraRows={extraRows}
        />
      </React.Fragment>

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
      {isInManagerStage && (
        <Textarea
          name="manager-comment"
          label={{
            children: (
              <Heading level={HeadingLevels.H2}>Manager&apos;s comment</Heading>
            ),
          }}
          value={managerCommentState}
          rows={4}
          onChange={(value): void => setManagerCommentState(value)}
        />
      )}
      <SubmitButton
        onSubmit={async (): Promise<boolean> => {
          if (!processRef || !processDatabase.result) {
            return false;
          }

          if (isInManagerStage) {
            // FIXME: This will overwrite the existing "managerComment" if there is one
            await processDatabase.result.put(
              "managerComment",
              processRef,
              managerCommentState
            );
          }

          await processDatabase.result.put(
            "submitted",
            processRef,
            new Date().toISOString()
          );

          return true;
        }}
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

export default UnableToEnterClosedReviewPage;
