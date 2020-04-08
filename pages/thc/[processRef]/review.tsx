import { ReviewSection } from "components/ReviewSection";
import formatDate from "date-fns/format";
import {
  Heading,
  HeadingLevels,
  Paragraph,
  SummaryList,
} from "lbh-frontend-react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { makeSubmit } from "../../../components/makeSubmit";
import { PostVisitActionInput } from "../../../components/PostVisitActionInput";
import { HouseholdReviewSection } from "../../../components/review-sections/HouseholdReviewSection";
import { IdAndResidencyReviewSection } from "../../../components/review-sections/IdAndResidencyReviewSection";
import { PropertyInspectionReviewSection } from "../../../components/review-sections/PropertyInspectionReviewSection";
import Signature from "../../../components/Signature";
import Thumbnail from "../../../components/Thumbnail";
import getProcessRef from "../../../helpers/getProcessRef";
import useDatabase from "../../../helpers/useDatabase";
import useDataValue from "../../../helpers/useDataValue";
import useReviewSectionRows from "../../../helpers/useReviewSectionRows";
import MainLayout from "../../../layouts/MainLayout";
import PageSlugs from "../../../steps/PageSlugs";
import PageTitles from "../../../steps/PageTitles";
import wellbeingSupportSteps from "../../../steps/wellbeing-support";
import { ResidentRef } from "../../../storage/ResidentDatabaseSchema";
import Storage from "../../../storage/Storage";

const ReviewPage: NextPage = () => {
  const router = useRouter();

  const processRef = getProcessRef(router);

  const tenants = useDataValue(
    Storage.ExternalContext,
    "residents",
    processRef,
    (values) => (processRef ? values[processRef]?.tenants : undefined)
  );

  const tenantIdsPresentForCheck = useDataValue(
    Storage.ProcessContext,
    "tenantsPresent",
    processRef,
    (values) => (processRef ? values[processRef] : undefined)
  );

  const getTenantNamesFromTenantIds = (
    tenantIds: string[],
    tenants: {
      id: string;
      fullName: string;
      dateOfBirth: Date;
    }[]
  ): string[] =>
    tenants
      .filter((tenant) => tenantIds.includes(tenant.id))
      .map((tenant) => tenant.fullName);

  const tenantsPresent = getTenantNamesFromTenantIds(
    tenantIdsPresentForCheck.result ? tenantIdsPresentForCheck.result : [],
    tenants.result ? tenants.result : []
  );

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

  const residentDatabase = useDatabase(Storage.ResidentContext);
  const processDatabase = useDatabase(Storage.ProcessContext);

  // We intentionally ignore whatever's in the database. We need the tenant to
  // sign against any changes, and this is the simplest way to ensure that
  // happens.
  const [signatures, setSignatures] = useState<
    { [Ref in ResidentRef]?: string }
  >({});

  const [otherNotes, setOtherNotes] = useState([
    {
      value: "",
      isPostVisitAction: false,
    },
  ]);

  const tenantIds = tenants.result
    ? tenants.result.map((tenant) => tenant.id)
    : [];

  const tenantNames = tenants.result
    ? tenants.result.map((tenant) => tenant.fullName)
    : [];

  const [selectedTenantId, setSelectedTenantId] = useState<
    ResidentRef | undefined
  >();

  const outsidePropertyImages = useDataValue(
    Storage.ProcessContext,
    "property",
    processRef,
    (values) => (processRef ? values[processRef]?.outside : undefined)
  );

  // Long term we want an interface that allows the user to select which tenant
  // to use, but for now we stick to the first tenant in the list.
  if (selectedTenantId !== tenantIds[0]) {
    setSelectedTenantId(tenantIds[0]);
  }

  const sections = [
    {
      heading: "Wellbeing support",
      rows: [
        ...useReviewSectionRows(Storage.ProcessContext, wellbeingSupportSteps),
      ],
    },
  ];

  const SubmitButton = makeSubmit({
    slug: PageSlugs.Submit,
    value: "Save and finish process",
  });

  const outsidePropertyImageThumbnails = outsidePropertyImages.result
    ? outsidePropertyImages.result.images.map((image) => (
        <Thumbnail
          key={image}
          src={image}
          alt={"Thumbnail of an uploaded image"}
        />
      ))
    : [];

  return (
    <MainLayout
      title={PageTitles.Review}
      heading="Review Tenancy and Household Check"
      pausable
    >
      <React.Fragment>
        <SummaryList
          className="govuk-summary-list--no-border mat-tenancy-summary"
          rows={[
            {
              key: "Address",
              value: address.result ? address.result.join(", ") : "Loading...",
            },
            {
              key: "Tenants",
              value: tenantNames ? tenantNames.join(", ") : "Loading...",
            },
            {
              key: "Tenure type",
              value: tenureType.result ? tenureType.result : "Loading...",
            },
            { key: "Ouside Property:", value: outsidePropertyImageThumbnails },
          ]}
        />
        <style>{`
          .mat-tenancy-summary img {
            margin-right: 2em;
          }
        `}</style>
      </React.Fragment>
      <Paragraph>
        The Tenancy and Household Check has now been completed. Please review
        the answers with all present tenants and ask them to sign.
      </Paragraph>
      {tenantsPresent.length > 0 && (
        <Paragraph>Present for check: {tenantsPresent.join(", ")}</Paragraph>
      )}
      {selectedTenantId && (
        <IdAndResidencyReviewSection selectedTenantId={selectedTenantId} />
      )}
      <HouseholdReviewSection />
      <PropertyInspectionReviewSection />
      {sections
        .filter((section) => section.rows.length)
        .map((section) => {
          return <ReviewSection key={section.heading} section={section} />;
        })}
      <PostVisitActionInput
        value={otherNotes}
        onValueChange={(notes): void => setOtherNotes(notes)}
        required={false}
        disabled={false}
        label={{ value: "Any other notes to be added?" }}
        name="other-notes"
      />
      <Heading level={HeadingLevels.H2}>Declaration</Heading>
      <Paragraph>
        I confirm that the information I have given for the purposes of this
        form is true and accurate. I understand that giving false information
        may amount to fraud and would put my tenancy at risk with the result
        that I may lose my home.
      </Paragraph>
      <Paragraph>
        Date of visit: {formatDate(new Date(), "d MMMM yyyy")}
      </Paragraph>
      <Signature
        value={selectedTenantId && signatures[selectedTenantId]}
        onChange={(value): void => {
          if (!selectedTenantId) {
            return;
          }

          setSignatures((sigs) => ({ ...sigs, [selectedTenantId]: value }));
        }}
      />
      <SubmitButton
        disabled={
          !processRef ||
          !residentDatabase.result ||
          !selectedTenantId ||
          !processDatabase.result
        }
        onSubmit={async (): Promise<boolean> => {
          if (
            !processRef ||
            !residentDatabase.result ||
            !selectedTenantId ||
            !processDatabase.result
          ) {
            return false;
          }

          await residentDatabase.result.put(
            "signature",
            selectedTenantId,
            signatures[selectedTenantId] || ""
          );

          await processDatabase.result.put(
            "otherNotes",
            processRef,
            otherNotes
          );

          await processDatabase.result.put(
            "submitted",
            processRef,
            new Date().toISOString()
          );

          return true;
        }}
      />
    </MainLayout>
  );
};

export default ReviewPage;
