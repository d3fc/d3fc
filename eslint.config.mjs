import js from '@eslint/js';
import neostandard from 'neostandard';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';
import globals from 'globals';

// Packages that get neostandard + prettier (enhanced style checks).
// When packages undergo significant change, they should be added to this list.
const enhancedSrc = [
    'packages/d3fc-data-join/src/**/*.js',
    'packages/d3fc-domain-zoom/src/**/*.js',
    'packages/d3fc-webgl/src/**/*.js',
    'scripts/**/*.js'
];
const enhancedTests = [
    'packages/d3fc-data-join/test/**/*.js',
    'packages/d3fc-domain-zoom/test/**/*.js',
    'packages/d3fc-webgl/test/**/*.js'
];
const enhancedExamples = [
    'examples/**/*.js'
];
const allEnhanced = [...enhancedSrc, ...enhancedTests, ...enhancedExamples];

export default [
    // Global ignores (replaces .eslintignore)
    {
        ignores: [
            '**/node_modules/**',
            '**/build/**',
            '**/dist/**',
            'packages/d3fc-label-layout/site/**',
            'packages/d3fc-sample/site/**'
        ]
    },

    // Base: eslint:recommended for all JS files
    {
        ...js.configs.recommended,
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            globals: {
                console: true
            }
        },
        rules: {
            ...js.configs.recommended.rules,
            'no-unused-vars': ['error', { args: 'none' }],
            semi: ['error', 'always'],
            'no-console': ['error', { allow: ['warn', 'info'] }]
        }
    },

    // Test files: browser + jest + node globals
    {
        files: ['**/test/**/*.js'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.jest,
                ...globals.node
            }
        }
    },

    // Browser-specific packages
    {
        files: [
            'packages/d3fc-chart/src/**/*.js',
            'packages/d3fc-element/src/**/*.js'
        ],
        languageOptions: {
            globals: {
                ...globals.browser,
                global: 'writable'
            }
        }
    },

    // Node-specific files
    {
        files: [
            '.commitlintrc.js',
            'babel.config.js',
            'packages/d3fc/rollup.config.mjs',
            'scripts/rollup.config.mjs'
        ],
        languageOptions: {
            globals: globals.node
        }
    },

    // Enhanced checks: neostandard + prettier for specific packages
    ...neostandard({ semi: true, noStyle: true }).map(config => ({
        ...config,
        files: allEnhanced
    })),
    {
        files: allEnhanced,
        ...eslintPluginPrettierRecommended
    },

    // Enhanced tests: add browser + jest + node globals
    {
        files: enhancedTests,
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.jest,
                ...globals.node
            }
        }
    },

    // Examples: browser globals + d3/fc library globals
    {
        files: enhancedExamples,
        languageOptions: {
            sourceType: 'script',
            globals: {
                ...globals.browser,
                fc: 'readable',
                d3: 'readable'
            }
        }
    },

    // Example test helpers: jest + puppeteer globals
    {
        files: [
            'examples/__helpers__/*.js',
            'examples/**/__tests__/*.js'
        ],
        languageOptions: {
            globals: {
                ...globals.jest,
                d3fc: true,
                page: true,
                browser: true,
                context: true,
                jestPuppeteer: true
            }
        }
    },

    // Jest scripts
    {
        files: ['scripts/jest/**/*.js'],
        languageOptions: {
            globals: {
                ...globals.jest,
                ...globals.node
            }
        }
    },

    // TypeScript files
    {
        files: ['packages/**/*.ts'],
        languageOptions: {
            parser: tseslint.parser
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin
        },
        rules: {
            ...tseslint.configs.recommended
                .filter(c => c.rules)
                .reduce((acc, c) => ({ ...acc, ...c.rules }), {}),
            '@typescript-eslint/no-explicit-any': 'off'
        }
    }
];
