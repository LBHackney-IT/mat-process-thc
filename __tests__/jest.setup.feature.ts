import { setJestCucumberConfiguration } from "jest-cucumber";
import { logging } from "selenium-webdriver";
import yn from "yn";

import WebDriverWrapper from "./helpers/webdriver/WebDriverWrapper";
import createTestProcess from "./helpers/createTestProcess";

jest.setTimeout(60 * 1000);

if (yn(process.env.CI)) {
  jest.retryTimes(3);
}

setJestCucumberConfiguration({ loadRelativePath: true });

beforeEach(async () => {
  await WebDriverWrapper.createSingleton();
  await createTestProcess();
});

afterEach(async () => {
  const log =
    (await global.browser?.manage().logs().get(logging.Type.BROWSER)) || [];

  for (const line of log) {
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
  }

  expect(log.filter(({ level }) => level === logging.Level.SEVERE)).toEqual([]);
  expect(log.filter(({ level }) => level === logging.Level.WARNING)).toEqual(
    []
  );
});

afterAll(async () => {
  await WebDriverWrapper.destroySingleton();
});
