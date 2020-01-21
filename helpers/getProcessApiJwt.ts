import { nullAsUndefined } from "null-as-undefined";

import getProcessRef from "./getProcessRef";

const getProcessApiJwt = (processRef?: string): string | undefined => {
  if (!processRef) {
    processRef = getProcessRef();
  }

  if (!processRef) {
    return;
  }

  let processApiJwt: string | undefined = undefined;

  if (process.browser) {
    processApiJwt = nullAsUndefined(
      sessionStorage.getItem(`${processRef}:processApiJwt`)
    );
  }

  return processApiJwt;
};

export default getProcessApiJwt;
