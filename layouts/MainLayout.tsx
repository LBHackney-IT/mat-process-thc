import Head from "next/head";
import React from "react";

import { Main } from "lbh-frontend-react/components/Main";
import { Container } from "lbh-frontend-react/components/Container";

interface Props {
  title?: string | null;
  children: React.ReactNode;
}

const MainLayout = ({ title, children }: Props): React.ReactElement => (
  <>
    <Head>
      <title>Tenancy and Household Check{title ? ` - ${title}` : ""}</title>
      <link
        href="https://fonts.googleapis.com/css?family=Montserrat:200,300,400,500,700&display=swap"
        rel="stylesheet"
      />
    </Head>
    <Main>
      <Container>{children}</Container>
    </Main>
  </>
);

export default MainLayout;
