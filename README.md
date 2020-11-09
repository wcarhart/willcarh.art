# willcarh.art
[willcarh.art](https://willcarh.art) is Will Carhart's personal porfolio website. This repository is for the most recent version of willcarh.art. For information on v1, please see the [v1 repository](https://github.com/wcarhart/willcarh.art-v1).

### Generating the website
[willcarh.art](https://willcarh.art) is a staticly generated site. It uses a custom node.js generator to replace template HTML with content sourced from markdown files.

Before starting, you'll have to install dependencies. If you don't already have Yarn installed, you can install it with `brew install yarn`.
```bash
git clone https://github.com/wcarhart/willcarh.art.git
cd willcarh.art
yarn install
```
To start a new build, use the forge:
```bash
./forge --help
```
```
forge - build pages for willcarh.art

Usage:
forge [-h] [-d]
  -h, --help      Show this menu and exit
  -d, --develop   Do not exit on validation errors
```

### Understanding this respository
The _forge_ ([`forge`](https://github.com/wcarhart/willcarh.art/blob/master/forge)) generates webpages based on HTML, CSS, and JS templates. When a new version of the site is generated, the forge utilizes `generator/generator.js` and `generator/core.js` to build valid webpages and components in `src/`. It pulls templates from these directories:
* `templates/` - template HTML files for building the webpages in `src/`
* `js/` - template JS files to be included in `src/`
* `snippets/` - HTML and JS snippets from which to build content, used repeatedly throughout the website

And populates them based on files in from `content/`. In addition, static assets are linked from these directories:
* `css/` - static css files
* `font/` - static font files
* `ico/` - static icon files

In addition, the following files are utilized:
* `.gitignore` - describes what items to ignore in git
* `_redirects` - configures routes for Netlify
* `config.json` - the current configurations for the built website
* `forge` - the file that invokes the generator
* `index.html` - the entrypoint for the built website; despite not being in `src/`, `index.html` is still an autogenerated file, but must be in the base directory of the repository in order to be served from Netlify
* `package.json` - standard package JSON generated by Yarn for the generator
* `README.md` - the file, which describes the repository
* `yarn.lock` - standard yarn lock file generated by Yarn to describe the dependencies of the generator
