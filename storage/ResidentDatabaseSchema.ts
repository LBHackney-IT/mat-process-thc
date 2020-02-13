import { NamedSchema, StoreNames } from "remultiform/database";
import databaseSchemaVersion from "./databaseSchemaVersion";

export type ResidentRef = string;

export const residentDatabaseName = `mat-process-${
  process.env.PROCESS_NAME
}-resident-${process.env.ENVIRONMENT_NAME || "unknown"}`;

type ResidentDatabaseSchema = NamedSchema<
  typeof residentDatabaseName,
  typeof databaseSchemaVersion,
  {
    id: {
      key: ResidentRef;
      value: {
        type: string;
        images: string[];
        notes: {
          value: string;
          isPostVisitAction: boolean;
        };
      };
    };

    residency: {
      key: ResidentRef;
      value: {
        type: string;
        images: string[];
        notes: {
          value: string;
          isPostVisitAction: boolean;
        };
      };
    };

    photo: {
      key: ResidentRef;
      value: {
        isWilling: string;
        images: string[];
        notes: {
          value: string;
          isPostVisitAction: boolean;
        };
      };
    };

    nextOfKin: {
      key: ResidentRef;
      value: {
        fullName: string;
        relationship: string;
        mobileNumber: string;
        otherNumber: string;
        email: string;
        address: {
          value: string;
          isPostVisitAction: boolean;
        };
      };
    };

    carer: {
      key: ResidentRef;
      value: {
        hasCarer: string;
        type: string;
        isLiveIn: string;
        liveInStartDate: { month?: number; year?: number };
        fullName: string;
        phoneNumber: string;
        relationship: string;
        address: string;
        notes: {
          value: string;
          isPostVisitAction: boolean;
        };
      };
    };

    signature: {
      key: ResidentRef;
      value: string;
    };
  }
>;

const storeNames: {
  [Name in StoreNames<ResidentDatabaseSchema["schema"]>]: boolean;
} = {
  id: true,
  residency: true,
  photo: true,
  nextOfKin: true,
  carer: true,
  signature: true
};

export const residentStoreNames = Object.entries(storeNames)
  .filter(([, include]) => include)
  .reduce(
    (names, [name]) => [
      ...names,
      name as StoreNames<ResidentDatabaseSchema["schema"]>
    ],
    [] as StoreNames<ResidentDatabaseSchema["schema"]>[]
  );

export default ResidentDatabaseSchema;
