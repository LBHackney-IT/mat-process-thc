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

import getProcessApiJwt from "../helpers/getProcessApiJwt";
import getProcessRef from "../helpers/getProcessRef";
import urlsForRouter from "../helpers/urlsForRouter";
import useOnlineWithRetry from "../helpers/useOnlineWithRetry";
import MainLayout from "../layouts/MainLayout";
import PageSlugs, { urlObjectForSlug } from "../steps/PageSlugs";
import PageTitles from "../steps/PageTitles";
import { processStoreNames } from "../storage/ProcessDatabaseSchema";
import Storage from "../storage/Storage";
import tmpProcessRef from "../storage/processRef";

const submit = async (): Promise<void> => {
  if (Storage.ProcessContext && Storage.ProcessContext.database) {
    const processRef = getProcessRef();
    const processApiJwt = getProcessApiJwt(processRef);

    if (!processRef || !processApiJwt) {
      console.error(
        "Unable to persist process data due to missing session data"
      );

      return;
    }

    // The steps still use the hardcoded `processRef`, so we need to also use
    // it, even though we're using the correct value to persist to the backend.
    const processJson = await Storage.getProcessJson(tmpProcessRef);

    if (processJson) {
      const response = await fetch(
        `${process.env.BASE_PATH}api/v1/process/${processRef}/processData?jwt=${processApiJwt}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(processJson)
        }
      );

      if (!response.ok) {
        console.error(`${response.status}: ${response.statusText}`);

        return;
      }

      const db = await Storage.ProcessContext.database;

      // To reduce risk of data loss, we only clear up the data if we sent
      // something to the backend.
      db.transaction(
        processStoreNames,
        async stores => {
          await Promise.all(
            Object.values(stores).map(store => store.delete(processRef))
          );
        },
        TransactionMode.ReadWrite
      );
    }
  } else {
    console.warn("No process data to persist");
  }
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
        onClick={async (): Promise<void> => {
          try {
            await submit();

            const { href, as } = urlsForRouter(
              urlObjectForSlug(PageSlugs.Confirmed)
            );

            await Router.push(href, as);
          } catch (err) {
            console.error(err);
          }
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
