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
var replace    = require('gulp-replace');
var clean      = require('gulp-clean');


var base = {
    app: 'app/',
    build: 'build/',
    dist: 'dist/'
};

var path = {
    js     : ['js/**/*.js'],
    vendor : ['js/vendor/**/*.js'],
    scss   : ['scss/**/*.scss'],
    styles : ['styles/**/*.css'],
    images : ['images/**/*.png'],
    html   : ['index.php']
};

// FLAG
var dirClean;
var dirInject;
var dirCompass;
gulp.task('processApp', function() {
    dirClean   = '.tmp/*';
    dirInject  = '<TAGPHPphp echo $app TAGPHP>';
    dirCompass = {
        css      : '.tmp/styles',
        file     : base.app,
        comments : true,
        style    : 'expanded'
    }

});
gulp.task('processBuild', function() {
    dirClean   = base.build + '*';
    dirInject  = '<TAGPHPphp echo $build TAGPHP>/..';
    dirCompass = {
        css      : base.build + 'css',
        file     : base.build,
        comments : false,
        style    : 'compressed'
    }
});

// Instalação do Bower
gulp.task('bower', function() {
    return bower();
});

// Limpar os arquivos dos diretórios
gulp.task('clean', function () {
    return gulp.src(dirClean, {read: false})
    .pipe(clean());
});

// Inserir no html os caminho dos arquivos do js e bower_components
gulp.task('inject', function () {
    var target  = gulp.src(base.app + path.html);
    var sources = gulp.src([base.app + path.js], {read: false});
    target.pipe(inject(sources,{addRootSlash: false, addPrefix: dirInject}))
    .pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower', addRootSlash: false, addPrefix: dirInject}))
    .pipe(replace('TAGPHP','?'))
    .pipe(gulp.dest(base.app));
});

// Compassa
gulp.task('compass', function() {
    gulp.src(base.app + path.scss)
    .pipe(compass({
        css      : dirCompass.css,
        sass     : base.app + 'scss',
        images   : dirCompass.file + 'images',
        font     : dirCompass.file + 'fonts',
        comments : dirCompass.comments,
        style    : dirCompass.style
    }))
});

gulp.task('js', function() {
    return gulp.src(['./lib/file3.js', './lib/file1.js', './lib/file2.js'])
    .pipe(concat('all.js'))
    .pipe(gulp.dest(base.build));
});

gulp.task('copy', function() {
    gulp.src([
        '*.{ico,png,jpg,gif}',
        '.htaccess',
        'img/{,**/}*.webp',
        '{,**/}*.{html,php}',
        'fonts/{,*/}*.*'
    ])
    .pipe(gulp.dest(base.build));
});

gulp.task('watch', function () {
    gulp.watch([base.app + '**', '!' + base.app + path.scss], ['copy','inject']);
    gulp.watch(['bower.json', base.app + 'scripts/{,**/}*.js'], ['inject']);
    gulp.watch([base.app + 'scss/{,*/}*.{scss,sass}'], ['compass']);
});

// process.env.NODE_ENV = 'dev';

gulp.task(
    'app',
    [
        'processApp',
        'clean',
        'bower',
        'compass',
        'inject',
        'watch'
    ]
);
gulp.task(
    'build',
    [
        'processBuild',
        'clean',
        'compass',
        // 'js',
        'inject',
        'size'
    ]
);

// gulp.task('build', function() {
//     gulp
//     .src([path.js, path.vendor])
//     .pipe(concat('all.min.js'))
//     .pipe(uglify())
//     .pipe(gulp.dest('build/js'));
// });


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
