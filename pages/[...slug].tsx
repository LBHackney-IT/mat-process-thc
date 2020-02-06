import { NextPage } from "next";
import ErrorPage from "next/error";
import { useRouter } from "next/router";
import React from "react";
import { Orchestrator } from "remultiform/orchestrator";

import { TenancySummary } from "../components/TenancySummary";
import { isRepeatingStep } from "../helpers/isStep";
import useData from "../helpers/useData";
import MainLayout from "../layouts/MainLayout";
import steps from "../steps";
import tmpProcessRef from "../storage/processRef";
import Storage from "../storage/Storage";

const parseSlug = (
  slugParam: string | string[] | undefined
): { slug: string | undefined; slugId?: string } => {
  const result: { slug?: string; slugId?: string } = {};

  // `router.query` might be empty when first loading a page for some reason.
  if (slugParam === undefined) {
    result.slug = undefined;
  } else if (typeof slugParam === "string") {
    result.slug = slugParam;
  } else {
    const parts = slugParam.filter(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      part => part !== process.env.BASE_PATH!.replace(/^\/+/, "")
    );

    if (isRepeatingStep({ pathname: `/${parts.join("/")}` })) {
      parts.reverse();

      const [tail, ...rest] = parts;

      rest.reverse();

      result.slug = rest.join("/");
      result.slugId = tail;
    } else {
      result.slug = parts.join("/");
    }
  }

  return result as { slug: string | undefined; slugId?: string };
};

const ProcessPage: NextPage = () => {
  const router = useRouter();
  const tenancyData = useData(Storage.ExternalContext, "tenancy");
  const residentData = useData(Storage.ExternalContext, "residents");

  const { slug } = parseSlug(router.query.slug);

  if (slug === undefined) {
    return null;
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
            await Storage.updateProcessLastModified(tmpProcessRef);
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
