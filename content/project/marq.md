## Powering static sites from markdown.

### Born out of necessity
Marq started as a simple `markdown.js` file in my personal website project, [willcarh.art]({{src:project/willcarh.art}}). As the markdown necessities of the website grew, like tables and embedded videos, I started searching for an off-the-shelf markdown to HTML converter. I was not satisfied with what I found, and in the spirit of [willcarh.art's]({{src:project/willcarh.art}}) DIY nature, I figured I'd make one myself. Marq has transformed from a simple translator to a powerful generator, now capable of supporting features not included in [GitHub Flavored Markdown (GFM)](https://github.github.com/gfm).

### Supporting the standard
Marq supports the vast majority of markdown features in [GitHub Flavored Markdown (GFM)](https://github.github.com/gfm), except for a few things that I disagree with (e.g. two consecutive lines of text get concatenated if there's not a blank line between them, why??). Marq supports **bold text**, _italicized text_, ~~strikethrough text~~, `inline code`, [links](https://www.youtube.com/watch?v=dQw4w9WgXcQ), and **interwoven _combinations_**. Need a demo? The text you're reading right now was generated with marq. This makes writing blog posts, experience bullets, and project descriptions a breeze, because I never have to touch HTML.

### Enhancing the markdown format
As I have written more blog posts, I realized there were things I wanted to do that stretched the limits of markdown. What if I was writing a blog post about a web development technique and I wanted to showcase the technique right in the blog post's webpage? That exact scenario happened with [one of my blog posts]({{src:blog/how-to-create-the-typewriter-effect-in-javascript}}), and so I started adding enhanced feature's to marq's capabilities. Yes, this means that marq strayed away from GFM, but not so much that it couldn't still render the vast majority of GFM markdown files. Here are a few of its highlights.

#### Embedded YouTube videos
Marq can embedded YouTube videos using the syntax `~(youtube_video_id)`. This makes is easy to place a YouTube video right in the middle of a blog post.
~(5qap5aO4i9A)


#### HTML blocks
===
<p class="p">Some times you want more granular control over your generated HTML. Yes, GFM supports HTML inside markdown files. However, it's limited, because you can't run scripts and attach to the IDs of other generated content (often because they don't have IDs). HTML blocks allow you to inject HTML and inline JavaScript straight into the generated content without leaving your markdown file. This makes it easy to <span style="color:red;">turn text red</span> on demand, or change <span style="font-size: 0.75rem !important">the font-size</span> inline. This may not seem powerful on the surface, but keep in mind that the styling you're seeing right now is all done from a markdown file with no additional HTML, CSS, or JavaScript required.</p>
===

#### Slideshows
Perhaps marq's most powerful feature (and furthest deviation from GFM) is its slideshows. Marq can put a photo carousel right into the page, without any extra code. Here's what the below slideshow looks like in markdown (the images are from my blog cover photos).
```
[[[
    []({{cdn:img/blog/why-i-wrote-my-own-static-site-generator/cover.jpg}})
    []({{cdn:img/blog/using-pm2-to-deploy-robust-nodejs-apps/cover.jpg}})
    []({{cdn:img/blog/the-easy-way-to-add-dark-mode-to-your-website/cover.jpg}})
]]]
```
[[[
	[]({{cdn:img/blog/why-i-wrote-my-own-static-site-generator/cover.jpg}})
	[]({{cdn:img/blog/using-pm2-to-deploy-robust-nodejs-apps/cover.jpg}})
	[]({{cdn:img/blog/the-easy-way-to-add-dark-mode-to-your-website/cover.jpg}})
]]]
