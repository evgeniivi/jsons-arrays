'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
 
gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('prod', function () {
  return gulp.src(['./js/libs/**/*.js','./js/public-code/**/*.js'])
  	.pipe(concat("all.js"))
    .pipe(gulp.dest('.'));
});