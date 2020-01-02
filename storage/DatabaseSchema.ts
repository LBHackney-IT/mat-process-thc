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

    property: {
      key: ProcessRef;
      value: {
        outside: {
          images: string[];
        };
      };
    };

    isUnannouncedVisit: {
      key: ProcessRef;
      value: {
        value: string;
        notes: string;
      };
    };

    isVisitInside: {
      key: ProcessRef;
      value: {
        value: string;
        notes: string;
      };
    };

    metalGates: {
      key: ProcessRef;
      value: {
        images: string[];
      };
    };
  }
>;

export const processStoreNames: StoreNames<DatabaseSchema["schema"]>[] = [
  "lastModified",
  "property",
  "isUnannouncedVisit",
  "isVisitInside",
  "metalGates"
];

export default DatabaseSchema;
