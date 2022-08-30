'use-strict';

// Gulp Setup
const gulp = require('gulp');
const $ = require('gulp-load-plugins')({
  pattern: ['*'],
  scope: ['devDependencies'],
});

// Configuration
const postCssConfig = [$.cssMqpacker(), $.autoprefixer(), $.cssnano()];

const babelConfig = {
  presets: ['@babel/preset-env'],
  sourceType: 'script',
};

// Paths
const paths = {
  src: {
    base: './src/',
    assets: './src/assets/**',
    html: './src/*.html',
    js: './src/js/**/*.js',
    lib: './src/lib/**',
    scss: ['./src/scss/anywhere.scss', './src/scss/login.scss', './src/scss/infalAnywhere.scss'],
  },
  watch: {
    scss: './src/**/*.scss',
    js: './src/**/*.js',
  },
  dist: {
    base: '../webroot/dist/',
    css: '../webroot/dist/css/',
    js: '../webroot/dist/js/',
  },
  webroot: '../webroot',
  partials: [
    './src/scss/base',
    './src/scss/components',
    './src/scss/modules',
    './src/scss/objects',
  ],
};

// Tasks
gulp.task('styles', () => {
  $.fancyLog('--> Building CSS...');
  return gulp
    .src(paths.src.scss)
    .pipe($.plumber())
    .pipe($.changed(paths.dist.css))
    .pipe($.sourcemaps.init())
    .pipe($.sass({ includePaths: [paths.partials] }))
    .pipe($.postcss(postCssConfig))
    .pipe($.rename({ suffix: '.min' }))
    .pipe($.sourcemaps.write('./'))
    .pipe($.size())
    .pipe(gulp.dest(paths.dist.css));
});

gulp.task('js', () => {
  $.fancyLog('--> Building JavaScript...');
  return gulp
    .src(paths.src.js)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel(babelConfig))
    .pipe($.concat('bundle.js'))
    .pipe($.sourcemaps.write('./'))
    .pipe($.size())
    .pipe(gulp.dest(paths.dist.js));
});
gulp.task('jsNew', () => {
  return gulp
    .src([
      'src/js/**/*.js',
      '!src/js/helpers/date-input.js',
      '!src/js/helpers/scrollLock.js',
      '!src/js/helpers/markerCluster.js',
      '!src/js/helpers/chartJS/Chart.js',
      '!src/js/helpers/chartJS/Chart.min.js',
    ])
    .pipe($.babel(babelConfig))
    .pipe($.concat('codeCount.js'))
    .pipe(gulp.dest('./src/customBundles'));
});

gulp.task('copy:assets', () => {
  $.fancyLog('--> Copying Asset Files...');
  return gulp.src(paths.src.assets, { base: paths.src.base }).pipe(gulp.dest(paths.dist.base));
});

gulp.task('copy:lib', () => {
  $.fancyLog('--> Copying Lib Files...');
  return gulp.src(paths.src.lib, { base: paths.src.base }).pipe(gulp.dest(paths.dist.base));
});

gulp.task('copy:html', () => {
  $.fancyLog('--> Copying HTML Files...');
  return gulp.src(paths.src.html).pipe(gulp.dest(paths.webroot));
});

gulp.task('copy', ['copy:html', 'copy:lib', 'copy:assets']);

gulp.task('watch', () => {
  $.fancyLog('--> Watching for changes...');
  gulp.watch(paths.src.base + '**/*.scss', ['styles']);
  gulp.watch(paths.src.js, ['js']);
  gulp.watch(paths.src.html, ['copy:html']);
});

gulp.task('watchForAsh', () => {
  $.fancyLog('--> Watching for changes...');
  gulp.watch(paths.src.js, ['js']);
  gulp.watch(paths.src.html, ['copy:html']);
});

gulp.task('watchScss', () => {
  $.fancyLog('--> Watching for style changes...');
  gulp.watch(paths.src.base + '**/*.scss', ['styles']);
});

gulp.task('build', () => {
  $.fancyLog('--> CI Build...');
  $.runSequence('styles', 'js', 'copy:html');
});

gulp.task('default', () => {
  $.runSequence('styles', 'js', 'copy', 'watch');
});
