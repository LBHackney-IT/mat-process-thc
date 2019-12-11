import { Paragraph } from "lbh-frontend-react/components/typography/Paragraph";
import {
  Heading,
  HeadingLevels
} from "lbh-frontend-react/components/typography/Heading";
import {
  ComponentWrapper,
  StaticComponent
} from "remultiform/component-wrapper";

import { makeSubmit } from "../components/makeSubmit";
import StepDefinition from "../types/StepDefintion";

const step: StepDefinition = {
  slug: "verify-proof-summary",
  heading: "Verify proof of ID and residency",
  nextSlug: "verify-id",
  Submit: makeSubmit({ href: "/verify-id", value: "Save and continue" }),
  componentWrappers: [
    ComponentWrapper.wrapStatic(
      new StaticComponent({
        key: "paragraph-1",
        Component: Paragraph,
        props: {
          children: "For this section, tenants will need to provide proof of ID and residency." as React.ReactNode
        }
      })
    ),
    ComponentWrapper.wrapStatic(
      new StaticComponent({
        key: "paragraph-2",
        Component: Paragraph,
        props: {
          children: "If a joint tenant is not present at this visit, only proof of residency is required for the subsequent joint tenant(s)." as React.ReactNode
        }
      })
    ),
    ComponentWrapper.wrapStatic(
      new StaticComponent({
        key: "select-tenant-heading",
        Component: Heading,
        props: {
          level: HeadingLevels.H2,
          children: "Select tenant for check" as React.ReactNode
        }
      })
    )
  ]
};

export default step;
