var userStory = require('../');
var should = require('should');
var gutil = require('gulp-util');
var fs = require('fs');
var path = require('path');
var es = require('event-stream');
var File = require('vinyl');
require('mocha');


SCRIPT_CONTENT = 'function test(x) {\n' +
'  // Test call with [x] @example.test\n' +
'  return x * 5;\n' +
'}\n\n' +
'// Run test @example\n' +
'test(5);';
SCRIPT_USERSTORIFIED_CONTENT = 'function test(x) {\n' +
'  UserStory.log(["Test call with [x=", x, "]"], ["example.test"]);\n' +
'  return x * 5;\n' +
'}\n\n' +
'UserStory.log(["Run test"], ["example"]);\n' +
'test(5);';


describe('gulp-user-story', function() {
  var fakeFile;

  function getFakeFile(fileContent){
    return new File({
      path: './test/fixtures/default-example.js',
      cwd: './test/',
      base: './test/fixtures/',
      contents: new Buffer(fileContent || '')
    });
  }

  beforeEach(function(){
    fakeFile = getFakeFile(SCRIPT_CONTENT);
  });

  it('should userstorify the file content', function(done) {
    var fileCount = 0;
    var stream = userStory();

    stream.on('data', function(newFile){
      should.exist(newFile);
      should.exist(newFile.path);
      should.exist(newFile.relative);
      should.exist(newFile.contents);
      should(newFile.isBuffer()).ok;
      newFile.path.should.equal('./test/fixtures/default-example.js');
      newFile.relative.should.equal('default-example.js');
      newFile.contents.toString('utf8').should.equal(SCRIPT_USERSTORIFIED_CONTENT);
      ++fileCount;
    });

    stream.once('end', function () {
      fileCount.should.equal(1);
      done();
    });

    stream.write(fakeFile);
    stream.end();
  });
});
