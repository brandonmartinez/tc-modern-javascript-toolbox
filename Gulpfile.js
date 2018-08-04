'use strict';

////////////////////////////////////////////////////////////////////////////////////
// configuration
////////////////////////////////////////////////////////////////////////////////////
const DEV_ENV = 'development';
const PROD_ENV = 'production';
let environment = DEV_ENV;
const onMac = process.platform === 'darwin';

////////////////////////////////////////////////////////////////////////////////////
// dependencies
////////////////////////////////////////////////////////////////////////////////////

// Config
const BuildConfig = require('./config/Build.js');
const buildConfig = BuildConfig(environment);

// Gulp
const gulp = require('gulp');
require('gulp-stats')(gulp);
const plumber = require('gulp-plumber');
const pump = require('pump');
const run = require('run-sequence');

// Gulp Plugins
const webserver = require('gulp-webserver');
const rename = require('gulp-rename');
const clean = require('gulp-clean');

const hasher = require('gulp-hasher');
const cachebust = require('gulp-cache-buster');

const sourcemaps = require('gulp-sourcemaps');

const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

const eslint = require('gulp-eslint');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

// Extra Configuration for Front-end Dependencies
//const bootstrap = require('bootstrap').includePaths;
const sassIncludePaths = [
    //...bootstrap
];

////////////////////////////////////////////////////////////////////////////////////
// tasks
////////////////////////////////////////////////////////////////////////////////////

gulp.task('clean', (cb) => {
    const tasks = [
        gulp.src(buildConfig.web.dist.basePath, {
            read: false
        }),
        plumber(),
        clean({
            force: true
        })
    ];

    pump(tasks, cb);
});

gulp.task('images', (cb) => {
    const tasks = [
        gulp.src(buildConfig.web.images.files, {
            cwd: buildConfig.web.images.cwd
        }),
        plumber(),
        gulp.dest(buildConfig.web.dist.images)
    ];

    pump(tasks, cb);
});

gulp.task('fonts', (cb) => {
    const tasks = [
        gulp.src(buildConfig.web.fonts.files, {
            cwd: buildConfig.web.fonts.cwd
        }),
        plumber(),
        gulp.dest(buildConfig.web.dist.fonts)
    ];

    pump(tasks, cb);
});

gulp.task('rootAssets', (cb) => {
    const tasks = [
        gulp.src(buildConfig.web.rootAssets.files, {
            cwd: buildConfig.web.rootAssets.cwd
        }),
        plumber(),
        gulp.dest(buildConfig.web.dist.rootAssets),
        hasher()
    ];

    pump(tasks, cb);
});

gulp.task('styles', (cb) => {
    const tasks = [
        gulp.src(buildConfig.web.styles.file),
        plumber(),
        sourcemaps.init(),
        sass({
            outputStyle: 'compressed',
            includePaths: sassIncludePaths
        }),
        postcss([
            autoprefixer()
        ]),
        rename({
            basename: 'app',
            extname: '.min.css'
        }),
        sourcemaps.mapSources(function (sourcePath) {
            var sanitizedSourcePath = '';
            if (sourcePath.indexOf('../../node_modules') >= 0) {
                sanitizedSourcePath = sourcePath.replace('../../node_modules', './node_modules');
            } else {
                sanitizedSourcePath = './styles/' + sourcePath;
            }

            return sanitizedSourcePath;
        }),
        sourcemaps.write('./'),
        gulp.dest(buildConfig.web.dist.basePath),
        hasher()
    ];

    pump(tasks, cb);
});

gulp.task('scripts:lint', function () {
    var pipeline = gulp.src([buildConfig.web.scripts.watch, '!node_modules/**'])
        .pipe(plumber())
        .pipe(eslint())
        .pipe(eslint.format());

    if (environment === PROD_ENV) {
        pipeline = pipeline.pipe(eslint.failAfterError());
    }

    return pipeline;
});

gulp.task('scripts:build', async () => {
    // Setup any values to be dynamically injected into the webpack configuration
    /////////////////////////////////////////////////////////////////////////////////////

    // Create the webpack script, injecting any parameters
    const webpackScript = require('./webpack.js')(buildConfig);

    // Run gulp tasks
    /////////////////////////////////////////////////////////////////////////////////////

    const tasks = [
        gulp.src(buildConfig.web.scripts.file),
        plumber(),
        webpackStream(webpackScript, webpack),
        gulp.dest(buildConfig.web.dist.basePath),
        hasher()
    ];

    pump(tasks);
});

gulp.task('scripts', (cb) => {
    run(['scripts:lint', 'scripts:build'], cb);
});

// _html task cannot run without having assets run first, as a hash needs to be built for cache busting
gulp.task('_html', (cb) => {
    const tasks = [
        gulp.src(buildConfig.web.html.files, {
            cwd: buildConfig.web.html.cwd
        }),
        plumber(),
        cachebust({
            env: environment,
            hashes: hasher.hashes,
            assetRoot: buildConfig.web.dist.basePath,
            assetURL: '/',
            tokenRegExp: /ASSET{(.*?)}/g,
            hashLength: 8
        }),
        gulp.dest(buildConfig.web.dist.html)
    ];

    pump(tasks, cb);
});

gulp.task('watch', function () {
    gulp.watch(buildConfig.web.scripts.watch, {
        cwd: buildConfig.web.scripts.cwd,
        verbose: true
    }, ['scripts']);

    gulp.watch(buildConfig.web.styles.watch, {
        cwd: buildConfig.web.styles.cwd,
        verbose: true
    }, ['styles']);

    gulp.watch(buildConfig.web.images.watch, {
        cwd: buildConfig.web.images.cwd,
        verbose: true
    }, ['images']);
});

gulp.task('webserver', (cb) => {
    const tasks = [
        gulp.src(buildConfig.web.dist.basePath),
        plumber(),
        webserver({
            livereload: true,
            directoryListing: false,
            open: true,
            fallback: 'index.html',
            port: 8080,
            host: onMac ? '0.0.0.0' : 'localhost'
        })
    ];

    pump(tasks, cb);
});

////////////////////////////////////////////////////////////////////////////////////
// build tasks
////////////////////////////////////////////////////////////////////////////////////

gulp.task('build', (cb) => {
    // clean runs first, then all asset steps, then _html (for cachebusting), and finally the cb
    run('clean', ['styles', 'scripts', 'images', 'fonts', 'rootAssets'], '_html', cb);
});

gulp.task('build:dev', ['build']);

gulp.task('env:prod', function () {
    environment = PROD_ENV;
});

gulp.task('build:prod', function () {
    run('env:prod', 'build');
});

gulp.task('serve', function () {
    run('build', ['watch', 'webserver']);
});

gulp.task('default', ['build:dev']);