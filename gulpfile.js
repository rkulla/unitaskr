var gulp = require('gulp');
var source = require('vinyl-source-stream');
var watchify = require('watchify');

gulp.task('watch', function() {
    var bundler = watchify('./public/js/app.js');

    bundler.on('update', rebundle)

    function rebundle () {
      console.log('Watchify is bundling.' + new Date().toTimeString());
      return bundler.bundle()
          .pipe(source('bundle.js'))
          .pipe(gulp.dest('./public/js'))
    }

    return rebundle();
});
