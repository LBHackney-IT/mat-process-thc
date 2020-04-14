import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { useAsync, UseAsyncReturn } from "react-async-hook";
import {
  ComponentDatabaseMap,
  ComponentValue,
} from "remultiform/component-wrapper";
import {
  Database,
  NamedSchema,
  Schema,
  StoreKey,
  StoreMap,
  StoreNames,
  StoreValue,
} from "remultiform/database";
import { DatabaseContext } from "remultiform/database-context";
import InternalLink from "../components/InternalLink";
import Thumbnail from "../components/Thumbnail";
import PageSlugs, {
  repeatingStepSlugs,
  urlObjectForSlug,
} from "../steps/PageSlugs";
import ResidentDatabaseSchema, {
  ResidentRef,
  residentStoreNames,
} from "../storage/ResidentDatabaseSchema";
import nextSlugWithId from "./nextSlugWithId";
import ProcessStepDefinition from "./ProcessStepDefinition";
import urlsForRouter from "./urlsForRouter";
import useDatabase from "./useDatabase";

interface Value<
  DBSchema extends NamedSchema<string, number, Schema>,
  Name extends StoreNames<DBSchema["schema"]>
> {
  databaseMap: ComponentDatabaseMap<DBSchema, Name>;
  renderValue(value: ComponentValue<DBSchema, Name>): React.ReactNode;
}

interface Row<
  DBSchema extends NamedSchema<string, number, Schema>,
  Names extends StoreNames<DBSchema["schema"]>
> {
  label: string;
  values: Value<DBSchema, Names>[];
  images: ComponentDatabaseMap<DBSchema, Names>[];
  changeSlug: PageSlugs;
}

export interface SectionRow {
  key: string;
  value: React.ReactNode;
}

const findKey = <
  DBSchema extends NamedSchema<string, number, Schema>,
  Name extends StoreNames<DBSchema["schema"]>
>(
  databaseMap: ComponentDatabaseMap<DBSchema, Name>,
  tenantId: ResidentRef | undefined
): StoreKey<DBSchema["schema"], Name> | undefined => {
  const { storeName, key } = databaseMap;

  return typeof key === "function"
    ? residentStoreNames.includes(
        storeName as StoreNames<ResidentDatabaseSchema["schema"]>
      )
      ? tenantId
      : key()
    : key;
};

const findValue = <
  DBSchema extends NamedSchema<string, number, Schema>,
  Name extends StoreNames<DBSchema["schema"]>
>(
  storeValue: StoreValue<DBSchema["schema"], Name> | undefined,
  databaseMap: ComponentDatabaseMap<DBSchema, Name>
): ComponentValue<DBSchema, Name> | undefined => {
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
    [s: string]: ComponentValue<DBSchema, Name>;
  })[propertyMap[0]];

  if (child === undefined) {
    return undefined;
  }

  if (propertyMap.length === 1) {
    return (child as unknown) as ComponentValue<DBSchema, Name>;
  }

  const grandChild = ((storeValue as unknown) as {
    [s: string]: {
      [s: string]: ComponentValue<DBSchema, Name>;
    };
  })[propertyMap[0]][propertyMap[1]];

  if (grandChild === undefined) {
    return undefined;
  }

  return (grandChild as unknown) as ComponentValue<DBSchema, Name>;
};

const useRows = <
  DBSchema extends NamedSchema<string, number, Schema>,
  Names extends StoreNames<DBSchema["schema"]>
>(
  steps: ProcessStepDefinition<DBSchema, Names>[]
): Row<DBSchema, Names>[] => {
  return useMemo(
    () =>
      steps.reduce<Row<DBSchema, Names>[]>(
        (r, { review, step }) => [
          ...r,
          ...(review
            ? review.rows.reduce<Row<DBSchema, Names>[]>(
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
                          renderValue: row.values[key]!.renderValue,
                        };
                      }),
                    images: [
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      step.componentWrappers.find(({ key, databaseMap }) =>
                        Boolean(databaseMap && row.images === key)
                      )?.databaseMap!,
                    ].filter(Boolean),
                    changeSlug: step.slug as PageSlugs,
                  },
                ],
                []
              )
            : []),
        ],
        []
      ),
    [steps]
  );
};

const useStoreInfo = <
  DBSchema extends NamedSchema<string, number, Schema>,
  Names extends StoreNames<DBSchema["schema"]>
>(
  rows: Row<DBSchema, Names>[],
  tenantId: ResidentRef | undefined
): { [Name in Names]?: StoreKey<DBSchema["schema"], Names>[] } => {
  return useMemo(() => {
    const databaseMaps = rows.reduce<ComponentDatabaseMap<DBSchema, Names>[]>(
      (maps, { values, images }) => [
        ...maps,
        ...values.map(({ databaseMap }) => databaseMap),
        ...images,
      ],
      []
    );

    const storeInfo: {
      [Name in Names]?: StoreKey<DBSchema["schema"], Names>[];
    } = {};

    for (const databaseMap of databaseMaps) {
      const { storeName } = databaseMap;

      const key = findKey(databaseMap, tenantId);

      if (key === undefined || storeInfo[storeName]?.includes(key)) {
        continue;
      }

      storeInfo[storeName] = [
        ...((storeInfo[storeName] || []) as StoreKey<
          DBSchema["schema"],
          Names
        >[]),
        key,
      ];
    }

    return storeInfo;
  }, [rows, tenantId]);
};

