import {
  ComponentDatabaseMap,
  ComponentWrapper,
  DynamicComponent
} from "remultiform/component-wrapper";

import { makeSubmit } from "../../components/makeSubmit";
import { TextArea } from "../../components/TextArea";
import { TextInput } from "../../components/TextInput";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import processRef from "../../storage/processRef";

import PageSlugs, { urlObjectForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step: ProcessStepDefinition<ProcessDatabaseSchema, "tenant"> = {
  title: PageTitles.NextOfKin,
  heading: "Next of kin details",
  review: {
    rows: [
      {
        label: "Next of kin details",
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
    nextSlug: PageSlugs.Carer,
    Submit: makeSubmit({
      url: urlObjectForSlug(PageSlugs.Carer),
      value: "Save and continue"
    }),
    componentWrappers: [
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
            ProcessDatabaseSchema,
            "tenant"
          >({
            storeName: "tenant",
            key: processRef,
            property: ["nextOfKin", "fullName"]
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
            ProcessDatabaseSchema,
            "tenant"
          >({
            storeName: "tenant",
            key: processRef,
            property: ["nextOfKin", "relationship"]
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
            ProcessDatabaseSchema,
            "tenant"
          >({
            storeName: "tenant",
            key: processRef,
            property: ["nextOfKin", "mobileNumber"]
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
            ProcessDatabaseSchema,
            "tenant"
          >({
            storeName: "tenant",
            key: processRef,
            property: ["nextOfKin", "otherNumber"]
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
            ProcessDatabaseSchema,
            "tenant"
          >({
            storeName: "tenant",
            key: processRef,
            property: ["nextOfKin", "email"]
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
            } as { id?: string; value?: React.ReactNode },
            rows: 4 as number | undefined
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "tenant"
          >({
            storeName: "tenant",
            key: processRef,
            property: ["nextOfKin", "address"]
          })
        })
      )
    ]
  }
};

export default step;
