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
  const notesByStore: NotesByStore = {};

  notesByStore[storeName] = notesPaths.reduce(
    (paths, path) => ({ ...paths, [path]: [] }),
    {}
  );

  const storeValue = data[storeName];

  if (!storeValue) {
    return {};
  }

  for (const path of notesPaths) {
    const pathComponents = path.split(".");
    let valueForPath: ComponentValue<DBSchema, StoreName> = storeValue;

    while (pathComponents.length > 0) {
      if (typeof valueForPath !== "object") {
        valueForPath = undefined;

        break;
      }

      const key: keyof ComponentValue<
        DBSchema,
        StoreName
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      > = pathComponents.shift()!;

      valueForPath = valueForPath[key];
    }

    if (valueForPath !== undefined) {
      if (Array.isArray(valueForPath)) {
        notesByStore[storeName][path] = [
          ...notesByStore[storeName][path],
          ...valueForPath,
        ];
      } else {
        console.error(
          `Invalid note found at ${path} for ${storeName}: ${JSON.stringify(
            valueForPath
          )}`
        );
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

  const processDatabase = await Storage.ProcessContext?.database;
  const externalDatabase = await Storage.ExternalContext?.database;

  if (!processDatabase || !externalDatabase) {
    return;
  }

  const residents = await externalDatabase.get("residents", processRef);
  const tenantNames = residents
    ? residents.tenants.map((tenant) => tenant.fullName).join(", ")
    : "N/A";
  const address = residents ? residents.address.join(", ") : "N/A";

  const unableToEnterMap = processPostVisitActionMap.unableToEnter;

  const firstFailedAttempt = unableToEnterData.firstFailedAttempt;
  const firstAttemptDate = firstFailedAttempt?.date || "N/A";
  const firstFailedAttemptNotes = firstFailedAttempt?.notes || "N/A";

  const secondFailedAttempt = unableToEnterData.secondFailedAttempt;
  const secondAttemptDate = secondFailedAttempt?.date || "N/A";
  const secondFailedAttemptNotes = secondFailedAttempt?.notes || "N/A";

  const thirdFailedAttempt = unableToEnterData.thirdFailedAttempt;
  const thirdAttemptDate = thirdFailedAttempt?.date || "N/A";
  const thirdFailedAttemptNotes = thirdFailedAttempt?.notes || "N/A";

  if (
    thirdFailedAttempt?.needsAppointmentLetterReminder &&
    !thirdFailedAttempt.appointmentLetterReminderCreatedAt
  ) {
    const description = `Action: Third failed attempt - appointment letter reminder
Address: ${address}
Resident(s) details: ${tenantNames}
First attempt: ${firstAttemptDate}; notes: ${firstFailedAttemptNotes}
Second attempt: ${secondAttemptDate}; notes: ${secondFailedAttemptNotes}
Third attempt: ${thirdAttemptDate}; notes: ${thirdFailedAttemptNotes}`;

    await postValueToBackend(
      description,
      unableToEnterMap["thirdFailedAttempt.needsAppointmentLetterReminder"],
      processRef
    );

    unableToEnterData = {
      ...unableToEnterData,
      thirdFailedAttempt: {
        ...thirdFailedAttempt,
        appointmentLetterReminderCreatedAt: new Date().toISOString(),
      },
    };

    await processDatabase.put(
      "unableToEnter",
      processRef,
      unableToEnterData as ProcessDatabaseSchema["schema"]["unableToEnter"]["value"]
    );
  }

  const fourthFailedAttempt = unableToEnterData.fourthFailedAttempt;
  const fourthAttemptDate = fourthFailedAttempt?.date || "N/A";
  const fourthFailedAttemptNotes = fourthFailedAttempt?.notes || "N/A";

  if (fourthFailedAttempt) {
    const details = `Address: ${address}.
Resident(s) details: ${tenantNames}.
First attempt: ${firstAttemptDate}; notes: ${firstFailedAttemptNotes}
Second attempt: ${secondAttemptDate}; notes: ${secondFailedAttemptNotes}
Third attempt: ${thirdAttemptDate}; notes: ${thirdFailedAttemptNotes}
Fourth attempt: ${fourthAttemptDate}; notes: ${fourthFailedAttemptNotes}`;

    if (
      fourthFailedAttempt.needsFraudInvestigationReminder &&
      !fourthFailedAttempt.fraudInvestigationReminderCreatedAt
    ) {
      await postValueToBackend(
        `Action: fourth failed attempt - fraud investigation reminder\n${details}`,
        unableToEnterMap["fourthFailedAttempt.needsFraudInvestigationReminder"],
        processRef
      );

      unableToEnterData = {
        ...unableToEnterData,
        fourthFailedAttempt: {
          ...fourthFailedAttempt,
          fraudInvestigationReminderCreatedAt: new Date().toISOString(),
        },
      };

      await processDatabase.put(
        "unableToEnter",
        processRef,
        unableToEnterData as ProcessDatabaseSchema["schema"]["unableToEnter"]["value"]
      );
    }

    if (
      fourthFailedAttempt.needsFraudInvestigationLetterReminder &&
      !fourthFailedAttempt.fraudInvestigationLetterReminderCreatedAt
    ) {
      await postValueToBackend(
        `Action: Fourth failed attempt - fraud investigation letter reminder\n${details}`,
        unableToEnterMap[
          "fourthFailedAttempt.needsFraudInvestigationLetterReminder"
        ],
        processRef
      );

      unableToEnterData = {
        ...unableToEnterData,
        fourthFailedAttempt: {
          ...fourthFailedAttempt,
          fraudInvestigationLetterReminderCreatedAt: new Date().toISOString(),
        },
      };

      await processDatabase.put(
        "unableToEnter",
        processRef,
        unableToEnterData as ProcessDatabaseSchema["schema"]["unableToEnter"]["value"]
      );
    }
  }
};

const updateNotesCreatedAt = async <
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

      let notes: ComponentValue<DBSchema, StoreName> = value;

      let key: keyof ComponentValue<DBSchema, StoreName> | undefined;

      while (pathComponents.length > 0) {
        const newKey: keyof ComponentValue<
          DBSchema,
          StoreName
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        > = pathComponents.shift()!;

        key = newKey;
        notes = notes[key];
      }

      const newNotes: Notes = notes;

      newNotes[noteIndex] = {
        ...newNotes[noteIndex],
        createdAt: new Date().toISOString(),
      };

      await store.put(ref, value);
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
          await updateNotesCreatedAt(
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
            await updateNotesCreatedAt(
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

  await persistUnableToEnterPostVisitActions(unableToEnterData, processRef);
};
