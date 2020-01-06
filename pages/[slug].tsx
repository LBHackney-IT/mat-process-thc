import { NextPage, NextPageContext } from "next";
import React from "react";
import { Orchestrator } from "remultiform/orchestrator";

import { TenancySummary } from "../components/TenancySummary";
import MainLayout from "../layouts/MainLayout";
import steps from "../steps";
import PageSlugs from "../steps/PageSlugs";
import processRef from "../storage/processRef";
import Storage from "../storage/Storage";

interface Props {
  slug: string;
}

const ProcessPage: NextPage<Props> = ({ slug }: Props) => {
  const currentStep = steps.find(step => step.step.slug === slug);

  if (!currentStep) {
    console.error(`No step matches slug ${slug}`);

    return <div>Something went wrong!</div>;
  }

  const content = (
    <>
      <TenancySummary
        address="1 Mare Street, London, E8 3AA"
        tenants={["Jane Doe", "John Doe"]}
        tenureType="Introductory"
        startDate="1 January 2019"
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
