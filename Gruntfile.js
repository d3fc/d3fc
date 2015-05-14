/* global module */

module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        meta: {
            componentsJsFiles: [
                'src/**/*.js'
            ],
            testJsFiles: [
                'tests/**/*Spec.js'
            ],
            visualTestFiles: [
                'visual-tests/src/**/*'
            ],
            visualTestJsFiles: [
                'visual-tests/src/**/*.js'
            ],
            componentsCssFiles: [
                'src/**/*.css'
            ],
            ourJsFiles: [
                '<%= meta.componentsJsFiles %>',
                '<%= meta.testJsFiles %>',
                '<%= meta.visualTestJsFiles %>'
            ]
        },

        assemble: {
            options: {
                assets: 'visual-tests/dist/assets',
                partials: 'visual-tests/src/site/templates/includes/*.hbs',
                layoutdir: 'visual-tests/src/site/templates/layouts'
            },
            visualTests: {
                files : [
                    // Index page
                    {
                        expand: true,
                        cwd: 'visual-tests/src/site/pages/',
                        src: ['index.hbs'],
                        dest: 'visual-tests/dist/'
                    },
                    // Visual tests
                    {
                        expand: true,
                        cwd: 'visual-tests/src/test-fixtures/',
                        src: ['**/*.hbs'],
                        dest: 'visual-tests/dist/'
                    }
                ],
                options: {
                    layout: 'test.hbs'
                }
            }
        },

        concat: {
            options: {
                sourceMap: false
            },
            dist: {
                src: ['src/fc.js', 'src/utilities/*.js', '<%= meta.componentsJsFiles %>'],
                dest: 'dist/<%= pkg.name %>.js'
            },
            visualTests: {
                options: {
                    sourceMap: true
                },
                src: 'visual-tests/src/site/assets/js/**/*.js',
                dest: 'visual-tests/dist/assets/index.js',
            }
        },

        connect: {
            options: {
                base: 'visual-tests/dist',
                useAvailablePort: true
            },
            dev: { },
            keepalive: {
                options: {
                    keepalive: true
                }
            }
        },

        copy: {
            visualTests: {
                files: [
                    {
                        expand: true,
                        cwd: 'visual-tests/src/site/assets/css',
                        src: ['**/*.css'],
                        dest: 'visual-tests/dist/assets/',
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/d3/',
                        src: ['d3.js'],
                        dest: 'visual-tests/dist/assets/',
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/css-layout/src/',
                        src: ['Layout.js'],
                        dest: 'visual-tests/dist/assets/',
                    },
                    {
                        expand: true,
                        cwd: 'dist',
                        src: ['d3-financial-components.js', 'd3-financial-components.css'],
                        dest: 'visual-tests/dist/assets/',
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/bootstrap/dist/',
                        src: ['**'],
                        dest: 'visual-tests/dist/assets/bootstrap/',
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/jquery/dist/',
                        src: ['jquery.min.*'],
                        dest: 'visual-tests/dist/assets/',
                    },
                    {
                        expand: true,
                        cwd: 'visual-tests/src/test-fixtures/',
                        src: ['**/*', '!**/*.hbs'],
                        dest: 'visual-tests/dist/',
                    }
                ]
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
                sourceMap: true
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },

        concat_css: {
            options: {},
            all: {
                src: ['<%= meta.componentsCssFiles %>'],
                dest: 'dist/<%= pkg.name %>.css'
            }
        },

        cssmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['<%= pkg.name %>.css'],
                    dest: 'dist/',
                    ext: '.min.css'
                }]
            }
        },

        watch: {
            components: {
                files: [
                    '<%= meta.componentsJsFiles %>',
                    '<%= meta.testJsFiles %>',
                    '<%= meta.componentsCssFiles %>'
                ],
                tasks: ['build']
            },
            visualTests: {
                files: [
                    '<%= meta.visualTestFiles %>'
                ],
                tasks: ['build:visual-tests']
            },
            options: {
                livereload: true
            }
        },

        jscs: {
            options: {
                config: '.jscsrc'
            },
            failOnError: {
                files: {
                    src: ['<%= meta.ourJsFiles %>']
                }
            },
            warnOnly: {
                options: {
                    force: true
                },
                files: {
                    src: ['<%= meta.ourJsFiles %>']
                }
            }
        },

        jshint: {
            options: {
                jshintrc: true
            },
            failOnError: {
                files: {
                    src: ['<%= meta.ourJsFiles %>']
                }
            },
            warnOnly: {
                options: {
                    force: true
                },
                files: {
                    src: ['<%= meta.ourJsFiles %>']
                }
            }
        },

        jsdoc : {
            dist : {
                src: ['<%= meta.componentsJsFiles %>'],
                options: {
                    destination: 'doc'
                }
            }
        },

        jasmine: {
            options: {
                specs: '<%= meta.testJsFiles %>',
                vendor: [
                    'node_modules/d3/d3.js',
                    'node_modules/css-layout/src/Layout.js'
                ]
            },
            test: {
                src: ['dist/*.js'],
            },
            testDebug: {
                src: ['dist/*.js'],
                options: {
                    keepRunner: true
                }
            }
        },

        clean: {
            dist: ['dist/*', '!dist/README.md'],
            doc: ['doc'],
            visualTests: ['visual-tests/dist']
        },

        _release: {
            options: {
                remote: 'upstream',
                github: {
                    repo: 'ScottLogic/d3-financial-components',
                    usernameVar: 'GITHUB_USERNAME',
                    passwordVar: 'GITHUB_PASSWORD'
                }
            }
        },

        version: {
            defaults: {
                src: ['src/fc.js']
            }
        }
    });

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.loadNpmTasks('assemble');

    grunt.renameTask('release', '_release');

    grunt.registerTask('check:failOnError', ['jshint:failOnError', 'jscs:failOnError']);
    grunt.registerTask('check:warnOnly', ['jshint:warnOnly', 'jscs:warnOnly']);
    grunt.registerTask('check', ['check:failOnError']);
    grunt.registerTask('build:visual-tests', ['check', 'clean:visualTests', 'copy:visualTests', 'concat:visualTests', 'assemble:visualTests']);
    grunt.registerTask('build:components', ['check', 'clean:dist', 'version', 'concat:dist', 'uglify:dist', 'concat_css:all', 'cssmin:dist', 'jasmine:test']);
    grunt.registerTask('build', ['build:components', 'build:visual-tests']);
    grunt.registerTask('dev:serve', ['build', 'connect:dev', 'watch']);
    grunt.registerTask('dev', ['build', 'watch']);
    grunt.registerTask('doc', ['clean:doc', 'jsdoc']);
    grunt.registerTask('ci', ['default']);
    grunt.registerTask('test', ['jasmine:test', 'build:visual-tests']);
    grunt.registerTask('serve', ['connect:keepalive']);
    grunt.registerTask('default', ['build', 'doc']);
    grunt.registerTask('release', ['default', '_release']);
};
