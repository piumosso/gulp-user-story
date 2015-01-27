[![NPM](https://nodei.co/npm/gulp-user-story.png)](https://nodei.co/npm/gulp-user-story/)

# gulp-user-story

Gulp plugin for [UserStory.js](https://github.com/piumosso/UserStory)

## Getting Started

```shell
npm install gulp-user-story
```


## Usage

```javascript
var userStory = require('gulp-user-story');

// Default
gulp.src('./javascripts/*.js')
  .pipe(userStory())
  .pipe(gulp.dest('./dist/')

// With options
gulp.src('./javascripts/*.js')
  .pipe(userStory({
    loggerName: 'console.lol'
  }))
  .pipe(gulp.dest('./dist/')
```

## API

### userStory(option)

#### option

Type: `Object`
Default: `{}`

Only `loggerName` option is supported.
