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
        damage: {
          hasDamage: boolean;
          images: string[];
          notes: string;
        };
        roof: {
          hasAccess: boolean;
          itemsStoredOnRoof: boolean;
          notes: string;
        };
        loft: {
          hasAccess: boolean;
          itemsStored: boolean;
          notes: string;
        };
        garden: {
          hasGarden: boolean;
          type: string;
          isMaintained: boolean;
          images: string[];
          notes: string;
        };
        storingMaterials: {
          isStoringMaterials: boolean;
          furtherActionRequired: boolean;
          notes: string;
        };
        fireExit: {
          hasFireExit: boolean;
          isAccessible: boolean;
          notes: string;
        };
        smokeAlarm: {
          hasSmokeAlarm: boolean;
          isWorking: boolean;
          notes: string;
        };
        metalGates: {
          hasMetalGates: boolean;
          combustibleItemsBehind: boolean;
          furtherActionRequired: boolean;
          images: string[];
          notes: string;
        };
        doorMats: {
          hasPlaced: boolean;
          furtherActionRequired: boolean;
          notes: string;
        };
        communalAreas: {
          hasLeftCombustibleItems: boolean;
          furtherActionRequired: boolean;
          notes: string;
        };
        pets: {
          hasPets: boolean;
          petTypes: string[];
          hasPermission: boolean;
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
  "residency",
  "tenant"
];

export default DatabaseSchema;
