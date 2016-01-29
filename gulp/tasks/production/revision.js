var gulp   = require('gulp');
var rev    = require('gulp-rev');
var rdel   = require('rev-del');
var config = require('../../config').revision;

/**
 * Revision all asset files and
 * write a manifest file
 */
gulp.task('revision', function() {
  return gulp.src(config.src.assets, { base: config.src.base })
    .pipe(rev())
    .pipe(gulp.dest(config.dest.assets))
    .pipe(rev.manifest({ path: config.dest.manifest.name, exclude: config.dest.manifest.name }))
    .pipe(rdel({ dest: config.dest.assets }))
    .pipe(gulp.dest(config.dest.manifest.path));
});
