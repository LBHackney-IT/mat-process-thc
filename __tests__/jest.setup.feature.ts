import { setJestCucumberConfiguration } from "jest-cucumber";
import { Browser, logging } from "selenium-webdriver";
import yn from "yn";

import WebDriverWrapper from "./helpers/webdriver/WebDriverWrapper";

jest.setTimeout(60 * 1000);

if (yn(process.env.CI)) {
  jest.retryTimes(3);
}

setJestCucumberConfiguration({ loadRelativePath: true });

beforeEach(async () => {
  global.browser = await WebDriverWrapper.create({
    browser: process.env.TEST_BROWSER || Browser.CHROME,
    headless: yn(process.env.TEST_HEADLESS, { default: true }),
    baseUrl: `http://localhost:${process.env.PORT || 3000}`
  });
});

afterEach(async () => {
  const log =
    (await global.browser
      ?.manage()
      .logs()
      .get(logging.Type.BROWSER)) || [];

  log.forEach(line => {
    switch (line.level) {
      case logging.Level.SEVERE:
        console.error(line.level.name, line.message);
        break;
      case logging.Level.WARNING:
        console.warn(line.level.name, line.message);
        break;
      default:
        console.log(line.level.name, line.message);
        break;
    }
  });

  const oldBrowser = global.browser;

  delete global.browser;

  await oldBrowser?.quit();
});
