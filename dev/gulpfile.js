'use strict';

var gulp = require('gulp'),
    argv = require('yargs').argv,
    gulpif = require('gulp-if'),
    rimraf = require('rimraf'),
    rename = require('gulp-rename'),
    runSequence = require('run-sequence'),
    jscs = require('gulp-jscs'),
    jscsStylish = require('gulp-jscs-stylish'),
    jshint = require('gulp-jshint'),
    notify = require('gulp-notify'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    scsslint = require('gulp-scss-lint'),
    scssLintStylish = require('gulp-scss-lint-stylish'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCss = require('gulp-minify-css'),
    processhtml = require('gulp-processhtml'),
    fs = require('fs'),
    env = require('gulp-env'),
    istanbul = require('gulp-istanbul'),
    ngDocs = require('gulp-ngdocs'),
    zip = require('gulp-zip'),
    cssnano = require('gulp-cssnano');

var exec = require('child_process').exec;

var isProd = argv.prod;
var isRelease = argv.release;
var isHotfix = argv.hotfix;
var noValidation = argv.noVal != null;

// to ignore files/folder use this syntax '!static/js/**/*.js',
var devLibFiles = [
    'client/bower_components/angular/angular.js',
    'client/bower_components/angular-ui-router/release/angular-ui-router.js',
    'client/bower_components/angulartics/dist/angulartics.min.js',
    'client/bower_components/angulartics-google-analytics/dist/angulartics-google-analytics.min.js',
    'client/bower_components/angular-translate/angular-translate.min.js',
    'client/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
    'client/bower_components/isteven-angular-multiselect/isteven-multi-select.js',
    'client/bower_components/isteven-angular-multiselect/isteven-multi-select.css',
    'client/bower_components/angular-cookies/angular-cookies.min.js'
];

var prodLibFiles = [
    'client/bower_components/angulartics/dist/angulartics.min.js',
    'client/bower_components/angulartics-google-analytics/dist/angulartics-google-analytics.min.js',
    'client/bower_components/angular-translate/angular-translate.min.js',
    'client/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
    'client/bower_components/isteven-angular-multiselect/isteven-multi-select.js',
    'client/bower_components/isteven-angular-multiselect/isteven-multi-select.css',
    'client/bower_components/angular-cookies/angular-cookies.min.js'
];

var jsFiles = [
    'client/app/polyfill.js',
    'client/app/app.constants.js',
    'client/app/app.module.js',
    'client/app/utility/**.utility.js',
    'client/app/behaviors/**.behavior.js',
    'client/app/decorators/**.decorator.js',
    'client/app/services/**.svc.js',
    'client/app/dataModals/**.modal.js',
    'client/app/components/**/*.js',
    'client/app/pages/**/*.js',
    'client/app/app.config.js',
    'client/app/app.route.js'
];

var testFiles = [
    'tests/unit/**/*.js',
    'tests/e2e/**/*.js'
];

var vendorStyles = [
    'client/static/style/bootstrap/bootstrap.min.css',
    'client/static/style/bootstrap/bootstrap-theme.min.css'
];

var scssFiles = [
    'client/static/style/**/*.scss',
    'client/app/**/*.scss'
];

var htmlPages = [
    './*.html'
];

var componentHtmlFiles = [
    './client/app/components/**/*.html'
];

var pagesHtmlFiles = [
    './client/app/pages/**/*.html'
];

var termsOfUsePages = [
    './client/termsofuse/*.html'
];

var privacyPolicyPages = [
    './client/privacypolicy/*.html'
];

var deployFolder = '../deploy';

// rimraf is a rm -rf command to delete a folder recursively
gulp.task('clean', function(cb) {
    rimraf(deployFolder + '/*', cb);
});


gulp.task('jscs', function() {
    gulp.src(jsFiles)
        .pipe(jscs('.jscsrc'))
        .pipe(jscsStylish())
        .on('error', function(err) {
            console.log(err)
        });

    gulp.src(testFiles)
        .pipe(jscs('.jscsrc'))
        .pipe(jscsStylish())
        .on('error', function(err) {
            console.log(err)
        });
});


gulp.task('jshint', function() {
    gulp.src(jsFiles)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'))
        .on('error', function(err) {
            console.log(err)
        });

    gulp.src(testFiles)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'))
        .on('error', function(err) {
            console.log(err)
        });
});


gulp.task('process-js', noValidation ? null : ['jscs', 'jshint'], function() {
    gulp.src(devLibFiles, {base: './client/'})
        .pipe(gulpif(!isProd, gulp.dest(deployFolder)));

    gulp.src(prodLibFiles, {base: './client/'})
        .pipe(gulpif(isProd, gulp.dest(deployFolder)));

    gulp.src(jsFiles, {base: './'})
        .pipe(gulpif(isProd, concat('all.min.js'), concat('all.js')))
        .pipe(gulpif(isProd, uglify({mangle: true, preserveComments: 'some'})))
        .pipe(gulp.dest(deployFolder + '/static/js'));
});

gulp.task('process-scss', function() {
    gulp.src(vendorStyles)
        .pipe(gulpif(isProd, cssnano()))
        .pipe(gulp.dest(deployFolder + '/static/css'));

    gulp.src(scssFiles)
        .pipe(gulpif(!noValidation, scsslint({config: 'scsslint.yml', customReport: scssLintStylish})))
        .pipe(sass({style: 'expanded'}))
        .pipe(autoprefixer('last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(gulpif(isProd, concat('all.min.css'), concat('all.css')))
        .pipe(gulpif(isProd, cssnano()))
        .pipe(gulp.dest(deployFolder + '/static/css'));
});


gulp.task('process-html', function() {
    gulp.src(htmlPages)
        .pipe(gulpif(isProd, processhtml({})))
        .pipe(gulp.dest(deployFolder));

    gulp.src(componentHtmlFiles)
        .pipe(gulpif(isProd, processhtml({})))
        .pipe(gulp.dest(deployFolder + '/app/components'));

    gulp.src(pagesHtmlFiles)
        .pipe(gulpif(isProd, processhtml({})))
        .pipe(gulp.dest(deployFolder + '/app/pages'));

    gulp.src(termsOfUsePages)
        .pipe(gulpif(isProd, processhtml({})))
        .pipe(gulp.dest(deployFolder + '/termsofuse'));

    gulp.src(privacyPolicyPages)
        .pipe(gulpif(isProd, processhtml({})))
        .pipe(gulp.dest(deployFolder + '/privacypolicy'));
});


gulp.task('deploy-favicons', function() {
    gulp.src('./client/static/favicons/**/*.*')
        .pipe(gulp.dest(deployFolder));
});


gulp.task('deploy-fonts', function() {
    gulp.src('./client/static/fonts/**/*.*', {base: './client/'})
        .pipe(gulp.dest(deployFolder));
});


gulp.task('deploy-images', function() {
    gulp.src('./client/static/images/**/*', {base: './client/'})
        .pipe(gulp.dest(deployFolder));
    gulp.src('./client/static/favicons/**/*')
        .pipe(gulp.dest(deployFolder));
});


gulp.task('deploy-data-files', function() {
    gulp.src('./client/data/*.json')
        .pipe(gulp.dest(deployFolder + '/data'));
    gulp.src('./client/data/i18n/*.json')
        .pipe(gulp.dest(deployFolder + '/data/i18n'));
    gulp.src('./client/data/env/dev-settings.js', {base: './client/'})
        .pipe(rename("env-settings.js"))
        .pipe(gulpif(!isProd, gulp.dest(deployFolder + '/data')));
    gulp.src('./client/data/env/prod-settings.js', {base: './client/'})
        .pipe(rename("env-settings.js"))
        .pipe(gulpif(isProd, gulp.dest(deployFolder + '/data/')));
});


gulp.task('docs', [], function() {
    var options = {
        scripts: [
            'client/bower_components/angular/angular.js',
            'client/bower_components/angular/angular.min.js',
            'client/bower_components/angular/angular.min.js.map',
            'client/bower_components/angular-animate/angular-animate.min.js',
            'client/bower_components/angular-animate/angular-animate.min.js.map'
        ]
    };

    return gulp.src(jsFiles)
        .pipe(ngDocs.process(options))
        .pipe(gulp.dest('../docs'));
});


function runCommand(command) {
    var child = exec(command);
    child.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
    });
    child.stderr.on('data', function(data) {
        console.log('stdout: ' + data);
    });
}

gulp.task('watch', function() {
    gulp.watch(jsFiles, ['process-js', 'docs']);
    gulp.watch(testFiles, ['jscs', 'jshint']);
    gulp.watch(scssFiles, ['process-scss']);
    gulp.watch(htmlPages, ['process-html']);
    gulp.watch('./client/app/**/*.html', ['process-html']);
    gulp.watch('./static/images/*', ['deploy-images']);
    gulp.watch('./client/data/**/*', ['deploy-data-files']);
});

gulp.task('build', function() {
    runSequence(
        'clean',
        'process-js',
        'process-scss',
        'process-html',
        'deploy-images',
        'deploy-fonts',
        'deploy-data-files'
    );
});


gulp.task('default', function() {
    if (isProd) {
        noValidation = true;
        runSequence(
            'build'
        );
    } else {
        runSequence(
            'build',
            'watch'
        );
    }
});
