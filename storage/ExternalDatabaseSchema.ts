import { NamedSchema, StoreNames } from "remultiform/database";

import { ProcessRef } from "./ProcessDatabaseSchema";

export const externalDatabaseName = `mat-process-thc-external-${process.env
  .ENVIRONMENT_NAME || "unknown"}`;

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

    residents: {
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
>[] = ["tenancy", "residents"];

export default ExternalDatabaseSchema;
