import React, { useMemo } from "react";
import { useAsync } from "react-async-hook";
import {
  ComponentDatabaseMap,
  ComponentValue
} from "remultiform/component-wrapper";
import { StoreMap, StoreNames, StoreValue } from "remultiform/database";

import Thumbnail from "../components/Thumbnail";
import ProcessDatabaseSchema from "../storage/ProcessDatabaseSchema";
import processRef from "../storage/processRef";
import Storage from "../storage/Storage";

import ProcessStepDefinition from "./ProcessStepDefinition";
import useDatabase from "./useDatabase";

interface Value<Name extends StoreNames<ProcessDatabaseSchema["schema"]>> {
  databaseMap: ComponentDatabaseMap<ProcessDatabaseSchema, Name>;
  renderValue(
    value: ComponentValue<ProcessDatabaseSchema, Name>
  ): React.ReactNode;
}

interface Row<Names extends StoreNames<ProcessDatabaseSchema["schema"]>> {
  label: string;
  values: Value<Names>[];
  images: ComponentDatabaseMap<ProcessDatabaseSchema, Names>[];
}

export interface SectionRow {
  key: string;
  value: React.ReactNode;
}

const findValue = <
  StoreName extends StoreNames<ProcessDatabaseSchema["schema"]>
>(
  storeValue:
    | StoreValue<ProcessDatabaseSchema["schema"], StoreName>
    | undefined,
  databaseMap: ComponentDatabaseMap<ProcessDatabaseSchema, StoreName>
): ComponentValue<ProcessDatabaseSchema, StoreName> | undefined => {
  if (storeValue === undefined) {
    return undefined;
  }

  const propertyMap = databaseMap.property as
    | [string]
    | [string, string]
    | undefined;

  if (!propertyMap) {
    return storeValue;
  }

  const child = ((storeValue as unknown) as {
    [s: string]: ComponentValue<ProcessDatabaseSchema, StoreName>;
  })[propertyMap[0]];

  if (child === undefined) {
    return undefined;
  }

  if (propertyMap.length === 1) {
    return (child as unknown) as ComponentValue<
      ProcessDatabaseSchema,
      StoreName
    >;
  }

  const grandChild = ((storeValue as unknown) as {
    [s: string]: {
      [s: string]: ComponentValue<ProcessDatabaseSchema, StoreName>;
    };
  })[propertyMap[0]][propertyMap[1]];

  if (grandChild === undefined) {
    return undefined;
  }

  return (grandChild as unknown) as ComponentValue<
    ProcessDatabaseSchema,
    StoreName
  >;
};

const useReviewSectionRows = <
  Names extends StoreNames<ProcessDatabaseSchema["schema"]>
