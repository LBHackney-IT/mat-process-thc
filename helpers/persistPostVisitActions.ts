import { ComponentValue } from "remultiform/component-wrapper";
import {
  Database,
  NamedSchema,
  Schema,
  StoreNames,
  TransactionMode,
} from "remultiform/database";
import { Notes } from "../storage/DatabaseSchema";
import ProcessDatabaseSchema, {
  ProcessJson,
  processNotesPaths,
  processPostVisitActionMap,
  ProcessRef,
} from "../storage/ProcessDatabaseSchema";
import ResidentDatabaseSchema, {
  residentNotesPaths,
  residentPostVisitActionMap,
  ResidentRef,
} from "../storage/ResidentDatabaseSchema";
import Storage from "../storage/Storage";
import basePath from "./basePath";
import getMatApiData from "./getMatApiData";
import getMatApiJwt from "./getMatApiJwt";

interface NotesByPath {
  [pathName: string]: Notes;
}

interface NotesByStore {
  [storeName: string]: NotesByPath;
}

interface NotesByRef {
  [ref: string]: NotesByStore;
}

export type SchemaValues<DBSchema extends Schema> = {
  [StoreName in StoreNames<DBSchema>]?: Partial<DBSchema[StoreName]["value"]>;
};

const collectNotesByStoreName = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DBSchema extends NamedSchema<string, number, any>,
  StoreName extends StoreNames<DBSchema["schema"]>
>(
  storeName: StoreName,
  notesPaths: string[],
  data: SchemaValues<DBSchema["schema"]>
): NotesByStore => {
  const notesByStore = {} as NotesByStore;

  notesByStore[storeName] = notesPaths.reduce(
    (paths, path) => ({ ...paths, [path]: [] }),
    {}
  );

  const storeValue = data[storeName];

  if (!storeValue) {
    return {};
  }

  const pathArray = notesPaths.map((path) => path.split("."));

  for (const path of pathArray) {
    let valueForPath: ComponentValue<DBSchema, StoreName> = storeValue;

    const pathName = path.join(".");

    while (path.length > 0) {
      if (typeof valueForPath !== "object") {
        valueForPath = undefined;

        break;
      }

      const key = path.shift() as
        | keyof ComponentValue<DBSchema, StoreName>
        | "<this>";

      if (key === "<this>") {
        continue;
      }

      valueForPath = valueForPath[key];
    }

    if (valueForPath) {
      if (Array.isArray(valueForPath)) {
        notesByStore[storeName][pathName] = [
          ...notesByStore[storeName][pathName],
          ...valueForPath,
        ];
      } else {
        console.error(`Invalid note found at ${pathName}`);
      }
    }
  }

  return notesByStore;
};

const getNotes = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DBSchema extends NamedSchema<string, number, any>
>(
  values: SchemaValues<DBSchema["schema"]> | undefined,
  notesPaths: {
    [Name in StoreNames<DBSchema["schema"]>]: string[] | never[];
  }
): NotesByStore => {
  if (!values) {
    return {};
  }

  return Object.entries<string[] | never[]>(notesPaths)
    .filter(([, path]) => path.length > 0)
    .reduce<NotesByStore>(
      (noteValues, [storeName, paths]) => ({
        ...noteValues,
        ...collectNotesByStoreName<DBSchema, StoreNames<DBSchema["schema"]>>(
          storeName as StoreNames<DBSchema["schema"]>,
          paths,
          values
        ),
      }),
      {}
    );
};

export const getProcessDataNotes = (
  processData: SchemaValues<ProcessDatabaseSchema["schema"]>
): NotesByStore => {
  return getNotes(processData, processNotesPaths);
};

export const getResidentDataNotes = (
  residentData: {
    [ref in ResidentRef]?: SchemaValues<ResidentDatabaseSchema["schema"]>;
  }
): NotesByRef => {
  const notesByRef = {} as NotesByRef;

  for (const [ref, values] of Object.entries(residentData)) {
    notesByRef[ref] = getNotes(values, residentNotesPaths);
  }

  return notesByRef;
};

