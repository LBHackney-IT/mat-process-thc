import { NextPageContext } from "next";
import { Orchestrator } from "remultiform/orchestrator";
import React, { Component } from "react";

import { TenancySummary } from "../components/TenancySummary";
import MainLayout from "../layouts/MainLayout";
import steps from "../steps";

interface ProcessPageProps {
  slug: string;
}

class ProcessPage extends Component<ProcessPageProps> {
  static getInitialProps({ query }: NextPageContext): ProcessPageProps {
    const { slug } = query;

    return { slug: slug as string };
  }

  render(): JSX.Element {
    const { slug } = this.props;

    const currentStep = steps.find(step => step.slug === slug);

    if (!currentStep) {
      console.error(`No step matches slug ${slug}`);

      return <div>Something went wrong!</div>;
    }

    if (currentStep.heading) {
      return (
        <MainLayout title={currentStep.title} heading={currentStep.heading}>
          <TenancySummary
            address="1 Mare Street, London, E8 3AA"
            tenants={["Jane Doe", "John Doe"]}
            tenureType="Introductory"
            startDate="1 January 2019"
          />
          <Orchestrator initialSlug={slug} steps={steps} />
        </MainLayout>
      );
    } else if (currentStep.title) {
      return (
        <MainLayout title={currentStep.title}>
          <Orchestrator initialSlug={slug} steps={steps} />
        </MainLayout>
      );
    }

    console.error("One of title or heading is required");

    return <div>Someething went wrong!</div>;
  }
}

export default ProcessPage;
