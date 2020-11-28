# A website. A showcase. A story.

### My take on a portfolio website
Willcarh.art is my personal website. It serves as a software showcase, personal blog, and expression of me.

### An evolving approach
Willcarh.art has gone through multiple implementations.
Originally, it was a full-stack Django application (for more, see the [v1 repository](https://github.com/wcarhart/willcarh.art-v1)) deployed via Heroku. As I've continued my career as a software engineer, I've progressed into additional positions, written more personal projects, and penned more blog posts; along the way, the web app became difficult to maintain and manage.
The second version of willcarh.art became a staticly generated site to combat the pain points from the previous implementation. However, because I'd like more nuanced control of the site (and because I'm a bit sadistic), I wrote the static site generator from scratch in Node.js. This allows me to write all of the content for the website in markdown files and generate webpages from them.

### Under the hood
Willcarh.art's generator is responsible for all of the webpages available on the site. Although the generator uses Node.js, the actual site is nothing more than vanilla HTML, CSS, and JavaScript (with a little bit of jQuery). The generator reuses HTML templates and snippets to reduce the complexity of the generation process.

### Learn more
To see how the generator works, check out [generate.js](https://github.com/wcarhart/willcarh.art/blob/master/generator/generator.js) and [core.js](https://github.com/wcarhart/willcarh.art/blob/master/generator/core.js).
To see willcarh.art's custom markdown to HTML converter, check out [markdown.js](https://github.com/wcarhart/willcarh.art/blob/master/generator/markdown.js). The markdown converter creates HTML for all the project and blog pages, this page included.
To see how willcarh.art reuses its components without a front-end framework, check out the [templates/](https://github.com/wcarhart/willcarh.art/tree/master/templates) and [snippets/](https://github.com/wcarhart/willcarh.art/tree/master/snippets) folders.