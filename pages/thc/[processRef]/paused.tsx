import { Button } from "lbh-frontend-react/components/Button";
import { PageAnnouncement } from "lbh-frontend-react/components/PageAnnouncement";
import { Paragraph } from "lbh-frontend-react/components/typography/Paragraph";
import { NextPage } from "next";
import React from "react";
import MainLayout from "../../../layouts/MainLayout";
import PageTitles from "../../../steps/PageTitles";

const PausedPage: NextPage = () => {
  return (
    <MainLayout title={PageTitles.Paused}>
      <PageAnnouncement title="Process paused">
        <Paragraph>
          The Tenancy and Household Check has been paused and saved to your work
          tray ready to continue later.
        </Paragraph>
      </PageAnnouncement>

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

export default PausedPage;
