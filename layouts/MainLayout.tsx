import Head from "next/head";
import React from "react";

import { Main } from "lbh-frontend-react/components/Main";
import { Container } from "lbh-frontend-react/components/Container";
import {
  Heading,
  HeadingLevels
} from "lbh-frontend-react/components/typography/Heading";
import { Header } from "lbh-frontend-react/components/Header";

interface BaseProps {
  title?: string | null;
  heading?: string | null;
  children: React.ReactNode;
}

interface TitledProps extends BaseProps {
  title: string;
}

interface HeadedProps extends BaseProps {
  heading: string;
}

type Props = TitledProps | HeadedProps;

const MainLayout = ({
  title,
  heading,
  children
}: Props): React.ReactElement => {
  const fullTitle = `${title || heading} - THC - Manage a tenancy`;

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <link
          href="https://fonts.googleapis.com/css?family=Montserrat:200,300,400,500,700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Header serviceName="Manage a tenancy"></Header>
      <Main>
        <Container>
          {heading && <Heading level={HeadingLevels.H1}>{heading}</Heading>}
          {children}
        </Container>
      </Main>
    </>
  );
};

export default MainLayout;
