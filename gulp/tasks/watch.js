var gulp = require('gulp');
var script = require('./script');
var sass = require('./sass');

// Watch script, .scss, and index.html files for change
var watchTask = function () {
    gulp.watch('./src/**/*.coffee', ['script']);
    gulp.watch('./src/*.scss', ['sass']);
};

gulp.task('watch', ['script', 'sass'], watchTask);

module.exports = 'watch';
