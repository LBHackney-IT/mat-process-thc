import { NextPage } from "next";
import Head from "next/head";
import React from "react";

import MainLayout from "../layouts/MainLayout";

const IndexPage: NextPage = () => (
  <MainLayout>
    <Head>
      <title>Tenancy & Household Check - Index</title>
    </Head>

    <h1>This will be a start page!</h1>
  </MainLayout>
);

export default IndexPage;
