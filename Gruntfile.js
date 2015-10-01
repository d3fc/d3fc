/* global module, require */

module.exports = function(grunt) {
    'use strict';

    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        meta: {
            metaJsFiles: [
                'Gruntfile.js'
            ],
            componentsJsFiles: [
                'src/*/**/*.js'
            ],
            componentsCssFiles: [
                'src/**/*.css'
            ],
            testJsFiles: [
                'tests/**/*Spec.js'
            ],
            visualTestJsFiles: [
                'visual-tests/**/*.js',
                '!visual-tests/assets/**/*.js'
            ],
            ourJsFiles: [
                '<%= meta.metaJsFiles %>',
                '<%= meta.componentsJsFiles %>',
                '<%= meta.testJsFiles %>',
                '<%= meta.visualTestJsFiles %>'
            ]
        },

        assemble: {
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
                files: [
                    {
                        expand: true,
                        cwd: 'site/src',
                        src: ['**/*.md', '*.md', '**/*.hbs', '*.hbs', '!_*/*'],
                        dest: 'site/dist'
                    }
                ]
            }
        },

        concat: {
            options: {
                sourceMap: false
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
            visualTests: {
                options: {
                    base: 'visual-tests'
                }
            },
            site: {
                options: {
                    base: 'site/dist'
                }
            }
        },

        copy: {
            visualTests: {
                files: [
                    {
                        expand: true,
                        cwd: 'node_modules/bootstrap/dist/',
                        src: ['**'],
                        dest: 'visual-tests/assets/bootstrap/'
                    },
                    {
                        src: [
                            'node_modules/css-layout/dist/css-layout.js',
                            'dist/d3fc.js',
                            'dist/d3fc.css',
                            'node_modules/jquery/dist/jquery.js',
                            'node_modules/d3/d3.js',
                            'node_modules/seedrandom/seedrandom.min.js'],
                        dest: 'visual-tests/assets/',
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
            components: {
                files: {
                    'dist/d3fc.min.js': ['dist/d3fc.js']
                }
            },
            site: {
                files: {
                    'site/dist/scripts.js': 'site/dist/scripts.js'
                }
            }
        },

        concat_css: {
            options: {},
            components: {
                src: ['<%= meta.componentsCssFiles %>'],
                dest: 'dist/d3fc.css'
            }
        },

        cssmin: {
            components: {
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['d3fc.css'],
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
                tasks: ['components']
            },
            visualTests: {
                files: [
                    '<%= meta.componentsJsFiles %>',
                    '<%= meta.testJsFiles %>',
                    '<%= meta.componentsCssFiles %>',
                    'visual-tests/**/*',
                    '!visual-tests/assets/**/*'
                ],
                tasks: ['components', 'visualTests']
            },
            site: {
                files: [
                    '<%= meta.metaJsFiles %>',
                    'site/src/**/*'
                ],
                tasks: ['site']
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
            meta: {
                files: {
                    src: ['<%= meta.metaJsFiles %>']
                }
            },
            components: {
                files: {
                    src: ['<%= meta.componentsJsFiles %>']
                }
            },
            test: {
                files: {
                    src: ['<%= meta.testJsFiles %>']
                }
            },
            visualTests: {
                files: {
                    src: ['<%= meta.visualTestJsFiles %>']
                }
            }
        },

        jshint: {
            options: {
                jshintrc: true
            },
            meta: {
                files: {
                    src: ['<%= meta.metaJsFiles %>']
                }
            },
            components: {
                files: {
                    src: ['<%= meta.componentsJsFiles %>']
                }
            },
            test: {
                files: {
                    src: ['<%= meta.testJsFiles %>']
                }
            },
            visualTests: {
                files: {
                    src: ['<%= meta.visualTestJsFiles %>']
                }
            }
        },

        jasmine_nodejs: {
            options: {
                reporters: {
                    console: {
                        verbosity: false
                    }
                }
            },
            test: {
                specs: '<%= meta.testJsFiles %>'
            }
        },

        clean: {
            components: ['dist/*', '!dist/README.md'],
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
        },

        rollup: {
            components: {
                files: {
                    'dist/d3fc.js': ['src/fc.js']
                },
                options: {
                    external: ['css-layout', 'd3'],
                    format: 'umd',
                    moduleName: 'fc'
                }
            }
        }

    });

    require('jit-grunt')(grunt);

    grunt.registerTask('components', [
        'jshint:components', 'jscs:components', 'clean:components', 'rollup:components', 'version',
        'concat_css:components', 'cssmin:components', 'jshint:test', 'jscs:test', 'jasmine_nodejs:test'
    ]);

    grunt.registerTask('visualTests', [
        'jshint:visualTests', 'jscs:visualTests', 'clean:visualTests', 'copy:visualTests'
    ]);
    grunt.registerTask('visualTests:serve', ['connect:visualTests', 'watch:visualTests']);

    grunt.registerTask('site', ['clean:site', 'copy:site', 'concat:site', 'less:site', 'assemble:site']);
    grunt.registerTask('site:serve', ['connect:site', 'watch:site']);

    grunt.registerTask('ci', ['jshint:meta', 'jscs:meta', 'components', 'uglify:components', 'site', 'uglify:site']);

    grunt.registerTask('default', ['watch:components']);
};
