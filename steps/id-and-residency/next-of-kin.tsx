import {
  ComponentDatabaseMap,
  ComponentWrapper,
  DynamicComponent
} from "remultiform/component-wrapper";

import { makeSubmit } from "../../components/makeSubmit";
import { TextArea } from "../../components/TextArea";
import { TextInput } from "../../components/TextInput";
import DatabaseSchema from "../../storage/DatabaseSchema";
import processRef from "../../storage/processRef";
import ProcessStepDefinition from "../../components/ProcessStepDefinition";

import PageSlugs, { hrefForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step: ProcessStepDefinition = {
  title: PageTitles.NextOfKin,
  heading: "Next of kin details",
  step: {
    slug: PageSlugs.NextOfKin,
    nextSlug: PageSlugs.Carer,
    Submit: makeSubmit({
      href: hrefForSlug(PageSlugs.Carer),
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
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "tenant">({
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
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "tenant">({
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
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "tenant">({
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
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "tenant">({
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
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "tenant">({
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
            label: { value: "Address" as string | null | undefined },
            rows: 4 as number | null | undefined
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<DatabaseSchema, "tenant">({
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
