import { nullAsUndefined } from "null-as-undefined";

<<<<<<< HEAD
const getProcessRef = (): string | undefined => {
  let processRef: string | undefined = undefined;
  if (process.browser) {
    processRef = nullAsUndefined(sessionStorage.getItem("currentProcessRef"));
  }
  return processRef;
};
=======
const getProcessRef = (): string | undefined =>
  nullAsUndefined(sessionStorage.getItem("currentProcessRef"));
>>>>>>> e3b737e... Add getProcessRef helper

export default getProcessRef;