const postValueToBackend = async (
  value: string,
  postVisitActionMap: { category: string; subcategory: string },
  processRef: string
): Promise<void> => {
  const matApiJwt = getMatApiJwt(processRef);

  const body = {
    description: value,
    category: postVisitActionMap.category,
    subcategory: postVisitActionMap.subcategory,
    data: getMatApiData(processRef),
  };

  const response = await fetch(
    `${basePath}/api/v1/processes/${processRef}/post-visit-actions?jwt=${matApiJwt}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export const persistUnableToEnterPostVisitActions = async (
  unableToEnterData: Partial<
    ProcessDatabaseSchema["schema"]["unableToEnter"]["value"]
  >,
  processRef: ProcessRef
): Promise<void> => {
  if (!unableToEnterData) {
    return;
  }

  const unableToEnterMap = processPostVisitActionMap["unableToEnter"];
  const externalDatabase = await Storage.ExternalContext?.database;

  if (!externalDatabase) {
    return;
  }
  const residents = await externalDatabase.get("residents", processRef);
  const tenantNames = residents
    ? residents.tenants.map((tenant) => tenant.fullName).join(", ")
    : "N/A";
  const address = residents ? residents.address.join(", ") : "N/A";

  const firstFailedAttempt = unableToEnterData["firstFailedAttempt"];
  const secondFailedAttempt = unableToEnterData["secondFailedAttempt"];
  const thirdFailedAttempt = unableToEnterData["thirdFailedAttempt"];
  const fourthFailedAttempt = unableToEnterData["fourthFailedAttempt"];

  const firstFailedAttemptNotes =
    (firstFailedAttempt && firstFailedAttempt["notes"]) || "N/A";

  const secondFailedAttemptNotes =
    (secondFailedAttempt && secondFailedAttempt["notes"]) || "N/A";

  const thirdFailedAttemptNotes =
    (thirdFailedAttempt && thirdFailedAttempt["notes"]) || "N/A";

  const fourthFailedAttemptNotes =
    (fourthFailedAttempt && fourthFailedAttempt["notes"]) || "N/A";

  const firstAttemptDate =
    (firstFailedAttempt && firstFailedAttempt["date"]) || "N/A";

  const secondAttemptDate =
    (secondFailedAttempt && secondFailedAttempt["date"]) || "N/A";

  const thirdAttemptDate =
    (thirdFailedAttempt && thirdFailedAttempt["date"]) || "N/A";

  const fourthAttemptDate =
    (fourthFailedAttempt && fourthFailedAttempt["date"]) || "N/A";

  if (thirdFailedAttempt) {
    if (thirdFailedAttempt.needsAppointmentLetterReminder) {
      const config =
        unableToEnterMap["thirdFailedAttempt.needsAppointmentLetterReminder"];
      const description = `Action: Third Failed Attempt - Appointment Letter Reminder
Address: ${address}.
Resident(s) details: ${tenantNames}.
First Attempt: ${firstAttemptDate}, Notes: ${firstFailedAttemptNotes}.
Second Attempt: ${secondAttemptDate}, Notes: ${secondFailedAttemptNotes}.
Third Attempt: ${thirdAttemptDate}, Notes: ${thirdFailedAttemptNotes}`;

      postValueToBackend(description, config, processRef);
    }
  }

  if (fourthFailedAttempt) {
    const details = `Address: ${address}.
Resident(s) details: ${tenantNames}.
First Attempt: ${firstAttemptDate}, Notes: ${firstFailedAttemptNotes}.
Second Attempt: ${secondAttemptDate}, Notes: ${secondFailedAttemptNotes}.
Third Attempt: ${thirdAttemptDate}, Notes: ${thirdFailedAttemptNotes}.
Fourth Attempt: ${fourthAttemptDate}, Notes: ${fourthFailedAttemptNotes}.`;

    if (fourthFailedAttempt.needsFraudInvestigationLetterReminder) {
      const config =
        unableToEnterMap[
          "fourthFailedAttempt.needsFraudInvestigationLetterReminder"
        ];

      const description = `Action: Fourth Failed Attempt - Fraud Investigation Letter Reminder\n${details}`;

      postValueToBackend(description, config, processRef);
    }

    if (fourthFailedAttempt.needsFraudInvestigationReminder) {
      const config =
        unableToEnterMap["fourthFailedAttempt.needsFraudInvestigationReminder"];

      const description = `Action: Fourth Failed Attempt - Fraud Investigation Reminder\n${details}`;

      postValueToBackend(description, config, processRef);
    }
  }
};

const updateCreatedAt = async <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DBSchema extends NamedSchema<string, number, any>,
  StoreName extends StoreNames<DBSchema["schema"]>
>(
  database: Database<DBSchema>,
  storeName: StoreName,
  ref: string,
  path: string,
  noteIndex: number
): Promise<void> => {
  const pathComponents = path.split(".");

  await database.transaction(
    [storeName],
    async (stores) => {
      const store = stores[storeName];

      const value = await store.get(ref);

      if (!value) {
        throw new Error("No existing value to update for note");
      }

      let notes = value as ComponentValue<
        ProcessDatabaseSchema,
        StoreNames<ProcessDatabaseSchema["schema"]>
      >;

      let key:
        | keyof ComponentValue<
            ProcessDatabaseSchema,
            StoreNames<ProcessDatabaseSchema["schema"]>
          >
        | "<this>"
        | undefined;

      while (pathComponents.length > 0) {
        const newKey = pathComponents.shift() as
          | keyof ComponentValue<
              ProcessDatabaseSchema,
              StoreNames<ProcessDatabaseSchema["schema"]>
            >
          | "<this>";

        if (newKey === "<this>") {
          break;
        }

        key = newKey;
        notes = notes[key];
      }

      const newNotes = notes as Notes;

      newNotes[noteIndex] = {
        ...newNotes[noteIndex],
        createdAt: new Date().toISOString(),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await store.put(ref, value as any);
    },
    TransactionMode.ReadWrite
  );
};

export const persistPostVisitActions = async (
  processJson: Partial<ProcessJson>,
  processRef: ProcessRef
): Promise<void> => {
  const { processData } = processJson;

  const processDatabase = await Storage.ProcessContext?.database;

  if (!processDatabase) {
    throw new Error("Process database not found");
  }

  const processNotes =
    processData === undefined
      ? {}
      : getProcessDataNotes(
          processData as SchemaValues<ProcessDatabaseSchema["schema"]>
        );

  for (const [storeName, notesByPath] of Object.entries(processNotes)) {
    const storeMap =
      processPostVisitActionMap[
        storeName as StoreNames<ProcessDatabaseSchema["schema"]>
      ];

    for (const [path, notes] of Object.entries(notesByPath)) {
      const postVisitActionMap = storeMap[path];

      await Promise.all(
        notes.map(async (note, index) => {
          if (!note) {
            console.error(`Note for ${path} on ${storeName} was ${note}`);

            return;
          }

          if (note.createdAt || !note.isPostVisitAction || note.value === "") {
            return;
          }

          await postValueToBackend(note.value, postVisitActionMap, processRef);
          await updateCreatedAt(
            processDatabase,
            storeName as StoreNames<ProcessDatabaseSchema["schema"]>,
            processRef,
            path,
            index
          );
        })
      );
    }
  }

  const residentDatabase = await Storage.ResidentContext?.database;

  if (!residentDatabase) {
    throw new Error("Resident database not found");
  }

  const residentNotes =
    processData?.residents === undefined
      ? {}
      : getResidentDataNotes(
          processData.residents as {
            [ref in ResidentRef]?: SchemaValues<
              ResidentDatabaseSchema["schema"]
            >;
          }
        );

  for (const [residentRef, notesByStore] of Object.entries(residentNotes)) {
    for (const [storeName, notesByPath] of Object.entries(notesByStore)) {
      const storeMap =
        residentPostVisitActionMap[
          storeName as StoreNames<ResidentDatabaseSchema["schema"]>
        ];

      for (const [path, notes] of Object.entries(notesByPath)) {
        const postVisitActionMap = storeMap[path];

        await Promise.all(
          notes.map(async (note, index) => {
            if (!note) {
              console.error(`Note for ${path} on ${storeName} was ${note}`);

              return;
            }

            if (
              note.createdAt ||
              !note.isPostVisitAction ||
              note.value === ""
            ) {
              return;
            }

            await postValueToBackend(
              note.value,
              postVisitActionMap,
              processRef
            );
            await updateCreatedAt(
              residentDatabase,
              storeName as StoreNames<ResidentDatabaseSchema["schema"]>,
              residentRef,
              path,
              index
            );
          })
        );
      }
    }
  }

  const unableToEnterData =
    processData !== undefined && processData.unableToEnter !== undefined
      ? (processData.unableToEnter as Partial<
          ProcessDatabaseSchema["schema"]["unableToEnter"]["value"]
        >)
      : {};

  if (unableToEnterData) {
    await persistUnableToEnterPostVisitActions(unableToEnterData, processRef);
  }
};