const useStoreValues = <
  DBSchema extends NamedSchema<string, number, Schema>,
  Names extends StoreNames<DBSchema["schema"]>
>(
  context: DatabaseContext<DBSchema> | undefined,
  rows: Row<DBSchema, Names>[],
  tenantId: ResidentRef | undefined
): UseAsyncReturn<
  | {
      [Name in Names]?: {
        [Key in StoreKey<DBSchema["schema"], Names>]?:
          | StoreValue<DBSchema["schema"], Name>
          | undefined;
      };
    }
  | undefined,
  [boolean, Database<DBSchema> | undefined, string]
> => {
  const database = useDatabase(context);
  const storeInfo = useStoreInfo(rows, tenantId);

  return useAsync(async () => {
    if (database.loading) {
      return;
    }

    const db = database.result;

    if (!db) {
      throw new Error("No database to check for process state");
    }

    let allValues: {
      [Name in Names]?: {
        [Key in StoreKey<DBSchema["schema"], Names>]?:
          | StoreValue<DBSchema["schema"], Name>
          | undefined;
      };
    } = {};

    await db.transaction(
      Object.keys(storeInfo) as Names[],
      async (stores: StoreMap<DBSchema["schema"], Names[]>) => {
        const values = await Promise.all(
          (Object.keys(stores) as Names[]).map<
            Promise<
              [
                Names,
                {
                  [Key in StoreKey<DBSchema["schema"], Names>]?: StoreValue<
                    DBSchema["schema"],
                    Names
                  >;
                }
              ]
            >
          >(async (storeName) => {
            const storeKeys = storeInfo[storeName];

            const valueSet = (
              await Promise.all(
                ((storeKeys || []) as StoreKey<
                  DBSchema["schema"],
                  Names
                >[]).map(
                  async (key) =>
                    ({
                      [key]: await stores[storeName].get(key),
                    } as {
                      [Key in StoreKey<DBSchema["schema"], Names>]?: StoreValue<
                        DBSchema["schema"],
                        Names
                      >;
                    })
                )
              )
            ).reduce<
              {
                [Key in StoreKey<DBSchema["schema"], Names>]?: StoreValue<
                  DBSchema["schema"],
                  Names
                >;
              }
            >((v, value) => ({ ...v, ...value }), {});

            return [storeName, valueSet];
          })
        );

        allValues = {
          ...allValues,
          ...values.reduce<
            {
              [Name in Names]?: {
                [Key in StoreKey<DBSchema["schema"], Names>]?: StoreValue<
                  DBSchema["schema"],
                  Name
                >;
              };
            }
          >(
            (storeValues, [storeName, values]) => ({
              ...storeValues,
              [storeName]: values,
            }),
            {}
          ),
        };
      }
    );

    return allValues;
  }, [database.loading, database.result, JSON.stringify(storeInfo)]);
};

const useReviewSectionRows = <
  DBSchema extends NamedSchema<string, number, Schema>,
  Names extends StoreNames<DBSchema["schema"]>
>(
  context: DatabaseContext<DBSchema> | undefined,
  steps: ProcessStepDefinition<DBSchema, Names>[],
  tenantId?: ResidentRef
): SectionRow[] => {
  const rows = useRows(steps);
  const storeValues = useStoreValues(context, rows, tenantId);
  const router = useRouter();

  return useMemo(
    () =>
      rows
        .map((row) => {
          const values = row.values
            .map((v) => {
              if (storeValues.loading || storeValues.result === undefined) {
                return undefined;
              }

              const { databaseMap, renderValue } = v;
              const { storeName } = databaseMap;

              const key = findKey(databaseMap, tenantId);
              const values = storeValues.result[storeName];

              if (key === undefined || values === undefined) {
                return undefined;
              }

              const value = findValue(values[key], databaseMap);

              if (value === undefined) {
                return undefined;
              }

              return renderValue(value);
            })
            .filter(Boolean) as React.ReactNode[];

          const images = (row.images
            .map((databaseMap) => {
              if (storeValues.loading || storeValues.result === undefined) {
                return undefined;
              }

              const { storeName } = databaseMap;

              const key = findKey(databaseMap, tenantId);
              const values = storeValues.result[storeName];

              if (key === undefined || values === undefined) {
                return undefined;
              }

              return findValue(values[key], databaseMap);
            })
            .filter(Boolean) as string[][]).reduce<string[]>(
            (i, images) => [...i, ...images],
            []
          );

          const changeSlug = repeatingStepSlugs.includes(row.changeSlug)
            ? nextSlugWithId(row.changeSlug, tenantId)()
            : row.changeSlug;

          const changeLink = urlsForRouter(
            router,
            urlObjectForSlug(router, changeSlug, { review: "true" })
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
                <div className="change-link">
                  <InternalLink url={changeLink.as}>Change</InternalLink>
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

                  .change-link {
                    margin-left: 2em;
                  }
                `}</style>
              </div>
            ),
          };
        })
        .filter(Boolean) as SectionRow[],
    [router, rows, storeValues.loading, storeValues.result, tenantId]
  );
};

export default useReviewSectionRows;
