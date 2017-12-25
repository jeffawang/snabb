// inspired by http://christianalfoni.github.io/javascript/2014/08/15/react-js-workflow.html
var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');

var webserver = require('gulp-webserver');

var fs = require('fs');

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

    function create_bundle() {
        var updateStart = Date.now();
        var bundle;
        console.log('Updating!');

        bundle = watcher.bundle() // Create new bundle that uses the cache for high performance
            .pipe(fs.createWriteStream(bundle_output))

        console.log('Updated!', (Date.now() - updateStart) + 'ms');
        return bundle
    }

    watcher.on('update', create_bundle);
    return create_bundle();
});

gulp.task('hot', ['browserify', 'webserver']);
gulp.task('default', ['hot']);
