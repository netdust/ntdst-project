
var project           = 'ntdst.test-gulp'; // client_code.projectname
var theme             = 'default';         // client_code.projectname

var src               = './src/';
var development       = './dev/';
var production        = './dist/';

var bower             = './bower_components/';
var composer          = './vendor/';
var proxy             = 'http://' + project + '.local/';

var srcAssets         = src + 'themes/' + theme + '/';
var developmentAssets = development + 'public/themes/' + theme + '/';
var productionAssets  = production + 'public/themes/' + theme + '/';

var destination = '~/path/to/my/website/root/';
var hostname = 'mydomain.com';
var username = 'user';
var psw = 'user';

module.exports = {

  browsersync: {
    development: {
      proxy: proxy,
      files: [
        developmentAssets + 'ccs/fonts/*',
        developmentAssets + 'css/*.css',
        developmentAssets + 'js/*.js',
        developmentAssets + 'img/**'
      ]
    },
    production: {
      server: {
        baseDir: [production]
      },
      port: 9998
    }
  },

  delete: {
    src: [development+'public/', production]
  },

  autoprefixer: {
    browsers: [
      'last 2 versions',
      'safari 5',
      'ie 8',
      'ie 9',
      'opera 12.1',
      'ios 6',
      'android 4'
    ],
    cascade: true
  },

  revision: { // add revision number to assets
    src: {
      assets: [
        productionAssets + '**/*.css',
        productionAssets + '**/*.js',
        productionAssets + '**/*.{jpg,jpeg,png,gif,svg}'
      ],
      base: ''
    },
    dest: {
      assets: productionAssets,
      manifest: {
        name: 'manifest.json',
        path: productionAssets
      }
    }
  },

  collect: {
    src: [
      productionAssets + 'manifest.json',
      production + '**/*.{html,xml,txt,json,css,js}',
      '!' + production + 'feed.xml'
    ],
    dest: production
  },

  rsync: { // upload the motherfucker

    src: production + '**',
    options: {
      destination: destination,
      root: production,
      hostname: hostname,
      username: username,
      incremental: true,
      progress: true,
      relative: true,
      emptyDirectories: true,
      recursive: true,
      clean: true,
      exclude: ['.DS_Store'],
      include: []
    }
  },

  browserify: {
    // Enable source maps
    debug: true,
    // Additional file extensions to make optional
    extensions: ['.coffee', '.hbs'],
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [{
      entries:    srcAssets + 'js/application.js',
      dest:       developmentAssets + 'js',
      outputName: 'application.js'
    }, {
      entries:    srcAssets + 'js/head.js',
      dest:       developmentAssets + 'js',
      outputName: 'head.js'
    }]
  },

  jshint: {
    src: srcAssets + 'js/*.js'
  },

  watch: { // What to watch

    scripts: srcAssets + 'js/**/*.js', // build a js file
    styles:  srcAssets + 'less/**/*.less', // build a css file
    themes:  srcAssets + '**/*.{htaccess,json,html,php}', // trigger copy
    images:  srcAssets + '**/*.{jpg,jpeg,png,gif,svg}'  // trigger image copy
  },

  images: {  // less compiling

    src:  srcAssets + '**/*.{jpg,jpeg,png,gif,svg}',
    dest: developmentAssets
  },

  less: {  // less compiling

      src:  [ srcAssets + 'less/**/*.less', '!'+srcAssets+'less/**/_*.less' ],
      dest: developmentAssets + 'css',
      options: {}
  },

  theme: {

    dev: {
      src: [
        src + '**/*.{eot,woff,oft,ttf,svg}',  // fonts
        src + '**/*.{htaccess,json,html,php}' // html
      ],
      dest: development + 'public/'
    },
    prod: {
      src: [
        development + '**/*.{eot,woff,oft,ttf,svg}',  // fonts
        development + '**/*.{htaccess,json,html,php}' // html
      ],
      dest: production
    }
  },

  gzip: { // gzip file for faster loading

    src: production + '**/*.{html,xml,json,css,js}',
    dest: production,
    options: {}
  },

  optimize: {
    css: {
      src:  developmentAssets + 'css/*.css',
      dest: productionAssets + 'css/',
      options: {
        baseDir: './',
        keepSpecialComments: 0,
        maxImageSize: 20 * 1024,
        extensions: ['woff', 'ttf', 'eot', 'svg', 'png']
      }
    },
    js: {
      src:  developmentAssets + 'js/*.js',
      dest: productionAssets + 'js/',
      options: {}
    },
    images: {
      src:  developmentAssets + '**/*.{jpg,jpeg,png,gif,svg}',
      dest: productionAssets,
      options: {
        optimizationLevel: 3,
        progessive: true,
        interlaced: true
      }
    },
    html: {
      src: production + '**/*.html',
      dest: production,
      options: {
        collapseWhitespace: true
      }
    },
    fonts: {
      src: developmentAssets + 'css/fonts/*',
      dest: productionAssets + 'css/fonts.css',
      options: {
        collapseWhitespace: true
      }
    }
  }

};
