/* jshint node: true */
/* global $: true */
"use strict";

var src = './';
var theme = src + 'public/themes/default/';

var gulp = require( "gulp" ),
	/** @type {Object} Loader of Gulp plugins from `package.json` */
	$ = require( "gulp-load-plugins" )({ camelize: true }),

	/** @type {Object of Array} browserify settings to build from commonJS */
	browserifyCnf = {
		// Enable source maps
		debug: true,
		// Additional file extensions to make optional
		extensions: ['.coffee', '.hbs'],
		// A separate bundle will be generated for each
		// bundle config in the list below
		bundleConfigs: [{
			entries:    theme + '/js/application.js',
			dest:       theme + '/js',
			outputName: 'application-build.js'
		}/*, {
			entries:    theme + '/js/vendor.js',
			dest:       theme + '/js',
			outputName: 'vendor-build.js'
		}*/]
	},
	/** @type {Array} JS source files to concatenate and uglify */
	uglifySrc = [
		/** jQuery */
		src + "bower_components/jquery/dist/jquery.js",
		/** Page scripts */
		theme + "js/scripts.js"
	],
	/** @type {Object of Array} CSS source files to concatenate and minify */
	cssminSrc = {
		development: [
			/** Theme style */
			theme + "css/style.css"
		],
		production: [
			/** Normalize */
			src + "bower_components/normalize.css/normalize.css",
			/** font-awesome */
			src + "bower_components/components-font-awesome/css/font-awesome.css",
			/** Theme style */
			theme + "css/style.css"
		]
	},
	/** @type {String} Used inside task for set the mode to 'development' or 'production' */
	env = (function() {
		/** @type {String} Default value of env */
		var env = "development";

		/** Test if there was a different value from CLI to env
			Example: gulp styles --env=production
			When ES6 will be default. `find` will replace `some`  */
		process.argv.some(function( key ) {
			var matches = key.match( /^\-{2}env\=([A-Za-z]+)$/ );

			if ( matches && matches.length === 2 ) {
				env = matches[1];
				return true;
			}
		});

		return env;
	} ());

/** Clean */
gulp.task( "clean", function(cb) {
	require('del')([ ".tmp", "dist{,**}" ], cb);
});

/** Copy */
gulp.task( "copy", function() {
	return gulp.src([
			theme + "**/*.{php,html,css,js,json}",
			theme + "**/*.{jpg,png,svg,gif,webp,ico}",
			theme + "**/*.{woff,woff2,ttf,otf,eot,svg}"
		])
		.pipe( gulp.dest( "dist" ) );
});

/** CSS Preprocessors */
gulp.task( "less", function () {
	return gulp.src( theme + "css/less/style.less" )
		.pipe( $.less() )
		.on( "error", function( e ) {
			console.error( e );
		})
		.pipe(gulp.dest(  theme + "css" ));
});

/** STYLES */
gulp.task( "styles", ["less"], function() {
	console.log( "`styles` task run in `" + env + "` environment" );

	// concat files into 1 css
	var stream = gulp.src( cssminSrc[ env ] )
		.pipe( $.concat( "build.css" ));


	// do some heavy lifting for production use
	if ( env === "production" ) {
		stream = stream.pipe($.replace('../fonts/', 'fonts/') )
				 .pipe( $.autoprefixer( "last 2 version" ) )
				 .pipe($.minifyCss(
					 { keepSpecialComments: 1, roundingPrecision: 3 }
				 ));
	}

	return stream.on( "error", function( e ) {
			console.error( e );
		})
		.pipe( gulp.dest( theme + 'css' ) );

});

/** Templates */
gulp.task( "template", function() {
	console.log( "`template` task run in `" + env + "` environment" );

	var is_debug = ( env === "production" ? "false" : "true" );

	return gulp.src( src + "debug.php" )
		.pipe( $.template({ is_debug: is_debug }) )
		.pipe( gulp.dest( src + "www/admin/system" ) );
});


/** JSHint */
gulp.task( "jshint", function () {
	/** Test all `js` files exclude those in the `lib` folder */
	return gulp.src( [src + "www/admin/front/**/*.js", !src + "www/admin/front/**/*/lib/*.js"] )
		.pipe( $.jshint() )
		.pipe( $.jshint.reporter( "jshint-stylish" ) )
		.pipe( $.jshint.reporter( "fail" ) );
});

/** Uglify */
gulp.task( "uglify", function() {
	return gulp.src( uglifySrc )
		.pipe( $.concat( "scripts.min.js" ) )
		.pipe( $.uglify() )
		.pipe( gulp.dest( "dist/js" ) );
});

/**
 * Run JavaScript through Browserify
 */
gulp.task('browserify', function(callback) {

	var bundleQueue = browserifyCnf.bundleConfigs.length;

	var browserifyThis = function(bundleConfig) {

		var bundler = require('browserify')({
			// Required watchify args
			cache: {}, packageCache: {}, fullPaths: false,
			// Specify the entry point of your app
			entries: bundleConfig.entries,
			// Add file extentions to make optional in your requires
			extensions: browserifyCnf.extensions,
			// Enable source maps!
			debug: browserifyCnf.debug
		});

		var bundle = function() {
			// Log when bundling starts
			console.log("Build is starting: " + bundleConfig.outputName );

			return bundler
				.bundle()
				// Report compile errors
				.on('error', function( e ) {
					console.error( e );
				})
				// Use vinyl-source-stream to make the
				// stream gulp compatible. Specifiy the
				// desired output filename here.
				.pipe(require('vinyl-source-stream')(bundleConfig.outputName))
				// Specify the output destination
				.pipe(gulp.dest(bundleConfig.dest))
				.on('finish', reportFinished);
		};

		if(global.isWatching) {
			// Wrap with watchify and rebundle on changes
			bundler = watchify(bundler);
			// Rebundle on update
			bundler.on('update', bundle);
		}

		var reportFinished = function() {
			// Log when bundling completes
			console.log("Build is finished: " + bundleConfig.outputName );

			if(bundleQueue) {
				bundleQueue--;
				if(bundleQueue === 0) {
					// If queue is empty, tell gulp the task is complete.
					// https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
					callback();
				}
			}
		};

		return bundle();
	};

	// Start bundling with Browserify for each bundleConfig specified
	browserifyCnf.bundleConfigs.forEach(browserifyThis);
});

/** `env` to 'production' */
gulp.task( "envProduction", function() {
	env = "production";
});

/** `env` to 'development' */
gulp.task( "devProduction", function() {
	env = "development";
});

/** Livereload */
gulp.task( "watch", [ "template", "browserify", "styles" ], function() {
	$.livereload();

	/** Watch for browserify */
	gulp.watch( [
		theme + "**/*.js"
	], [ "browserify" ] );

	/** Watch for autoprefix */
	gulp.watch( [
		theme + "**/*.less"
	], [ "styles" ] );

	/** Watch for livereoad */
	gulp.watch([
		theme + "**/*.js",
		theme + "**/*.php",
		theme + "**/*.css"
	]).on( "change", function( file ) {
		console.log( file.path );
		$.livereload.changed( file.path );
	});

	/** Watch for JSHint */
	gulp.watch( theme + "**/*.js", ["jshint"] );
});

/** Build */
gulp.task( "build", function () {
	require('run-sequence')(
		"envProduction",
		"clean",
		"template",
		"styles",
		"copy",
		"devProduction",
		function() { console.log("Build is finished") }
	);
});

/** Gulp default task */
gulp.task( "default", ["watch"] );
