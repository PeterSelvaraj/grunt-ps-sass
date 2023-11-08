/*
 * grunt-ps-sass
 *
 * Copyright (c) 2023 Peter Selvaraj
 * Licensed under the MIT license.
 */

'use strict';

const glob = require('fast-glob');
const log = require('grunt-ps-log');
const fileSvc = require('grunt-ps-file');

module.exports = function (grunt) {
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/**/*.js'
      ],

      options: {
        jshintrc: '.jshintrc'
      }
    },

    clean: {
      tests: ['tmp']
    },

    psSass: {
      demoTask1: {
        options: {

        },

        files: [{
          ext: '.css',
          expand: true,
          src: 'test/fixtures/*.*',
          rename: (dest, src) => src.replace('test/fixtures', 'tmp')
        }]
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('psSassTest', () => {
    let success = true;
    let files = glob.sync('test/expected/**');

    files.forEach(file => {
      const outFile = file.replace('test/expected', 'tmp');
      const expData = fileSvc.read(file).trim();
      const outData = fileSvc.read(outFile).trim();

      if (expData !== outData) {
        success = false;
        log.error(`Output file ${outFile} is invalid!`);
      }
    });

    if (success) {
      log.ok('All tests passed successfully!');
    }
  });

  // Whenever the "dev" task is run, first lint, then run this
  // plugin's task(s).
  grunt.registerTask('dev', ['jshint', 'psSass']);

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'psSass', 'psSassTest']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['psSass']);
};
