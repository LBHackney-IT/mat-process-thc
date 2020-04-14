import { Button } from "lbh-frontend-react/components/Button";
import { PageAnnouncement } from "lbh-frontend-react/components/PageAnnouncement";
import { Paragraph } from "lbh-frontend-react/components/typography/Paragraph";
import { NextPage } from "next";
import React from "react";
import MainLayout from "../../../layouts/MainLayout";
import PageTitles from "../../../steps/PageTitles";

const PausedPage: NextPage = () => {
  // TODO: Replace these with the real values!
  const address = "1 Mare Street, London, E8 3AA";
  const tenants = ["Jane Doe", "John Doe"];

  return (
    <MainLayout title={PageTitles.Paused}>
      <PageAnnouncement title="Process paused">
        <Paragraph>
          The Tenancy and Household Check for the tenancy at {address}, occupied
          by {tenants.join(", ")} has been paused and saved to your work tray
          ready to continue later.
        </Paragraph>
      </PageAnnouncement>

      <Paragraph>
        <Button>Return to my work tray</Button>
      </Paragraph>
    </MainLayout>
  );
};

export default PausedPage;
