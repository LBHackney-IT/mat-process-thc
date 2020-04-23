import {
  Button,
  Heading,
  HeadingLevels,
  PageAnnouncement,
  Paragraph,
} from "lbh-frontend-react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import getProcessRef from "../../../helpers/getProcessRef";
import isManager from "../../../helpers/isManager";
import useDataValue from "../../../helpers/useDataValue";
import MainLayout from "../../../layouts/MainLayout";
import PageTitles from "../../../steps/PageTitles";
import Storage from "../../../storage/Storage";

const ConfirmedPage: NextPage = () => {
  const router = useRouter();
  const processRef = getProcessRef(router);
  const isManagerPage = isManager(router);

  const { status } = router.query;

  const residentData = useDataValue(
    Storage.ExternalContext,
    "residents",
    processRef,
    (values) => (processRef ? values[processRef] : undefined)
  );

  const address = residentData.result?.address.join(", ");
  const tenants = (residentData.result?.tenants || [])
    .map((tenant) => tenant.fullName)
    .join(", ");

  const managerApprovedText = `The Tenancy and Household Check for the tenancy at ${address}, occupied by ${tenants} has been approved by you.`;
  const managerDeclinedText = `The Tenancy and Household Check for the tenancy at ${address}, occupied by ${tenants} has been declined by you. The Housing Officer will be notified.`;
  const officerText = `The Tenancy and Household Check for the tenancy at ${address}, occupied by ${tenants} has been submitted for manager review.`;

  const managerText = status
    ? status === "2"
      ? managerApprovedText
      : managerDeclinedText
    : "Loading...";

  return (
    <MainLayout title={PageTitles.Confirmed}>
      <PageAnnouncement title="Process submission confirmed">
        {residentData.loading ? (
          "Loading..."
        ) : (
          <Paragraph>{isManagerPage ? managerText : officerText}</Paragraph>
        )}
      </PageAnnouncement>

      <Heading level={HeadingLevels.H3}>What to do next?</Heading>
      {isManagerPage || (
        <Paragraph>
          <Button
            disabled={!process.env.DIVERSITY_FORM_URL}
            onClick={(): void => {
              if (process.env.DIVERSITY_FORM_URL) {
                location.assign(process.env.DIVERSITY_FORM_URL);
              }
            }}
          >
            Go to diversity monitoring form
          </Button>
        </Paragraph>
      )}
      <Paragraph>
        <Button
          disabled={!process.env.WORKTRAY_URL}
          onClick={(): void => {
            if (process.env.WORKTRAY_URL) {
              location.assign(process.env.WORKTRAY_URL);
            }
          }}
        >
          Return to my work tray
        </Button>
      </Paragraph>
    </MainLayout>
  );
};

export default ConfirmedPage;
