/* jshint node: true */
/* global $: true */
"use strict";

var src = './src/';

var gulp = require( "gulp" ),
	/** @type {Object} Loader of Gulp plugins from `package.json` */
	$ = require( "gulp-load-plugins" )({ camelize: true }),
	/** @type {Array} JS source files to concatenate and uglify */
	uglifySrc = [
		/** Modernizr */
		src + "bower_components/modernizr/modernizr.js",
		/** Conditionizr */
		src + "js/lib/conditionizr-4.3.0.min.js",
		/** jQuery */
		src + "bower_components/jquery/dist/jquery.js",
		/** Page scripts */
		src + "js/scripts.js"
	],
	/** @type {Object of Array} CSS source files to concatenate and minify */
	cssminSrc = {
		development: [
			/** The banner of `style.css` */
			src + "www/admin/front/css/banner.css",
			/** Theme style */
			src + "www/admin/front/css/style.css"
		],
		production: [
			/** Normalize */
			src + "bower_components/normalize.css/normalize.css",
			/** foundation */
			src + "bower_components/foundation/css/foundation.css",
			/** font-awesome */
			src + "bower_components/components-font-awesome/css/font-awesome.css",
			/** dropzone */
			src + "bower_components/dropzone/dist/dropzone.css",
			/** The banner of `style.css` */
			src + "www/admin/front/css/banner.css",
			/** Theme style */
			src + "www/admin/front/css/style.css"
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

gulp.task( "clean-dist", function(cb) {
	require('del')([ "dist/**/*/style.css", "dist/**/*/banner.css", "dist/**/*/app-bootstrap.js", "dist/**/*/build.txt", "dist/**/*/app{,**}" ], cb);
});

/** Copy */
gulp.task( "copy", function() {
	return gulp.src([
			src + "www/.htaccess",
			src + "www/**/*.{php,html,css,js,json}",
			src + "www/**/*.{jpg,png,svg,gif,webp,ico}",
			src + "www/**/*.{woff,woff2,ttf,otf,eot,svg}",

			"!" + src + "/www/**/*/vendor/**/*{.json,.markdown,.mdown,.md,.yml,.dist,.gitignore,examples,examples/**,tests,tests/**,test,test/**,doc,doc/**,docs,docs/**}"
		])
		.pipe( gulp.dest( "dist" ) );
});

/** POST CSS MTF*CKR **/
gulp.task('postcss', function () {
	var stream = gulp.src( cssminSrc[ env ] )
		.pipe( $.concat( "build.css" ))
		.pipe( $.autoprefixer( "last 2 version" ) )
		.pipe( $.postcss([$.cssnext()]) );

	if ( env === "production" ) {
		stream = stream.pipe( require('gulp-replace')('../fonts/', 'fonts/') )
			.pipe( require('gulp-minify-css')({ keepSpecialComments: 1, roundingPrecision: 3 }) );
	}

	return stream.on( "error", function( e ) {
			console.error( e );
		})
		.pipe( gulp.dest( src + 'www/admin/front/css' ) );
});

/** CSS Preprocessors */
gulp.task( "less", function () {
	return gulp.src( src + "css/less/style.less" )
		.pipe( $.less() )
		.on( "error", function( e ) {
			console.error( e );
		})
		.pipe(gulp.dest(  src + "css" ));
});

/** STYLES */
gulp.task( "styles", function() {
	console.log( "`styles` task run in `" + env + "` environment" );

	var stream = gulp.src( cssminSrc[ env ] )
		.pipe( $.concat( "build.css" ))
		.pipe( $.autoprefixer( "last 2 version" ) );

	if ( env === "production" ) {
		stream = stream.pipe( require('gulp-replace')('../fonts/', 'fonts/') )
				 .pipe( require('gulp-minify-css')({ keepSpecialComments: 1, roundingPrecision: 3 }) );
	}

	return stream.on( "error", function( e ) {
			console.error( e );
		})
		.pipe( gulp.dest( src + 'www/admin/front/css' ) );
});

/** JSHint */
gulp.task( "jshint", function () {
	/** Test all `js` files exclude those in the `lib` folder */
	return gulp.src( [src + "www/admin/front/**/*.js", !src + "www/admin/front/**/*/lib/*.js"] )
		.pipe( $.jshint() )
		.pipe( $.jshint.reporter( "jshint-stylish" ) )
		.pipe( $.jshint.reporter( "fail" ) );
});

/** Templates */
gulp.task( "template", function() {
	console.log( "`template` task run in `" + env + "` environment" );

    var is_debug = ( env === "production" ? "false" : "true" );

    return gulp.src( src + "debug.php" )
        .pipe( $.template({ is_debug: is_debug }) )
        .pipe( gulp.dest( src + "www/admin/system" ) );
});

/** Uglify */
gulp.task( "uglify", function() {
	return gulp.src( uglifySrc )
		.pipe( $.concat( "scripts.min.js" ) )
		.pipe( $.uglify() )
		.pipe( gulp.dest( "dist/js" ) );
});

/** Build.js */
gulp.task('buildjs', function() {
	$.shell.task(['r.js.cmd -o build.js','gulp clean-dist', 'gulp template --env=development'])();
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
gulp.task( "watch", [ "template", "styles" ], function() {
	$.livereload();

	/** Watch for livereoad */
	gulp.watch([
		src + "**/*.js",
		src + "**/*.php",
		src + "**/*.css"
	]).on( "change", function( file ) {
		console.log( file.path );
		$.livereload.changed( file.path );
	});

	/** Watch for autoprefix */
	gulp.watch( [
		src + "**/*.css",
		src + "**/*.less"
	], [ "styles" ] );

	/** Watch for JSHint */
	//gulp.watch( [src + "www/admin/front/**/*.js", !src + "www/admin/front/**/*/lib/*.js"], ["jshint"] );
});

/** Build */
gulp.task( "build", function () {
	require('run-sequence')(
		"envProduction",
		"clean",
		"template",
		"styles",
		"copy",
		"buildjs",
		"devProduction",
		function() { console.log("Build is finished") }
	);

});

/** Gulp default task */
gulp.task( "default", ["watch"] );