>(
  steps: ProcessStepDefinition<ProcessDatabaseSchema, Names>[]
): SectionRow[] => {
  const database = useDatabase(Storage.ProcessContext);

  const rows = useMemo(
    () =>
      steps.reduce(
        (r, { review, step }) => [
          ...r,
          ...(review
            ? review.rows.reduce(
                (r, row) => [
                  ...r,
                  {
                    label: row.label,
                    values: step.componentWrappers
                      .filter(({ key, databaseMap }) =>
                        Boolean(databaseMap && row.values[key])
                      )
                      .map(({ key, databaseMap }) => {
                        return {
                          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                          databaseMap: databaseMap!,
                          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/unbound-method
                          renderValue: row.values[key]!.renderValue
                        };
                      }),
                    images: [
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      step.componentWrappers.find(({ key, databaseMap }) =>
                        Boolean(databaseMap && row.images === key)
                      )?.databaseMap!
                    ].filter(Boolean)
                  }
                ],
                [] as Row<Names>[]
              )
            : [])
        ],
        [] as Row<Names>[]
      ),
    [steps]
  );

  const storeNames = useMemo(
    () =>
      rows
        .map(({ values, images }) => [
          ...values.map(({ databaseMap }) => databaseMap),
          ...images
        ])
        .map(databaseMaps =>
          databaseMaps.reduce(
            (sectionStoreNames, databaseMap) => [
              ...sectionStoreNames,
              databaseMap.storeName
            ],
            [] as StoreNames<ProcessDatabaseSchema["schema"]>[]
          )
        )
        .reduce(
          (names, sectionStoreNames) => [...names, ...sectionStoreNames],
          [] as StoreNames<ProcessDatabaseSchema["schema"]>[]
        )
        .filter((storeName, i, names) => names.indexOf(storeName) === i),
    [rows]
  );

  const storeValues = useAsync(async () => {
    if (database.loading) {
      return;
    }

    const db = database.result;

    if (!db) {
      throw new Error("No database to check for process state");
    }

    let allValues: {
      [StoreName in StoreNames<ProcessDatabaseSchema["schema"]>]?: StoreValue<
        ProcessDatabaseSchema["schema"],
        StoreName
      >;
    } = {};

    await db.transaction(
      storeNames,
      async (
        stores: StoreMap<
          ProcessDatabaseSchema["schema"],
          StoreNames<ProcessDatabaseSchema["schema"]>[]
        >
      ) => {
        const values = await Promise.all(
          storeNames.map(async storeName => {
            const value = await stores[storeName].get(processRef);

            return [storeName, value] as [
              StoreNames<ProcessDatabaseSchema["schema"]>,
              StoreValue<
                ProcessDatabaseSchema["schema"],
                StoreNames<ProcessDatabaseSchema["schema"]>
              >
            ];
          })
        );

        allValues = {
          ...allValues,
          ...values.reduce(
            (storeValues, [storeName, value]) => ({
              ...storeValues,
              [storeName]: value
            }),
            {} as {
              [StoreName in StoreNames<
                ProcessDatabaseSchema["schema"]
              >]?: StoreValue<ProcessDatabaseSchema["schema"], StoreName>;
            }
          )
        };
      }
    );

    return allValues;
  }, [database.loading, database.result, processRef, storeNames.join(",")]);

  return useMemo(
    () =>
      rows
        .map(row => {
          const values = row.values
            .map(v => {
              const { databaseMap, renderValue } = v;

              if (storeValues.loading || storeValues.result === undefined) {
                return undefined;
              }

              const value = findValue(
                storeValues.result[databaseMap.storeName],
                databaseMap
              );

              if (!value) {
                return undefined;
              }

              return renderValue(value);
            })
            .filter(Boolean) as React.ReactNode[];

          const images = (row.images
            .map(databaseMap => {
              if (storeValues.loading || storeValues.result === undefined) {
                return undefined;
              }

              return (findValue(
                storeValues.result[databaseMap.storeName],
                databaseMap
              ) as unknown) as string[] | undefined;
            })
            .filter(Boolean) as string[][]).reduce(
            (i, images) => [...i, ...images],
            [] as string[]
          );

          if (!values.length && !images.length) {
            return undefined;
          }

          return {
            key: row.label,
            value: (
              <div className="row">
                <div className="values">
                  {values.map((value, index) => (
                    <div key={index}>{value}</div>
                  ))}
                </div>
                <div className="images">
                  {images.map((src, index) => (
                    <div key={index}>
                      <Thumbnail
                        src={src}
                        alt="Thumbnail of an uploaded image"
                      />
                    </div>
                  ))}
                </div>
                <style jsx>{`
                  .row {
                    display: flex;
                    justify-content: space-between;
                    align-items: stretch;
                  }

                  .images {
                    flex: 1;
                    margin-left: 2em;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: flex-end;
                  }

                  .images > div {
                    margin-left: 0.2em;
                  }
                `}</style>
              </div>
            )
          };
        })
        .filter(Boolean) as SectionRow[],
    [rows, storeValues.loading, storeValues.result]
  );
};

export default useReviewSectionRows;
