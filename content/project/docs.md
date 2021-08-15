## A clean interface for all of my tools' documentation.
>> Check it out! | Docs is deployed at [willcarhart.dev](https://willcarhart.dev). Check it out yourself to explore how the site works.

### Documentation is paramount
Documentation is important. People won't use my software if it isn't well-documented. And, as I written more and more software tools, I've started to feel constrained by standard GitHub READMEs and markdown files. While they are great starting point, I wanted a bit more control over how I structured my documentation. Thus, I created a standalone documentation website to house all of my software tools' documentation, which is currently deployed to [willcarhart.dev](https://willcarhart.dev).

### Multiplexing documentation
In order to reduce the amount of repeated components within my documentation site, I use a purpose-built static site generator for documentation, [Docsify](https://docsify.js.org). In addition, docs acts as a documentation multiplexer, as it has a custom landing page that directs you to the separate documentation sites depending on what tool you're looking for.