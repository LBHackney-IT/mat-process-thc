import { NamedSchema, StoreNames } from "remultiform/database";
import { DeepPartial } from "utility-types";
import { Notes } from "./DatabaseSchema";
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
          notes: Notes;
        };
        laminatedFlooring: {
          hasLaminatedFlooring: string;
          hasPermission: string;
          images: string[];
          notes: Notes;
        };
        structuralChanges: {
          hasStructuralChanges: string;
          changesAuthorised: string;
          images: string[];
          notes: Notes;
        };
        damage: {
          hasDamage: string;
          images: string[];
          notes: Notes;
        };
        repairs: {
          needsRepairs: string;
          images: string[];
          notes: string;
        };
        roof: {
          hasAccess: string;
          itemsStoredOnRoof: string;
          notes: Notes;
        };
        loft: {
          hasAccess: string;
          itemsStored: string;
          notes: Notes;
        };
        garden: {
          hasGarden: string;
          type: string;
          isMaintained: string;
          images: string[];
          notes: Notes;
        };
        storingMaterials: {
          isStoringMaterials: string;
          furtherActionRequired: string;
          notes: Notes;
        };
        fireExit: {
          hasFireExit: string;
          isAccessible: string;
          notes: Notes;
        };
        smokeAlarm: {
          hasSmokeAlarm: string;
          isWorking: string;
          notes: Notes;
        };
        metalGates: {
          hasMetalGates: string;
          combustibleItemsBehind: string;
          furtherActionRequired: string;
          images: string[];
          notes: Notes;
        };
        doorMats: {
          hasPlaced: string;
          furtherActionRequired: string;
          notes: Notes;
        };
        communalAreas: {
          hasLeftCombustibleItems: string;
          furtherActionRequired: string;
          notes: Notes;
        };
        pets: {
          hasPets: string;
          petTypes: string[];
          hasPermission: string;
          images: string[];
          notes: Notes;
        };
        antisocialBehaviour: {
          tenantUnderstands: string;
          notes: Notes;
        };
        otherComments: {
          images: string[];
          notes: Notes;
        };
      };
    };

    isUnannouncedVisit: {
      key: ProcessRef;
      value: {
        value: string;
        notes: Notes;
      };
    };

    isVisitInside: {
      key: ProcessRef;
      value: {
        value: string;
        notes: Notes;
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
          notes: Notes;
        };
        memberChanges: {
          notes: Notes;
        };
        rentArrears: {
          type: string;
          notes: Notes;
        };
        housingBenefits: {
          hasApplied: string;
          notes: Notes;
        };
        incomeOfficer: {
          wantsToContact: string;
          notes: Notes;
        };
        otherProperty: {
          hasOtherProperty: string;
          notes: Notes;
        };
      };
    };

    homeCheck: {
      key: ProcessRef;
      value: {
        value: string;
        notes: Notes;
      };
    };

    healthConcerns: {
      key: ProcessRef;
      value: {
        value: string;
        who: string[];
        moreInfo: string[];
        notes: Notes;
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
        notes: Notes;
      };
    };

    supportNeeds: {
      key: ProcessRef;
      value: {
        residentSustainmentNotes: Notes;
        befriendingNotes: Notes;
        adultSafeguardingNotes: Notes;
        childrenYoungPeopleSafeguardingNotes: Notes;
        domesticSexualViolenceNotes: Notes;
        mentalHealth18To65Notes: Notes;
        mentalHealthOver65Notes: Notes;
      };
    };

    otherNotes: {
      key: ProcessRef;
      value: Notes;
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
