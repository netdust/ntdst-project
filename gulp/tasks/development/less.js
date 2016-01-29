var gulp        = require('gulp');
var plugins     = require('gulp-load-plugins')({ camelize: true });
var config      = require('../../config').less;


gulp.task('less', function() {

    var filter = plugins.filter(['*.css', '!*.map']);

    return gulp.src(config.src)
        .pipe(plugins.less(config.options))
        .on('error', plugins.util.log) // Log errors instead of killing the process
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.autoprefixer(config.autoprefixer))
        .pipe(filter) // Don’t write sourcemaps of sourcemaps
        .pipe(plugins.sourcemaps.write('.', { includeContent: false }))
        .pipe(filter.restore()) // Restore original files
        .pipe(gulp.dest(config.dest));
});