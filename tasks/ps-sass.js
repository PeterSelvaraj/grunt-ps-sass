/*
 * grunt-ps-sass
 *
 * Copyright (c) 2023 Peter Selvaraj
 * Licensed under the MIT license.
 */

'use strict';

const log = require('grunt-ps-log');
const sassSvc = require('./services/sass');

module.exports = function (grunt) {
  grunt.registerMultiTask('psSass', 'Compile Sass files...', function () {
    log.log(`Starting ${this.target} task...`);

    const files = [];
    const done = this.async();

    this.files.forEach(item => {
      item.src.forEach(src => {
        files.push({
          src,
          dest: item.dest
        });
      });
    });

    sassSvc.compileFiles(files, () => {
      log.ok(`Task ${this.target} is complete!`);
      done();
    });
  });
};
