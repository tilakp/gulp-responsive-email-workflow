# gulp-responsive-email-workflow
Gulp.js based workflow to build and test responsive html templates. 

## Overview

This is a very simple gulp based workflow to create and test responsive email templates locally. If you are beginner like me, install `npm` and `gulp` first.

After installation, you can run it like:
```bash
git clone https://github.com/tilakp/gulp-responsive-email-workflow.git
npm install
gulp
```
which should open it in a browser and you can selected some templates and play with it. 

If you want to run a specific steps, you can see targets defined in gulpfile and run them directly e.g., `gulp build-advanced-templates`

## Project Structure
### src/preview
It contains "preview functionality" that Lee Munroe has put together in his tutorial (see "Inspirations#1") and it is used as a base to test various templates. There is gulp target that does its magic and will output files in `preview` directory to keep email templates separate. 

### templates 
Email template from https://github.com/joshuasoehn/email-framework/ and from Lee's tutorial (see "Inspirations#2"). I moved handlebar templates to nunjucks since `assemble` hasn't been supported anymore and I was getting build errors. Nunjucks is better from my brief evaluation. 

For simplicity, I don't have litmus or mailgun or other 3P integrations.

## Inspirations

1. https://webdesign.tutsplus.com/tutorials/using-grunt-to-make-your-email-design-workflow-fun-again--cms-22223 - great Grunt.js based workflow which uses handlebar templates. It also has a nice looking preview utility which are uses in this project with Gulp. 
2. https://github.com/joshuasoehn/email-framework/.
