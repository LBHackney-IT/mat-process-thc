import { NextPageContext } from "next";
import React, { Component } from "react";
import { Orchestrator } from "remultiform/orchestrator";
import { DatabaseProvider } from "remultiform/database-context/DatabaseProvider";

import { TenancySummary } from "../components/TenancySummary";
import MainLayout from "../layouts/MainLayout";
import steps from "../steps";

import Store from "../store/Store";

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
          <Orchestrator initialSlug={slug} steps={steps} />
        </MainLayout>
      );
    } else if (currentStep.title) {
      page = (
        <MainLayout title={currentStep.title}>
          <Orchestrator initialSlug={slug} steps={steps} />
        </MainLayout>
      );
    } else {
      console.error("One of title or heading is required");

      page = <MainLayout title="Error">Someething went wrong!</MainLayout>;
    }

    if (Store.Context) {
      return (
        <DatabaseProvider context={Store.Context}>{page}</DatabaseProvider>
      );
    } else {
      return page;
    }
  }
}

export default ProcessPage;
