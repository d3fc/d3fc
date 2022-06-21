module.exports = {
    maxConcurrency: 1,
    preset: 'jest-puppeteer',
    setupFilesAfterEnv: ['./__helpers__/setup.js'],
    testTimeout: 30000
};
