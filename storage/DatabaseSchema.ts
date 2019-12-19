import { NamedSchema, StoreNames } from "remultiform/database";

type ProcessRef = string;

// We will replace this with a real name before release. It should be specific
// to the environment it's running on to avoid clashes.
export const databaseName = "mat-process-thc-local";

type DatabaseSchema = NamedSchema<
  typeof databaseName,
  1,
  {
    lastModified: {
      key: ProcessRef;
      value: Date;
    };

    outsidePropertyImages: {
      key: ProcessRef;
      value: string[];
    };

    metalGateImages: {
      key: ProcessRef;
      value: string[];
    };
  }
>;

export const processStoreNames: StoreNames<DatabaseSchema["schema"]>[] = [
  "lastModified",
  "outsidePropertyImages",
  "metalGateImages"
];

export default DatabaseSchema;
