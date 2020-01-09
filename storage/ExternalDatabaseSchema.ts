import { NamedSchema, StoreNames } from "remultiform/database";

import { ProcessRef } from "./ProcessDatabaseSchema";

// We will replace this with a real name before release. It should be specific
// to the environment it's running on to avoid clashes.
export const externalDatabaseName = "mat-process-thc-external-local";

type ExternalDatabaseSchema = NamedSchema<
  typeof externalDatabaseName,
  1,
  {
    tenancy: {
      key: ProcessRef;
      value: {
        tenureType: string;
        startDate: Date;
      };
    };

    contacts: {
      key: ProcessRef;
      value: {
        address: string[];
        tenants: { fullName: string }[];
        householdMembers: { fullName: string }[];
      };
    };
  }
>;

export const externalStoreNames: StoreNames<
  ExternalDatabaseSchema["schema"]
>[] = ["tenancy", "contacts"];

export default ExternalDatabaseSchema;
