import { NextRouter } from "next/router";
import { TransactionMode } from "remultiform/database";
import { externalStoreNames } from "../storage/ExternalDatabaseSchema";
import { processStoreNames } from "../storage/ProcessDatabaseSchema";
import { residentStoreNames } from "../storage/ResidentDatabaseSchema";
import Storage from "../storage/Storage";
import basePath from "./basePath";
import getProcessApiJwt from "./getProcessApiJwt";
import getProcessRef from "./getProcessRef";
import { persistPostVisitActions } from "./persistPostVisitActions";

const persistProcessData = async (
  router: NextRouter,
  setProgress?: (progress: number) => void
): Promise<void> => {
  let progress = 0;

  if (setProgress) {
    setProgress(progress);
  }

  if (
    !Storage.ExternalContext ||
    !Storage.ExternalContext.database ||
    !Storage.ResidentContext ||
    !Storage.ResidentContext.database ||
    !Storage.ProcessContext ||
    !Storage.ProcessContext.database
  ) {
    return;
  }

  const processRef = getProcessRef(router);
  const processApiJwt = getProcessApiJwt(processRef);

  if (!processRef || !processApiJwt) {
    console.error("Unable to persist process data due to missing session data");

    return;
  }

  let json = await Storage.getProcessJson(processRef);

  let processJson = json?.processJson || {};

  if (!processJson.processData) {
    console.warn("No process data to persist");

    return;
  }

  const imagesJson = json?.imagesJson || [];

  const progressIncrement = 1 / (imagesJson.length + 3);

  await Promise.all(
    imagesJson.map(async ({ id, image }) => {
      const response = await fetch(
        `${basePath}/api/v1/processes/${processRef}/images?jwt=${processApiJwt}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, image }),
        }
      );

      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }

      progress += progressIncrement;

      if (setProgress) {
        setProgress(progress);
      }
    })
  );

  {
    await persistPostVisitActions(processJson, processRef);

    progress += progressIncrement;

    if (setProgress) {
      setProgress(progress);
    }

    json = await Storage.getProcessJson(processRef);

    processJson = json?.processJson || {};
  }

  if (!processJson.processData) {
    console.warn("No process data to persist");

    return;
  }

  const response = await fetch(
    `${basePath}/api/v1/processes/${processRef}/processData?jwt=${processApiJwt}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(processJson),
    }
  );

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  progress += progressIncrement;

  if (setProgress) {
    setProgress(progress);
  }

  // To reduce risk of data loss, we only clear up the data if we sent
  // something to the backend.
  {
    const externalDatabase = await Storage.ExternalContext.database;
    const residentDatabase = await Storage.ResidentContext.database;
    const processDatabase = await Storage.ProcessContext.database;

    await externalDatabase.transaction(
      externalStoreNames,
      async (stores) => {
        await Promise.all(
          Object.values(stores).map((store) => store.delete(processRef))
        );
      },
      TransactionMode.ReadWrite
    );

    const residentRefs = await processDatabase.get(
      "tenantsPresent",
      processRef
    );

    if (residentRefs) {
      await residentDatabase.transaction(
        residentStoreNames,
        async (stores) => {
          await Promise.all(
            Object.values(stores).map(async (store) => {
              for (const ref of residentRefs) {
                await store.delete(ref);
              }
            })
          );
        },
        TransactionMode.ReadWrite
      );
    }

    await processDatabase.transaction(
      processStoreNames,
      async (stores) => {
        await Promise.all(
          Object.values(stores).map((store) => store.delete(processRef))
        );
      },
      TransactionMode.ReadWrite
    );
  }

  if (setProgress) {
    setProgress(1);
  }
};

export default persistProcessData;
