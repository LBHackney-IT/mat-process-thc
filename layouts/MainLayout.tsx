import Head from "next/head";
import React from "react";

import { Main } from "lbh-frontend-react/components/Main";
import { Container } from "lbh-frontend-react/components/Container";
import {
  Heading,
  HeadingLevels
} from "lbh-frontend-react/components/typography/Heading";

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

const MainLayout = ({ title, heading, children }: Props): JSX.Element => {
  const fullTitle = `Tenancy & Household Check - ${title || heading}`;

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <link
          href="https://fonts.googleapis.com/css?family=Montserrat:200,300,400,500,700&display=swap"
          rel="stylesheet"
        />
      </Head>
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
