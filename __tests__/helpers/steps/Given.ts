import { DefineStepFunction } from "jest-cucumber";

class Given {
  static iAmOffline(defineStep: DefineStepFunction): void {
    defineStep("I am offline", () => {
      // TODO
    });
  }

  static iAmOnline(defineStep: DefineStepFunction): void {
    defineStep("I am online", () => {
      // TODO
    });
  }
}

export default Given;
