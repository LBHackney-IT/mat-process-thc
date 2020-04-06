import { NextRouter } from "next/router";
import { nullAsUndefined } from "null-as-undefined";
import basePath from "./basePath";
import getMatApiJwt from "./getMatApiJwt";
import getProcessRef from "./getProcessRef";
import isClient from "./isClient";
import { ProcessStage } from "./ProcessStage";

const transferProcess = async (
  router: NextRouter,
  stage: ProcessStage
): Promise<void> => {
  const processRef = getProcessRef(router);
  const matApiJwt = getMatApiJwt(processRef);

  const data =
    isClient && processRef
      ? nullAsUndefined(sessionStorage.getItem(`${processRef}:matApiData`))
      : undefined;

  const response = await fetch(
    `${basePath}/api/v1/processes/${processRef}/transfer?jwt=${matApiJwt}&processStage=${stage}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    }
  );

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const transferProcessToManager = async (router: NextRouter): Promise<void> => {
  await transferProcess(router, ProcessStage.InReview);
};

export { transferProcessToManager };
