import { cloneDeep } from "lodash";
import { Database, StoreValue, TransactionMode } from "remultiform/database";
import { DatabaseContext } from "remultiform/database-context";
import { v5 as uuid } from "uuid";
import databaseSchemaVersion from "./databaseSchemaVersion";
import ExternalDatabaseSchema, {
  externalDatabaseName
} from "./ExternalDatabaseSchema";
import ProcessDatabaseSchema, {
  processDatabaseName,
  ProcessJson,
  ProcessRef,
  processStoreNames
} from "./ProcessDatabaseSchema";
import ResidentDatabaseSchema, {
  residentDatabaseName,
  ResidentRef,
  residentStoreNames
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

  if (version < 4) {
    delete processData.id;
    delete processData.residency;
    delete processData.tenant;

    version = 4;
  }

  if (version === 4) {
    const noteKeys = [
      "notes",
      "residentSustainmentNotes",
      "befriendingNotes",
      "adultSafeguardingNotes",
      "childrenYoungPeopleSafeguardingNotes",
      "domesticSexualViolenceNotes",
      "mentalHealth18To65Notes",
      "mentalHealthOver65Notes"
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
            isPostVisitAction: false
          };
        }
      }
    };

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

    version = 5;
  }

  if (version < 6) {
    version = 6;
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
      databaseSchemaVersion,
      {
        upgrade(upgrade) {
          let version = upgrade.oldVersion;

          if (version === 0) {
            upgrade.createStore("lastModified");
            upgrade.createStore("property");
            upgrade.createStore("isUnannouncedVisit");
            upgrade.createStore("isVisitInside");
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

          if (version === 2) {
            upgrade.createStore("tenantsPresent");

            version = 3;
          }

          if (version === 3) {
            // We don't remove the `id`, `residency`, or `tenants` stores,
            // which were removed from the schema with this version, to guard
            // against data loss.
            version = 4;
          }

          if (version === 4) {
            version = 5;
          }

          if (version === 5) {
            upgrade.createStore("otherNotes");
            version = 6;
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

    const residentDatabasePromise = Database.open<ResidentDatabaseSchema>(
      residentDatabaseName,
      databaseSchemaVersion,
      {
        upgrade(upgrade) {
          let version = upgrade.oldVersion;

          if (version === 0) {
            upgrade.createStore("id");
            upgrade.createStore("residency");
            upgrade.createStore("photo");
            upgrade.createStore("nextOfKin");
            upgrade.createStore("carer");

            version = 1;
          }

          if (version === 1) {
            upgrade.createStore("signature");

            version = 2;
          }

          if (version === 2) {
            upgrade.createStore("otherSupport");

            version = 3;
          }

          if (version < 6) {
            version = 6;
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
        processStoreNames.map(async storeName => {
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
        ...valueObj
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
          residentRefs.map(async ref => {
            return {
              [ref]: (
                await Promise.all(
                  residentStoreNames.map(async storeName => {
                    const value = await residentDatabase.get(storeName, ref);

                    return { [storeName]: value };
                  })
                )
              ).reduce(
                (valuesObj, valueObj) => ({
                  ...valuesObj,
                  ...valueObj
                }),
                {}
              )
            };
          })
        )
      ).reduce(
        (valuesObj, valueObj) => ({
          ...valuesObj,
          ...valueObj
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
        processData
      },
      imagesJson: images
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
      processData
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
        storeName => storeName !== "lastModified"
      );

      await processDatabase.transaction(
        realProcessStoreNames,
        async stores => {
          await Promise.all([
            ...realProcessStoreNames.map(async storeName => {
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
            })
          ]);
        },
        TransactionMode.ReadWrite
      );

      const residentRefs = migratedProcessData.tenantsPresent;
      const migratedResidentData = migratedProcessData.residents;

      if (migratedResidentData && residentRefs && residentRefs.length > 0) {
        await residentDatabase.transaction(
          residentStoreNames,
          async stores => {
            await Promise.all([
              ...residentStoreNames.map(async storeName => {
                const store = stores[storeName];

                await Promise.all(
                  residentRefs.map(async residentRef => {
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
              })
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
