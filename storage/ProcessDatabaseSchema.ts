import { NamedSchema, StoreNames } from "remultiform/database";
import { DeepPartial } from "utility-types";

export type ProcessRef = string;

export const processDatabaseName = `mat-process-thc-process-${process.env
  .ENVIRONMENT_NAME || "unknown"}`;

type ProcessDatabaseSchema = NamedSchema<
  typeof processDatabaseName,
  2,
  {
    lastModified: {
      key: ProcessRef;
      value: string;
    };

    property: {
      key: ProcessRef;
      value: {
        outside: {
          images: string[];
        };
        rooms: {
          canEnterAll: string;
          notes: string;
        };
        laminatedFlooring: {
          hasLaminatedFlooring: string;
          hasPermission: string;
          images: string[];
          notes: string;
        };
        structuralChanges: {
          hasStructuralChanges: string;
          changesAuthorised: string;
          images: string[];
          notes: string;
        };
        damage: {
          hasDamage: string;
          images: string[];
          notes: string;
        };
        roof: {
          hasAccess: string;
          itemsStoredOnRoof: string;
          notes: string;
        };
        loft: {
          hasAccess: string;
          itemsStored: string;
          notes: string;
        };
        garden: {
          hasGarden: string;
          type: string;
          isMaintained: string;
          images: string[];
          notes: string;
        };
        storingMaterials: {
          isStoringMaterials: string;
          furtherActionRequired: string;
          notes: string;
        };
        fireExit: {
          hasFireExit: string;
          isAccessible: string;
          notes: string;
        };
        smokeAlarm: {
          hasSmokeAlarm: string;
          isWorking: string;
          notes: string;
        };
        metalGates: {
          hasMetalGates: string;
          combustibleItemsBehind: string;
          furtherActionRequired: string;
          images: string[];
          notes: string;
        };
        doorMats: {
          hasPlaced: string;
          furtherActionRequired: string;
          notes: string;
        };
        communalAreas: {
          hasLeftCombustibleItems: string;
          furtherActionRequired: string;
          notes: string;
        };
        pets: {
          hasPets: string;
          petTypes: string[];
          hasPermission: string;
          images: string[];
          notes: string;
        };
        antisocialBehaviour: {
          tenantUnderstands: string;
          notes: string;
        };
        otherComments: {
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
          images: string[];
          notes: string;
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

    household: {
      key: ProcessRef;
      value: {
        documents: {
          images: string[];
        };
        houseMovingSchemes: {
          notes: string;
        };
        memberChanges: {
          notes: string;
        };
        rentArrears: {
          type: string;
          notes: string;
        };
        housingBenefits: {
          hasApplied: string;
          notes: string;
        };
        incomeOfficer: {
          wantsToContact: string;
          notes: string;
        };
        otherProperty: {
          hasOtherProperty: string;
          notes: string;
        };
      };
    };

    homeCheck: {
      key: ProcessRef;
      value: {
        value: string;
        notes: string;
      };
    };

    healthConcerns: {
      key: ProcessRef;
      value: {
        value: string;
        who: string[];
        moreInfo: string[];
        notes: string;
      };
    };

    disability: {
      key: ProcessRef;
      value: {
        value: string;
        whoDisability: string[];
        pipOrDLA: string;
        whoPIP: string[];
        whoDLA: string[];
        notes: string;
      };
    };

    supportNeeds: {
      key: ProcessRef;
      value: {
        residentSustainmentNotes: string;
        befriendingNotes: string;
        adultSafeguardingNotes: string;
        childrenYoungPeopleSafeguardingNotes: string;
        domesticSexualViolenceNotes: string;
        mentalHealth18To65Notes: string;
        mentalHealthOver65Notes: string;
      };
    };
  }
>;

export interface ProcessJson {
  dateCreated: string;
  dateLastModified?: string;
  dataSchemaVersion: number;
  processData?: DeepPartial<
    {
      [StoreName in keyof ProcessDatabaseSchema["schema"]]: ProcessDatabaseSchema["schema"][StoreName]["value"];
    }
  >;
}

const storeNames: {
  [Name in StoreNames<ProcessDatabaseSchema["schema"]>]: boolean;
} = {
  lastModified: true,
  property: true,
  isUnannouncedVisit: true,
  isVisitInside: true,
  id: true,
  residency: true,
  tenant: true,
  household: true,
  homeCheck: true,
  healthConcerns: true,
  disability: true,
  supportNeeds: true
};

export const processStoreNames = Object.entries(storeNames)
  .filter(([, include]) => include)
  .reduce(
    (names, [name]) => [
      ...names,
      name as StoreNames<ProcessDatabaseSchema["schema"]>
    ],
    [] as StoreNames<ProcessDatabaseSchema["schema"]>[]
  );

export default ProcessDatabaseSchema;
