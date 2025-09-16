// Jest configuration

module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/config/db.js",
    "!src/models/TaskModel.js",
  ],
  coverageDirectory: "coverage",
  coerageReporters: ["text", "lcov"],
};
