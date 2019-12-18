import { NamedSchema } from "remultiform/database/types";

// We will replace this with a real name before release. It should be specific
// to the environment it's running on to avoid clashes.
export const databaseName = "mat-process-thc-local";

type DatabaseSchema = NamedSchema<
  typeof databaseName,
  1,
  {
    outsidePropertyImages: {
      key: string;
      value: string[];
    };

    metalGateImages: {
      key: string;
      value: string[];
    };

    unannouncedVisit: {
      key: string;
      value: string;
    };

    unannouncedVisitNotes: {
      key: string;
      value: string;
    };

    insideProperty: {
      key: string;
      value: string;
    };

    insidePropertyNotes: {
      key: string;
      value: string;
    };
  }
>;

export default DatabaseSchema;
