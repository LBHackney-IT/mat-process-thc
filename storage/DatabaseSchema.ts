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
        rooms: {
          canEnterAll: boolean;
          notes: string;
        };
        laminatedFlooring: {
          hasLaminatedFlooring: boolean;
          hasPermission: boolean;
          images: string[];
          notes: string;
        };
        structuralChanges: {
          hasStructuralChanges: boolean;
          changesAuthorised: boolean;
          images: string[];
          notes: string;
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

    id: {
      key: ProcessRef;
      value: {
        type: string;
        images: string[];
        notes: string;
      };
    };

    residency: {
      key: ProcessRef;
      value: {
        type: string;
        images: string[];
        notes: string;
      };
    };

    tenant: {
      key: ProcessRef;
      value: {
        photo: {
          isWilling: string;
          notes: string;
          images: string[];
        };

        nextOfKin: {
          fullName: string;
          relationship: string;
          mobileNumber: string;
          otherNumber: string;
          email: string;
          address: string;
        };

        carer: {
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
    };
  }
>;

export const processStoreNames: StoreNames<DatabaseSchema["schema"]>[] = [
  "lastModified",
  "property",
  "isUnannouncedVisit",
  "isVisitInside",
  "metalGates",
  "residency",
  "tenant"
];

export default DatabaseSchema;
