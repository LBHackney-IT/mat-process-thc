import "cross-fetch/polyfill";

import { Button } from "lbh-frontend-react/components/Button";
import {
  Heading,
  HeadingLevels
} from "lbh-frontend-react/components/typography/Heading";
import { Paragraph } from "lbh-frontend-react/components/typography/Paragraph";
import { NextPage } from "next";
import Router from "next/router";
import React from "react";
import useSWR from "swr";

import { TenancySummary } from "../components/TenancySummary";

import MainLayout from "../layouts/MainLayout";

export const IndexPage: NextPage = () => {
  const { data } = useSWR(
    "http://slowwly.robertomurray.co.uk/delay/3000/url/https://placekitten.com/200/200",
    fetch
  );

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
      >
        {data ? "Go" : "Loading..."}
      </Button>
    </MainLayout>
  );
};

export default IndexPage;
