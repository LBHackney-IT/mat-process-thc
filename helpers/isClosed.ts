import { NextRouter } from "next/router";
import getProcessStage from "./getProcessStage";
import { ProcessStage } from "./ProcessStage";

const isClosed = (router: NextRouter): boolean => {
  const stage = getProcessStage(router);

  return stage === ProcessStage.Approved || stage === ProcessStage.Declined;
};

export default isClosed;
