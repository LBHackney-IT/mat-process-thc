import { NextPageContext } from "next";
import React, { Component } from "react";
import { Orchestrator } from "remultiform/orchestrator";

import { TenancySummary } from "../components/TenancySummary";
import MainLayout from "../layouts/MainLayout";
import steps from "../steps";

import Storage from "../storage/Storage";

interface ProcessPageProps {
  slug: string;
}

class ProcessPage extends Component<ProcessPageProps> {
  static getInitialProps({ query }: NextPageContext): ProcessPageProps {
    const { slug } = query;

    return { slug: slug as string };
  }

  render(): React.ReactElement {
    const { slug } = this.props;

    const currentStep = steps.find(step => step.step.slug === slug);
    const innerSteps = steps.map(step => step.step);

    if (!currentStep) {
      console.error(`No step matches slug ${slug}`);

      return <div>Something went wrong!</div>;
    }

    let page: React.ReactElement;

    if (currentStep.heading) {
      page = (
        <MainLayout title={currentStep.title} heading={currentStep.heading}>
          <TenancySummary
            address="1 Mare Street, London, E8 3AA"
            tenants={["Jane Doe", "John Doe"]}
            tenureType="Introductory"
            startDate="1 January 2019"
          />
          <Orchestrator
            context={Storage.Context}
            initialSlug={slug}
            steps={innerSteps}
            manageStepTransitions={false}
            provideDatabase={false}
          />
        </MainLayout>
      );
    } else if (currentStep.title) {
      page = (
        <MainLayout title={currentStep.title}>
          <Orchestrator
            context={Storage.Context}
            initialSlug={slug}
            steps={innerSteps}
            manageStepTransitions={false}
          />
        </MainLayout>
      );
    } else {
      console.error("One of title or heading is required");

      page = <MainLayout title="Error">Something went wrong!</MainLayout>;
    }

    return page;
  }
}

export default ProcessPage;
