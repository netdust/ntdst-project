var gulp        = require('gulp');
var runSequence = require('run-sequence');

/**
 * Run all tasks needed for a build in defined order
 */
gulp.task('build:production', function(callback) {
  runSequence('delete',
  [
    'less',
    'scripts',
    'images',
    'theme'
  ],
  [
    'optimize:css',
    'optimize:js',
    'optimize:images',
    'optimize:html',
    'theme:production'
  ],
  'revision',
  'rev:collect',
  [
    'gzip'
  ],
  callback);
});
