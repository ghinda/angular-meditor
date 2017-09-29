var gulp = require('gulp'),
concatCss = require('gulp-concat-css'),
concatJs = require('gulp-concat'),
csso = require('gulp-csso'),
del = require('gulp-delete-files'),
copy = require('gulp-copy'),
sassCompile = require('gulp-sass'),
server = require('gulp-webserver'),
ngAnotate = require('gulp-ng-annotate'),
ngTemplate = require('gulp-ng-template-strings'),
minifyHtml = require('gulp-minify-html'),
uglify = require('gulp-uglify');

var vendor = {
js: [
],
css: [
    'node_modules/foundation-sites/dist/css/foundation.min.css',
    'node_modules/font-awesome/css/font-awesome.min.css',
    'bower_components/angular-foundation-colorpicker/css/colorpicker.css'
]
};

var project = {
js: [
    'app/scripts/directives/editor.js'
],
scss: [
    'app/styles/_utils.scss',
    'app/styles/meditor.scss'
],
demo: [
    'app/styles/_utils.scss',
    'app/styles/demo.scss'
]
};

gulp.task('build:js:dist', function () {
gulp.src(project.js)
    .pipe(ngAnotate())
    .pipe(ngTemplate())
    .pipe(concatJs('meditor.js'))
    .pipe(gulp.dest('dist/js'));
gulp.src('dist/js/meditor.js')
    .pipe(uglify())
    .pipe(concatJs('meditor.min.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('build:js:vendor', function () {
gulp.src(vendor.js)
    .pipe(concatJs('vendor.js'))
    .pipe(gulp.dest('dist/js'));
gulp.src('dist/js/vendor.js')
    .pipe(uglify())
    .pipe(concatJs('vendor.min.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('build:js:bundle', ['build:js'], function() {
gulp.src('dist/js/*.js')
    .pipe(concatJs('bundle.js'))
    .pipe(gulp.dest('dist'));
})

gulp.task('build:js', ['build:js:dist', 'build:js:vendor']);

gulp.task('build:css:dist', function () {
gulp.src(project.scss)
    .pipe(sassCompile())
    .pipe(concatCss('meditor.css'))
    .pipe(gulp.dest('dist/css'));
gulp.src('./dist/css/meditor.css')
    .pipe(concatCss('meditor.min.css'))
    .pipe(csso())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('build:css:vendor', function () {
gulp.src(vendor.css)
    .pipe(concatCss('vendor.css'))
    .pipe(gulp.dest('dist/css'));
gulp.src('./dist/css/vendor.css')
    .pipe(concatCss('vendor.min.css'))
    .pipe(csso())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('build:css:bundle', ['build:css'], function(){
gulp.src('./dist/css/*.css')
    .pipe(concatCss('bundle.css'))
    .pipe(csso())
    .pipe(gulp.dest('dist'));
})

gulp.task('build:css', ['build:css:dist', 'build:css:vendor']);

gulp.task('build', ['delete', 'build:js:bundle', 'build:css:bundle']);

gulp.task('server', function () {
gulp.src('demo/')
    .pipe(server({
        livereload: true,
        directoryListing: true,
        open: false
    }));
});

gulp.task('demo:css', function () {
gulp.src(project.scss)
    .pipe(sassCompile())
    .pipe(concatCss('demo.css'))
    .pipe(gulp.dest('demo'));
});

gulp.task('demo', ['build', 'demo:css'], function() {
gulp.src('dist/*.*')
    .pipe(copy('demo/'));
});

gulp.task('delete', function(){
gulp.src([__dirname + '/dist/', __dirname + '/demo/dist/'])
    .pipe(del());
})

gulp.task('default', ['build', 'watch', 'server']);

gulp.task('watch', function(){
gulp.watch('app/**', ['build']);
})