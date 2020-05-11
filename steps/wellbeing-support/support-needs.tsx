import { Heading, HeadingLevels } from "lbh-frontend-react";
import { Link } from "lbh-frontend-react/components/Link";
import { Paragraph } from "lbh-frontend-react/components/typography/Paragraph";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentWrapper,
  DynamicComponent,
  StaticComponent,
} from "remultiform/component-wrapper";
import { makeSubmit } from "../../components/makeSubmit";
import {
  PostVisitActionInputDetails,
  PostVisitActionInputDetailsProps,
} from "../../components/PostVisitActionInputDetails";
import { ReviewNotes } from "../../components/ReviewNotes";
import keyFromSlug from "../../helpers/keyFromSlug";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import { Notes } from "../../storage/DatabaseSchema";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const step: ProcessStepDefinition<ProcessDatabaseSchema, "supportNeeds"> = {
  title: PageTitles.SupportNeeds,
  heading: "Support needs",
  review: {
    rows: [
      {
        label: "Resident Sustainment",
        values: {
          "resident-sustainment": {
            renderValue(notes: Notes): React.ReactNode {
              if (notes.length === 0) {
                return;
              }

              return <ReviewNotes notes={notes} />;
            },
          },
        },
      },
      {
        label: "Befriending",
        values: {
          befriending: {
            renderValue(notes: Notes): React.ReactNode {
              if (notes.length === 0) {
                return;
              }

              return <ReviewNotes notes={notes} />;
            },
          },
        },
      },
      {
        label: "Adult Safeguarding",
        values: {
          "adult-safeguarding": {
            renderValue(notes: Notes): React.ReactNode {
              if (notes.length === 0) {
                return;
              }

              return <ReviewNotes notes={notes} />;
            },
          },
        },
      },
      {
        label: "Children's Safeguarding",
        values: {
          "childrens-safeguarding": {
            renderValue(notes: Notes): React.ReactNode {
              if (notes.length === 0) {
                return;
              }

              return <ReviewNotes notes={notes} />;
            },
          },
        },
      },
      {
        label: "Domestic Violence & Sexual Abuse",
        values: {
          "domestic-violence": {
            renderValue(notes: Notes): React.ReactNode {
              if (notes.length === 0) {
                return;
              }

              return <ReviewNotes notes={notes} />;
            },
          },
        },
      },
      {
        label: "Mental Health - aged 18-65",
        values: {
          "mental-health-18-65": {
            renderValue(notes: Notes): React.ReactNode {
              if (notes.length === 0) {
                return;
              }

              return <ReviewNotes notes={notes} />;
            },
          },
        },
      },
      {
        label: "Mental Health - Over-65",
        values: {
          "mental-health-over-65": {
            renderValue(notes: Notes): React.ReactNode {
              if (notes.length === 0) {
                return;
              }

              return <ReviewNotes notes={notes} />;
            },
          },
        },
      },
    ],
  },
  step: {
    slug: PageSlugs.SupportNeeds,
    nextSlug: PageSlugs.Sections,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
        value: "Save and continue",
      }),
    componentWrappers: [
      ComponentWrapper.wrapStatic<ProcessDatabaseSchema, "supportNeeds">(
        new StaticComponent({
          key: "support-needs-heading",
          Component: Heading,
          props: {
            level: HeadingLevels.H2,
            children: "Does anyone have support needs?",
          },
        })
      ),
      ComponentWrapper.wrapStatic<ProcessDatabaseSchema, "supportNeeds">(
        new StaticComponent({
          key: "support-needs-paragraph",
          Component: Paragraph,
          props: {
            children:
              "Please consider whether the tenant(s) would benefit from being referred to any of the following services or agencies.",
          },
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "resident-sustainment",
          Component: PostVisitActionInputDetails,
          props: {
            summary: (
              <>
                <h2>Resident sustainment</h2>
                <br />
                <span>
                  Is the household considered to be at risk of tenancy failure
                  or leasehold enforcement?
                </span>
              </>
            ),
            name: "resident-sustainment-notes",
            label: {
              id: "resident-sustainment-notes-label",
              value: "Add note for post visit referral.",
            },
            contentAfter: (
              <Paragraph>
                Or refer now:{" "}
                <Link
                  href="//docs.google.com/forms/d/e/1FAIpQLSexeODLHAxOss3LDDyi66Go_MucxA85VMr5ADGufZzQzJPmpQ/viewform"
                  target="_blank"
                >
                  fill in and send form to Resident Sustainment team
                </Link>{" "}
                (online only, opens in a new tab)
              </Paragraph>
            ),
          } as PostVisitActionInputDetailsProps,
          defaultValue: [] as Notes,
          emptyValue: [] as Notes,
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "supportNeeds"
          >({
            storeName: "supportNeeds",
            key: keyFromSlug(),
            property: ["residentSustainmentNotes"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "befriending",
          Component: PostVisitActionInputDetails,
          props: {
            summary: (
              <>
                <h2>Befriending and support services</h2>
                <br />
                <span>
                  Are there any concerns where the tenant would benefit from
                  help from another agency or service via the Outward team?
                </span>
              </>
            ),
            name: "befriending-notes",
            label: {
              id: "befriending-notes-label",
              value: "Add note for post visit referral.",
            },
          } as PostVisitActionInputDetailsProps,
          defaultValue: [] as Notes,
          emptyValue: [] as Notes,
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "supportNeeds"
          >({
            storeName: "supportNeeds",
            key: keyFromSlug(),
            property: ["befriendingNotes"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "adult-safeguarding",
          Component: PostVisitActionInputDetails,
          props: {
            summary: (
              <>
                <h2>Adult safeguarding</h2>
                <br />
                <span>
                  Have you or a member of the household expressed concerns
                  relating to adult safeguarding or self neglect?
                </span>
              </>
            ),
            name: "adult-safeguarding-notes",
            label: {
              id: "adult-safeguarding-notes-label",
              value: "Add note for post visit referral.",
            },
            contentAfter: (
              <Paragraph>
                Website:{" "}
                <Link
                  href="//www.hackney.gov.uk/safeguarding-vulnerable-adults"
                  target="_blank"
                >
                  Information about safeguarding vulnerable adults
                </Link>{" "}
                (online only, opens in a new tab)
                <br />
                Email:{" "}
                <Link href="mailto:adultprotection@hackney.gov.uk">
                  adultprotection@hackney.gov.uk
                </Link>
                <br />
                Phone: 020 8356 5782
                <br />
                Out of hours: 020 8356 2300
                <br />
                For someone in the City of London area,{" "}
                <Link
                  href="//www.cityoflondon.gov.uk/services/adult-social-care/Pages/contact-us.aspx"
                  target="_blank"
                >
                  contact the City of London Adult Social Care Team
                </Link>{" "}
                (online only, opens in a new tab)
              </Paragraph>
            ),
          } as PostVisitActionInputDetailsProps,
          defaultValue: [] as Notes,
          emptyValue: [] as Notes,
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "supportNeeds"
          >({
            storeName: "supportNeeds",
            key: keyFromSlug(),
            property: ["adultSafeguardingNotes"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "childrens-safeguarding",
          Component: PostVisitActionInputDetails,
          props: {
            summary: (
              <>
                <h2>Children&apos;s and Young People&apos;s safeguarding</h2>
                <br />
                <span>
                  Have you or a member of the household expressed concerns
                  relating to children and young people’s safeguarding?
                </span>
              </>
            ),
            name: "childrens-safeguarding-notes",
            label: {
              id: "childrens-safeguarding-notes-label",
              value: "Add note for post visit referral.",
            },
            contentAfter: (
              <>
                <Paragraph>Or refer now:</Paragraph>
                <Paragraph>
                  Hackney First Access Screening Team (FAST)
                  <br />
                  Email:{" "}
                  <Link href="mailto:fast@hackney.gov.uk">
                    fast@hackney.gov.uk
                  </Link>
                  <br />
                  Phone: 020 8356 5500
                </Paragraph>
                <Paragraph>
                  Children&apos;s and young people&apos;s safeguarding
                  <br />
                  Email:{" "}
                  <Link href="mailto:cscreferrals@hackney.gov.uk">
                    cscreferrals@hackney.gov.uk
                  </Link>
                  <br />
                  Phone: 020 8356 4844
                  <br />
                  Out of hours: 020 8356 2710
                </Paragraph>
              </>
            ),
          } as PostVisitActionInputDetailsProps,
          defaultValue: [] as Notes,
          emptyValue: [] as Notes,
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "supportNeeds"
          >({
            storeName: "supportNeeds",
            key: keyFromSlug(),
            property: ["childrenYoungPeopleSafeguardingNotes"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "domestic-violence",
          Component: PostVisitActionInputDetails,
          props: {
            summary: (
              <>
                <h2>Domestic or sexual violence</h2>
                <br />
                <span>
                  Have you or a member of the household expressed concerns
                  relating to domestic or sexual violence?
                </span>
              </>
            ),
            name: "domestic-violence-notes",
            label: {
              id: "domestic-violence-notes-label",
              value: "Add note for post visit referral.",
            },
            contentAfter: (
              <>
                <Paragraph>Or refer now:</Paragraph>
                <Paragraph>
                  Email:{" "}
                  <Link href="mailto:dias@hackney.gov.uk">
                    dias@hackney.gov.uk
                  </Link>
                  <br />
                  Phone: 020 8356 4458 / 4459 or 0800 056 0905
                </Paragraph>
              </>
            ),
          } as PostVisitActionInputDetailsProps,
          defaultValue: [] as Notes,
          emptyValue: [] as Notes,
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "supportNeeds"
          >({
            storeName: "supportNeeds",
            key: keyFromSlug(),
            property: ["domesticSexualViolenceNotes"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "mental-health-18-65",
          Component: PostVisitActionInputDetails,
          props: {
            summary: (
              <>
                <h2>Mental health &mdash; aged 18&ndash;65</h2>
                <br />
                <span>
                  Have you or a member of the household aged between 18-65
                  expressed concerns relating to their mental health?
                </span>
              </>
            ),
            name: "mental-health-18-65-notes",
            label: {
              id: "mental-health-18-65-notes-label",
              value: "Add note for post visit referral.",
            },
            contentAfter: (
              <>
                <Paragraph>Or refer now:</Paragraph>
                <Paragraph>
                  Website:{" "}
                  <Link
                    href="//www.hackney.gov.uk/mental-health"
                    target="_blank"
                  >
                    Hackney mental health support
                  </Link>{" "}
                  (online only, opens in a new tab)
                </Paragraph>
              </>
            ),
          } as PostVisitActionInputDetailsProps,
          defaultValue: [] as Notes,
          emptyValue: [] as Notes,
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "supportNeeds"
          >({
            storeName: "supportNeeds",
            key: keyFromSlug(),
            property: ["mentalHealth18To65Notes"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "mental-health-over-65",
          Component: PostVisitActionInputDetails,
          props: {
            summary: (
              <>
                <h2>Mental health &mdash; aged over 65</h2>
                <br />
                <span>
                  Have you or a member of the household aged over 65 expressed
                  concerns relating to their mental health?
                </span>
              </>
            ),
            name: "mental-health-over-65-notes",
            label: {
              id: "mental-health-over-65-notes-label",
              value: "Add note for post visit referral.",
            },
            contentAfter: (
              <>
                <Paragraph>Or refer now:</Paragraph>
                <Paragraph>
                  Phone: 020 3222 8500 / 020 3222 8628
                  <br />
                  Website:{" "}
                  <Link
                    href="//www.elft.nhs.uk/service/69/CMHT-for-Older-People---City-and-Hackney"
                    target="_blank"
                  >
                    City and Hackney Community Mental Health Team for Older
                    People
                  </Link>{" "}
                  (online only, opens in a new tab)
                </Paragraph>
              </>
            ),
          } as PostVisitActionInputDetailsProps,
          defaultValue: [] as Notes,
          emptyValue: [] as Notes,
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "supportNeeds"
          >({
            storeName: "supportNeeds",
            key: keyFromSlug(),
            property: ["mentalHealthOver65Notes"],
          }),
        })
      ),
    ],
  },
};

export default step;
