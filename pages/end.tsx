import { Button } from "lbh-frontend-react/components/Button";
import { PageAnnouncement } from "lbh-frontend-react/components/PageAnnouncement";
import {
  Heading,
  HeadingLevels
} from "lbh-frontend-react/components/typography/Heading";
import { Paragraph } from "lbh-frontend-react/components/typography/Paragraph";
import { NextPage } from "next";
import React from "react";

import MainLayout from "../layouts/MainLayout";

const EndPage: NextPage = () => {
  const address = "1 Mare Street, London, E8 3AA";
  const tenants = ["Jane Doe", "John Doe"];

  return (
    <MainLayout title="Complete">
      <PageAnnouncement title="Process submission confirmed">
        <Paragraph>
          The Tenancy and Household Check for the tenancy at {address}, occupied
          by {tenants.join(", ")} has been submitted for manager review.
        </Paragraph>
      </PageAnnouncement>

      <Heading level={HeadingLevels.H3}>What to do next?</Heading>
      <Paragraph>
        <Button>Go to diversity monitoring form</Button>
      </Paragraph>
      <Paragraph>
        <Button>Return to my work tray</Button>
      </Paragraph>
    </MainLayout>
  );
};

export default EndPage;
