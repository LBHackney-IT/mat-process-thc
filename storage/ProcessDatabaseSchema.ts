import { NamedSchema, StoreNames } from "remultiform/database";
import { DeepPartial } from "utility-types";
import { Note } from "./DatabaseSchema";
import databaseSchemaVersion from "./databaseSchemaVersion";
import ResidentDatabaseSchema, { ResidentRef } from "./ResidentDatabaseSchema";

export type ProcessRef = string;

export const processDatabaseVersion = 5;

export const processDatabaseName = `mat-process-${
  process.env.PROCESS_NAME
}-process-${process.env.ENVIRONMENT_NAME || "unknown"}`;

type ProcessDatabaseSchema = NamedSchema<
  typeof processDatabaseName,
  typeof databaseSchemaVersion,
  {
    lastModified: {
      key: ProcessRef;
      value: string;
    };

    submitted: {
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
          notes: Note;
        };
        laminatedFlooring: {
          hasLaminatedFlooring: string;
          hasPermission: string;
          images: string[];
          notes: Note;
        };
        structuralChanges: {
          hasStructuralChanges: string;
          changesAuthorised: string;
          images: string[];
          notes: Note;
        };
        damage: {
          hasDamage: string;
          images: string[];
          notes: Note;
        };
        repairs: {
          needsRepairs: string;
          images: string[];
          notes: string;
        };
        roof: {
          hasAccess: string;
          itemsStoredOnRoof: string;
          notes: Note;
        };
        loft: {
          hasAccess: string;
          itemsStored: string;
          notes: Note;
        };
        garden: {
          hasGarden: string;
          type: string;
          isMaintained: string;
          images: string[];
          notes: Note;
        };
        storingMaterials: {
          isStoringMaterials: string;
          furtherActionRequired: string;
          notes: Note;
        };
        fireExit: {
          hasFireExit: string;
          isAccessible: string;
          notes: Note;
        };
        smokeAlarm: {
          hasSmokeAlarm: string;
          isWorking: string;
          notes: Note;
        };
        metalGates: {
          hasMetalGates: string;
          combustibleItemsBehind: string;
          furtherActionRequired: string;
          images: string[];
          notes: Note;
        };
        doorMats: {
          hasPlaced: string;
          furtherActionRequired: string;
          notes: Note;
        };
        communalAreas: {
          hasLeftCombustibleItems: string;
          furtherActionRequired: string;
          notes: Note;
        };
        pets: {
          hasPets: string;
          petTypes: string[];
          hasPermission: string;
          images: string[];
          notes: Note;
        };
        antisocialBehaviour: {
          tenantUnderstands: string;
          notes: Note;
        };
        otherComments: {
          images: string[];
          notes: Note;
        };
      };
    };

    isUnannouncedVisit: {
      key: ProcessRef;
      value: {
        value: string;
        notes: Note;
      };
    };

    isVisitInside: {
      key: ProcessRef;
      value: {
        value: string;
        notes: Note;
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
          notes: Note;
        };
        memberChanges: {
          notes: Note;
        };
        rentArrears: {
          type: string;
          notes: Note;
        };
        housingBenefits: {
          hasApplied: string;
          notes: Note;
        };
        incomeOfficer: {
          wantsToContact: string;
          notes: Note;
        };
        otherProperty: {
          hasOtherProperty: string;
          notes: Note;
        };
      };
    };

    homeCheck: {
      key: ProcessRef;
      value: {
        value: string;
        notes: Note;
      };
    };

    healthConcerns: {
      key: ProcessRef;
      value: {
        value: string;
        who: string[];
        moreInfo: string[];
        notes: Note;
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
        notes: Note;
      };
    };

    supportNeeds: {
      key: ProcessRef;
      value: {
        residentSustainmentNotes: Note;
        befriendingNotes: Note;
        adultSafeguardingNotes: Note;
        childrenYoungPeopleSafeguardingNotes: Note;
        domesticSexualViolenceNotes: Note;
        mentalHealth18To65Notes: Note;
        mentalHealthOver65Notes: Note;
      };
    };

    otherNotes: {
      key: ProcessRef;
      value: Note;
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
  submitted: true,
  property: true,
  isUnannouncedVisit: true,
  isVisitInside: true,
  tenantsPresent: true,
  household: true,
  homeCheck: true,
  healthConcerns: true,
  disability: true,
  supportNeeds: true,
  otherNotes: true,
};

export const processStoreNames = Object.entries(storeNames)
  .filter(([, include]) => include)
  .reduce(
    (names, [name]) => [
      ...names,
      name as StoreNames<ProcessDatabaseSchema["schema"]>,
    ],
    [] as StoreNames<ProcessDatabaseSchema["schema"]>[]
  );

export default ProcessDatabaseSchema;
