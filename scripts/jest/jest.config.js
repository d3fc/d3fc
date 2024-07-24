process.env.TZ = 'Europe/London';

module.exports = {
    rootDir: '../../',
    roots: ['<rootDir>/packages'],
    setupFilesAfterEnv: [require.resolve('./setup.js')],
    moduleNameMapper: {
        '^d3-(.*)$': '<rootDir>/node_modules/d3-$1/dist/d3-$1'
    },
    testMatch: ['**/test/**/*[sS]pec.js'],
    testEnvironment: 'jsdom',
    globals: {
        nodeModulesPath: '../../../node_modules'
    }
};
