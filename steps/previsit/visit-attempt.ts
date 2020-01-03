import {
  Heading,
  HeadingLevels
} from "lbh-frontend-react/components/typography/Heading";
import { Paragraph } from "lbh-frontend-react/components/typography/Paragraph";
import {
  ComponentDatabaseMap,
  ComponentWrapper,
  DynamicComponent,
  StaticComponent
} from "remultiform/component-wrapper";

import { ImageInput } from "../../components/ImageInput";
import { makeSubmit } from "../../components/makeSubmit";
import DatabaseSchema from "../../storage/DatabaseSchema";
import processRef from "../../storage/processRef";
import ProcessStepDefinition from "../../components/ProcessStepDefinition";

import PageSlugs, { hrefForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step: ProcessStepDefinition = {
  title: PageTitles.VisitAttempt,
  heading: "Tenancy and Household Check",
  step: {
    slug: PageSlugs.VisitAttempt,
    nextSlug: PageSlugs.StartCheck,
    Submit: makeSubmit([
      {
        href: hrefForSlug(PageSlugs.StartCheck),
        value: "Enter the property"
      },
      {
        href: "",
        value: "Unable to enter property"
      }
    ]),
    componentWrappers: [
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "visit-attempt-heading",
          Component: Heading,
          props: {
            level: HeadingLevels.H2,
            children: "Visit attempt"
          }
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "outside-property-heading",
          Component: Heading,
          props: {
            level: HeadingLevels.H3,
            children: "Outside property"
          }
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "outside-property-paragraph",
          Component: Paragraph,
          props: {
            children:
              "The photo of outside of the property should include as much as the front of the property as possible. If it is a flat, then try to take a photo of what you see when you are standing outside of the property itself."
          }
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "outside-property-images",
          Component: ImageInput,
          props: {
            label: "Upload an image",
            buttonText: "Take a photo of outside the property",
            name: "outside-property-images"
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "property">({
            storeName: "property",
            key: processRef,
            property: ["outside", "images"]
          })
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "metal-gate-heading",
          Component: Heading,
          props: {
            level: HeadingLevels.H3,
            children: "Metal gate across entrance?"
          }
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "metal-gate-paragraph",
          Component: Paragraph,
          props: {
            children: "This photo will also be displayed later in the process."
          }
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "metal-gate-images",
          Component: ImageInput,
          props: {
            label: "Upload an image",
            buttonText: "Take a photo of the metal gate",
            name: "metal-gate-images"
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "metalGates">({
            storeName: "metalGates",
            key: processRef,
            property: ["images"]
          })
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "do-next-heading",
          Component: Heading,
          props: {
            level: HeadingLevels.H4,
            children: "What do you want to do next?"
          }
        })
      )
    ]
  }
};

export default step;
