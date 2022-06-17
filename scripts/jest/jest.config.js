process.env.TZ = "Europe/London";
module.exports = {
    rootDir: '../../',
    roots: ['<rootDir>/packages'],
    setupFilesAfterEnv: [require.resolve('./setup.js')],
    moduleNameMapper: { '^d3-(.*)$': `d3-$1/dist/d3-$1` },
    testMatch: ['**/test/**/*[sS]pec.js']
};
