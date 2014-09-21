/**
  Gulpfile

  TODO:
  [ ] grouping all variable and task based
      on what they do.
 */

// gulp
var gulp = require("gulp");
var gutil = require("gulp-util");
var log = gutil.log;
var colors = gutil.colors;

// layout
var htmls = [
    "./src/html/*.*",
    "./src/html/**/*.*"
];
gulp.task("layout", function() {
  gulp.src(htmls, { base: "./src/html"})
    .pipe(gulp.dest("./build/"));
})

// views
gulp.task("views", function() {
  gulp.src("./src/assets/views/*.html")
    .pipe(gulp.dest("./build/assets/views/"))
})

// images
gulp.task("images", function () {
  gulp.src("./src/assets/images/*.*")
    .pipe(gulp.dest("./build/assets/images/"))
})

// rootFile
var roots = [
  "./src/CNAME",
  "./src/apple-touch-icon-precomposed.png",
  "./src/browserconfig.xml",
  "./src/crossdomain.xml",
  "./src/favicon.ico",
  "./src/robots.txt",
  "./src/tile-wide.png",
  "./src/tile.png"
]

gulp.task("rootFile", function () {
  gulp.src(roots)
    .pipe(gulp.dest("./build/"))
})

// LESS
var less = require('gulp-less');
var csso = require('gulp-csso');

var lessSrc = [
  "./src/assets/css/*.less",
  "./src/assets/css/components/*.less",
  "./src/assets/css/components/**/*.less"
];

gulp.task('less', function () {
  gulp.src("./src/assets/css/main.less")
    .pipe(less())
    .pipe(csso())
    .pipe(gulp.dest('./build/assets/css'));
});

// Dependencies
var libs = [
  "./src/libs/jquery/dist/jquery.min.js",
  "./src/libs/angular/angular.min.js",
  ]
gulp.task("libs", function () {
  gulp.src(libs)
    .pipe(gulp.dest("./build/assets/libs/"));
});

// bootstrap
var bootstrapFiles = [
  "./src/libs/bootstrap/dist/**/*.*"
];
gulp.task("bootstrap", function() {
  gulp.src(bootstrapFiles, { base: "./src/libs/bootstrap/dist"})
    .pipe(gulp.dest("./build/assets/bootstrap"));
})

// app.js
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

gulp.task("app", function () {
  gulp.src(["./src/app/app.js", "./src/app/route.js","src/app/*/*.js"])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(concat("app.js"))
    .pipe(gulp.dest("./build/assets/js"))
})

/*
  Watching all files

  TODO:

 */
gulp.task("watch", function () {
    gulp.watch(["./src/html/*.html", "./src/html/**/*.html"], ["layout"]);
    gulp.watch("./src/assets/views/*.html", ["views"]);
    // watch less files, and compile main.less
    gulp.watch(lessSrc, ["less"]);
    gulp.watch(["./src/app/*.js", "src/app/*/*.js"], ["app"]);
});

/*
  BUILD

 */
var tasks = ["layout", "views", "images", "rootFile", "less", "app", "libs", "bootstrap"]
gulp.task("build", tasks, function() {})
/*
  Server

  TODO:

 */
var connect = require("connect");
var open = require("open");
var http = require("http");
var HOST = "localhost";
var PORT = 4000;

var deps = ["watch", "libs"]
gulp.task('server',deps, function(callback) {

    // set connect middleware
    var app = connect()
        .use(connect.logger('dev'))
        .use(connect.static(__dirname + '/build'));

    var server = http.createServer(app).listen(PORT, HOST);

    server.on('error', function(error) {
        log(colors.underline(colors.red('ERROR'))+' Unable to start server!');
          callback(error);
    });

    server.on('listening', function() {
        var address = server.address();
        var host = HOST;
        var url = 'http://' + host + ':' + address.port + '/index.html';

        log('Started at '+colors.magenta(url));
        if(gutil.env.open) {
            log('Opening URL in browser');
            open(url);
        } else {
            log(colors.gray('(Run with --open to automatically open URL on startup)'));
        };
    });
});
