# Automating the release process.

### Releasing via GitHub, deploying via Homebrew
To easily deploy many of my software tools, I use [Homebrew](https://brew.sh). Homebrew provides a clean interface for installing 3rd party software, and it's available on both macOS and Linux. However, Homebrew depends on a _tap_ (a repository) to define _formulae_ (build and installation instructions), which specify release versions of installable software. When releasing software, it can be time consuming to manually tag the release commit, release it on [GitHub](https://github.com), and update the formula in the tap. Chiller is an automation tool to accelerate this release process.
It's called chiller because a [chiller](https://en.wikipedia.org/wiki/Immersion_chiller) is a helpful tool when home brewing.

### Automating the repetitive stuff
Chiller has a few helpful commands for bumping formulae when new versions of software are available. For full command documentation, check out chiller's [documentation site](https://willcarhart.dev/docs/chiller).
? This table is automatically generated!
| Command | Description |
| ------- | ----------- |
|`chiller change`|Change the formula for a local tap to a specific release in GitHub.|
|`chiller get`|Get a release tarball for a repository.|
|`chiller help`|Show the help menu.|
|`chiller list`|List all available commands.|
|`chiller pull`|Pull the latest release for a repsitory and generate a SHA256 hash.|
|`chiller sha`|Generate a SHA256 hash for a release.|
|`chiller update`|Update the formula for a local tap to the latest release on GitHub.|
