import { Button } from "lbh-frontend-react/components/Button";
import { PageAnnouncement } from "lbh-frontend-react/components/PageAnnouncement";
import {
  Heading,
  HeadingLevels,
} from "lbh-frontend-react/components/typography/Heading";
import { Paragraph } from "lbh-frontend-react/components/typography/Paragraph";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import isManager from "../../../helpers/isManager";
import MainLayout from "../../../layouts/MainLayout";
import PageTitles from "../../../steps/PageTitles";

const ConfirmedPage: NextPage = () => {
  const router = useRouter();
  const { status } = router.query;
  const isManagerPage = isManager(router);

  // TODO: Replace these with the real values!
  const address = "1 Mare Street, London, E8 3AA";
  const tenants = ["Jane Doe", "John Doe"];

  return (
    <MainLayout title={PageTitles.Confirmed}>
      <PageAnnouncement title="Process submission confirmed">
        <Paragraph>
          The Tenancy and Household Check for the tenancy at {address}, occupied
          by {tenants.join(", ")}
          {isManagerPage
            ? ` has been ${status} by you.`
            : " has been submitted for manager review."}
          {isManagerPage &&
            status === "declined" &&
            " The Housing Officer will be notified."}
        </Paragraph>
      </PageAnnouncement>

      <Heading level={HeadingLevels.H3}>What to do next?</Heading>
      {isManagerPage || (
        <Paragraph>
          <Button
            onClick={(): void => {
              location.assign(
                "https://docs.google.com/forms/d/e/1FAIpQLScDI85GMCFl8c02DYGpf_cOxsjD83FNbNFEIWKs4u_HOydhKA/viewform?usp=sf_link"
              );
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
