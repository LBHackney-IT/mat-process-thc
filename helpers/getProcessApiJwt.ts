import { nullAsUndefined } from "null-as-undefined";
import getProcessRef from "./getProcessRef";
import isServer from "./isServer";

const getProcessApiJwt = (processRef?: string): string | undefined => {
  if (isServer) {
    return;
  }

  if (!processRef) {
    processRef = getProcessRef();
  }

  if (!processRef) {
    return;
  }

  return nullAsUndefined(sessionStorage.getItem(`${processRef}:processApiJwt`));
};

export default getProcessApiJwt;
