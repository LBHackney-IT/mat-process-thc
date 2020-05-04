import formatDate from "date-fns/format";
import { Heading, HeadingLevels, Paragraph } from "lbh-frontend-react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { TransactionMode } from "remultiform/database";
import { makeSubmit } from "../../../components/makeSubmit";
import { PostVisitActionInput } from "../../../components/PostVisitActionInput";
import { HouseholdReviewSection } from "../../../components/review-sections/HouseholdReviewSection";
import { IdAndResidencyReviewSection } from "../../../components/review-sections/IdAndResidencyReviewSection";
import { PropertyInspectionReviewSection } from "../../../components/review-sections/PropertyInspectionReviewSection";
import { WellbeingSupportReviewSection } from "../../../components/review-sections/WellbeingSupportReviewSection";
import Signature from "../../../components/Signature";
import { TenancySummary } from "../../../components/TenancySummary";
import Thumbnail from "../../../components/Thumbnail";
import getProcessRef from "../../../helpers/getProcessRef";
import useDatabase from "../../../helpers/useDatabase";
import useDataValue from "../../../helpers/useDataValue";
import MainLayout from "../../../layouts/MainLayout";
import PageSlugs from "../../../steps/PageSlugs";
import PageTitles from "../../../steps/PageTitles";
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

  const allTenantNames = tenantsValue.map(({ fullName }) => fullName);

  const tenantsPresent = tenantsValue.filter((tenant) =>
    tenantIdsPresentForCheckValue.includes(tenant.id)
  );
  const presentTenantIds = tenantsPresent.map(({ id }) => id);

  const outsidePropertyImages = useDataValue(
    Storage.ProcessContext,
    "property",
    processRef,
    (values) => (processRef ? values[processRef]?.outside : undefined)
  );

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

  const extraRows = [
    { key: "Outside property", value: outsidePropertyImageThumbnails },
  ].filter(({ value }) => value.length > 0);

  return (
    <MainLayout
      title={PageTitles.Review}
      heading="Review Tenancy and Household Check"
      pausable
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
      <IdAndResidencyReviewSection tenants={tenantsWithPresentStatus} />
      <HouseholdReviewSection />
      <PropertyInspectionReviewSection />
      <WellbeingSupportReviewSection />
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
      {tenantsPresent.map(({ fullName, id }) => (
        <React.Fragment key={id}>
          <Heading level={HeadingLevels.H3}>{fullName}</Heading>
          <Signature
            value={id && signatures[id]}
            onChange={(value): void => {
              if (!id) {
                return;
              }

              setSignatures((sigs) => ({ ...sigs, [id]: value }));
            }}
          />
        </React.Fragment>
      ))}
      <SubmitButton
        disabled={
          !processRef || !residentDatabase.result || !processDatabase.result
        }
        onSubmit={async (): Promise<boolean> => {
          if (
            !processRef ||
            !residentDatabase.result ||
            !processDatabase.result
          ) {
            return false;
          }

          for (const tenantId of presentTenantIds) {
            await residentDatabase.result.put(
              "signature",
              tenantId,
              signatures[tenantId] || ""
            );
          }

          await processDatabase.result.transaction(
            ["other"],
            async (stores) => {
              const otherValue = await stores.other.get(processRef);

              await stores.other.put(processRef, {
                ...otherValue,
                notes: otherNotes,
              });
            },
            TransactionMode.ReadWrite
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
