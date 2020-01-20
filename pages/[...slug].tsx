import { NextPage } from "next";
import ErrorPage from "next/error";
import { useRouter } from "next/router";
import React from "react";
import { Orchestrator } from "remultiform/orchestrator";

import { TenancySummary } from "../components/TenancySummary";
import useData from "../helpers/useData";
import MainLayout from "../layouts/MainLayout";
import steps from "../steps";
import processRef from "../storage/processRef";
import Storage from "../storage/Storage";

const ProcessPage: NextPage = () => {
  const router = useRouter();
  const tenancyData = useData(Storage.ExternalContext, "tenancy");
  const residentData = useData(Storage.ExternalContext, "residents");

  const slugParam = router.query.slug as string | string[] | undefined;

  // `router.query` might be empty when first loading a page for some reason.
  if (slugParam === undefined) {
    return null;
  }

  let slug: string;

  if (typeof slugParam === "string") {
    slug = slugParam;
  } else {
    slug = slugParam.filter(part => part !== "thc").join("/");
  }

  const currentStep = steps.find(step => step.step.slug === slug);

  if (!currentStep) {
    return <ErrorPage statusCode={404} />;
  }

  const content = (
    <>
      <TenancySummary
        details={{
          address: residentData.result
            ? residentData.result.address
            : residentData.error
            ? ["Error"]
            : undefined,
          tenants: residentData.result
            ? residentData.result.tenants.map(tenant => tenant.fullName)
            : residentData.error
            ? ["Error"]
            : undefined,
          tenureType: tenancyData.result
            ? tenancyData.result.tenureType
            : tenancyData.error
            ? "Error"
            : undefined,
          startDate: tenancyData.result
            ? tenancyData.result.startDate
            : tenancyData.error
            ? "Error"
            : undefined
        }}
      />

      <Orchestrator
        context={Storage.ProcessContext}
        initialSlug={slug}
        steps={steps.map(step => step.step)}
        manageStepTransitions={false}
        provideDatabase={false}
        onNextStep={async (): Promise<void> => {
          try {
            await Storage.updateProcessLastModified(processRef);
          } catch (error) {
            // This is invisible to the user, so we should do something to
            // display it to them.
            console.error(error);
          }
        }}
      />
    </>
  );

  let page: React.ReactElement;

  if (currentStep.heading) {
    page = (
      <MainLayout title={currentStep.title} heading={currentStep.heading}>
        {content}
      </MainLayout>
    );
  } else if (currentStep.title) {
    page = <MainLayout title={currentStep.title}>{content}</MainLayout>;
  } else {
    console.error("At least one of title or heading is required");

    page = <MainLayout title={slug}>{content}</MainLayout>;
  }

  return page;
};

export default ProcessPage;
