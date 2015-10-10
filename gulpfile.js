'use strict';
// generated on 2014-11-29 using generator-gulp-webapp 0.1.0

var gulp = require('gulp');
var merge = require('merge-stream');

// load plugins
var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {
    return gulp.src('src/styles/*.scss')
        .pipe($.rubySass({
            style: 'expanded',
            precision: 10
        }))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe($.size());
});

gulp.task('html', ['styles'], function () {
    var cssFilter = $.filter('**/*.css');

    var demo = gulp.src('src/*.html')
        .pipe($.useref.assets({searchPath: '{.tmp,src}'}))
        .pipe(cssFilter)
        .pipe(cssFilter.restore())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest('demo'))
        .pipe($.size());

    var grid = gulp.src('.tmp/styles/grid.css')
        .pipe(gulp.dest('dist'))
        .pipe($.csso())
        .pipe($.rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'));

    var grid_prefixed = gulp.src('.tmp/styles/grid.css')
        .pipe($.autoprefixer('last 2 versions'))     
        .pipe($.rename({suffix: '.prefixed'}))
        .pipe(gulp.dest('dist'))
        .pipe($.csso())
        .pipe($.rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'));
   
    return merge(demo, grid, grid_prefixed);
});

gulp.task('clean', function () {
    return gulp.src(['.tmp', 'demo', 'dist'], { read: false }).pipe($.clean());
});

gulp.task('build', ['html']);

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('connect', function () {
    var connect = require('connect');
    var app = connect()
        .use(require('connect-livereload')({ port: 35729 }))
        .use(connect.static('src'))
        .use(connect.static('.tmp'))
        .use(connect.directory('src'));

    require('http').createServer(app)
        .listen(9000)
        .on('listening', function () {
            console.log('Started connect web server on http://localhost:9000');
        });
});

gulp.task('serve', ['connect', 'styles'], function () {
    require('opn')('http://localhost:9000');
});

gulp.task('watch', ['connect', 'serve'], function () {
    var server = $.livereload();

    // watch for changes

    gulp.watch([
        'src/*.html',
        '.tmp/styles/**/*.css',
    ]).on('change', function (file) {
        server.changed(file.path);
    });

    gulp.watch('src/styles/**/*.scss', ['styles']);
});
