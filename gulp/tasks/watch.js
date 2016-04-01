var gulp = require('gulp');
var script = require('./script');
var sass = require('./sass');
var bower = require('./bower');

// Watch script, .scss, and index.html files for change
var watchTask = function () {
    gulp.watch('./src/**/*.coffee', ['script']);
    gulp.watch('./src/*.scss', ['sass']);
    gulp.watch('./src/index.html', ['bower']);
};

gulp.task('watch', ['script', 'sass', 'bower'], watchTask);

module.exports = 'watch';
