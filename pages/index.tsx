import "cross-fetch/polyfill";

<<<<<<< HEAD
import isOnline from "is-online";
=======
>>>>>>> Create start and end pages with fake requests
import { Button } from "lbh-frontend-react/components/Button";
import {
  Heading,
  HeadingLevels
} from "lbh-frontend-react/components/typography/Heading";
import { Paragraph } from "lbh-frontend-react/components/typography/Paragraph";
import { NextPage } from "next";
import Router from "next/router";
import React from "react";
<<<<<<< HEAD
import { useAsync } from "react-async-hook";
=======
>>>>>>> Create start and end pages with fake requests
import useSWR from "swr";

import { TenancySummary } from "../components/TenancySummary";

import MainLayout from "../layouts/MainLayout";

export const IndexPage: NextPage = () => {
<<<<<<< HEAD
  // We need this to keep retrying itself until it's online (and even after
  // that in case we go back offline).
  const online = useAsync(async () => isOnline(), []);
  const swr = useSWR(
=======
  const { data } = useSWR(
>>>>>>> Create start and end pages with fake requests
    "http://slowwly.robertomurray.co.uk/delay/3000/url/https://placekitten.com/200/200",
    fetch
  );

<<<<<<< HEAD
  if (online.error) {
    // We should give the user some way to recover from this. Perhaps we should
    // retry in this case and dedupe the error?
    console.error(online.error);
  }

  let data: Response | undefined = undefined;
  let content: React.ReactElement;

  if (online.loading) {
    content = (
      <Paragraph>
        We are currently checking your online status. Please wait...
      </Paragraph>
    );
  } else if (online.result) {
    data = swr.data;

    content = (
      <>
        {data ? (
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

  return (
    <MainLayout title="Start">
      <Heading level={HeadingLevels.H1}>Tenancy and Household Check</Heading>

      {content}

      <Button
        preventDoubleClick={true}
        disabled={!data}
        onClick={(): Promise<boolean> => Router.push("/submit")}
=======
  return (
    <MainLayout>
      <Heading level={HeadingLevels.H1}>Tenancy & Household Check</Heading>

      {data ? (
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
        Please wait until the &apos;Go&apos; button is available to be clicked
        before proceeding.
      </Paragraph>

      <Button
        disabled={!data}
        onClick={(): Promise<boolean> => Router.push("/submit")}
        preventDoubleClick={true}
>>>>>>> Create start and end pages with fake requests
      >
        {data ? "Go" : "Loading..."}
      </Button>
    </MainLayout>
  );
};

export default IndexPage;
