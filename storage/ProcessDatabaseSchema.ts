import { NamedSchema, StoreNames } from "remultiform/database";
import { DeepPartial } from "utility-types";
import { Notes } from "./DatabaseSchema";
import databaseSchemaVersion from "./databaseSchemaVersion";
import ResidentDatabaseSchema, { ResidentRef } from "./ResidentDatabaseSchema";

export type ProcessRef = string;

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

    other: {
      key: ProcessRef;
      value: {
        notes: Notes;
      };
    };

    unableToEnter: {
      key: ProcessRef;
      value: {
        firstFailedAttempt: {
          value: string[];
          notes: string;
          date: string;
        };
        secondFailedAttempt: {
          value: string[];
          notes: string;
          date: string;
        };
        thirdFailedAttempt: {
          reasons: string[];
          actions: string[];
          notes: string;
          date: string;
          needsAppointmentLetterReminder: boolean;
          appointmentLetterReminderCreatedAt: string;
        };
        fourthFailedAttempt: {
          reasons: string[];
          notes: string;
          date: string;
          needsFraudInvestigationReminder: boolean;
          fraudInvestigationReminderCreatedAt: string;
          needsFraudInvestigationLetterReminder: boolean;
          fraudInvestigationLetterReminderCreatedAt: string;
        };
        otherNotes: string;
      };
    };

    managerComment: {
      key: ProcessRef;
      value: string;
    };
  }
>;

export enum UnableToEnterPropertyNames {
  First = "firstFailedAttempt",
  Second = "secondFailedAttempt",
  Third = "thirdFailedAttempt",
  Fourth = "fourthFailedAttempt",
}

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
  other: true,
  unableToEnter: true,
  managerComment: true,
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

export const processNotesPaths: {
  [Name in StoreNames<ProcessDatabaseSchema["schema"]>]: string[] | never[];
} = {
  lastModified: [],
  submitted: [],
  property: [
    "rooms.notes",
    "laminatedFlooring.notes",
    "structuralChanges.notes",
    "damage.notes",
    "repairs.notes",
    "roof.notes",
    "loft.notes",
    "garden.notes",
    "storingMaterials.notes",
    "fireExit.notes",
    "smokeAlarm.notes",
    "metalGates.notes",
    "doorMats.notes",
    "communalAreas.notes",
    "pets.notes",
    "antisocialBehaviour.notes",
    "otherComments.notes",
  ],
  isUnannouncedVisit: ["notes"],
  isVisitInside: ["notes"],
  tenantsPresent: [],
  household: [
    "houseMovingSchemes.notes",
    "memberChanges.notes",
    "rentArrears.notes",
    "housingBenefits.notes",
    "incomeOfficer.notes",
    "otherProperty.notes",
  ],
  homeCheck: [],
  healthConcerns: ["notes"],
  disability: ["notes"],
  supportNeeds: [
    "residentSustainmentNotes",
    "befriendingNotes",
    "adultSafeguardingNotes",
    "childrenYoungPeopleSafeguardingNotes",
    "domesticSexualViolenceNotes",
    "mentalHealth18To65Notes",
    "mentalHealthOver65Notes",
  ],
  other: ["notes"],
  unableToEnter: [],
  managerComment: [],
};

export const processPostVisitActionMap: {
  [storeName in StoreNames<ProcessDatabaseSchema["schema"]>]: {
    [path: string]: { category: string; subcategory: string };
  };
} = {
  lastModified: {},
  submitted: {},
  property: {
    "room.notes": {
      category: "20",
      subcategory: "100000170",
    },
    "laminatedFlooring.notes": {
      category: "20",
      subcategory: "100000184",
    },
    "structuralChanges.notes": {
      category: "20",
      subcategory: "100000199",
    },
    "damage.notes": {
      category: "20",
      subcategory: "100000179",
    },
    "repairs.notes": {
      category: "20",
      subcategory: "100000555",
    },
    "roof.notes": {
      category: "20",
      subcategory: "100000172",
    },
    "loft.notes": {
      category: "20",
      subcategory: "100000171",
    },
    "garden.notes": {
      category: "20",
      subcategory: "100000183",
    },
    "storingMaterials.notes": {
      category: "20",
      subcategory: "100000556",
    },
    "fireExit.notes": {
      category: "20",
      subcategory: "100000182",
    },
    "smokeAlarm.notes": {
      category: "20",
      subcategory: "100000194",
    },
    "metalGates.notes": {
      category: "20",
      subcategory: "100000188",
    },
    "doorMats.notes": {
      category: "16",
      subcategory: "100000181",
    },
    "communalAreas.notes": {
      category: "16",
      subcategory: "100000177",
    },
    "pets.notes": {
      category: "18",
      subcategory: "100000202",
    },
    "antisocialBehaviour.notes": {
      category: "23",
      subcategory: "100000302",
    },
    "otherComments.notes": {
      category: "20",
      subcategory: "100000303",
    },
  },
  isUnannouncedVisit: {
    notes: {
      category: "29",
      subcategory: "100000304",
    },
  },
  isVisitInside: {
    notes: {
      category: "29",
      subcategory: "100000305",
    },
  },
  tenantsPresent: {},
  household: {
    "houseMovingSchemes.notes": {
      category: "17",
      subcategory: "100000301",
    },
    "memberChanges.notes": {
      category: "17",
      subcategory: "100000193",
    },
    "rentArrears.notes": {
      category: "17",
      subcategory: "100000107",
    },
    "housingBenefits.notes": {
      category: "17",
      subcategory: "100000055",
    },
    "incomeOfficer.notes": {
      category: "17",
      subcategory: "100000215",
    },
    "otherProperty.notes": {
      category: "17",
      subcategory: "100000204",
    },
  },
  supportNeeds: {
    residentSustainmentNotes: {
      category: "23",
      subcategory: "100000192",
    },
    befriendingNotes: {
      category: "23",
      subcategory: "100000174",
    },
    adultSafeguardingNotes: {
      category: "23",
      subcategory: "100000173",
    },
    childrenYoungPeopleSafeguardingNotes: {
      category: "23",
      subcategory: "100000175",
    },
    domesticSexualViolenceNotes: {
      category: "23",
      subcategory: "100000180",
    },
    mentalHealth18To65Notes: {
      category: "23",
      subcategory: "100000186",
    },
    mentalHealthOver65Notes: {
      category: "23",
      subcategory: "100000187",
    },
  },
  disability: {
    notes: {
      category: "23",
      subcategory: "100000560",
    },
  },
  homeCheck: {},
  healthConcerns: {
    notes: {
      category: "23",
      subcategory: "100000200",
    },
  },
  other: {
    notes: {
      category: "24",
      subcategory: "100000209",
    },
  },
  unableToEnter: {
    "thirdFailedAttempt.needsAppointmentLetterReminder": {
      category: "30",
      subcategory: "100000206",
    },
    "fourthFailedAttempt.needsFraudInvestigationReminder": {
      category: "30",
      subcategory: "100000595",
    },
    "fourthFailedAttempt.needsFraudInvestigationLetterReminder": {
      category: "30",
      subcategory: "100000310",
    },
  },
  managerComment: {},
};

export default ProcessDatabaseSchema;
