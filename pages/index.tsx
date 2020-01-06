import "cross-fetch/polyfill";

import { Paragraph } from "lbh-frontend-react/components";
import { NextPage } from "next";
import React from "react";

import useRedirectWhenOnline from "../helpers/useRedirectWhenOnline";
import MainLayout from "../layouts/MainLayout";
import PageSlugs from "../steps/PageSlugs";
import PageTitles from "../steps/PageTitles";

export const IndexPage: NextPage = () => {
  const online = useRedirectWhenOnline(PageSlugs.Loading, "push");

  let content: React.ReactNode;

  if (online.errors) {
    for (const error of online.errors) {
      console.error(error);
    }

    content = (
      <Paragraph>
        Something went really wrong. Please contact support.
      </Paragraph>
    );
  } else if (online.result === false) {
    content = (
      <Paragraph>You are offline. Please go online to continue.</Paragraph>
    );
  } else {
    content = (
      <Paragraph>
        We are currently checking your online status. Please wait...
      </Paragraph>
    );
  }

  return (
    <MainLayout title={PageTitles.Index} heading="Tenancy and Household Check">
      {content}
    </MainLayout>
  );
};

export default IndexPage;
