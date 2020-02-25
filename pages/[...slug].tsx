import { NextPage } from "next";
import ErrorPage from "next/error";
import { NextRouter, useRouter } from "next/router";
import React from "react";
import { StoreNames } from "remultiform/database";
import { DatabaseContext } from "remultiform/database-context";
import { Orchestrator } from "remultiform/orchestrator";
import { StepDefinition } from "remultiform/step";
import { TenancySummary } from "../components/TenancySummary";
import getProcessRef from "../helpers/getProcessRef";
import { isRepeatingStep } from "../helpers/isStep";
import useDataValue from "../helpers/useDataValue";
import MainLayout from "../layouts/MainLayout";
import steps from "../steps";
import ProcessDatabaseSchema from "../storage/ProcessDatabaseSchema";
import tmpProcessRef from "../storage/processRef";
import ResidentDatabaseSchema from "../storage/ResidentDatabaseSchema";
import Storage from "../storage/Storage";

const innerSteps = steps.map(step => step.step) as StepDefinition<
  ProcessDatabaseSchema | ResidentDatabaseSchema,
  StoreNames<ProcessDatabaseSchema["schema"] | ResidentDatabaseSchema["schema"]>
>[];

const parseSlug = (
  router: NextRouter
): { slug: string | undefined; slugId?: string } => {
  // `router.query` might be empty when first loading a page for some reason.
  const slugParam = router.query.slug;

  const result: { slug?: string; slugId?: string } = {};

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
  const processRef = getProcessRef();
  const router = useRouter();
  const tenancyData = useDataValue(
    Storage.ExternalContext,
    "tenancy",
    processRef,
    values => (processRef ? values[processRef] : undefined)
  );
  const residentData = useDataValue(
    Storage.ExternalContext,
    "residents",
    processRef,
    values => (processRef ? values[processRef] : undefined)
  );

  const { slug } = parseSlug(router);

  if (slug === undefined) {
    return null;
  }

  const currentStep = steps.find(step => step.step.slug === slug);

  if (!currentStep) {
    return <ErrorPage statusCode={404} />;
  }

  const context = (currentStep.context || Storage.ProcessContext) as
    | DatabaseContext<ProcessDatabaseSchema | ResidentDatabaseSchema>
    | undefined;

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

      <Orchestrator<
        ProcessDatabaseSchema | ResidentDatabaseSchema,
        StoreNames<
          ProcessDatabaseSchema["schema"] | ResidentDatabaseSchema["schema"]
        >
      >
        context={context}
        initialSlug={slug}
        steps={innerSteps}
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
