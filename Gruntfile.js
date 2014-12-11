/* global module */

module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        meta: {
            componentsJsFiles: [
                'components/**/*.js'
            ],
            componentsCssFiles: [
                'components/**/*.css'
            ],
            ourJsFiles: [
                'Gruntfile.js',
                '<%= meta.componentsJsFiles %>'
            ]
        },

        concat: {
            options: {
                sourceMap: false
            },
            dist: {
                src: ['components/fc.js', 'components/utilities/*.js', '<%= meta.componentsJsFiles %>'],
                dest: 'dist/<%= pkg.name %>.js'
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
            files: ['<%= meta.componentsJsFiles %>', '<%= meta.componentsCssFiles %>'],
            tasks: ['build']
        },

        jscs: {
            options: {
                config: '.jscsrc'
            },
            failOnError: {
                files: {
                    src: ['<%= meta.componentsJsFiles %>']
                }
            },
            warnOnly: {
                options: {
                    force: true
                },
                files: {
                    src: ['<%= meta.componentsJsFiles %>']
                }
            }
        },

        jshint: {
            options: {
                jshintrc: true
            },
            failOnError: {
                files: {
                    src: ['<%= meta.componentsJsFiles %>']
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

        clean: {
            doc: ["doc"]
        }
    });

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('check:failOnError', ['jshint:failOnError', 'jscs:failOnError']);
    grunt.registerTask('check:warnOnly', ['jshint:warnOnly', 'jscs:warnOnly']);
    grunt.registerTask('check', ['check:failOnError']);
    grunt.registerTask('build', ['jshint:failOnError', 'jscs:failOnError', 'concat:dist', 'uglify:dist', 'concat_css:all', 'cssmin:dist']);
    grunt.registerTask('dev', ['build', 'watch']);
    grunt.registerTask('doc', ['clean:doc', 'jsdoc'])
};