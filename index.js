// through2 is a thin wrapper around node transform streams
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var UserStoryParser = require('user-story/lib/UserStoryParser');


PLUGIN_NAME = 'gulp-user-story';


function gulpUserStory(userStoryOptions) {

  userStoryOptions = userStoryOptions || {};

  return through.obj(function(file, enc, cb) {

    if (file.isNull()) {
      cb(null, file);
    }

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }

    if (file.isBuffer()) {
      file.contents = new Buffer(UserStoryParser.parse(file.contents.toString(), userStoryOptions));
    }

    cb(null, file);

  });

}


module.exports = gulpUserStory;