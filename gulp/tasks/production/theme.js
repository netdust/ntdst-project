var gulp        = require('gulp')
    , plugins     = require('gulp-load-plugins')({ camelize: true })
    , config      = require('../../config').theme
    ;

// Copy PHP source files to the `build` folder
gulp.task('copy-files:prod', function() {
  return gulp.src(config.prod.src)
      .pipe(plugins.changed(config.prod.dest))
      .pipe(gulp.dest(config.prod.dest));
});


// All the theme tasks in one
gulp.task('theme:production', ['copy-files:prod']);