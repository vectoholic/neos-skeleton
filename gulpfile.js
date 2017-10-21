var gulp  = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  cleanCSS = require('gulp-clean-css'),
  concat = require('gulp-concat'),
  directorySync = require('gulp-directory-sync'),
  gutil = require('gulp-util'),
  header = require('gulp-header'),
  notify = require('gulp-notify'),
  plumber = require('gulp-plumber'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  watch = require('gulp-watch');

var argv = require('yargs').argv;
var browsersync = require('browser-sync').create();
var fs = require('file-system');

var config = require('./gulpconfig.json');

gulp.task('build-css', () => {
  var onError = function(err) {
    notify.onError({
      title:    'Gulp',
      subtitle: 'Failure!',
      message:  'Error: <%= error.message %>',
      sound:    'Beep'
    })(err);
    this.emit('end');
  };

gulp.src(config.source.vendorStyles.concat(config.source.styles))
  .pipe(plumber({errorHandler: onError}))
  .pipe(sourcemaps.init())
  .pipe(concat('main.min.css'))
  .pipe(sass({includePaths: config.source.styleIncludePaths}))
  .pipe(cleanCSS({inline: ['all']}))
  .pipe(autoprefixer({browsers: ['last 3 versions']}))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(config.dest.styles))
  .pipe(browsersync.stream())
  .pipe(notify({
      'title': 'Gulp',
      'message': 'CSS files were generated',
      onLast: true
    })
  );

gulp.src(config.source.vendorStyles.concat(config.source.styles))
  .pipe(plumber({errorHandler: onError}))
  .pipe(header('$screen-sm-min: ' + config.backendBreakpoints.half['screen-sm'] + ';\n' +
    '$screen-md-min: ' + config.backendBreakpoints.half['screen-md'] + ';\n' +
    '$screen-lg-min: ' + config.backendBreakpoints.half['screen-lg'] + ';\n'))
  .pipe(sourcemaps.init())
  .pipe(concat('main-backend-half.min.css'))
  .pipe(sass({includePaths: config.source.styleIncludePaths}))
  .pipe(cleanCSS({inline: ['all']}))
  .pipe(autoprefixer({browsers: ['last 3 versions']}))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(config.dest.styles)
  );

gulp.src(config.source.vendorStyles.concat(config.source.styles))
  .pipe(plumber({errorHandler: onError}))
  .pipe(header('$screen-sm-min: ' + config.backendBreakpoints.full['screen-sm'] + ';\n' +
    '$screen-md-min: ' + config.backendBreakpoints.full['screen-md'] + ';\n' +
    '$screen-lg-min: ' + config.backendBreakpoints.full['screen-lg'] + ';\n'))
  .pipe(sourcemaps.init())
  .pipe(concat('main-backend-full.min.css'))
  .pipe(sass({includePaths: config.source.styleIncludePaths}))
  .pipe(cleanCSS({inline: ['all']}))
  .pipe(autoprefixer({browsers: ['last 3 versions']}))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(config.dest.styles)
  );
});

gulp.task('build-js', () => {
  var onError = function(err) {
    notify.onError({
      title:    'Gulp',
      subtitle: 'Failure!',
      message:  'Error: <%= error.message %>',
      sound:    'Beep'
    })(err);
    this.emit('end');
  };

gulp.src(config.source.vendorScripts.concat(config.source.scripts))
  .pipe(plumber({errorHandler: onError}))
  .pipe(sourcemaps.init())
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(config.dest.scripts))
  .pipe(notify({
      'title': 'Gulp',
      'message': 'JavaScript files were generated',
      onLast: true
    })
  );
});

gulp.task('copy-images', () => {
  var onError = function(err) {
    notify.onError({
      title:    'Gulp',
      subtitle: 'Failure!',
      message:  'Error: <%= error.message %>',
      sound:    'Beep'
    })(err);
    this.emit('end');
  };

config.source.vendorImageFolders.forEach((item) => {
  gulp.src('')
  .pipe(directorySync(item, config.dest.images, {nodelete: true}));
});

fs.access(config.source.imageFolder, (err) => {
  if (!err) {
  gulp.src('')
    .pipe(directorySync(config.source.imageFolder, config.dest.images, {nodelete: true, ignore: '.gitkeep'}))
    .pipe(notify({
        'title': 'Gulp',
        'message': 'Image files copied',
        onLast: true
      })
    );
}
});
});

gulp.task('copy-fonts', function() {
  var onError = function(err) {
    notify.onError({
      title:    'Gulp',
      subtitle: 'Failure!',
      message:  'Error: <%= error.message %>',
      sound:    'Beep'
    })(err);
    this.emit('end');
  };

  config.source.vendorFontFolders.forEach((item) => {
    gulp.src('')
    .pipe(directorySync(item, config.dest.fonts, {nodelete: true}));
});

  fs.access(config.source.fontFolder, (err) => {
    if (!err) {
    gulp.src('')
      .pipe(directorySync(config.source.fontFolder, config.dest.images, {nodelete: true, ignore: '.gitkeep'}))
      .pipe(notify({
          'title': 'Gulp',
          'message': 'Font files copied',
          onLast: true
        })
      );
  }
});
});

gulp.task('browsersync', () => {
  browsersync.init({
  proxy: 'dev.neos'
});

watch(config.browsersyncWatch).on('change', browsersync.reload);
});

gulp.task('build', ['build-css', 'build-js', 'copy-images', 'copy-fonts']);

gulp.task('default', ['build-css', 'build-js', 'copy-images', 'copy-fonts'], () => {
  watch(config.source.vendorStyles.concat(config.source.styles), () => {
  gulp.start('build-css');
});

watch(config.source.vendorScripts.concat(config.source.scripts), () => {
  gulp.start('build-js');
});

watch(config.source.imageFolder+'**/*', () => {
  gulp.start('copy-images');
});

watch(config.source.fontFolder+'**/*', () => {
  gulp.start('copy-fonts');
});

if (argv.browsersync) {
  gulp.start('browsersync');
}
});
