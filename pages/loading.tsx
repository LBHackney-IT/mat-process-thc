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

import useProcessApi from "../api/useProcessApi";
import { TenancySummary } from "../components/TenancySummary";
import MainLayout from "../layouts/MainLayout";
import PageSlugs, { hrefForSlug } from "../steps/PageSlugs";
import PageTitles from "../steps/PageTitles";
import processRef from "../storage/processRef";
import Storage from "../storage/Storage";

export const LoadingPage: NextPage = () => {
  const processData = useProcessApi({
    endpoint: `/v1/processData/${processRef}`
  });

  const offlineDataStatus = useAsync(
    async (data: typeof processData.result) => {
      if (!data) {
        return;
      }

      if (!data.processData) {
        return false;
      }

      return Storage.updateProcessData(processRef, data.processData);
    },
    [processData.result]
  );

  const loading = processData.loading || offlineDataStatus.loading;
  const errored =
    !loading &&
    (Boolean(processData.error) || Boolean(offlineDataStatus.error));
  const ready =
    !loading &&
    !errored &&
    processData.result &&
    offlineDataStatus.result !== undefined;

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
    <MainLayout
      title={PageTitles.Loading}
      heading="Tenancy and Household Check"
    >
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
        Please wait until the &lsquo;Go&rsquo; button is available to be clicked
        before proceeding.
      </Paragraph>

      <List items={progressItems} />

      {errored && (
        <Paragraph>
          Something went really wrong. Please contact support.
        </Paragraph>
      )}

      <Link href={hrefForSlug(PageSlugs.VisitAttempt)}>
        <Button disabled={!ready} data-testid="submit">
          {ready ? "Go" : "Loading..."}
        </Button>
      </Link>
    </MainLayout>
  );
};

export default LoadingPage;
