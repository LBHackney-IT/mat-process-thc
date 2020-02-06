import { NamedSchema, StoreNames } from "remultiform/database";

import { ProcessRef, ResidentRef } from "./ProcessDatabaseSchema";

export const externalDatabaseName = `mat-process-${
  process.env.PROCESS_NAME
}-external-${process.env.ENVIRONMENT_NAME || "unknown"}`;

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
        tenants: {
          id: ResidentRef;
          fullName: string;
          dateOfBirth: Date;
        }[];
        householdMembers: {
          id: ResidentRef;
          fullName: string;
        }[];
      };
    };
  }
>;

const storeNames: {
  [Name in StoreNames<ExternalDatabaseSchema["schema"]>]: boolean;
} = {
  tenancy: true,
  residents: true
};

export const externalStoreNames = Object.entries(storeNames)
  .filter(([, include]) => include)
  .reduce(
    (names, [name]) => [
      ...names,
      name as StoreNames<ExternalDatabaseSchema["schema"]>
    ],
    [] as StoreNames<ExternalDatabaseSchema["schema"]>[]
  );

export default ExternalDatabaseSchema;
