import formatDate from "date-fns/format";
import {
  Button,
  Heading,
  HeadingLevels,
  Paragraph,
  SummaryList
} from "lbh-frontend-react";
import { NextPage } from "next";
import NextLink from "next/link";
import React from "react";

import urlsForRouter from "../helpers/urlsForRouter";
import useReviewSectionRows from "../helpers/useReviewSectionRows";
import MainLayout from "../layouts/MainLayout";
import PageSlugs, { urlObjectForSlug } from "../steps/PageSlugs";
import PageTitles from "../steps/PageTitles";
import idAndResidencySteps from "../steps/id-and-residency";

const ReviewPage: NextPage = () => {
  const sections = [
    {
      heading: "ID, residency, and tenant information",
      rows: useReviewSectionRows(idAndResidencySteps)
    }
  ];

  const { href, as } = urlsForRouter(urlObjectForSlug(PageSlugs.Submit));

  return (
    <MainLayout
      title={PageTitles.Review}
      heading="Review Tenancy and Household Check"
    >
      {sections.map(({ heading, rows }) => (
        <React.Fragment key={heading}>
          <Heading level={HeadingLevels.H2}>{heading}</Heading>

          {rows.length ? (
            <SummaryList
              rows={(rows as unknown) as { key: string; value: string }[]}
            />
          ) : (
            <Paragraph>Loading...</Paragraph>
          )}
        </React.Fragment>
      ))}

      <Heading level={HeadingLevels.H2}>Declaration</Heading>
      <Paragraph>
        I confirm that the information I have given for the purposes of this
        form is true and accurate. I understand that giving false information
        may amount to fraud and would put my tenancy at risk with the result
        that I may lose my home.
      </Paragraph>
      <Paragraph>
        Date of visit: {formatDate(new Date(), "d MMMM yyyy")}
      </Paragraph>

      <NextLink href={href} as={as}>
        <Button
          disabled={sections.some(section => !section.rows.length)}
          data-testid="submit"
        >
          Save and finish process
        </Button>
      </NextLink>
    </MainLayout>
  );
};

export default ReviewPage;
