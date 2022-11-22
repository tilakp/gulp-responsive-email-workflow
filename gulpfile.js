var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var inlineCss = require('gulp-inline-css');
var fileinclude = require('gulp-file-include');
var template = require('gulp-template');
var glob = require("glob");
const sass = require('gulp-sass')(require('sass'));
var extname = require('gulp-extname');
var assemble = require('assemble');
var app = assemble();
var inlineSource = require('gulp-inline-source');

// Build Templates
gulp.task('build-templates', async function() {
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

gulp.task('load', async function(cb) {
  app.partials('src/hb-templates/partials/**/*.hbs');
  app.layouts('src/hb-templates/layouts/*.hbs');
  app.pages('src/hb-templates/emails/*.hbs');
  app.engine('hbs', require('engine-handlebars'));
  app.data('src/hb-templates/data/*.{json,yml}');
  app.option('layoutDelims', /{{>[ \t]*?(body)[ \t]*?}}/g);
  cb();
});

gulp.task('styles', async function() {
    gulp.src('src/hb-templates/css/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('build/css/'));
});

gulp.task('images', async function() {
    gulp.src('src/hb-templates/img/**/*.png')
        .pipe(gulp.dest('build/img/'));
});

gulp.task('assemble', gulp.series('load', 'styles', 'images', async function() {
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
}));

gulp.task('preview-sass', async function(){
  return gulp.src('./src/preview/scss/*.scss')
    .pipe(sass().on('error', sass.logError)) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('./preview/css'))
});

gulp.task('preview-img', async function(){
    return gulp.src('./src/preview/img/**/*.png')
            .pipe(gulp.dest('./preview/img'));
});

// Build Preview
gulp.task('build-preview', gulp.series('preview-sass', 'preview-img',  async function() {
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
}));

// Static server
gulp.task('browser-sync', gulp.series('build-preview', async function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        startPath: "/preview/"
    });
}));

// Watch Files For Changes And Reload
gulp.task('watch', async function() {
    gulp.watch('./src/preview/**/*.html', gulp.series('build-preview', reload));
    gulp.watch('./src/preview/**/*.css', gulp.series('build-preview', reload));
    gulp.watch('./src/preview/**/*.scss', gulp.series('build-preview', reload));
    gulp.watch('./src/preview/**/*.png', gulp.series('build-preview', reload));

    gulp.watch('./src/templates/**/*.html', gulp.series('build-templates', reload));
    gulp.watch('./src/templates/css/*.css', gulp.series('build-templates', reload));
    
    gulp.watch('./src/hb-templates/**/*.css', gulp.series('assemble', reload));
    gulp.watch('./src/hb-templates/**/*.scss', gulp.series('assemble', reload));
    gulp.watch('./src/hb-templates/**/*.hbs', gulp.series('assemble', reload));
    gulp.watch('./src/hb-templates/**/*.png', gulp.series('assemble', reload));

    gulp.watch('./**/*.scss', reload);
    gulp.watch('./**/*.html', reload);
    gulp.watch('./**/*.css', reload);
});

// handle bar doesn't work still so removed it for now
gulp.task('default',
    gulp.series('build-templates',  'build-preview', 'browser-sync', 'watch'));
  // gulp.series('build-templates', 'assemble', 'build-preview', 'browser-sync', 'watch'));

