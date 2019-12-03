import { DefineStepFunction } from "jest-cucumber";

class Given {
  static iAmOffline(given: DefineStepFunction): void {
    given("I am offline", () => {
      fetchMock.mockRejectedValue(new Error("Request timed out"));
    });
  }

  static iAmOnline(
    given: DefineStepFunction,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolveWith: any = jest.fn()
  ): void {
    given("I am online", () => {
      fetchMock.mockImplementation(resolveWith);
    });
  }
}

export default Given;
