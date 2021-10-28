declare var __BASEPATH__: string;

const request = require("supertest");
jest.mock("fs");
const { buildApp } = require("../../server/app");

const simpleStatusMap = {
  "/": 200,
  "/about": 200,
  "/legal": 200,
  "/totally-not-found-path": 404,
  "/home": 301,
};

const app = buildApp(__dirname);

app.use(function (err, req, res, next) {
  console.error(err.stack);
  next();
});

describe("Test simple paths", () => {
  const MOCK_FILE_INFO = {};

  MOCK_FILE_INFO[`${__BASEPATH__}/dist/public/assets-manifest.json`] = "{}";

  beforeEach(() => {
    // Set up some mocked out file info before each test
    require("fs").__setMockFiles(MOCK_FILE_INFO);
  });

  for (const path of Object.keys(simpleStatusMap)) {
    const statusCode = simpleStatusMap[path];
    test(`It return ${statusCode} ("${path}")`, async () => {
      const response = await request(app).get(path);
      expect(response.statusCode).toBe(statusCode);
    });
  }
});
