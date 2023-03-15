'use-strict';

const { dest, src, series, parallel, watch } = require('gulp');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const changed = require('gulp-changed');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');
const fancylog = require('fancy-log');

const paths = {
  src: {
    base: './src/',
    assets: './src/assets/**',
    html: './src/*.html',
    js: ['./src/js/**/*.js'],
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

// TASKS
//===========================================================
// CSS & SCSS
function styles() {
  return src(paths.src.scss)
    .pipe(plumber())
    .pipe(changed(paths.dist.css))
    .pipe(sourcemaps.init())
    .pipe(sass({ includePaths: [paths.partials] }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./'))
    .pipe(size())
    .pipe(dest(paths.dist.css));
}
// JavaScript
function javaScript() {
  return src(paths.src.js)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['@babel/preset-env'],
        sourceType: 'script',
      }),
    )
    .pipe(concat('bundle.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(size())
    .pipe(dest(paths.dist.js));
}
// Other
function copyAssets() {
  return src(paths.src.assets, { base: paths.src.base }).pipe(dest(paths.dist.base));
}
function copyHTML() {
  return src(paths.src.html).pipe(dest(paths.webroot));
}
function copyLib() {
  return src(paths.src.lib, { base: paths.src.base }).pipe(dest(paths.dist.base));
}

// EXPORTS
//===========================================================
exports.build = series(parallel(copyAssets, copyHTML, copyLib), javaScript, styles);
exports.default = () => {
  fancylog(`Watching....`);
  watch(paths.src.js, javaScript);
  watch(paths.src.base + '**/*.scss', styles);
  watch(paths.src.html, copyHTML);
};
