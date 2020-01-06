import {
  Database,
  Store,
  StoreNames,
  TransactionMode
} from "remultiform/database";
import { DatabaseContext } from "remultiform/database-context";

import DatabaseSchema, { databaseName } from "./DatabaseSchema";

export default class Storage {
  static Context: DatabaseContext<DatabaseSchema> | undefined = undefined;

  static init(): void {
    const databasePromise = Database.open<DatabaseSchema>(databaseName, 1, {
      upgrade(upgrade) {
        let version = upgrade.oldVersion;

        if (version === 0) {
          upgrade.createStore("lastModified");
          upgrade.createStore("property");
          upgrade.createStore("isUnannouncedVisit");
          upgrade.createStore("isVisitInside");
          upgrade.createStore("id");
          upgrade.createStore("residency");
          upgrade.createStore("tenant");

          version = 1;
        }

        if (version !== upgrade.newVersion) {
          throw new Error(
            `Unable to upgrade to ${upgrade.newVersion} due to missing ` +
              `migrations from ${version} onwards`
          );
        }
      }
    });

    this.Context = new DatabaseContext(databasePromise);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async updateData(processRef: string, data: any): Promise<boolean> {
    if (!this.Context) {
      return false;
    }

    if (!this.Context.database) {
      return false;
    }

    const database = await this.Context.database;

    let isNewer = false;

    await database.transaction(
      ["lastModified"],
      async stores => {
        const lastModified = new Date(data.dateLastModified);

        isNewer = await this.isNewerThanStorage(
          stores.lastModified,
          processRef,
          lastModified
        );

        if (!isNewer) {
          return;
        }

        await stores.lastModified.put(processRef, lastModified);

        // Update the rest of the data here.
      },
      TransactionMode.ReadWrite
    );

    return isNewer;
  }

  static async updateLastModified(processRef: string): Promise<void> {
    if (!this.Context) {
      return;
    }

    if (!this.Context.database) {
      return;
    }

    const database = await this.Context.database;

    await database.put("lastModified", processRef, new Date());
  }

  static async isNewerThanStorage(
    store: Store<
      DatabaseSchema["schema"],
      StoreNames<DatabaseSchema["schema"]>[],
      "lastModified"
    >,
    processRef: string,
    lastModified: Date
  ): Promise<boolean> {
    const storedLastModified = await store.get(processRef);

    return !storedLastModified || lastModified > storedLastModified;
  }
}
