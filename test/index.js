var userStory = require('../');
var should = require('should');
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
SCRIPT_USERSTORIFIED_CONTENT_CUSTOM = 'function test(x) {\n' +
'  console.lol(["Test call with [x=", x, "]"], ["example.test"]);\n' +
'  return x * 5;\n' +
'}\n\n' +
'console.lol(["Run test"], ["example"]);\n' +
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

  function getFakeFileReadStream(){
    return new File({
      contents: es.readArray([SCRIPT_CONTENT])
    });
  }

  beforeEach(function(){
    fakeFile = getFakeFile(SCRIPT_CONTENT);
  });

  it('should userstorify the buffer-file content', function(done) {
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

  it('should userstorify the buffer-file content with specific logger name', function() {
    var fileCount = 0;
    var stream = userStory({
      loggerName: 'console.lol'
    });

    stream.on('data', function(newFile){
      newFile.contents.toString('utf8').should.equal(SCRIPT_USERSTORIFIED_CONTENT_CUSTOM);
      ++fileCount;
    });

    stream.write(fakeFile);
    stream.end();
  });

  it('should userstorify the stream-file content', function(done) {
    var myHeader = userStory({});

    myHeader.write(getFakeFileReadStream());

    myHeader.once('data', function(file) {
      should(file.isStream()).ok;
      file.contents.pipe(es.wait(function(err, data) {
        data.toString('utf8').should.equal(SCRIPT_USERSTORIFIED_CONTENT);
        done();
      }));
    });

  });
});
