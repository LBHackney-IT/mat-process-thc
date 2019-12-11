import React from "react";
import {
  ComponentWrapper,
  StaticComponent
} from "remultiform/component-wrapper";
import {
  Heading,
  HeadingLevels
} from "lbh-frontend-react/components/typography/Heading";

import { Paragraph } from "lbh-frontend-react/components/typography/Paragraph";
import { List, ListTypes } from "lbh-frontend-react/components/List";

import { makeSubmit } from "../components/makeSubmit";

import StepDefinition from "../types/StepDefintion";

const step: StepDefinition = {
  slug: "start",
  heading: "Start Tenancy and Household Check",
  nextSlug: "about-visit",
  Submit: makeSubmit({ href: "/about-visit", value: "Save and continue" }),
  componentWrappers: [
    ComponentWrapper.wrapStatic(
      new StaticComponent({
        key: "main-heading",
        Component: Heading,
        props: {
          level: HeadingLevels.H2,
          children: "About Tenancy and Household Check" as React.ReactNode
        }
      })
    ),
    ComponentWrapper.wrapStatic(
      new StaticComponent({
        key: "paragraph-1",
        Component: Paragraph,
        props: {
          children: "Housing Services carry out unnounced visits at tenants homes." as React.ReactNode
        }
      })
    ),
    ComponentWrapper.wrapStatic(
      new StaticComponent({
        key: "paragraph-2",
        Component: Paragraph,
        props: {
          children: "It helps us to:" as React.ReactNode
        }
      })
    ),
    ComponentWrapper.wrapStatic(
      new StaticComponent({
        key: "list",
        Component: List,
        props: {
          type: ListTypes.Bullet as ListTypes | undefined | null,
          items: [
            "maintain up-to-date records of who lives at a property" as React.ReactNode,
            "ensure properties are being maintained" as React.ReactNode,
            "and identify any support needs." as React.ReactNode
          ]
        }
      })
    ),
    ComponentWrapper.wrapStatic(
      new StaticComponent({
        key: "paragraph-3",
        Component: Paragraph,
        props: {
          children: "We can also give advice about any tenancy issues or other enquiries." as React.ReactNode
        }
      })
    ),
    ComponentWrapper.wrapStatic(
      new StaticComponent({
        key: "paragraph-4",
        Component: Paragraph,
        props: {
          children: "Is it OK to start visit?" as React.ReactNode
        }
      })
    )
  ]
};

export default step;
