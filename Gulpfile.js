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
const watch = require('gulp-watch');

// Gulp Plugins
const rename = require('gulp-rename');
const clean = require('gulp-clean');

const hasher = require('gulp-hasher');
const cachebust = require('gulp-cache-buster');
const preprocess = require("gulp-preprocess");

const sourcemaps = require('gulp-sourcemaps');

const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

const eslint = require('gulp-eslint');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const babel = require('gulp-babel');
const copyNodeModules = require('copy-node-modules')

const gls = require('gulp-live-server');

// Extra Configuration for Front-end Dependencies
//const bootstrap = require('bootstrap').includePaths;
const sassIncludePaths = [
    //...bootstrap
];

////////////////////////////////////////////////////////////////////////////////////
// shared functions
////////////////////////////////////////////////////////////////////////////////////
const cleanDirectoryFunc = (directory) => {
    return (cb) => {
        const tasks = [
            gulp.src(directory, {
                read: false
            }),
            plumber(),
            clean({
                force: true
            })
        ];

        pump(tasks, cb);
    };
};

const lintingFunc = (watchExpression, cwd) => {
    return () => {
        var pipeline = gulp.src([watchExpression, '!node_modules/**'], {
            cwd: cwd
        })
            .pipe(plumber())
            .pipe(eslint())
            .pipe(eslint.format());

        if (environment === PROD_ENV) {
            pipeline = pipeline.pipe(eslint.failAfterError());
        }

        return pipeline;
    };
}

const watchDirectory = (watchPattern, cwd, onChangeFunc) => {
    return () => {
        watch(watchPattern, {
            cwd: cwd,
            ignoreInitial: true
        }).on('change', onChangeFunc);
    }
};

////////////////////////////////////////////////////////////////////////////////////
// web app tasks
////////////////////////////////////////////////////////////////////////////////////

gulp.task('web:clean', cleanDirectoryFunc(buildConfig.web.dist.basePath));

gulp.task('web:images', (cb) => {
    const tasks = [
        gulp.src(buildConfig.web.images.files, {
            cwd: buildConfig.web.images.cwd
        }),
        plumber(),
        gulp.dest(buildConfig.web.dist.images)
    ];

    pump(tasks, cb);
});

gulp.task('web:fonts', (cb) => {
    const tasks = [
        gulp.src(buildConfig.web.fonts.files, {
            cwd: buildConfig.web.fonts.cwd
        }),
        plumber(),
        gulp.dest(buildConfig.web.dist.fonts)
    ];

    pump(tasks, cb);
});

gulp.task('web:rootAssets', (cb) => {
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

gulp.task('web:styles', (cb) => {
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

gulp.task('web:scripts:lint', lintingFunc(buildConfig.web.scripts.watch, buildConfig.web.scripts.cwd));

gulp.task('web:scripts:build', (cb) => {
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

    pump(tasks, cb);
});

gulp.task('web:scripts', (cb) => {
    run(['web:scripts:lint', 'web:scripts:build'], cb);
});

// _html task cannot run without having assets run first, as a hash needs to be built for cache busting
gulp.task('web:html', (cb) => {
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
        preprocess({
            NODE_ENV: environment
        }),
        gulp.dest(buildConfig.web.dist.html)
    ];

    pump(tasks, cb);
});

////////////////////////////////////////////////////////////////////////////////////
// api app tasks
////////////////////////////////////////////////////////////////////////////////////

gulp.task('api:clean', cleanDirectoryFunc(buildConfig.api.dist.basePath));

gulp.task('api:scripts:lint', lintingFunc(buildConfig.api.scripts.watch, buildConfig.api.scripts.cwd));

gulp.task('api:scripts:build', (cb) => {
    const tasks = [
        gulp.src(buildConfig.api.scripts.watch, {
            cwd: buildConfig.api.scripts.cwd
        }),
        plumber(),
        babel(),
        gulp.dest(buildConfig.api.dist.basePath)
    ];

    pump(tasks, cb);
});

gulp.task('api:scripts:nodemodules', async () => {
    copyNodeModules(buildConfig.projectBasePath, buildConfig.api.dist.basePath, { devDependencies: false }, function (err, results) {
        if (err) {
            console.error(err);
            return;
        }
    });
});

gulp.task('api:scripts', (cb) => {
    run(['api:scripts:lint', 'api:scripts:build', 'api:scripts:nodemodules'], cb);
});

////////////////////////////////////////////////////////////////////////////////////
// watcher tasks
////////////////////////////////////////////////////////////////////////////////////
gulp.task(
    'web:watch:scripts',
    watchDirectory(
        buildConfig.web.scripts.watch,
        buildConfig.web.scripts.cwd,
        () => run('web:scripts:build')
    )
);

gulp.task(
    'web:watch:images',
    watchDirectory(
        buildConfig.web.images.watch,
        buildConfig.web.images.cwd,
        () => run('web:images')
    )
);

gulp.task(
    'web:watch:styles',
    watchDirectory(
        buildConfig.web.styles.watch,
        buildConfig.web.styles.cwd,
        () => run('web:styles')
    )
);

gulp.task(
    'web:watch:html',
    watchDirectory(
        buildConfig.web.html.watch,
        buildConfig.web.html.cwd,
        // if we change html, we have to run an entire build do to hashing/cachebusting
        () => run('web:build')
    )
);

gulp.task('web:watch', ['web:watch:scripts', 'web:watch:styles', 'web:watch:images', 'web:watch:html']);

gulp.task(
    'api:watch:scripts',
    watchDirectory(
        buildConfig.api.scripts.watch,
        buildConfig.api.scripts.cwd,
        () => run('api:scripts:build')
    )
);

gulp.task('api:watch', ['api:watch:scripts']);

////////////////////////////////////////////////////////////////////////////////////
// other tasks
////////////////////////////////////////////////////////////////////////////////////

gulp.task('env:prod', async () => {
    environment = PROD_ENV;
});

////////////////////////////////////////////////////////////////////////////////////
// build tasks
////////////////////////////////////////////////////////////////////////////////////

gulp.task('web:build', (cb) => {
    // clean runs first, then all asset steps, then _html (for cachebusting), and finally the cb
    run('web:clean', ['web:styles', 'web:scripts', 'web:images', 'web:fonts', 'web:rootAssets'], 'web:html', cb);
});

gulp.task('api:build', (cb) => {
    run('api:clean', ['api:scripts'], cb);
});

gulp.task('build', ['web:build', 'api:build']);

gulp.task('build:dev', ['build']);

gulp.task('build:prod', (cb) => {
    run('env:prod', 'build', cb);
});

gulp.task('default', ['build:dev']);

////////////////////////////////////////////////////////////////////////////////////
// local dev tasks
////////////////////////////////////////////////////////////////////////////////////

gulp.task('live-server', function () {
    const server = gls.new(
        ['--harmony', buildConfig.api.dist.basePath + '/app.js'],
        {
            cwd: buildConfig.api.dist.basePath,
            env: {
                NODE_ENV: environment
            }
        });
    server.start();

    // Watch for any .dist files changing, this means we need to reload
    console.log('Watching', buildConfig.api.dist.basePath);
    const serverWatcher = watchDirectory('**/*', buildConfig.distBasePath, (file) => server.notify.apply(server, [file]));
    serverWatcher();
});

gulp.task('serve', function (cb) {
    run('build', ['web:watch', 'api:watch', 'live-server'], cb);
});