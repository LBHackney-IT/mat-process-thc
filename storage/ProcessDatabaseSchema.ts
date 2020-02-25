import { NamedSchema, StoreNames } from "remultiform/database";
import { DeepPartial } from "utility-types";

import ResidentDatabaseSchema, { ResidentRef } from "./ResidentDatabaseSchema";

export type ProcessRef = string;
export interface NoteValue {
  value: string;
}

export const processDatabaseName = `mat-process-${
  process.env.PROCESS_NAME
}-process-${process.env.ENVIRONMENT_NAME || "unknown"}`;

type ProcessDatabaseSchema = NamedSchema<
  typeof processDatabaseName,
  5,
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
          notes: NoteValue & {
            isPostVisitAction?: boolean;
          };
        };
        laminatedFlooring: {
          hasLaminatedFlooring: string;
          hasPermission: string;
          images: string[];
          // does this solve the problem?
          notes: NoteValue & {
            isPostVisitAction?: boolean;
          };
        };
        structuralChanges: {
          hasStructuralChanges: string;
          changesAuthorised: string;
          images: string[];
          notes: NoteValue & {
            isPostVisitAction?: boolean;
          };
        };
        damage: {
          hasDamage: string;
          images: string[];
          notes: NoteValue & {
            isPostVisitAction?: boolean;
          };
        };
        roof: {
          hasAccess: string;
          itemsStoredOnRoof: string;
          notes: NoteValue & {
            isPostVisitAction?: boolean;
          };
        };
        loft: {
          hasAccess: string;
          itemsStored: string;
          notes: NoteValue & {
            isPostVisitAction?: boolean;
          };
        };
        garden: {
          hasGarden: string;
          type: string;
          isMaintained: string;
          images: string[];
          notes: NoteValue & {
            isPostVisitAction?: boolean;
          };
        };
        storingMaterials: {
          isStoringMaterials: string;
          furtherActionRequired: string;
          notes: NoteValue & {
            isPostVisitAction?: boolean;
          };
        };
        fireExit: {
          hasFireExit: string;
          isAccessible: string;
          notes: NoteValue & {
            isPostVisitAction?: boolean;
          };
        };
        smokeAlarm: {
          hasSmokeAlarm: string;
          isWorking: string;
          notes: NoteValue & {
            isPostVisitAction?: boolean;
          };
        };
        metalGates: {
          hasMetalGates: string;
          combustibleItemsBehind: string;
          furtherActionRequired: string;
          images: string[];
          notes: NoteValue & {
            isPostVisitAction?: boolean;
          };
        };
        doorMats: {
          hasPlaced: string;
          furtherActionRequired: string;
          notes: NoteValue & {
            isPostVisitAction?: boolean;
          };
        };
        communalAreas: {
          hasLeftCombustibleItems: string;
          furtherActionRequired: string;
          notes: NoteValue & {
            isPostVisitAction?: boolean;
          };
        };
        pets: {
          hasPets: string;
          petTypes: string[];
          hasPermission: string;
          images: string[];
          notes: NoteValue & {
            isPostVisitAction?: boolean;
          };
        };
        antisocialBehaviour: {
          tenantUnderstands: string;
          notes: NoteValue & {
            isPostVisitAction?: boolean;
          };
        };
        otherComments: {
          images: string[];
          notes: NoteValue & {
            isPostVisitAction?: boolean;
          };
        };
      };
    };

    isUnannouncedVisit: {
      key: ProcessRef;
      value: {
        value: string;
        notes: {
          value: string;
          isPostVisitAction?: boolean;
        };
      };
    };

    isVisitInside: {
      key: ProcessRef;
      value: {
        value: string;
        notes: {
          value: string;
          isPostVisitAction?: boolean;
        };
      };
    };

    tenantsPresent: {
      key: ProcessRef;
      value: ResidentRef[];
    };

    household: {
      key: ProcessRef;
      value: {
        documents: {
          images: string[];
        };
        houseMovingSchemes: {
          notes: NoteValue & {
            isPostVisitAction?: boolean;
          };
        };
        memberChanges: {
          notes: NoteValue & {
            isPostVisitAction?: boolean;
          };
        };
        rentArrears: {
          type: string;
          notes: NoteValue & {
            isPostVisitAction?: boolean;
          };
        };
        housingBenefits: {
          hasApplied: string;
          notes: NoteValue & {
            isPostVisitAction?: boolean;
          };
        };
        incomeOfficer: {
          wantsToContact: string;
          notes: NoteValue & {
            isPostVisitAction?: boolean;
          };
        };
        otherProperty: {
          hasOtherProperty: string;
          notes: NoteValue & {
            isPostVisitAction?: boolean;
          };
        };
      };
    };

    homeCheck: {
      key: ProcessRef;
      value: {
        value: string;
        notes: {
          value: string;
          isPostVisitAction?: boolean;
        };
      };
    };

    healthConcerns: {
      key: ProcessRef;
      value: {
        value: string;
        who: string[];
        moreInfo: string[];
        notes: {
          value: string;
          isPostVisitAction?: boolean;
        };
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
        notes: {
          value: string;
          isPostVisitAction?: boolean;
        };
      };
    };

    supportNeeds: {
      key: ProcessRef;
      value: {
        residentSustainmentNotes: {
          value: string;
          isPostVisitAction?: boolean;
        };
        befriendingNotes: { value: string; isPostVisitAction?: boolean };
        adultSafeguardingNotes: { value: string; isPostVisitAction?: boolean };
        childrenYoungPeopleSafeguardingNotes: {
          value: string;
          isPostVisitAction?: boolean;
        };
        domesticSexualViolenceNotes: {
          value: string;
          isPostVisitAction?: boolean;
        };
        mentalHealth18To65Notes: { value: string; isPostVisitAction?: boolean };
        mentalHealthOver65Notes: { value: string; isPostVisitAction?: boolean };
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
    } & {
      residents: {
        [Ref in ResidentRef]: {
          [StoreName in keyof ResidentDatabaseSchema["schema"]]: ResidentDatabaseSchema["schema"][StoreName]["value"];
        };
      };
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
  tenantsPresent: true,
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
