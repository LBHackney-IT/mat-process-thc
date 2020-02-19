import { Heading, HeadingLevels } from "lbh-frontend-react";
import {
  ComponentDatabaseMap,
  ComponentWrapper,
  DynamicComponent,
  StaticComponent
} from "remultiform/component-wrapper";

import { makeSubmit } from "../../components/makeSubmit";
import { TextArea } from "../../components/TextArea";
import { TextInput } from "../../components/TextInput";
import keyFromSlug from "../../helpers/keyFromSlug";
import nextSlugWithId from "../../helpers/nextSlugWithId";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import ResidentDatabaseSchema from "../../storage/ResidentDatabaseSchema";
import Storage from "../../storage/Storage";

import PageSlugs, { urlObjectForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const questions = {
  "next-of-kin-details": "Next of kin details"
};

const step: ProcessStepDefinition<ResidentDatabaseSchema, "nextOfKin"> = {
  title: PageTitles.NextOfKin,
  heading: "Next of kin",
  context: Storage.ResidentContext,
  review: {
    rows: [
      {
        label: questions["next-of-kin-details"],
        values: {
          "next-of-kin-full-name": {
            renderValue(name: string): React.ReactNode {
              return name;
            }
          },
          "next-of-kin-relationship": {
            renderValue(relationship: string): React.ReactNode {
              return relationship;
            }
          },
          "next-of-kin-mobile-number": {
            renderValue(mobile: string): React.ReactNode {
              return mobile;
            }
          },
          "next-of-kin-other-number": {
            renderValue(otherNumber: string): React.ReactNode {
              return otherNumber;
            }
          },
          "next-of-kin-email": {
            renderValue(email: string): React.ReactNode {
              return email;
            }
          },
          "next-of-kin-address": {
            renderValue(address: string): React.ReactNode {
              return address.trim().replace(/\n/g, ", ");
            }
          }
        }
      }
    ]
  },
  step: {
    slug: PageSlugs.NextOfKin,
    nextSlug: nextSlugWithId(PageSlugs.Carer),
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        url: urlObjectForSlug(nextSlug),
        value: "Save and continue"
      }),
    componentWrappers: [
      ComponentWrapper.wrapStatic<ResidentDatabaseSchema, "nextOfKin">(
        new StaticComponent({
          key: "next-of-kin-heading",
          Component: Heading,
          props: {
            level: HeadingLevels.H2,
            children: questions["next-of-kin-details"]
          }
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "next-of-kin-full-name",
          Component: TextInput,
          props: {
            name: "next-of-kin-full-name",
            label: "Full name"
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ResidentDatabaseSchema,
            "nextOfKin"
          >({
            storeName: "nextOfKin",
            key: keyFromSlug(),
            property: ["fullName"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "next-of-kin-relationship",
          Component: TextInput,
          props: {
            name: "next-of-kin-relationship",
            label: "Relationship to tenant"
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ResidentDatabaseSchema,
            "nextOfKin"
          >({
            storeName: "nextOfKin",
            key: keyFromSlug(),
            property: ["relationship"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "next-of-kin-mobile-number",
          Component: TextInput,
          props: {
            name: "next-of-kin-mobile-number",
            label: "Mobile number"
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ResidentDatabaseSchema,
            "nextOfKin"
          >({
            storeName: "nextOfKin",
            key: keyFromSlug(),
            property: ["mobileNumber"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "next-of-kin-other-number",
          Component: TextInput,
          props: {
            name: "next-of-kin-other-number",
            label: "Other phone number"
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ResidentDatabaseSchema,
            "nextOfKin"
          >({
            storeName: "nextOfKin",
            key: keyFromSlug(),
            property: ["otherNumber"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "next-of-kin-email",
          Component: TextInput,
          props: {
            name: "next-of-kin-email",
            label: "Email address"
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ResidentDatabaseSchema,
            "nextOfKin"
          >({
            storeName: "nextOfKin",
            key: keyFromSlug(),
            property: ["email"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "next-of-kin-address",
          Component: TextArea,
          props: {
            name: "next-of-kin-address",
            label: {
              value: "Address"
            } as { id?: string; value: React.ReactNode },
            rows: 4 as number | undefined
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ResidentDatabaseSchema,
            "nextOfKin"
          >({
            storeName: "nextOfKin",
            key: keyFromSlug(),
            property: ["address"]
          })
        })
      )
    ]
  }
};

export default step;
