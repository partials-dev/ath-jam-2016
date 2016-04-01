var notifier = require('node-notifier');
var path = require('path');
var projectName = require('../../package').name;
// match everything between / and the project name, including the
// slash and the project name
var matchPathToProject = new RegExp("\/.*" + projectName);

module.exports = function(err) { 
  console.log(err.message);
  err.message = err.message.replace(matchPathToProject, '');
  notifier.notify({
    title: 'Gulp build error',
    message: err.message,
    icon: path.join(__dirname, './', 'bmo-sad.png'),
  });
  this.emit('end'); 
};
