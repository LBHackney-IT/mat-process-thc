import { nullAsUndefined } from "null-as-undefined";
import isClient from "./isClient";

const getProcessRef = (): string | undefined => {
  let processRef: string | undefined = undefined;

  if (isClient) {
    processRef = nullAsUndefined(sessionStorage.getItem("currentProcessRef"));
  }

  if (process.env.NODE_ENV !== "production") {
    processRef = processRef || process.env.TEST_PROCESS_REF;
  }

  return processRef;
};

export default getProcessRef;
