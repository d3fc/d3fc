process.env.TZ = 'Europe/London';

module.exports = {
    rootDir: '../../',
    roots: ['<rootDir>/packages'],
    setupFiles: [require.resolve('./globals.js')],
    setupFilesAfterEnv: [require.resolve('./setup.js')],
    moduleNameMapper: { '^d3-(.*)$': `d3-$1/dist/d3-$1` },
    testMatch: ['**/test/**/*[sS]pec.js'],
    testEnvironment: 'jsdom',
    transform: { '\\.[jt]sx?$': 'babel-jest', '\\.mjs$': 'babel-jest' },
    transformIgnorePatterns: [
        'node_modules/(?!.*(' +
            '@asamuzakjp/css-color|@asamuzakjp/generational-cache|@asamuzakjp/dom-selector|' +
            '@bramus/specificity|' +
            '@csstools/css-calc|@csstools/css-color-parser|@csstools/color-helpers|' +
            '@csstools/css-parser-algorithms|@csstools/css-tokenizer|' +
            '@exodus/bytes|' +
            'css-tree|glsl-transpiler|parse5|prepr|subscript|tough-cookie' +
            ')/)',
    ],
};
