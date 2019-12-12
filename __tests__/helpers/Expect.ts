/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Locator } from "selenium-webdriver";

class Expect {
  static async pageToContain(content: string): Promise<void> {
    const element = await browser!.findElement({ tagName: "body" });

    await expect(element.getText()).resolves.toContain(content);
  }

  static async toBeEnabled(locator: Locator): Promise<void> {
    const element = await browser!.findElement(locator);

    await expect(element.isEnabled()).resolves.toEqual(true);
  }

  static async toBeDisabled(locator: Locator): Promise<void> {
    const element = await browser!.findElement(locator);

    await expect(element.isEnabled()).resolves.toEqual(false);
  }
}

export default Expect;
