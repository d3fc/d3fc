module.exports = {
    rootDir: '../../',
    roots: ['<rootDir>/packages'],
    setupFilesAfterEnv: [require.resolve('./setup.js')],
    testMatch: ['**/test/**/*[sS]pec.js']
};
