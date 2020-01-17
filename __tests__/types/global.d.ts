/* eslint-disable no-var */
import "jest-fetch-mock";

import WebDriverWrapper from "../helpers/webdriver/WebDriverWrapper";

declare global {
  declare var browser: WebDriverWrapper | undefined;

  namespace NodeJS {
    interface Global {
      browser?: WebDriverWrapper;
    }

    interface Process {
      browser?: boolean;
    }
  }
}
