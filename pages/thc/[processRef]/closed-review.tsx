import formatDate from "date-fns/format";
import {
  Heading,
  HeadingLevels,
  Paragraph,
  PageAnnouncement,
  Button,
} from "lbh-frontend-react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { Notes } from "storage/DatabaseSchema";
import { HouseholdReviewSection } from "../../../components/review-sections/HouseholdReviewSection";
import { IdAndResidencyReviewSection } from "../../../components/review-sections/IdAndResidencyReviewSection";
import { PropertyInspectionReviewSection } from "../../../components/review-sections/PropertyInspectionReviewSection";
import { WellbeingSupportReviewSection } from "../../../components/review-sections/WellbeingSupportReviewSection";
import { TenancySummary } from "../../../components/TenancySummary";
import Thumbnail from "../../../components/Thumbnail";
import getProcessRef from "../../../helpers/getProcessRef";
import useDataSet from "../../../helpers/useDataSet";
import useDataValue from "../../../helpers/useDataValue";
import MainLayout from "../../../layouts/MainLayout";
import PageTitles from "../../../steps/PageTitles";
import Storage from "../../../storage/Storage";

const getSummaryText = (
  yesValue: string,
  noValue: string,
  databaseValue: { value: string; notes: Notes }
): string => {
  if (databaseValue.value === "yes") {
    return yesValue;
  } else {
    return databaseValue.notes.length > 0
      ? `${noValue}. Note: ${databaseValue.notes[0].value}`
      : `${noValue}`;
  }
};

const ReviewPage: NextPage = () => {
  const router = useRouter();
  const processRef = getProcessRef(router);

  const managerComments = useDataValue(
    Storage.ProcessContext,
    "managerComments",
    processRef,
    (values) => (processRef ? values[processRef] : undefined)
  );

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

  const tenantsWithPresentStatus = tenantsValue.map((tenant) => ({
    ...tenant,
    present: tenantIdsPresentForCheckValue.includes(tenant.id),
  }));

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

  const officerFullName = useDataValue(
    Storage.ExternalContext,
    "officer",
    processRef,
    (values) => (processRef ? values[processRef]?.fullName : undefined)
  );

  const officerFullNameValue = officerFullName.result || "Loading...";

  const submittedDate = useDataValue(
    Storage.ProcessContext,
    "submitted",
    processRef,
    (values) => (processRef ? values[processRef] : undefined)
  );

  const submittedDateValue = submittedDate.result
    ? formatDate(new Date(submittedDate.result), "d MMMM yyyy")
    : "Loading...";

  const isUnannouncedVisit = useDataValue(
    Storage.ProcessContext,
    "isUnannouncedVisit",
    processRef,
    (values) => (processRef ? values[processRef] : undefined)
  );

  const visitType = isUnannouncedVisit.result
    ? getSummaryText("Unannounced", "Announced", isUnannouncedVisit.result)
    : "Loading...";

  const isVisitInside = useDataValue(
    Storage.ProcessContext,
    "isVisitInside",
    processRef,
    (values) => (processRef ? values[processRef] : undefined)
  );

  const visitTookPlace = isVisitInside.result
    ? getSummaryText("Inside", "Outside", isVisitInside.result)
    : "Loading...";

  const otherNotes = useDataValue(
    Storage.ProcessContext,
    "other",
    processRef,
    (values) => (processRef && values[processRef]?.notes) || []
  );

  const otherNotesValues = otherNotes.result
    ? otherNotes.result.map(({ value }) => value)
    : [];

  const signatures = useDataSet(
    Storage.ResidentContext,
    "signature",
    tenantIdsPresentForCheckValue
  );

  const signatureValues = signatures.result ? signatures.result : {};

  const allTenantNames = tenantsValue.map(({ fullName }) => fullName);

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
    { key: "The visit was", value: visitType },
    { key: "The visit took place", value: visitTookPlace },
    {
      key: "Present for check",
      value:
        presentTenantNames.length > 0
          ? presentTenantNames.join(", ")
          : "Loading...",
    },
  ].filter(({ value }) => value.length > 0);

  return (
    <MainLayout
      title={PageTitles.ClosedReview}
      heading="Review Tenancy and Household Check"
    >
      <TenancySummary
        details={{
          address: address.result,
          tenants: allTenantNames,
          tenureType: tenureType.result,
          startDate: tenancyStartDate.result,
        }}
        extraRows={extraRows}
      />

      {managerComments.result?.managerReview && (
        <PageAnnouncement title="Manager comment">
          {managerComments.result?.managerReview}
        </PageAnnouncement>
      )}

      <IdAndResidencyReviewSection
        tenants={tenantsWithPresentStatus}
        readOnly
      />
      <HouseholdReviewSection readOnly />
      <PropertyInspectionReviewSection readOnly />
      <WellbeingSupportReviewSection readOnly />
      {otherNotesValues.length > 0 && (
        <>
          <Heading level={HeadingLevels.H2}>Other Notes</Heading>
          {otherNotesValues.map((note, index) => (
            <Paragraph key={index}>{note}</Paragraph>
          ))}
        </>
      )}
      <Heading level={HeadingLevels.H2}>Declaration</Heading>
      <Paragraph>
        I confirm that the information I have given for the purposes of this
        form is true and accurate. I understand that giving false information
        may amount to fraud and would put my tenancy at risk with the result
        that I may lose my home.
      </Paragraph>
      <Paragraph>Date of submission: {submittedDateValue}</Paragraph>
      {tenantsPresent.map(
        ({ fullName, id }) =>
          signatureValues[id] && (
            <React.Fragment key={id}>
              <Heading level={HeadingLevels.H3}>{fullName}</Heading>
              <img
                className="signature"
                src={signatureValues[id]}
                alt={`${fullName}'s signature`}
              />
            </React.Fragment>
          )
      )}
      <Button
        onClick={(): void => {
          if (process.env.WORKTRAY_URL) {
            location.assign(process.env.WORKTRAY_URL);
          }
        }}
      >
        Exit process
      </Button>
      <style jsx>{`
        .mat-tenancy-summary img {
          margin-right: 2em;
        }

        .signature {
          border: 2px solid #0b0c0c;
        }
      `}</style>
    </MainLayout>
  );
};

export default ReviewPage;
