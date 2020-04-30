import { cloneDeep } from "lodash";
import { Database, StoreValue, TransactionMode } from "remultiform/database";
import { DatabaseContext } from "remultiform/database-context";
import { v5 as uuid } from "uuid";
import databaseSchemaVersion from "./databaseSchemaVersion";
import ExternalDatabaseSchema, {
  externalDatabaseName,
} from "./ExternalDatabaseSchema";
import dataMigrations from "./migrations/data";
import externalSchemaMigrations from "./migrations/schema/external";
import processSchemaMigrations from "./migrations/schema/process";
import residentSchemaMigrations from "./migrations/schema/resident";
import ProcessDatabaseSchema, {
  processDatabaseName,
  ProcessJson,
  ProcessRef,
  processStoreNames,
} from "./ProcessDatabaseSchema";
import ResidentDatabaseSchema, {
  residentDatabaseName,
  ResidentRef,
  residentStoreNames,
} from "./ResidentDatabaseSchema";

const migrateProcessData = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  processData: any,
  oldVersion: number,
  newVersion: number
  // eslint-disable-next-line @typescript-eslint/require-await
): Promise<Required<ProcessJson>["processData"]> => {
  let version = oldVersion;
  processData = cloneDeep(processData);

  while (version < newVersion) {
    const migration = dataMigrations[version];

    if (migration) {
      processData = migration(processData);
    }

    version++;
  }

  return processData;
};

interface ImageJson {
  id: string;
  image: string;
}

interface ImageIdentifier {
  id: string;
  ext: string;
}

export default class Storage {
  static ExternalContext:
    | DatabaseContext<ExternalDatabaseSchema>
    | undefined = undefined;
  static ProcessContext:
    | DatabaseContext<ProcessDatabaseSchema>
    | undefined = undefined;
  static ResidentContext:
    | DatabaseContext<ResidentDatabaseSchema>
    | undefined = undefined;

  static init(): void {
    const externalDatabasePromise = Database.open<ExternalDatabaseSchema>(
      externalDatabaseName,
      2,
      {
        upgrade(upgrade) {
          if (upgrade.newVersion === undefined) {
            return;
          }

          let version = upgrade.oldVersion;

          while (version < upgrade.newVersion) {
            const migration = externalSchemaMigrations[version];

            if (migration) {
              migration(upgrade);
            }

            version++;
          }
        },
      }
    );

    const processDatabasePromise = Database.open<ProcessDatabaseSchema>(
      processDatabaseName,
      databaseSchemaVersion,
      {
        upgrade(upgrade) {
          if (upgrade.newVersion === undefined) {
            return;
          }

          let version = upgrade.oldVersion;

          while (version < upgrade.newVersion) {
            const migration = processSchemaMigrations[version];

            if (migration) {
              migration(upgrade);
            }

            version++;
          }
        },
      }
    );

    const residentDatabasePromise = Database.open<ResidentDatabaseSchema>(
      residentDatabaseName,
      databaseSchemaVersion,
      {
        upgrade(upgrade) {
          if (upgrade.newVersion === undefined) {
            return;
          }

          let version = upgrade.oldVersion;

          while (version < upgrade.newVersion) {
            const migration = residentSchemaMigrations[version];

            if (migration) {
              migration(upgrade);
            }

            version++;
          }
        },
      }
    );

    this.ExternalContext = new DatabaseContext(externalDatabasePromise);
    this.ProcessContext = new DatabaseContext(processDatabasePromise);
    this.ResidentContext = new DatabaseContext(residentDatabasePromise);
  }

