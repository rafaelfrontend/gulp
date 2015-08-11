var gulp       = require('gulp');
var sass       = require('gulp-sass');
var gutil      = require('gulp-util');
var uglify     = require('gulp-uglify');
var concat     = require('gulp-concat');
var watch      = require('gulp-watch');
var ftp        = require('vinyl-ftp');
var compass    = require('gulp-compass');
var newer      = require('gulp-newer');
var bower      = require('gulp-bower');
var inject     = require('gulp-inject');
var bowerFiles = require('main-bower-files');

var config = {
    app: 'app',
    build: 'build',
};

gulp.task('bower', function() {
    return bower();
});

gulp.task('inject', function () {
    var target  = gulp.src(config.app+'/index.php');
    var sources = gulp.src([config.app+'/js/**/*.js'], {read: false});
    target.pipe(inject(sources))
    .pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower'}))
    .pipe(gulp.dest(config.app));
});

gulp.task('compass', function() {
    gulp.src(config.app+'/scss/**/*.scss')
    .pipe(newer(config.app+'/scss/**/*.scss'))
    .pipe(compass({
        css      : '.tmp/styles',
        sass     : config.app+'/scss',
        images   : config.app+'/images',
        font     : config.app+'/fonts',
        comments : true
    }));
});

gulp.task('js', function() {
    gulp
    .src([config.app+'/js/**/*.js'])
    .pipe(newer(config.app+'/js/**/*.js'))
    // .pipe(concat('script.js'))
    .pipe(gulp.dest(config.app+'/js'));
});

gulp.task('copy', function() {
    gulp.src(config.app+'/*.{php,html}')
    .pipe(gulp.dest(config.build));
});


gulp.task('watch', function () {
    gulp.watch(config.app+'/*.{php,html}',['copy']);
    gulp.watch([config.app+'/scss/**/*.scss',config.app+'/js/vendor/**/*.js'],['compass']);
});




gulp.task(
    'app',
    [
        'bower',
        'compass',
        'js',
        'inject',
        'watch'
    ]
);

gulp.task('build', function() {
    gulp
    .src(['src/js/**/*.js','src/js/vendor/**/*.js'])
    .pipe(concat('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

gulp.task( 'deploy', function() {
    var conn = ftp.create( {
        host    : 'ftp.cappen.com',
        user    : 'zito@cappen.com',
        password: 'c@p3333',
        parallel: 10,
        log     : gutil.log
    } );
    var globs = [
        'build/**'
    ];
    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance
    return gulp.src( globs, { base: '.', buffer: false } )
    .pipe( conn.newer( '/dev/gulp' ) ) // only upload newer files
    .pipe( conn.dest( '/dev/gulp' ) );

} );
