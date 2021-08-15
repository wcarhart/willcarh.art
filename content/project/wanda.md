## A meaningful website. A technical experiment.

>> See it yourself! | Wanda is deployed to [alexxandwill.us](https://alexxandwill.us). Check it out yourself to see wanda in action.

### A wonderful site for a wonderful person
For the 2019 holidays, I wanted to be more creative than a simple Christmas card for my beautiful girlfriend, Alexx. Instead, I built her a website, [alexxandwill.us](https://alexxandwill.us), and gave it the codename `wanda` (an acronym for _Will and Alexx_) to hide it until it was ready. Since then, it's blossomed into a fun way to document our relationship.

### How a passion project turned into a technical experiment
Initially, wanda was a standard static website with HTML, CSS, and JavaScript. However, I very quickly realized that much of the website could be broken down into reusable components. I figured that I could use a static site generator to build the site more sustainably in the future, but I had already built the whole website. Thus, I decided to write _my own static site generator._ 
Wanda is staticly generated from a markdown file via a [custom Python HTML generator](https://github.com/wcarhart/wanda/blob/master/generate.py). It was the precursor to the method I've used to develop [willcarh.art]({{src:project/willcarh.art}}), which also uses a custom static site generator, albeit much more complex.
Love you, Alexx ❤️