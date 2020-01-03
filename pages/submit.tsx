import "cross-fetch/polyfill";

import { Button } from "lbh-frontend-react/components/Button/Button";
import { ErrorMessage } from "lbh-frontend-react/components/ErrorMessage";
import { PageAnnouncement } from "lbh-frontend-react/components/PageAnnouncement";
import { Paragraph } from "lbh-frontend-react/components/typography/Paragraph";
import { NextPage } from "next";
import Router from "next/router";
import React from "react";
import { TransactionMode } from "remultiform/database";

import useOnlineWithRetry from "../helpers/useOnlineWithRetry";
import MainLayout from "../layouts/MainLayout";
import { processStoreNames } from "../storage/DatabaseSchema";
import Storage from "../storage/Storage";
import processRef from "../storage/processRef";

const SubmitPage: NextPage = () => {
  const online = useOnlineWithRetry();

  const address = "1 Mare Street, London, E8 3AA";
  const tenants = ["Jane Doe", "John Doe"];

  let content: React.ReactElement;

  if (online.loading) {
    content = (
      <Paragraph>
        We are currently checking your online status. Please wait...
      </Paragraph>
    );
  } else {
    content = (
      <PageAnnouncement title="Process submission pending">
        <Paragraph>
          {online.result
            ? "You are online."
            : "You are currently working offline."}
        </Paragraph>
        <Paragraph>
          The Tenancy and Household Check for the tenancy at {address}, occupied
          by {tenants.join(", ")} has been saved to your device ready to be sent
          to your manager for review.
        </Paragraph>
        <Paragraph>
          <strong>You need to be online on this device to continue.</strong>
        </Paragraph>
        <Paragraph>
          If you can&apos;t go online now, when you are next online on this
          device, please come back to this Tenancy and Household Check from your
          work tray and click on the &lsquo;Save and submit to manager&rsquo;
          button below that will become able to be clicked.
        </Paragraph>
        {!online.error && online.result && (
          <Paragraph>
            <strong>You are online</strong>, and can submit this Tenancy and
            Household Check to your manager now.
          </Paragraph>
        )}
      </PageAnnouncement>
    );
  }

  const disabled = online.loading || Boolean(online.error) || !online.result;

  return (
    <MainLayout title="Submit">
      {online.error && (
        <ErrorMessage>
          Something went wrong while checking whether you are online or not.
        </ErrorMessage>
      )}

      {content}

      <Button
        disabled={disabled}
        preventDoubleClick={true}
        onClick={async (): Promise<void> => {
          if (Storage.Context && Storage.Context.database) {
            const database = await Storage.Context.database;

            // We should push to the API before doing this, or data will be
            // lost.
            database.transaction(
              processStoreNames,
              async stores => {
                await Promise.all(
                  Object.values(stores).map(store => store.delete(processRef))
                );
              },
              TransactionMode.ReadWrite
            );
          }

          await Router.push("/end");
        }}
        data-testid="submit"
      >
        {disabled
          ? "Waiting for connectivity..."
          : "Save and submit to manager"}
      </Button>
    </MainLayout>
  );
};

export default SubmitPage;
