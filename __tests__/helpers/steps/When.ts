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

  static iStartTheProcess(defineStep: DefineStepFunction): void {
    defineStep("I start the process", async () => {
      await browser!.getRelative("");
    });
  }

  static iWaitForTheDataToBeFetched(defineStep: DefineStepFunction): void {
    defineStep("I wait for the data to be fetched", async () => {
      await browser!.sleep(2000);
    });
  }
}

export default When;
