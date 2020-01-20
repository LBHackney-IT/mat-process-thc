import { nullAsUndefined } from "null-as-undefined";

const getProcessRef = (): string | undefined => {
  let processRef: string | undefined = undefined;
  if (process.browser) {
    processRef = nullAsUndefined(sessionStorage.getItem("currentProcessRef"));
  }
  return processRef;
};

export default getProcessRef;
