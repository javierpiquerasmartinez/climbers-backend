export default {
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  }
};