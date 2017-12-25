// inspired by http://christianalfoni.github.io/javascript/2014/08/15/react-js-workflow.html

var gulp = require('gulp');
// var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var browserify = require('browserify');
var watchify = require('watchify');
// var reactify = require('reactify');
var concat = require('gulp-concat');

var fs = require('fs');

var bundle_output = './build/bundle.js';
var bundle_source = './main.js'

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

// I added this so that you see how to run two watch tasks
gulp.task('css', function () {
    gulp.watch('styles/**/*.css', function () {
        return gulp.src('styles/**/*.css')
        .pipe(concat('main.css'))
        .pipe(gulp.dest('build/'));
    });
});

// Just running the two tasks
gulp.task('default', ['browserify', 'css']);

gulp.task('hot', ['browserify']);
