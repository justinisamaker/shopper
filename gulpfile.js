var gulp = require('gulp'),
    sass = require('gulp-sass'),
    del = require('del'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    runSequence = require('run-sequence'),
    imagemin = require('gulp-imagemin'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    svgmin = require('gulp-svgmin'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

// ERROR HANDLING
var errorHandler = {
  errorHandler: notify.onError({
    title: 'Gulp',
    message: 'Error: <%= error.message %>'
  })
};

// PATH DECLARATIONS
var root = '';
var dist = root + 'dist/';
var paths = {
  scss: root + 'scss',
  css: dist + 'css',
  jssrc: root + 'js-src',
  js: dist + 'js',
  imgsrc: root + 'img-src',
  img: dist + 'img',
  fontssrc: root + 'fonts',
  fonts: dist + 'fonts'
};

// BROWSERSYNC TASK
gulp.task('browsersync', function(){
  var files = [
    dist + '**/*',
    root + '**/*.html'
  ];

  browserSync.init(files, {
    proxy: 'localhost:8000',
    notify: true
  });
});

// SASS TASK
gulp.task('sass', function(){
  gulp.src(paths.scss + '/**/*')
    .pipe(plumber(errorHandler))
    .pipe(sass())
    .pipe(gulp.dest(paths.css))
    .pipe(reload({stream: true}));
});

// JAVASCRIPT TASK
gulp.task('javascript', function(){
  gulp.src(paths.jssrc + '/**/*.js')
    .pipe(plumber(errorHandler))
    .pipe(jshint())
    .pipe(jshint.reporter('fail'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js))
    .pipe(reload({stream: true}));
});

// IMAGE TASK
gulp.task('images', function(){
  gulp.src(paths.imgsrc + '/**/*.{jpg,png,gif}')
    .pipe(plumber(errorHandler))
    .pipe(imagemin({
      optimizationLevel: 7,
      progressive: true
    }))
    .pipe(gulp.dest(paths.img))
    .pipe(reload({stream: true}));
  gulp.src(paths.imgsrc + '/**/*.svg')
    .pipe(plumber(errorHandler))
    .pipe(svgmin())
    .pipe(gulp.dest(paths.img))
    .pipe(reload({stream: true}));
});

// FONTS TASK
gulp.task('fonts', function(){
  gulp.src(paths.fontssrc + '/**/*')
      .pipe(gulp.dest(paths.fonts))
      .pipe(reload({stream:true}));
});

// CLEAN TASK
gulp.task('clean', function(){
  del([
    paths.css + '/*',
    paths.js + '/*',
    paths.img + '/*',
    paths.fonts + '/*'
  ]);
});

// WATCH TASK
gulp.task('watch', function(){
  gulp.watch(paths.scss + '/**/*', ['sass']);
  gulp.watch(paths.jssrc + '/**/*', ['javascript']);
  gulp.watch(paths.imgsrc + '/**/*', ['images']);
  gulp.watch(paths.fontsrc + '/**/*', ['fonts']);
});

gulp.task('default', function(callback){
  runSequence(
    'clean',
    ['sass', 'javascript', 'images', 'fonts'],
    ['watch', 'browsersync'],
    callback
  );
});