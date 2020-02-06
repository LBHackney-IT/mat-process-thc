import { NamedSchema, StoreNames } from "remultiform/database";

export type ResidentRef = string;

export const residentDatabaseName = `mat-process-${
  process.env.PROCESS_NAME
}-resident-${process.env.ENVIRONMENT_NAME || "unknown"}`;

type ResidentDatabaseSchema = NamedSchema<
  typeof residentDatabaseName,
  1,
  {
    id: {
      key: ResidentRef;
      value: {
        type: string;
        images: string[];
        notes: string;
      };
    };

    residency: {
      key: ResidentRef;
      value: {
        type: string;
        images: string[];
        notes: string;
      };
    };

    photo: {
      key: ResidentRef;
      value: {
        isWilling: string;
        images: string[];
        notes: string;
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
        address: string;
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
        notes: string;
      };
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
  carer: true
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
