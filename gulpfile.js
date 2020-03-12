var     gulp           = require('gulp'),
        pug            = require('gulp-pug');
		sass           = require('gulp-sass'),
		browserSync    = require('browser-sync'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
        babel          = require('gulp-babel'),
		cleanCSS       = require('gulp-clean-css'),
		rename         = require('gulp-rename'),
		autoprefixer   = require('gulp-autoprefixer'),
		rigger 	   	   = require('gulp-rigger'),
        watch          = require('gulp-watch'),
		reload 		   = browserSync.reload;

var config = {
    server: {
        baseDir: "./build"
    },
    host: 'localhost',
    port: 9000,
    logPrefix: "glp"
};

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: { 
        html: 'src/*.pug', 
        js: 'src/js/*.js',
        style: 'src/scss/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: { 
        html: 'src/**/*.pug',
        js: 'src/js/**/*.js',
        style: 'src/scss/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

gulp.task('html', function (done) {
    gulp.src(path.src.html) 
        .pipe(rigger())
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(path.build.html)) 
        .pipe(reload({stream: true})); 

        done();
});

gulp.task('js', function (done) {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify()) 
        .pipe(rename({suffix: '.min', prefix : ''}))
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));

        done();
});


gulp.task('style', function (done) {
    gulp.src(path.src.style) 
        .pipe(sass()) 
        .pipe(rename({suffix: '.min', prefix : ''}))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(cleanCSS()) 
        .pipe(gulp.dest(path.build.css)) 
        .pipe(reload({stream: true}));

        done();
});



gulp.task('image', function (done) {
    gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img)) 
        .pipe(reload({stream: true}));

        done();
});

gulp.task('fonts', function(done) {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));

        done();
});


gulp.task('build', gulp.series(
    'html',
    'js',
    'style',
    'fonts',
    'image'
));



gulp.task('watch', function(){
    gulp.watch([path.watch.html], gulp.series('html'));
    gulp.watch([path.watch.style], gulp.series('style'));
    gulp.watch([path.watch.js], gulp.series('js'));
    gulp.watch([path.watch.img], gulp.series('image'));
    gulp.watch([path.watch.fonts], gulp.series('fonts'));
});


gulp.task('webserver', function (done) {
    browserSync(config);

    done();
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});



gulp.task('default', gulp.series('build', 'webserver', 'watch'));
