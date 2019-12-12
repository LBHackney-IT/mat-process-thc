/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DefineStepFunction } from "jest-cucumber";

class When {
  static iGoOnline(defineStep: DefineStepFunction): void {
    defineStep("I go online", () => {
      // TODO
    });
  }

  static iVisitX(defineStep: DefineStepFunction): void {
    defineStep(/^I visit (\/.*)$/, async (relativeUrl: string) => {
      await browser!.getRelative(relativeUrl);
    });
  }
}

export default When;
