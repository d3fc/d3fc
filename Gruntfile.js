/* global module */

module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        meta: {
            componentsJsFiles: [
                'src/*/**/*.js'
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
            visualTestSiteFiles: [
                {
                    expand: true,
                    cwd: 'visual-tests/src/site/pages/',
                    src: ['index.hbs'],
                    dest: 'visual-tests/dist/'
                },
                {
                    expand: true,
                    cwd: 'visual-tests/src/test-fixtures/',
                    src: ['**/*.hbs'],
                    dest: 'visual-tests/dist/'
                }
            ],
            componentsCssFiles: [
                'src/**/*.css'
            ],
            ourJsFiles: [
                'Gruntfile.js',
                '<%= meta.componentsJsFiles %>',
                '<%= meta.testJsFiles %>',
                '<%= meta.visualTestJsFiles %>'
            ],
            siteFiles: [
                {
                    expand: true,
                    cwd: 'site/src',
                    src: ['**/*.md', '*.md', '**/*.hbs', '*.hbs', '!_*/*'],
                    dest: 'site/dist'
                }
            ]
        },

        assemble: {
            visualTests: {
                options: {
                    assets: 'visual-tests/dist/assets',
                    partials: 'visual-tests/src/site/templates/includes/*.hbs',
                    layoutdir: 'visual-tests/src/site/templates/layouts',
                    layout: 'test.hbs'
                },
                files: '<%= meta.visualTestSiteFiles %>'
            },
            site: {
                options: {
                    assets: 'site/dist',
                    data: ['package.json', 'site/src/_config.yml'],
                    partials: 'site/src/_includes/*.hbs',
                    layoutdir: 'site/src/_layouts',
                    layout: 'default',
                    layoutext: '.hbs',
                    helpers: ['handlebars-helpers']
                },
                files: '<%= meta.siteFiles %>'
            }
        },

        concat: {
            options: {
                sourceMap: false
            },
            dist: {
                src: [
                    'src/head.js',
                    '<%= meta.componentsJsFiles %>',
                    'src/tail.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            },
            site: {
                src: [
                        'node_modules/d3/d3.js',
                        'node_modules/css-layout/dist/css-layout.js',
                        'dist/d3fc.js',
                        'node_modules/jquery/dist/jquery.js',
                        'node_modules/bootstrap/js/collapse.js',
                        'site/src/lib/init.js'
                ],
                dest: 'site/dist/scripts.js'
            }
        },

        connect: {
            options: {
                useAvailablePort: true
            },
            dev: {
                options: {
                    base: 'visual-tests/dist'
                }
            },
            site: {
                options: {
                    base: 'site/dist'
                }
            },
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
                        cwd: 'visual-tests/src/site/assets/',
                        src: ['**'],
                        dest: 'visual-tests/dist/assets/'
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/bootstrap/dist/',
                        src: ['**'],
                        dest: 'visual-tests/dist/assets/bootstrap/'
                    },
                    {
                        expand: true,
                        cwd: 'visual-tests/src/test-fixtures/',
                        src: ['**/*', '!**/*.hbs'],
                        dest: 'visual-tests/dist/'
                    },
                    {
                        src: [
                            'node_modules/css-layout/dist/css-layout.js',
                            'dist/d3fc.js',
                            'dist/d3fc.css',
                            'node_modules/jquery/dist/jquery.js',
                            'node_modules/d3/d3.js',
                            'node_modules/seedrandom/seedrandom.min.js'],
                        dest: 'visual-tests/dist/assets/',
                        flatten: true,
                        expand: true
                    }
                ]
            },
            site: {
                files: [
                    {
                        expand: true,
                        cwd: 'site/src/',
                        src: ['**/*', '!_*', '!**/*.hbs', '!**/*.md', '!**/*.yml'],
                        dest: 'site/dist/'
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
            },
            site: {
                files: {
                    'site/dist/scripts.js': 'site/dist/scripts.js'
                }
            }
        },

        concatCss: {
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
            site: {
                files: [
                    'Gruntfile.js',
                    'site/src/**/*'
                ],
                tasks: ['site:dev']
            },
            options: {
                livereload: true,
                atBegin: true
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

        jasmine: {
            options: {
                specs: '<%= meta.testJsFiles %>',
                vendor: [
                    'node_modules/d3/d3.js',
                    'node_modules/css-layout/dist/css-layout.js'
                ],
                helpers: 'tests/beforeEachSpec.js'
            },
            test: {
                src: ['dist/d3fc.min.js'],
                options: {
                    keepRunner: true
                }
            }
        },

        clean: {
            dist: ['dist/*', '!dist/README.md'],
            visualTests: ['visual-tests/dist'],
            site: ['site/dist']
        },

        version: {
            defaults: {
                src: ['dist/d3fc.js']
            }
        },

        less: {
            site: {
                files: {
                    'site/dist/styles.css': 'site/src/style/styles.less'
                }
            }
        }
    });

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.loadNpmTasks('assemble');

    grunt.renameTask('concat_css', 'concatCss');

    grunt.registerTask('check:failOnError', ['jshint:failOnError', 'jscs:failOnError']);
    grunt.registerTask('check:warnOnly', ['jshint:warnOnly', 'jscs:warnOnly']);
    grunt.registerTask('check', ['check:failOnError']);
    grunt.registerTask('build:visual-tests', [
        'check', 'clean:visualTests', 'copy:visualTests', 'assemble:visualTests'
    ]);
    grunt.registerTask('build:components', [
        'check', 'clean:dist', 'concat:dist', 'version', 'uglify:dist', 'concatCss:all', 'cssmin:dist', 'jasmine:test'
    ]);
    grunt.registerTask('build', ['build:components', 'build:visual-tests']);
    grunt.registerTask('dev:serve', ['connect:dev', 'watch:components']);
    grunt.registerTask('dev', ['build', 'watch']);
    grunt.registerTask('ci', ['default', 'site']);
    grunt.registerTask('test', ['jasmine:test', 'build:visual-tests']);
    grunt.registerTask('serve', ['connect:keepalive']);
    grunt.registerTask('site:dev', ['clean:site', 'copy:site', 'concat:site', 'less:site', 'assemble:site']);
    grunt.registerTask('site:serve', ['connect:site', 'watch:site']);
    grunt.registerTask('site', ['site:dev', 'uglify:site']);
    grunt.registerTask('default', ['build']);
};
