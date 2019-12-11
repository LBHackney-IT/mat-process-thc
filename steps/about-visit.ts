import React from "react";
import {
  ComponentWrapper,
  StaticComponent
} from "remultiform/component-wrapper";
import {
  Heading,
  HeadingLevels
} from "lbh-frontend-react/components/typography/Heading";

import { makeSubmit } from "../components/makeSubmit";
import { RadioButtons } from "../components/RadioButtons";
import { TextArea } from "../components/textArea";

import StepDefinition from "../types/StepDefintion";

const step: StepDefinition = {
  slug: "about-visit",
  heading: "About the visit",
  nextSlug: "thc-summary",
  Submit: makeSubmit({ href: "/thc-summary", value: "Save and continue" }),
  componentWrappers: [
    ComponentWrapper.wrapStatic(
      new StaticComponent({
        key: "unannounced-visit-question",
        Component: Heading,
        props: {
          level: HeadingLevels.H2,
          children: "Is this an unannounced visit?" as React.ReactNode
        }
      })
    ),
    ComponentWrapper.wrapStatic(
      new StaticComponent({
        key: "unannounced-visit-input",
        Component: RadioButtons,
        props: {
          name: "unannounced-visit",
          radios: [
            {
              label: "Yes",
              value: "yes"
            },
            {
              label: "No",
              value: "no"
            }
          ]
        }
      })
    ),
    ComponentWrapper.wrapStatic(
      new StaticComponent({
        key: "why-pre-arranged",
        Component: TextArea,
        props: {
          name: "why-pre-arranged",
          label: "Explain why this visit is pre-arranged."
        }
      })
    ),
    ComponentWrapper.wrapStatic(
      new StaticComponent({
        key: "inside-question",
        Component: Heading,
        props: {
          level: HeadingLevels.H2,
          children: "Is this taking place inside a tenant's home?" as React.ReactNode
        }
      })
    ),
    ComponentWrapper.wrapStatic(
      new StaticComponent({
        key: "inside-input",
        Component: RadioButtons,
        props: {
          name: "inside",
          radios: [
            {
              label: "Yes",
              value: "yes"
            },
            {
              label: "No",
              value: "no"
            }
          ]
        }
      })
    ),
    ComponentWrapper.wrapStatic(
      new StaticComponent({
        key: "why-visit-outside",
        Component: TextArea,
        props: {
          name: "why-visit-outside",
          label: "Explain why this visit is outside of tenant's home."
        }
      })
    )
  ]
};

export default step;
