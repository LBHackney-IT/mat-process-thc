import {
  Heading,
  HeadingLevels
} from "lbh-frontend-react/components/typography/Heading";
import { Paragraph } from "lbh-frontend-react/components/typography/Paragraph";
import {
  ComponentWrapper,
  DatabaseMap,
  DynamicComponent,
  StaticComponent
} from "remultiform/component-wrapper";
import React from "react";

import { ImageInput } from "../../components/ImageInput";
import { makeSubmit } from "../../components/makeSubmit";

import DatabaseSchema from "../../storage/DatabaseSchema";
import processRef from "../../storage/processRef";

import ProcessStepDefinition from "../../components/ProcessStepDefinition";

const step: ProcessStepDefinition = {
  title: "Attempt visit",
  heading: "Tenancy and Household Check",
  step: {
    slug: "attempt-visit",
    nextSlug: "start-visit",
    Submit: makeSubmit([
      {
        href: "/start-visit",
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
            children: "Visit attempt" as React.ReactNode
          }
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "outside-property-heading",
          Component: Heading,
          props: {
            level: HeadingLevels.H3,
            children: "Outside property" as React.ReactNode
          }
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "outside-property-paragraph",
          Component: Paragraph,
          props: {
            children: "The photo of outside of the property should include as much as the front of the property as possible. If it is a flat, then try to take a photo of what you see when you are standing outside of the property itself." as React.ReactNode
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
          databaseMap: new DatabaseMap<DatabaseSchema, "outsidePropertyImages">(
            {
              storeName: "outsidePropertyImages",
              key: processRef
            }
          ),
          emptyValue: []
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "metal-gate-heading",
          Component: Heading,
          props: {
            level: HeadingLevels.H3,
            children: "Metal gate across entrance?" as React.ReactNode
          }
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "metal-gate-paragraph",
          Component: Paragraph,
          props: {
            level: Paragraph,
            children: "This photo will also be displayed later in the process." as React.ReactNode
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
          databaseMap: new DatabaseMap<DatabaseSchema, "metalGateImages">({
            storeName: "metalGateImages",
            key: processRef
          }),
          emptyValue: []
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "do-next-heading",
          Component: Heading,
          props: {
            level: HeadingLevels.H4,
            children: "What do you want to do next?" as React.ReactNode
          }
        })
      )
    ]
  }
};

export default step;
