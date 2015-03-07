'use strict';

var gulp      = require('gulp'),
    watch     = require('gulp-watch'),
    nodemon   = require('gulp-nodemon'),
    bs        = require('browser-sync'),
    reload    = bs.reload,
    shell     = require('gulp-shell'),
    usemin    = require('gulp-usemin'),
    uglify    = require('gulp-uglify'),
    minifyHtml = require('gulp-minify-html'),
    minifyCss = require('gulp-minify-css'),
    rev       = require('gulp-rev');

var paths = {
  scripts: ['client/app/**/*.js'],
  html: ['client/app/**/*.html', 'client/index.html'],
  styles: ['client/styles/style.css'],
  test: ['specs/server/*.js']
};

gulp.task('test-server', shell.task([
  'mocha ' + paths.test
]));

gulp.task('test-client', shell.task([
  'jest'
]));

gulp.task('test', shell.task([
  'npm test'
]));

gulp.task('bower', shell.task([
  'bower install'
]));

gulp.task('selenium', shell.task([
  'webdriver-manager start'
]));

gulp.task('e2e', shell.task([
  'protractor e2e/conf.js'
]));

gulp.task('jsx', shell.task([
  'watchify -d client/app/starter.js -o client/app/bundle.js -v'
]));

gulp.task('usemin', ['jsx'], function() {
  gulp.src('./client/index.html')
    .pipe(usemin({
      css: [minifyCss(), 'concat'],
      html: [minifyHtml({empty: true})],
      js: [uglify(), rev()]
    }))
    .pipe(gulp.dest('client/'));
});

gulp.task('serve', function () {
  nodemon({script: 'index.js', ignore: 'node_modules/**/*.js'});
});

gulp.task('start', ['serve'], function() {
  bs({
    notify: true,
    injectChanges: true,
    files: paths.scripts.concat(paths.html, paths.styles),
    proxy: 'localhost:8000'
  });
});

gulp.task('default', ['start']);
