const gulp = require('gulp');
const rimraf = require('rimraf');
const less = require('gulp-less');
const cssmin = require('gulp-clean-css');
const ts = require('gulp-typescript');
const plumber = require('gulp-plumber');
const alias = require('gulp-ts-alias');

const tsProject = ts.createProject('tsconfig.json');

const srcDir = ['./.debug/**/*.js', './.debug/**/*.ts', './.debug/**/*.tsx'];

gulp.task('clean', async () => {
  rimraf.sync('./lib');
});

gulp.task('compile-ts', () => {
  return gulp
    .src(srcDir)
    .pipe(plumber())
    .pipe(alias({ configuration: tsProject.config }))
    .pipe(tsProject())
    .pipe(plumber.stop())
    .pipe(gulp.dest('lib'));
});

gulp.task('compile-less', () => {
  return gulp
    .src(['.debug/**/*.less'])
    .pipe(less())
    .pipe(cssmin())
    .pipe(gulp.dest('lib'));
});

gulp.task('copy-less', () => {
  return gulp
    .src('.debug/**/*.less', { base: '.debug' })
    .pipe(gulp.dest('lib'));
});

gulp.task('default', gulp.series('clean', 'compile-ts', 'compile-less', 'copy-less'));