import { processStoreNames } from "../../ProcessDatabaseSchema";
import { residentStoreNames } from "../../ResidentDatabaseSchema";

const noteKeys = [
  "notes",
  "residentSustainmentNotes",
  "befriendingNotes",
  "adultSafeguardingNotes",
  "childrenYoungPeopleSafeguardingNotes",
  "domesticSexualViolenceNotes",
  "mentalHealth18To65Notes",
  "mentalHealthOver65Notes",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const migrateNotes = (storeValues: any): void => {
  for (const value of Object.values(storeValues)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const v = value as any;

    for (const noteKey of noteKeys) {
      const noteValue = v[noteKey];

      if (noteValue === undefined) {
        continue;
      }

      v[noteKey] = {
        value: noteValue,
        isPostVisitAction: false,
      };
    }
  }
};

export default <
  T extends {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [s: string]: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    residents: { [s: string]: any };
  }
>(
  processData: T
): T => {
  for (const storeName of processStoreNames) {
    if (processData[storeName] === undefined) {
      continue;
    }

    migrateNotes(processData[storeName]);
  }

  for (const storeName of residentStoreNames) {
    if (
      !processData.residents ||
      processData.residents[storeName] === undefined
    ) {
      continue;
    }

    migrateNotes(processData.residents[storeName]);
  }

  return processData;
};
