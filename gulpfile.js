var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var inlineCss = require('gulp-inline-css');
var fileinclude = require('gulp-file-include');
var template = require('gulp-template');
var glob = require("glob");
var sass = require('gulp-sass');
var extname = require('gulp-extname');
var assemble = require('assemble');
var app = assemble();
var inlineSource = require('gulp-inline-source');

// Static server
gulp.task('browser-sync', ['build-preview'], function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        startPath: "/preview/"
    });
});

gulp.task('load', function(cb) {
  app.partials('src/hb-templates/partials/**/*.hbs');
  app.layouts('src/hb-templates/layouts/*.hbs');
  app.pages('src/hb-templates/emails/*.hbs');
  app.engine('hbs', require('engine-handlebars'));
  app.data('src/hb-templates/data/*.{json,yml}');
  app.option('layoutDelims', /{{>[ \t]*?(body)[ \t]*?}}/g);
  cb();
});

gulp.task('styles', function() {
    gulp.src('src/hb-templates/css/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('build/css/'));
});

gulp.task('images', function() {
    gulp.src('src/hb-templates/img/**/*.png')
        .pipe(gulp.dest('build/img/'));
});

gulp.task('assemble', ['load', 'styles', 'images'], function() {
  return app.toStream('pages')
    .pipe(app.renderFile())
    .pipe(extname())
    .pipe(inlineSource({
      rootpath: 'build'
    }))
    .pipe(inlineCss({
        preserveMediaQueries: true
    }))
    .pipe(app.dest('build'));
});

gulp.task('preview-sass', function(){
  return gulp.src('./src/preview/scss/*.scss')
    .pipe(sass().on('error', sass.logError)) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('./preview/css'))
});

gulp.task('preview-img', function(){
    return gulp.src('./src/preview/img/**/*.png')
            .pipe(gulp.dest('./preview/img'));
});

// Build Preview
gulp.task('build-preview', ['preview-sass', 'preview-img'], function() {
    glob("./build/*.html", {}, function(er, files) {
        var templates = files.map(function(file) {
            var pathArray = file.split("/");
            var fileName = pathArray[pathArray.length - 1];
            var templateName = fileName.split(".")[0];

            return {
                name: templateName,
                path: "/build/" + fileName
            };
        });
        return gulp.src('./src/preview/**/*.html')
            .pipe(template({
                templates: templates
            }))
            .pipe(gulp.dest('./preview'));
    });
});

// Build Templates
gulp.task('build-templates', function() {
    return gulp.src('./src/templates/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(inlineCss({
            preserveMediaQueries: true
        }))
        .pipe(gulp.dest('./build/'));
});

// Watch Files For Changes And Reload
gulp.task('watch', function() {
    gulp.watch('./src/preview/**/*.html', ['build-preview', reload]);
    gulp.watch('./src/preview/**/*.css', ['build-preview', reload]);
    gulp.watch('./src/preview/**/*.scss', ['build-preview', reload]);
    gulp.watch('./src/preview/**/*.png', ['build-preview', reload]);

    gulp.watch('./src/templates/**/*.html', ['build-templates', reload]);
    gulp.watch('./src/templates/css/*.css', ['build-templates', reload]);
    
    gulp.watch('./src/hb-templates/**/*.css', ['assemble', reload]);
    gulp.watch('./src/hb-templates/**/*.scss', ['assemble', reload]);
    gulp.watch('./src/hb-templates/**/*.hbs', ['assemble', reload]);
    gulp.watch('./src/hb-templates/**/*.png', ['assemble', reload]);

    gulp.watch('./**/*.scss', reload);
    gulp.watch('./**/*.html', reload);
    gulp.watch('./**/*.css', reload);
});

gulp.task('default', ['build-templates', 'assemble', 'build-preview', 'browser-sync', 'watch']);
