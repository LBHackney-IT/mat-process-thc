import { Button } from "lbh-frontend-react/components/Button";
import { PageAnnouncement } from "lbh-frontend-react/components/PageAnnouncement";
import { Paragraph } from "lbh-frontend-react/components/typography/Paragraph";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import getProcessRef from "../../../helpers/getProcessRef";
import useDataValue from "../../../helpers/useDataValue";
import MainLayout from "../../../layouts/MainLayout";
import PageTitles from "../../../steps/PageTitles";
import Storage from "../../../storage/Storage";

const PausedPage: NextPage = () => {
  const router = useRouter();
  const processRef = getProcessRef(router);

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

  return (
    <MainLayout title={PageTitles.Paused}>
      <PageAnnouncement title="Process paused">
        {residentData.loading ? (
          "Loading..."
        ) : (
          <Paragraph>
            The Tenancy and Household Check for the tenancy at {address},
            occupied by {tenants} has been paused and saved to your work tray
            ready to continue later.
          </Paragraph>
        )}
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
