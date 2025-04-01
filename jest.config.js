export default {
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  globalSetup: './tests/config/globalSetup.ts',
  globalTeardown: './tests/config/globalTeardown.ts',
};