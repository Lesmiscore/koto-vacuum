const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require("gulp-uglify");
const babel = require("gulp-babel");
//const compiler = require('google-closure-compiler-js').gulp();

gulp.task('js', function(){
  return browserify('./index.js')
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(babel({ presets: [['env', {
    targets: { 'browsers': 'ie 6' }
  }]]}))
  .pipe(uglify('mini.js'))
  .on("error",console.log)
  .pipe(gulp.dest('./dist/mini.js'));
});
