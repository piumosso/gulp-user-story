var through = require('through2');
var es = require('event-stream');
var UserStoryParser = require('user-story/lib/UserStoryParser');


function gulpUserStory(userStoryOptions) {

  userStoryOptions = userStoryOptions || {};

  return through.obj(function(file, enc, cb) {

    if (file.isStream()) {
      file.contents = file.contents.pipe(es.map(function (data, cb) {
        cb(null, UserStoryParser.parse(data, userStoryOptions));
      }));
    }

    if (file.isBuffer()) {
      file.contents = new Buffer(UserStoryParser.parse(file.contents.toString(), userStoryOptions));
    }

    cb(null, file);

  });

}


module.exports = gulpUserStory;
