import Head from "next/head";
import React, { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

const MainLayout = ({ children }: LayoutProps): JSX.Element => (
  <>
    <Head>
      <title>Tenancy & Household Check</title>
    </Head>

    {children}
  </>
);

export default MainLayout;