  static async getProcessJson(
    processRef: ProcessRef
  ): Promise<
    | {
        processJson: Partial<ProcessJson>;
        imagesJson: ImageJson[];
      }
    | undefined
  > {
    if (!processRef || !this.ProcessContext) {
      return;
    }

    const processDatabase = await this.ProcessContext.database;

    let lastModified: string | undefined;

    let processData = (
      await Promise.all(
        processStoreNames.map(async (storeName) => {
          const value = await processDatabase.get(storeName, processRef);

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
        ...valueObj,
      }),
      {}
    ) as Exclude<ProcessJson["processData"], undefined>;

    const residentRefs = processData.tenantsPresent as
      | ResidentRef[]
      | undefined;

    if (residentRefs && residentRefs.length && this.ResidentContext) {
      const residentDatabase = await this.ResidentContext.database;

      processData.residents = (
        await Promise.all(
          residentRefs.map(async (ref) => {
            return {
              [ref]: (
                await Promise.all(
                  residentStoreNames.map(async (storeName) => {
                    const value = await residentDatabase.get(storeName, ref);

                    return { [storeName]: value };
                  })
                )
              ).reduce(
                (valuesObj, valueObj) => ({
                  ...valuesObj,
                  ...valueObj,
                }),
                {}
              ),
            };
          })
        )
      ).reduce(
        (valuesObj, valueObj) => ({
          ...valuesObj,
          ...valueObj,
        }),
        {}
      );
    }

    let processDataString = JSON.stringify(processData);

    const imageDataUris = (
      processDataString.match(/data:image\/[\w.\-+]+.+?(?=")/g) || []
    ).filter((match, i, matches) => matches.indexOf(match) === i);
    const images = [] as ImageJson[];

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

    return {
      processJson: {
        dateLastModified: lastModified,
        // Ideally we'd be exposing the version on the database directly, but
        // this hack works for now.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dataSchemaVersion: (processDatabase as any).db.version,
        processData,
      },
      imagesJson: images,
    };
  }

  static getImagesToFetch(
    processData: ProcessJson["processData"]
  ): ImageIdentifier[] {
    const processDataString = JSON.stringify(processData);

    const imageKeys = (
      processDataString.match(/image:[\w-]+?.+?(?=")/g) || []
    ).filter((match, i, matches) => matches.indexOf(match) === i);

    const images = [] as ImageIdentifier[];

    for (const image of imageKeys) {
      const [id, ext] = image.replace("image:", "").split(".", 2);

      images.push({ id, ext });
    }

    return images;
  }

  static async updateProcessData(
    processRef: ProcessRef,
    data: ProcessJson
  ): Promise<boolean> {
    const {
      dateCreated,
      dateLastModified,
      dataSchemaVersion,
      processData,
    } = data;

    if (!processData) {
      return false;
    }

    if (!dateLastModified && !dateCreated) {
      throw new Error("No last modified or created dates");
    }

    if (!this.ProcessContext || !this.ProcessContext.database) {
      throw new Error("No process database to update");
    }

    if (!this.ResidentContext || !this.ResidentContext.database) {
      throw new Error("No resident database to update");
    }

    const processDatabase = await this.ProcessContext.database;
    const residentDatabase = await this.ResidentContext.database;

    if (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (processDatabase as any).db.version !==
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (residentDatabase as any).db.version
    ) {
      throw new Error("Process and resident database versions must match");
    }

    // Ideally we'd be exposing the version on the databases directly, but
    // this hack works for now.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schemaVersion = (processDatabase as any).db.version;

    const migratedProcessData = await migrateProcessData(
      processData,
      dataSchemaVersion || 0,
      schemaVersion
    );

    const lastModified = new Date(dateLastModified || dateCreated);

    const isNewer = await this.isProcessNewerThanStorage(
      processRef,
      lastModified
    );

    if (isNewer) {
      const realProcessStoreNames = processStoreNames.filter(
        (storeName) => storeName !== "lastModified"
      );

      await processDatabase.transaction(
        realProcessStoreNames,
        async (stores) => {
          await Promise.all([
            ...realProcessStoreNames.map(async (storeName) => {
              const store = stores[storeName];
              const value = migratedProcessData[storeName];

              if (value === undefined) {
                await store.delete(processRef);
              } else {
                await store.put(
                  processRef,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  value as any
                );
              }
            }),
          ]);
        },
        TransactionMode.ReadWrite
      );

      const residentRefs = migratedProcessData.tenantsPresent;
      const migratedResidentData = migratedProcessData.residents;

      if (migratedResidentData && residentRefs && residentRefs.length > 0) {
        await residentDatabase.transaction(
          residentStoreNames,
          async (stores) => {
            await Promise.all([
              ...residentStoreNames.map(async (storeName) => {
                const store = stores[storeName];

                await Promise.all(
                  residentRefs.map(async (residentRef) => {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const ref = residentRef!;
                    const allValues = migratedResidentData[ref];
                    const value =
                      allValues === undefined
                        ? undefined
                        : allValues[storeName];

                    if (value === undefined) {
                      await store.delete(ref);
                    } else {
                      await store.put(
                        ref,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        value as any
                      );
                    }
                  })
                );
              }),
            ]);
          },
          TransactionMode.ReadWrite
        );
      }
    }

    // Do this last so if anything goes wrong, we can try again.
    await processDatabase.put(
      "lastModified",
      processRef,
      lastModified.toISOString()
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
    processRef: string,
    lastModified: Date
  ): Promise<boolean> {
    if (!this.ProcessContext) {
      return false;
    }

    const db = await this.ProcessContext.database;

    const storedLastModified = await db.get("lastModified", processRef);

    return storedLastModified === undefined
      ? true
      : lastModified > new Date(storedLastModified);
  }
}
