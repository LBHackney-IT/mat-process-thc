import {
  Button,
  ErrorMessage,
  PageAnnouncement,
  Paragraph
} from "lbh-frontend-react";
import { NextPage } from "next";
import Router from "next/router";
import React from "react";
import { TransactionMode } from "remultiform/database";

import urlsForRouter from "../helpers/urlsForRouter";
import useOnlineWithRetry from "../helpers/useOnlineWithRetry";
import MainLayout from "../layouts/MainLayout";
import PageSlugs, { urlObjectForSlug } from "../steps/PageSlugs";
import PageTitles from "../steps/PageTitles";
import { processStoreNames } from "../storage/ProcessDatabaseSchema";
import Storage from "../storage/Storage";
import getProcessRef from "../helpers/getProcessRef";

const submit = async (): Promise<void> => {
  if (Storage.ProcessContext && Storage.ProcessContext.database) {
    const database = await Storage.ProcessContext.database;

    // We should push to the API before doing this, or data will be
    // lost.
    database.transaction(
      processStoreNames,
      async stores => {
        const processRef: string | undefined = getProcessRef();

        if (processRef) {
          await Promise.all(
            Object.values(stores).map(store => store.delete(processRef))
          );
        }
      },
      TransactionMode.ReadWrite
    );
  }

  const { href, as } = urlsForRouter(urlObjectForSlug(PageSlugs.Confirmed));

  await Router.push(href, as);
};

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
    <MainLayout title={PageTitles.Submit}>
      {online.error && (
        <ErrorMessage>
          Something went wrong while checking whether you are online or not.
        </ErrorMessage>
      )}

      {content}

      <Button
        disabled={disabled}
        preventDoubleClick={true}
        onClick={submit}
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
