module.exports = {
  "preset": "ts-jest/presets/js-with-ts",
  testEnvironment: 'jsdom',
  rootDir: '.',
  roots: ['<rootDir>/packages'],
  testMatch: ['**/test/**/*[sS]pec.ts']
};