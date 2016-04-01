var gulp = require('gulp');
var sass = require('gulp-sass');

// Transpile Sass
var sassTask = function () {
  gulp.src('./src/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public'));
};
gulp.task('sass', sassTask);

module.exports = 'sass';
