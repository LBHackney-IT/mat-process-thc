import { FieldsetLegend } from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentValue,
  ComponentWrapper,
  DynamicComponent
} from "remultiform/component-wrapper";

import { Checkboxes } from "../../components/Checkboxes";
import { ImageInput } from "../../components/ImageInput";
import { makeSubmit } from "../../components/makeSubmit";
import { RadioButtons } from "../../components/RadioButtons";
import { TextArea } from "../../components/TextArea";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import processRef from "../../storage/processRef";

import PageSlugs, { urlObjectForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step = {
  title: PageTitles.Pets,
  heading: "Pets",
  step: {
    slug: PageSlugs.Pets,
    nextSlug: PageSlugs.AntisocialBehaviour,
    Submit: makeSubmit({
      url: urlObjectForSlug(PageSlugs.AntisocialBehaviour),
      value: "Save and continue"
    }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "has-pets",
          Component: RadioButtons,
          props: {
            name: "has-pets",
            legend: (
              <FieldsetLegend>
                Are there any pets in the property?
              </FieldsetLegend>
            ) as React.ReactNode,
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
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: processRef,
            property: ["pets", "hasPets"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "pet-type",
          Component: Checkboxes,
          props: {
            name: "pet-type",
            legend: (
              <FieldsetLegend>What type of pets?</FieldsetLegend>
            ) as React.ReactNode,
            checkboxes: [
              {
                label: "Amphibian (e.g. frog, newt, salamander, toad)",
                value: "amphibian"
              },
              {
                label: "Bird",
                value: "bird"
              },
              {
                label: "Cat",
                value: "cat"
              },
              {
                label: "Chicken",
                value: "chicken"
              },
              {
                label: "Dog",
                value: "dog"
              },
              {
                label: "Domestic rodent (e.g. gerbil, hamster, mouse, rat)",
                value: "domestic rodent"
              },
              {
                label: "Fish",
                value: "fish"
              },
              {
                label: "Invertebrate (e.g. crab, insect, spider, worm)",
                value: "invertebrate"
              },
              {
                label: "Rabbit",
                value: "rabbit"
              },
              {
                label: "Reptile (e.g. lizard, snake, tortoise, turtle)",
                value: "reptile"
              },
              {
                label: "Other",
                value: "other"
              }
            ]
          },
          renderWhen(stepValues: {
            "has-pets"?: ComponentValue<ProcessDatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-pets"] === "yes";
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: processRef,
            property: ["pets", "petTypes"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "has-permission",
          Component: RadioButtons,
          props: {
            name: "has-permission",
            legend: (
              <FieldsetLegend>
                Has permission been given to keep pets?
              </FieldsetLegend>
            ) as React.ReactNode,
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
          },
          renderWhen(stepValues: {
            "has-pets"?: ComponentValue<ProcessDatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-pets"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: processRef,
            property: ["pets", "hasPermission"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "pets-permission-images",
          Component: ImageInput,
          props: {
            label: "Take photo of permission document",
            name: "pets-permission-images",
            maxCount: 1 as number | null | undefined
          },
          renderWhen(stepValues: {
            "has-permission"?: ComponentValue<
              ProcessDatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["has-permission"] === "yes";
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: processRef,
            property: ["pets", "images"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "pets-notes",
          Component: TextArea,
          props: {
            label: {
              value: "Add note about pets if necessary."
            } as { id?: string; value?: React.ReactNode },
            name: "pets-notes"
          },
          renderWhen(stepValues: {
            "has-pets"?: ComponentValue<ProcessDatabaseSchema, "property">;
          }): boolean {
            return stepValues["has-pets"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: processRef,
            property: ["pets", "notes"]
          })
        })
      )
    ]
  }
};

export default step;
