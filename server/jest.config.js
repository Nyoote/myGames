/** @type {import('jest').Config} */
export default {
    testEnvironment: "node",
    verbose: true,
    roots: ["<rootDir>/tests"],
    setupFiles: ["<rootDir>/tests/setupEnv.js"],
    setupFilesAfterEnv: ["<rootDir>/tests/setupDB.js"],
    transform: {},
};
