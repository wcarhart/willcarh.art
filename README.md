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
