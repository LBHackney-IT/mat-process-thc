import router from "next/router";
import { TransactionMode } from "remultiform/database";
import ProcessDatabaseSchema, {
  UnableToEnterPropertyNames,
} from "storage/ProcessDatabaseSchema";
import Storage from "../storage/Storage";
import getProcessRef from "./getProcessRef";

export const persistUnableToEnterDate = async (
  attemptKey: UnableToEnterPropertyNames
): Promise<void> => {
  const db = await Storage.ProcessContext?.database;

  if (!db) {
    console.error("Unable to find process database");

    return;
  }

  const processRef = getProcessRef(router);

  if (!processRef) {
    console.error("Unable to get process ref");

    return;
  }

  const date = new Date().toISOString();

  await db.transaction(
    ["unableToEnter"],
    async (stores) => {
      const unableToEnter =
        (await stores.unableToEnter.get(processRef)) ||
        ({} as ProcessDatabaseSchema["schema"]["unableToEnter"]["value"]);

      const attempt = {
        ...unableToEnter,
        [attemptKey]: {
          ...unableToEnter[attemptKey],
          date,
        },
      };

      await stores.unableToEnter.put(processRef, attempt);
    },
    TransactionMode.ReadWrite
  );
};
