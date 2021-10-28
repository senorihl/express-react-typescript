import "regenerator-runtime/runtime";

jest.mock("rotating-file-stream");
jest.mock("morgan", () => ({
  __esModule: true,
  default: jest.fn(() => (req, res, next) => {
    next();
  }),
}));
