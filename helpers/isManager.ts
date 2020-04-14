import { NextRouter } from "next/router";
import getProcessStage from "./getProcessStage";
import { ProcessStage } from "./ProcessStage";

const isManager = (router: NextRouter): boolean => {
  return getProcessStage(router) === ProcessStage.InReview;
};

export default isManager;
