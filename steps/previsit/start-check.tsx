import {
  Heading,
  HeadingLevels
} from "lbh-frontend-react/components/typography/Heading";
import { List, ListTypes, ListProps } from "lbh-frontend-react/components/List";
import { Paragraph } from "lbh-frontend-react/components/typography/Paragraph";
import {
  ComponentWrapper,
  StaticComponent
} from "remultiform/component-wrapper";
import React from "react";

import { makeSubmit } from "../../components/makeSubmit";

import PageSlugs, { urlObjectForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step = {
  title: PageTitles.StartCheck,
  heading: "Start Tenancy and Household Check",
  questionsForReview: {},
  step: {
    slug: PageSlugs.StartCheck,
    nextSlug: PageSlugs.AboutVisit,
    Submit: makeSubmit([
      {
        url: urlObjectForSlug(PageSlugs.AboutVisit),
        value: "Start visit with tenant"
      },
      {
        url: urlObjectForSlug(PageSlugs.Index),
        value: "Unable to enter property"
      }
    ]),
    componentWrappers: [
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "heading",
          Component: Heading,
          props: {
            level: HeadingLevels.H2,
            children: "About Tenancy and Household Check"
          }
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "paragraph-1",
          Component: Paragraph,
          props: {
            children: (
              <strong>
                Please read the following text to the tenant(s) to explain why
                we collect information from them and what we do with it.
              </strong>
            )
          }
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "paragraph-2",
          Component: Paragraph,
          props: {
            children:
              "Housing Services carry out unannounced visits at tenants' homes."
          }
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "paragraph-3",
          Component: Paragraph,
          props: {
            children: "The information we collect from our visits helps us to:"
          }
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "paragraph-3-list",
          Component: List,
          props: {
            items: [
              "maintain up-to-date records of who lives at a property",
              "ensure properties are being maintained",
              "and identify any support needs."
            ],
            type: ListTypes.Bullet
          } as ListProps
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "paragraph-4",
          Component: Paragraph,
          props: {
            children:
              "We can also give advice about any tenancy issues or other enquiries."
          }
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "paragraph-5",
          Component: Paragraph,
          props: {
            children:
              "All the information collected from you will be stored electronically and kept secure. Once stored, it can be accessed by the Council’s Housing team and may be shared internally and with partner organisations, for instance, if you have medical or support needs."
          }
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "paragraph-6",
          Component: Paragraph,
          props: {
            children:
              "We will keep your information for as long as the Council’s data retention schedule permits."
          }
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "paragraph-7",
          Component: Paragraph,
          props: {
            children:
              "More about how we hold information about you and your access to it can be found on the privacy notice page of the Hackney Council website."
          }
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "paragraph-8",
          Component: Paragraph,
          props: {
            children: "Are you OK to start this visit?"
          }
        })
      )
    ]
  }
};

export default step;
