var gulp = require('gulp');
var mocha = require('gulp-mocha');
var source = require('vinyl-source-stream');
var watchify = require('watchify');

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

gulp.task('test', function() {
  // Waiting for the 'require' option to be merged in:
  //   https://github.com/sindresorhus/gulp-mocha/pull/34
  // or at least for mocha.opts to be supported:
  //   https://github.com/sindresorhus/gulp-mocha/pull/35
  return gulp.src('test/*.js')
    .pipe(mocha({ reporter: 'spec', 
                //require: 'should',
                  ui: 'bdd'
    })
    .on('error', handleError));
});

gulp.task('watch', function() {
    var bundler = watchify('./public/js/app.js');

    bundler.on('update', rebundle)

    function rebundle () {
      console.log('Watchify is bundling. ' + new Date().toTimeString());
      return bundler.bundle()
          .pipe(source('bundle.js'))
          .pipe(gulp.dest('./public/js'))
    }

    return rebundle();
});
