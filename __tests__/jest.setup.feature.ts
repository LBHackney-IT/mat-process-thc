import { request } from "https";
import { setJestCucumberConfiguration } from "jest-cucumber";
import { Browser, logging } from "selenium-webdriver";
import uuid from "uuid/v1";
import yn from "yn";

import WebDriverWrapper from "./helpers/webdriver/WebDriverWrapper";

jest.setTimeout(60 * 1000);

if (yn(process.env.CI)) {
  jest.retryTimes(3);
}

setJestCucumberConfiguration({ loadRelativePath: true });

const createTestProcess = async (): Promise<void> => {
  const responseData = await new Promise<{ processRef: string }>(
    (resolve, reject) => {
      const req = request(
        {
          host: process.env.PROCESS_API_HOST,
          port: 443,
          path: `${process.env.PROCESS_API_BASE_URL}/v1/processData`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": process.env.PROCESS_API_KEY || ""
          }
        },
        res => {
          res.setEncoding("utf8");

          let rawData = "";

          res.on("data", chunk => {
            rawData += chunk;
          });

          res.on("end", () => {
            try {
              const parsedData = JSON.parse(rawData);

              resolve(parsedData);
            } catch (err) {
              reject(err);
            }
          });

          res.on("error", err => {
            reject(err);
          });
        }
      );

      req.on("error", err => {
        reject(err);
      });

      req.write(
        JSON.stringify({
          processRef: uuid(),
          processType: {
            value: 100000156,
            name: "Tenancy and Household check"
          },
          processDataSchemaVersion: 1
        })
      );

      req.end();
    }
  );

  process.env.TEST_PROCESS_REF = responseData.processRef;
};

beforeEach(async () => {
  global.browser = await WebDriverWrapper.create({
    browser: process.env.TEST_BROWSER || Browser.CHROME,
    headless: yn(process.env.TEST_HEADLESS, { default: true }),
    baseUrl: `http://localhost:${process.env.PORT || 3000}`
  });

  await createTestProcess();
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
