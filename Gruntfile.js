/* global module */

module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        meta: {
            componentsJsFiles: [
                'components/**/*.js'
            ],
            examplesJsFiles: [
                'examples/!(_dependencies)/**/*.js'
            ],
            ourJsFiles: [
                'Gruntfile.js',
                '<%= meta.componentsJsFiles %>',
                '<%= meta.examplesJsFiles %>'
            ]
        },

        concat: {
            options: {
                sourceMap: true
            },
            dist: {
                src: ['components/fc.js', 'components/utilities/*.js', '<%= meta.componentsJsFiles %>'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
                sourceMap: true,
                sourceMapIncludeSources : true,
                sourceMapIn : 'dist/<%= pkg.name %>.js.map'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },

        copy: {
            main: {
                expand: true,
                cwd: 'dist/',
                src: '**',
                dest: 'examples/_dependencies/js/',
                flatten: true,
                filter: 'isFile'
            }
        },

        watch: {
            files: ['<%= meta.componentsJsFiles %>'],
            tasks: ['build']
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
        }
    });

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('build', ['concat:dist', 'uglify:dist', 'copy:main']);
    grunt.registerTask('check:failOnError', ['jshint:failOnError', 'jscs:failOnError']);
    grunt.registerTask('check:warnOnly', ['jshint:warnOnly', 'jscs:warnOnly']);
    grunt.registerTask('check', ['check:failOnError']);
};