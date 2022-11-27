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
var inlineSource = require('gulp-inline-source');
const del = require('del');
const njk = require('gulp-nunjucks-render');
const beautify = require('gulp-beautify');

// clean up will delete build directory 
gulp.task('clean', async function() {
    return del(['build']);
});

// Build Templates
gulp.task('build-basic-templates', async function() {
    return gulp.src('src/email-templates/basic-templates/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(inlineCss({
            preserveMediaQueries: true
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('styles', async function() {
    gulp.src('src/email-templates/advanced-templates/css/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('build/css/'));
});

gulp.task('images', async function() {
    gulp.src('src/email-templates/advanced-templates/img/**/*.png')
        .pipe(gulp.dest('build/img/'));
});

gulp.task('build-advanced-templates', gulp.series('styles', 'images', async function() {
    return gulp.src('src/email-templates/advanced-templates/emails/*.+(html|njk)')
        .pipe(
            njk({
                path: ['src/email-templates/advanced-templates'],
            })
        )
        .pipe(beautify.html({ indent_size: 4, preserve_newlines: false }))
        .pipe(inlineSource({
            rootpath: 'build'
        }))
        .pipe(inlineCss({
            preserveMediaQueries: true
        }))
        .pipe(gulp.dest('build'));
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

    gulp.watch('./src/email-templates/basic-templates/**/*.html', gulp.series('build-basic-templates', reload));
    gulp.watch('./src/email-templates/basic-templates/css/*.css', gulp.series('build-basic-templates', reload));
    
    gulp.watch('./src/email-templates/advanced-templates/**/*.css', gulp.series('build-advanced-templates', reload));
    gulp.watch('./src/email-templates/advanced-templates/**/*.scss', gulp.series('build-advanced-templates', reload));
    gulp.watch('./src/email-templates/advanced-templates/**/*.html', gulp.series('build-advanced-templates', reload));
    gulp.watch('./src/email-templates/advanced-templates/**/*.png', gulp.series('build-advanced-templates', reload));

    gulp.watch('./**/*.scss', reload);
    gulp.watch('./**/*.html', reload);
    gulp.watch('./**/*.css', reload);
});

// handle bar doesn't work still so removed it for now
gulp.task('default',
    gulp.series('build-basic-templates', 'build-advanced-templates', 'build-preview', 'browser-sync', 'watch'));

