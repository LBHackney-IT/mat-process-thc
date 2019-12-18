import { Database } from "remultiform/database/Database";
import { DatabaseContext } from "remultiform/database-context/DatabaseContext";

import DatabaseSchema, { databaseName } from "./DatabaseSchema";

export default class Storage {
  static Context: DatabaseContext<DatabaseSchema> | undefined = undefined;

  static init(): void {
    const databasePromise = Database.open<DatabaseSchema>(databaseName, 1, {
      upgrade(upgrade) {
        let version = upgrade.oldVersion;

        if (version === 0) {
          upgrade.createStore("outsidePropertyImages");
          upgrade.createStore("metalGateImages");

          version = 1;
        }

        if (version !== upgrade.newVersion) {
          throw new Error(
            `Unable to upgrade to ${upgrade.newVersion} due to missing migration`
          );
        }
      }
    });

    this.Context = new DatabaseContext(databasePromise);
  }
}
