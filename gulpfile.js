/* jshint node: true */
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    csscomb = require('gulp-csscomb'),
    minifycss = require('gulp-clean-css'),
    plumber = require('gulp-plumber'),
    gzip = require('gulp-gzip'),
    rename = require('gulp-rename');

gulp.task('styles', function() {
    gulp.src(['sass/main.scss'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(rename({
        basename: 'libguides.2.0.jul'
    }))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(minifycss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('assets/css/'))
});

gulp.task('serve', ['styles'], function() {
    gulp.watch('sass/**/*.scss', ['styles']);
});
          
gulp.task('default', ['serve']);