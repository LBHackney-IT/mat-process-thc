import "cross-fetch/polyfill";

import { Button } from "lbh-frontend-react/components/Button/Button";
import { PageAnnouncement } from "lbh-frontend-react/components/PageAnnouncement";
import { Paragraph } from "lbh-frontend-react/components/typography/Paragraph";
import { NextPage } from "next";
import Router from "next/router";
import React from "react";
import useSWR from "swr";

import MainLayout from "../layouts/MainLayout";

const SubmitPage: NextPage = () => {
  const { data } = useSWR(
    "http://slowwly.robertomurray.co.uk/delay/3000/url/https://placekitten.com/200/200",
    fetch
  );

  return (
    <MainLayout title="Submit">
      <PageAnnouncement title="Process submission pending">
        <Paragraph>
          {data ? "You are now online." : "You are currently working offline."}
        </Paragraph>
        <Paragraph>
          The Tenancy and Household Check for the tenancy at 121 East Street,
          occupied by John Doe needs to saved when next online.
        </Paragraph>
        <Paragraph>
          <strong>Do not</strong> close your web browser or log out of your iPad
          until this has been done.
        </Paragraph>
        <Paragraph>
          When you are next online on your iPad (4G or wi-fi), please come back
          to this Tenancy and Household Check from your work tray and click on
          the &apos;Save&apos; button that will be available on this page when
          you are online.
        </Paragraph>
      </PageAnnouncement>

      <Button
        disabled={!data}
        preventDoubleClick={true}
        onClick={(): Promise<boolean> => Router.push("/end")}
      >
        Save and submit to manager
      </Button>
    </MainLayout>
  );
};

export default SubmitPage;
