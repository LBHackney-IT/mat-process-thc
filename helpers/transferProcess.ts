import { NextRouter } from "next/router";
import basePath from "./basePath";
import getMatApiData from "./getMatApiData";
import getMatApiJwt from "./getMatApiJwt";
import getProcessRef from "./getProcessRef";
import { ProcessStage } from "./ProcessStage";

const transferProcess = async (
  router: NextRouter,
  stage: ProcessStage
): Promise<void> => {
  const processRef = getProcessRef(router);
  const matApiJwt = getMatApiJwt(processRef);
  const data = getMatApiData(processRef);
  const path = `${basePath}/api/v1/processes/${processRef}/transfer?jwt=${matApiJwt}&processStage=${stage}`;
  let response: Response;
  try {
    response = await fetch(path, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });
  } catch (err) {
    throw new Error(`Fetch failed for ${path}`);
  }

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const appraiseProcess = async (
  router: NextRouter,
  stage: ProcessStage
): Promise<void> => {
  const processRef = getProcessRef(router);
  const matApiJwt = getMatApiJwt(processRef);
  const data = getMatApiData(processRef);
  let response: Response;
  const path = `${basePath}/api/v1/processes/${processRef}/appraise?jwt=${matApiJwt}&processStage=${stage}`;
  try {
    response = await fetch(path, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });
  } catch (err) {
    throw new Error(`Fetch failed for ${path}`);
  }

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const transferProcessToManager = async (router: NextRouter): Promise<void> => {
  await transferProcess(router, ProcessStage.InReview);
};

const approveProcess = async (router: NextRouter): Promise<void> => {
  await transferProcess(router, ProcessStage.Approved);
  await appraiseProcess(router, ProcessStage.Approved);
};

const declineProcess = async (router: NextRouter): Promise<void> => {
  await transferProcess(router, ProcessStage.Declined);
  await appraiseProcess(router, ProcessStage.Declined);
};

export { transferProcessToManager, approveProcess, declineProcess };
