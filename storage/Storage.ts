import {
  Database,
  Store,
  StoreNames,
  TransactionMode,
  StoreValue
} from "remultiform/database";
import { DatabaseContext } from "remultiform/database-context";
import { DeepPartial } from "utility-types";
import uuid from "uuid/v5";

import ExternalDatabaseSchema, {
  externalDatabaseName
} from "./ExternalDatabaseSchema";
import ProcessDatabaseSchema, {
  ProcessJson,
  ProcessRef,
  processDatabaseName,
  processStoreNames
} from "./ProcessDatabaseSchema";
import tmpProcessRef from "./processRef";

const migrateProcessData = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  processData: any,
  oldVersion: number,
  newVersion: number
  // eslint-disable-next-line @typescript-eslint/require-await
): Promise<Required<ProcessJson>["processData"]> => {
  let version = oldVersion;

  if (version === 0) {
    version = 1;
  }

  if (version === 1) {
    version = 2;
  }

  if (version !== newVersion) {
    throw new Error(
      `Unable to upgrade to ${newVersion} due to missing ` +
        `data migrations from ${version} onwards`
    );
  }

  return processData;
};

interface ImageJson {
  id: string;
  image: string;
}

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
      2,
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

          if (version === 1) {
            upgrade.createStore("household");

            version = 2;
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
  ): Promise<
    | {
        processJson: DeepPartial<ProcessJson>;
        imagesJson: ImageJson[];
      }
    | undefined
  > {
    if (!processRef || !this.ProcessContext) {
      return;
    }

    const db = await this.ProcessContext.database;

    let lastModified: string | undefined;

    let processData = (
      await Promise.all(
        processStoreNames.map(async storeName => {
          // The steps still use the hardcoded `processRef`, so we need to also
          // use it, even though we're using the correct value to persist to the
          // backend.
          const value = await db.get(storeName, tmpProcessRef);

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

    const images = [] as ImageJson[];

    if (processData) {
      let processDataString = JSON.stringify(processData);

      const imageDataUris = (
        processDataString.match(/data:image\/[\w.\-+]+.+?(?=")/g) || []
      ).filter((match, i, matches) => matches.indexOf(match) === i);

      for (const image of imageDataUris) {
        const [type] = /image\/[\w.\-+]+/.exec(image) || [];

        if (!type) {
          console.error(`Skipping unexpected data URI of type ${type}`);

          continue;
        }

        const id = uuid(image, processRef);
        const ext = type.replace("image/", "");

        processDataString = processDataString
          .split(image)
          .join(`image:${id}.${ext}`);

        images.push({ id, image });
      }

      processData = JSON.parse(processDataString);
    }

    return {
      processJson: {
        dateLastModified: lastModified,
        // Ideally we'd be exposing the version on the database directly, but
        // this hack works for now.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dataSchemaVersion: (db as any).db.version,
        processData
      },
      imagesJson: images
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

    const migratedProcessData = await migrateProcessData(
      processData,
      dataSchemaVersion || 0,
      // Ideally we'd be exposing the version on the database directly, but
      // this hack works for now.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (db as any).db.version
    );

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
          Object.entries(migratedProcessData).map(
            async ([storeName, value]) => {
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
            }
          )
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
