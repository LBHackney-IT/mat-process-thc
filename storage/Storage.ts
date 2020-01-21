import {
  Database,
  Store,
  StoreNames,
  TransactionMode,
  StoreValue
} from "remultiform/database";
import { DatabaseContext } from "remultiform/database-context";
import { DeepPartial } from "utility-types";

import ExternalDatabaseSchema, {
  externalDatabaseName
} from "./ExternalDatabaseSchema";
import ProcessDatabaseSchema, {
  ProcessJson,
  ProcessRef,
  processDatabaseName,
  processStoreNames
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

  static async getProcessJson(
    processRef: ProcessRef
  ): Promise<DeepPartial<ProcessJson> | undefined> {
    if (!processRef || !this.ProcessContext) {
      return;
    }

    const db = await this.ProcessContext.database;

    let lastModified: string | undefined;

    const processData = (
      await Promise.all(
        processStoreNames.map(async storeName => {
          const value = await db.get(storeName, processRef);

          if (storeName === "lastModified") {
            lastModified = value as StoreValue<
              ProcessDatabaseSchema["schema"],
              typeof storeName
            >;

            return {};
          }

          return { [storeName]: value };
        })
      )
    ).reduce(
      (valuesObj, valueObj) => ({
        ...valuesObj,
        ...valueObj
      }),
      {}
    ) as ProcessJson["processData"];

    return {
      dateLastModified: lastModified,
      // Ideally we'd be exposing the version on the database directly, but
      // this hack works for now.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dataSchemaVersion: (db as any).db.version,
      processData
    };
  }

  static async updateProcessData(
    processRef: ProcessRef,
    data: ProcessJson & { processData: DeepPartial<ProcessJson["processData"]> }
  ): Promise<boolean> {
    const {
      dateCreated,
      dateLastModified,
      dataSchemaVersion,
      processData
    } = data;

    if (!processData) {
      return false;
    }

    if (!dateLastModified && !dateCreated) {
      throw new Error("No last modified or created dates");
    }

    if (!this.ProcessContext || !this.ProcessContext.database) {
      throw new Error("No database to update");
    }

    const db = await this.ProcessContext.database;

    // Ideally we'd be exposing the version on the database directly, but
    // this hack works for now.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (dataSchemaVersion !== (db as any).db.version) {
      throw new Error("Database schema versions don't match");
    }

    let isNewer = false;

    await db.transaction(
      processStoreNames,
      async stores => {
        const lastModified = new Date(dateLastModified || dateCreated);

        isNewer = await this.isProcessNewerThanStorage(
          stores.lastModified,
          processRef,
          lastModified
        );

        if (!isNewer) {
          return;
        }

        await stores.lastModified.put(processRef, lastModified.toISOString());

        await Promise.all(
          Object.entries(processData).map(async ([storeName, value]) => {
            if (storeName === "lastModified") {
              return;
            }

            await stores[
              storeName as StoreNames<ProcessDatabaseSchema["schema"]>
            ].put(
              processRef,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              value as any
            );
          })
        );
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
