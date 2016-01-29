var gulp        = require('gulp')
    , plugins     = require('gulp-load-plugins')({ camelize: true })
    , config      = require('../../config').theme
    ;

// Copy PHP source files to the `build` folder
gulp.task('theme-files', function() {
    return gulp.src(config.dev.src)
        .pipe(plugins.changed(config.dev.dest))
        .pipe(gulp.dest(config.dev.dest));
});


// All the theme tasks in one
gulp.task('theme', ['theme-files']);
