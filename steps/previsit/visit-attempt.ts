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

import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import processRef from "../../storage/processRef";

import PageSlugs, { urlObjectForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step = {
  title: PageTitles.VisitAttempt,
  heading: "Tenancy and Household Check",
  step: {
    slug: PageSlugs.VisitAttempt,
    nextSlug: PageSlugs.StartCheck,
    Submit: makeSubmit([
      {
        url: urlObjectForSlug(PageSlugs.StartCheck),
        value: "Enter the property"
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
              "The photos of outside of the property should include as much as the front of the property as possible. If it is a flat, then try to take a photo of what you see when you are standing outside of the property itself."
          }
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "outside-property-images",
          Component: ImageInput,
          props: {
            label: "Take a photo of the outside of the property",
            name: "outside-property-images",
            hintText: "You can take up to 5 different photos of the outside of the property." as
              | string
              | null
              | undefined,
            maxCount: 5 as number | null | undefined
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
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
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "metal-gate-images",
          Component: ImageInput,
          props: {
            label: "Take a photo of any metal gates",
            name: "metal-gate-images",
            hintText: "You can take up to 3 different photos of metal gates. These photos will also be displayed later in the process." as
              | string
              | null
              | undefined,
            maxCount: 3 as number | null | undefined
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: processRef,
            property: ["metalGates", "images"]
          })
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "next-heading",
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
