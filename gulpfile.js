// inspired by http://christianalfoni.github.io/javascript/2014/08/15/react-js-workflow.html
var gulp = require('gulp');
var gutil = require('gulp-util');
var fs = require('fs');

// Compile js
var browserify = require('browserify');
var watchify = require('watchify');

// Serve pages for testing
var webserver = require('gulp-webserver');

var server_root = "./app/"
var bundle_output = './app/bundle.js';
var bundle_source = './app/main.js'

gulp.task('webserver', function() {
    gulp.src(server_root)
        .pipe(webserver({
            livereload: true,
            directoryListing: false,
            open: false
        }));
});

gulp.task('browserify', function() {
    var bundler = browserify({
        entries: [bundle_source], // Only need initial file, browserify finds the deps
        //transform: [reactify], // We want to convert JSX to normal javascript
        debug: true, // Gives us sourcemapping
        cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
    });
    var watcher  = watchify(bundler);

    function rebundle() {
        var updateStart = Date.now();
        var bundle;
        gutil.log('Updating!');

        bundle = watcher.bundle() // Create new bundle that uses the cache for high performance
            .on('error', function(e) { gutil.log(e.stack) })
            .pipe(fs.createWriteStream(bundle_output))

        gutil.log('Updated!', (Date.now() - updateStart) + 'ms');
        return bundle
    }

    watcher.on('update', rebundle);
    return rebundle();
});

gulp.task('hot', ['browserify', 'webserver']);
gulp.task('default', ['hot']);
