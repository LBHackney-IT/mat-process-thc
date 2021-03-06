import { Paragraph } from "lbh-frontend-react/components";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import getProcessRef from "../../helpers/getProcessRef";
import isServer from "../../helpers/isServer";
import useRedirectWhenOnline from "../../helpers/useRedirectWhenOnline";
import MainLayout from "../../layouts/MainLayout";
import PageSlugs from "../../steps/PageSlugs";
import PageTitles from "../../steps/PageTitles";

const useCacheQueryParameters = (): void => {
  const router = useRouter();

  if (isServer) {
    return;
  }

  const processRef = getProcessRef(router);

  if (!processRef) {
    return;
  }

  // `router.query` might be an empty object when first loading a page for
  // some reason.
  let processApiJwt = router.query.processApiJwt as string | undefined;
  let matApiJwt = router.query.matApiJwt as string | undefined;
  let matApiData = router.query.data as string | undefined;
  let processStage = router.query.processStage as string | undefined;

  if (process.env.NODE_ENV !== "production") {
    processApiJwt = processApiJwt || process.env.TEST_PROCESS_API_JWT;
    matApiJwt = matApiJwt || process.env.TEST_MAT_API_JWT;
    matApiData = matApiData || process.env.TEST_MAT_API_DATA;
    processStage = processStage || process.env.TEST_PROCESS_STAGE;
  }

  if (processApiJwt) {
    sessionStorage.setItem(`${processRef}:processApiJwt`, processApiJwt);
  } else {
    sessionStorage.removeItem(`${processRef}:processApiJwt`);
  }

  if (matApiJwt) {
    sessionStorage.setItem(`${processRef}:matApiJwt`, matApiJwt);
  } else {
    sessionStorage.removeItem(`${processRef}:matApiJwt`);
  }

  if (matApiData) {
    sessionStorage.setItem(`${processRef}:matApiData`, matApiData);
  } else {
    sessionStorage.removeItem(`${processRef}:matApiData`);
  }

  if (processStage) {
    sessionStorage.setItem(`${processRef}:processStage`, processStage);
  } else {
    sessionStorage.removeItem(`${processRef}:processStage`);
  }
};

export const IndexPage: NextPage = () => {
  useCacheQueryParameters();

  const online = useRedirectWhenOnline(PageSlugs.Loading, "replace");

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
