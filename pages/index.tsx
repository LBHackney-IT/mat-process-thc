import "cross-fetch/polyfill";

import isOnline from "is-online";
import {
  Button,
  List,
  Heading,
  HeadingLevels,
  Paragraph
} from "lbh-frontend-react/components";
import { NextPage } from "next";
import Link from "next/link";
import React from "react";
import { useAsync } from "react-async-hook";

import useApi from "../api/useApi";
import { TenancySummary } from "../components/TenancySummary";
import MainLayout from "../layouts/MainLayout";
import processRef from "../storage/processRef";
import Storage from "../storage/Storage";

export const IndexPage: NextPage = () => {
  // We need this to keep retrying itself until it's online (and even after
  // that in case we go back offline).
  const online = useAsync(async () => isOnline(), []);

  const processData = useApi({
    url: `${process.env.PROCESS_API_URL}/v1/processData/${processRef}`
  });

  const offlineDataStatus = useAsync(
    async (data: typeof processData.result) => {
      if (!data) {
        return;
      }

      if (!data.processData) {
        return false;
      }

      return Storage.updateData(processRef, data.processData);
    },
    [processData.result]
  );

  const loading =
    online.loading || processData.loading || offlineDataStatus.loading;
  const errored =
    !loading &&
    (Boolean(online.error) ||
      (online.result &&
        (Boolean(processData.error) || Boolean(offlineDataStatus.error))));
  const ready =
    !loading &&
    !errored &&
    online.result &&
    processData.result &&
    offlineDataStatus.result !== undefined;

  if (online.error) {
    // We should give the user some way to recover from this. Perhaps we should
    // retry in this case and dedupe the error?
    console.error(online.error);
  }

  if (processData.error) {
    // We should give the user some way to recover from this. Perhaps we should
    // retry in this case and dedupe the error?
    console.error(processData.error);
  }

  if (offlineDataStatus.error) {
    // We should give the user some way to recover from this. Perhaps we should
    // retry in this case and dedupe the error?
    console.error(offlineDataStatus.error);
  }

  let content: React.ReactElement;

  if (online.loading) {
    content = (
      <Paragraph>
        We are currently checking your online status. Please wait...
      </Paragraph>
    );
  } else if (online.result) {
    content = (
      <>
        {!processData.loading && processData.result ? (
          <TenancySummary
            address="1 Mare Street, London, E8 3AA"
            tenants={["Jane Doe", "John Doe"]}
            tenureType="Introductory"
            startDate="1 January 2019"
          />
        ) : (
          <TenancySummary />
        )}

        <Heading level={HeadingLevels.H2}>Previsit setup</Heading>
        <Paragraph>
          The system is currently updating the information you need for this
          process so that you can work offline or online.
        </Paragraph>
        <Paragraph>
          Please wait until the &lsquo;Go&rsquo; button is available to be
          clicked before proceeding.
        </Paragraph>
      </>
    );
  } else {
    content = (
      <Paragraph>You are offline. Please go online to continue.</Paragraph>
    );
  }

  const progressItems = [
    `Answers saved to the Hub... ${
      processData.loading
        ? "Loading"
        : processData.error
        ? "Error"
        : processData.result
        ? "Loaded"
        : "N/A"
    }`
  ] as React.ReactNode[];

  if (processData.result) {
    progressItems.push(
      `Offline storage... ${
        offlineDataStatus.loading
          ? "Updating"
          : offlineDataStatus.error
          ? "Error"
          : offlineDataStatus.result
          ? "Updated"
          : "More recent than the Hub"
      }`
    );
  }

  return (
    <MainLayout title="Start">
      <Heading level={HeadingLevels.H1}>Tenancy and Household Check</Heading>

      {content}

      {!online.loading && online.result && <List items={progressItems} />}

      {errored && (
        <Paragraph>
          Something went really wrong. Please contact support.
        </Paragraph>
      )}

      {!online.loading && online.result ? (
        <Link href="/attempt-visit">
          <Button disabled={!ready} data-testid="submit">
            {ready ? "Go" : "Loading..."}
          </Button>
        </Link>
      ) : (
        <Button
          onClick={async (): Promise<void> => {
            await online.execute();
          }}
        >
          Check again
        </Button>
      )}
    </MainLayout>
  );
};

export default IndexPage;
