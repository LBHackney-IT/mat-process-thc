import {
  Database,
  Store,
  StoreNames,
  TransactionMode
} from "remultiform/database";
import { DatabaseContext } from "remultiform/database-context";

import ExternalDatabaseSchema, {
  externalDatabaseName
} from "./ExternalDatabaseSchema";
import ProcessDatabaseSchema, {
  processDatabaseName
} from "./ProcessDatabaseSchema";

export default class Storage {
  static ExternalContext:
    | DatabaseContext<ExternalDatabaseSchema>
    | undefined = undefined;
  static ProcessContext:
    | DatabaseContext<ProcessDatabaseSchema>
    | undefined = undefined;

  static init(): void {
    const externalDatabasePromise = Database.open<ExternalDatabaseSchema>(
      externalDatabaseName,
      1,
      {
        upgrade(upgrade) {
          let version = upgrade.oldVersion;

          if (version === 0) {
            upgrade.createStore("tenancy");
            upgrade.createStore("residents");

            version = 1;
          }

          if (version !== upgrade.newVersion) {
            throw new Error(
              `Unable to upgrade to ${upgrade.newVersion} due to missing ` +
                `migrations from ${version} onwards`
            );
          }
        }
      }
    );

    const processDatabasePromise = Database.open<ProcessDatabaseSchema>(
      processDatabaseName,
      1,
      {
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
            upgrade.createStore("homeCheck");
            upgrade.createStore("healthConcerns");
            upgrade.createStore("disability");
            upgrade.createStore("supportNeeds");

            version = 1;
          }

          if (version !== upgrade.newVersion) {
            throw new Error(
              `Unable to upgrade to ${upgrade.newVersion} due to missing ` +
                `migrations from ${version} onwards`
            );
          }
        }
      }
    );

    this.ExternalContext = new DatabaseContext(externalDatabasePromise);
    this.ProcessContext = new DatabaseContext(processDatabasePromise);
  }

  static async updateProcessData(
    processRef: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
  ): Promise<boolean> {
    if (!this.ProcessContext) {
      return false;
    }

    if (!this.ProcessContext.database) {
      return false;
    }

    const database = await this.ProcessContext.database;

    let isNewer = false;

    await database.transaction(
      ["lastModified"],
      async stores => {
        const lastModified = new Date(
          data.dateLastModified || data.dateCreated
        );

        isNewer = await this.isProcessNewerThanStorage(
          stores.lastModified,
          processRef,
          lastModified
        );

        if (!isNewer) {
          return;
        }

        await stores.lastModified.put(processRef, lastModified.toISOString());

        // Update the rest of the data here.
      },
      TransactionMode.ReadWrite
    );

    return isNewer;
  }

  static async updateProcessLastModified(processRef: string): Promise<void> {
    if (!this.ProcessContext) {
      return;
    }

    if (!this.ProcessContext.database) {
      return;
    }

    const database = await this.ProcessContext.database;

    await database.put("lastModified", processRef, new Date().toISOString());
  }

  static async isProcessNewerThanStorage(
    store: Store<
      ProcessDatabaseSchema["schema"],
      StoreNames<ProcessDatabaseSchema["schema"]>[],
      "lastModified"
    >,
    processRef: string,
    lastModified: Date
  ): Promise<boolean> {
    const storedLastModified = await store.get(processRef);

    return !storedLastModified || lastModified > new Date(storedLastModified);
  }
}
