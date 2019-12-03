import { GlobalWithFetchMock } from "jest-fetch-mock";

const globalWithFetchMock: GlobalWithFetchMock = global as GlobalWithFetchMock;

globalWithFetchMock.fetch = require("jest-fetch-mock");
globalWithFetchMock.fetchMock = globalWithFetchMock.fetch;
