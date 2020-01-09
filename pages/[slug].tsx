import { NextPage, NextPageContext } from "next";
import React from "react";
import { useAsync } from "react-async-hook";
import { Database } from "remultiform/database";
import { Orchestrator } from "remultiform/orchestrator";

import { TenancySummary } from "../components/TenancySummary";
import useDatabase from "../helpers/useDatabase";
import MainLayout from "../layouts/MainLayout";
import steps from "../steps";
import PageSlugs from "../steps/PageSlugs";
import ExternalDatabaseSchema from "../storage/ExternalDatabaseSchema";
import processRef from "../storage/processRef";
import Storage from "../storage/Storage";

interface Props {
  slug: string;
}

const ProcessPage: NextPage<Props> = ({ slug }: Props) => {
  const database = useDatabase(Storage.ExternalContext);
  const tenancyData = useAsync(
    async (db: Database<ExternalDatabaseSchema> | undefined) =>
      db?.get("tenancy", processRef),
    [database]
  );
  const contactsData = useAsync(
    async (db: Database<ExternalDatabaseSchema> | undefined) =>
      db?.get("contacts", processRef),
    [database]
  );

  const currentStep = steps.find(step => step.step.slug === slug);

  if (!currentStep) {
    console.error(`No step matches slug ${slug}`);

    return <div>Something went wrong!</div>;
  }

  const content = (
    <>
      <TenancySummary
        details={{
          address: contactsData.result
            ? contactsData.result.address
            : contactsData.error
            ? ["Error"]
            : undefined,
          tenants: contactsData.result
            ? contactsData.result.tenants.map(tenant => tenant.fullName)
            : contactsData.error
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

// eslint-disable-next-line @typescript-eslint/unbound-method
ProcessPage.getInitialProps = ({ query }: NextPageContext): Props => {
  const { slug } = query;

  return { slug: slug as PageSlugs };
};

export default ProcessPage;
