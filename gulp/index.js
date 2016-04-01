var gulp = require('gulp');

var tasks = []
// require all tasks in ./tasks
var normalizedPath = require("path").join(__dirname, "tasks");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  var task = require("./tasks/" + file);
  tasks.push(task);
});
gulp.task('all', tasks);

module.exports = gulp;
