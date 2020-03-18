import { ErrorMessage } from "lbh-frontend-react";
import { NextPage } from "next";
import ErrorPage from "next/error";
import { NextRouter, useRouter } from "next/router";
import React, { useState } from "react";
import { StoreNames } from "remultiform/database";
import { DatabaseContext } from "remultiform/database-context";
import { Orchestrator } from "remultiform/orchestrator";
import { StepDefinition } from "remultiform/step";
import { TenancySummary } from "../../../components/TenancySummary";
import getProcessRef from "../../../helpers/getProcessRef";
import { isRepeatingStep } from "../../../helpers/isStep";
import useDataValue from "../../../helpers/useDataValue";
import MainLayout from "../../../layouts/MainLayout";
import steps from "../../../steps";
import PageSlugs from "../../../steps/PageSlugs";
import ProcessDatabaseSchema from "../../../storage/ProcessDatabaseSchema";
import ResidentDatabaseSchema from "../../../storage/ResidentDatabaseSchema";
import Storage from "../../../storage/Storage";

const innerSteps = steps.map((step) => step.step) as StepDefinition<
  ProcessDatabaseSchema | ResidentDatabaseSchema,
  StoreNames<ProcessDatabaseSchema["schema"] | ResidentDatabaseSchema["schema"]>
>[];

const parseSlugFromQuery = (
  router: NextRouter
): { slug: string | undefined } => {
  // `router.query` might be an empty object when first loading a page for
  // some reason.
  const slugParam = router.query.slug;

  const result: { slug?: string } = {};

  if (slugParam === undefined) {
    result.slug = undefined;
  } else if (typeof slugParam === "string") {
    result.slug = slugParam;
  } else if (isRepeatingStep(router, { pathname: `/${slugParam.join("/")}` })) {
    result.slug = slugParam.slice(0, -1).join("/");
  } else {
    result.slug = slugParam.join("/");
  }

  return result as { slug: string | undefined };
};

const ProcessPage: NextPage = () => {
  const router = useRouter();

  const processRef = getProcessRef(router);

  const tenancyData = useDataValue(
    Storage.ExternalContext,
    "tenancy",
    processRef,
    (values) => (processRef ? values[processRef] : undefined)
  );
  const residentData = useDataValue(
    Storage.ExternalContext,
    "residents",
    processRef,
    (values) => (processRef ? values[processRef] : undefined)
  );

  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const { slug } = parseSlugFromQuery(router);

  if (slug === undefined) {
    return null;
  }

  const currentStep = steps.find((step) => step.step.slug === slug);

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
            ? residentData.result.tenants.map((tenant) => tenant.fullName)
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
            : undefined,
        }}
      />

      {/* This should really be an ErrorSummary component, once one exists. */}
      {errorMessages.map((message, i) => (
        <ErrorMessage key={i}>{message}</ErrorMessage>
      ))}

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
        onIncompleteStep={(missingValues?: string[]): void => {
          setErrorMessages(
            (missingValues || []).map((key) =>
              currentStep.errors?.required
                ? currentStep.errors.required[key]
                : "A required value is missing"
            )
          );
        }}
        onNextStep={async (): Promise<void> => {
          setErrorMessages([]);

          try {
            if (!processRef) {
              throw new Error("No process to reference");
            }

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

  const pausable = ![
    PageSlugs.Outside,
    PageSlugs.Start,
    PageSlugs.AboutVisit,
  ].includes(currentStep.step.slug as PageSlugs);

  let page: React.ReactElement;

  if (currentStep.heading) {
    page = (
      <MainLayout
        title={currentStep.title}
        heading={currentStep.heading}
        pausable={pausable}
      >
        {content}
      </MainLayout>
    );
  } else if (currentStep.title) {
    page = (
      <MainLayout title={currentStep.title} pausable={pausable}>
        {content}
      </MainLayout>
    );
  } else {
    console.error("At least one of title or heading is required");

    page = (
      <MainLayout title={slug} pausable={pausable}>
        {content}
      </MainLayout>
    );
  }

  return page;
};

export default ProcessPage;
