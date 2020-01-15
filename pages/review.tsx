import { Heading, HeadingLevels } from "lbh-frontend-react";
import { NextPage } from "next";
import React from "react";
import { useAsync } from "react-async-hook";
import {
  ComponentDatabaseMap,
  ComponentValue
} from "remultiform/component-wrapper";
import {
  StoreNames,
  Database,
  StoreMap,
  StoreValue
} from "remultiform/database";

import useDatabase from "../helpers/useDatabase";
import MainLayout from "../layouts/MainLayout";
import PageTitles from "../steps/PageTitles";
import { idAndResidency } from "../steps";
import ProcessDatabaseSchema from "../storage/ProcessDatabaseSchema";
import processRef from "../storage/processRef";
import Storage from "../storage/Storage";

const ReviewPage: NextPage = () => {
  const reviewData = idAndResidency.reduce(
    (questionValues, { step, questionsForReview }) => [
      ...questionValues,
      ...step.componentWrappers
        .filter(({ key, databaseMap }) =>
          Boolean(databaseMap && questionsForReview[key])
        )
        .map(({ key, databaseMap }) => {
          return {
            question: questionsForReview[key],
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            databaseMap: databaseMap!
          };
        })
    ],
    [] as {
      question: string;
      databaseMap: ComponentDatabaseMap<
        ProcessDatabaseSchema,
        StoreNames<ProcessDatabaseSchema["schema"]>
      >;
    }[]
  );

  const storeNames = reviewData.reduce(
    (names, { databaseMap }) => [...names, databaseMap.storeName],
    [] as StoreNames<ProcessDatabaseSchema["schema"]>[]
  );

  const database = useDatabase(Storage.ProcessContext);

  const storeValues = useAsync<
    {
      [StoreName in StoreNames<ProcessDatabaseSchema["schema"]>]?: StoreValue<
        ProcessDatabaseSchema["schema"],
        StoreName
      >;
    },
    [Database<ProcessDatabaseSchema> | undefined, string, string]
  >(async () => {
    if (!database) {
      throw new Error("No database to check for process state");
    }

    let allValues: {
      [StoreName in StoreNames<ProcessDatabaseSchema["schema"]>]?: StoreValue<
        ProcessDatabaseSchema["schema"],
        StoreName
      >;
    } = {};

    await database.transaction(
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
  }, [database, processRef, storeNames.join(",")]);

  const finalData = reviewData.map(({ question, databaseMap }) => {
    if (storeValues.loading || storeValues.result === undefined) {
      return { question, value: "Loading..." };
    }

    const storeValue = storeValues.result[databaseMap.storeName];

    console.log(storeValue);

    if (storeValue === undefined) {
      return undefined;
    }

    const propertyMap = databaseMap.property as
      | [string]
      | [string, string]
      | undefined;

    console.log(propertyMap);

    if (!propertyMap) {
      return { question, value: storeValue };
    }

    const child = ((storeValue as unknown) as {
      [s: string]: ComponentValue<
        ProcessDatabaseSchema,
        StoreNames<ProcessDatabaseSchema["schema"]>
      >;
    })[propertyMap[0]];

    console.log(child);

    if (child === undefined) {
      return undefined;
    }

    if (propertyMap.length === 1) {
      return {
        question,
        value: child
      };
    }

    const grandChild = ((storeValue as unknown) as {
      [s: string]: {
        [s: string]: ComponentValue<
          ProcessDatabaseSchema,
          StoreNames<ProcessDatabaseSchema["schema"]>
        >;
      };
    })[propertyMap[0]][propertyMap[1]];

    console.log(grandChild);

    if (grandChild === undefined) {
      return undefined;
    }

    return {
      question,
      value: grandChild
    };
  });

  console.log(finalData);

  return (
    <MainLayout title={PageTitles.Review}>
      <Heading level={HeadingLevels.H1}>Tenancy and Household Check</Heading>
      {finalData.map((question, index) => (
        <div key={index}>
          {question && (
            <span>
              {question.question}:{question.value}
            </span>
          )}
        </div>
      ))}
    </MainLayout>
  );
};

export default ReviewPage;
