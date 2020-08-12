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
import isManager from "../../../helpers/isManager";
import MainLayout from "../../../layouts/MainLayout";
import PageTitles from "../../../steps/PageTitles";

const ConfirmedPage: NextPage = () => {
  const router = useRouter();
  const isInManagerStage = isManager(router);

  const { status } = router.query;

  const managerApprovedText = `The Tenancy and Household Check has been approved by you.`;
  const managerDeclinedText = `The Tenancy and Household Check has been declined by you. The Housing Officer will be notified.`;
  const officerText = `The Tenancy and Household Check has been submitted for manager review.`;

  const managerText = status
    ? status === "2"
      ? managerApprovedText
      : managerDeclinedText
    : "Loading...";

  return (
    <MainLayout title={PageTitles.Confirmed}>
      <PageAnnouncement
        title="Process submission confirmed"
        headingLevel={HeadingLevels.H1}
      >
        <Paragraph>{isInManagerStage ? managerText : officerText}</Paragraph>
      </PageAnnouncement>

      <Heading level={HeadingLevels.H3}>What to do next?</Heading>
      {isInManagerStage || (
        <Paragraph>
          <Button
            disabled={!process.env.DIVERSITY_FORM_URL}
            onClick={(): void => {
              if (process.env.DIVERSITY_FORM_URL) {
                window.open(process.env.DIVERSITY_FORM_URL);
              }
            }}
          >
            Go to diversity monitoring form
          </Button>
          <br />
          (online only, opens in a new tab)
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
