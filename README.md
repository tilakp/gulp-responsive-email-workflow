# gulp-responsive-email-workflow
Gulp.js based workflow to build and test responsive html templates. 

## Overview

This is a very simple gulp based workflow to create and test responsive email templates locally. If you are beginner like me, install `npm` and `gulp` first.

After installation, you can run it like:
`
git clone https://github.com/tilakp/gulp-responsive-email-workflow.git
npm install
gulp
`
which should open it in a browser and you can selected some templates. 

## Project Structure
### src/preview
I really liked preview utility that Lee Munroe has put together in his tutorial (see "Inspirations#1") so it is used as a base to test various templates. It is outputted in a separate directory (preview) to keep email templates separate. 

### templates 
Email template from https://github.com/joshuasoehn/email-framework/

### hb-templates
Handlebar templates (including partials and data) from Lee's tutorial (see "Inspirations#2"). If I was doing this from scratch, I would have gone with Nunjucks (may be I will add new templates using Nunjucks)


For simplicity, I don't have litmus or mailgun or other 3P integrations.

## Inspirations

1. https://webdesign.tutsplus.com/tutorials/using-grunt-to-make-your-email-design-workflow-fun-again--cms-22223 - great Grunt.js based workflow which uses handlebar templates. It also has a nice looking preview utility which are uses in this project with Gulp. 
2. https://github.com/joshuasoehn/email-framework/ - it wasn't using any templating but used as a base with additional changes to support handlebar templates from #1.
