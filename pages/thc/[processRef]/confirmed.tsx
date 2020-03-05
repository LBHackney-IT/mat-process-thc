import { Button } from "lbh-frontend-react/components/Button";
import { PageAnnouncement } from "lbh-frontend-react/components/PageAnnouncement";
import {
  Heading,
  HeadingLevels
} from "lbh-frontend-react/components/typography/Heading";
import { Paragraph } from "lbh-frontend-react/components/typography/Paragraph";
import { NextPage } from "next";
import React from "react";
import MainLayout from "../../../layouts/MainLayout";
import PageTitles from "../../../steps/PageTitles";

const ConfirmedPage: NextPage = () => {
  const address = "1 Mare Street, London, E8 3AA";
  const tenants = ["Jane Doe", "John Doe"];

  return (
    <MainLayout title={PageTitles.Confirmed}>
      <PageAnnouncement title="Process submission confirmed">
        <Paragraph>
          The Tenancy and Household Check for the tenancy at {address}, occupied
          by {tenants.join(", ")} has been submitted for manager review.
        </Paragraph>
      </PageAnnouncement>

      <Heading level={HeadingLevels.H3}>What to do next?</Heading>
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
      <Paragraph>
        <Button>Return to my work tray</Button>
      </Paragraph>
    </MainLayout>
  );
};

export default ConfirmedPage;
