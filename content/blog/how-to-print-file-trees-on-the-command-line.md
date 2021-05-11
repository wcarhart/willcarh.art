### Why should we care?
Have you ever written a program that needed to print a list of files to the command line? Perhaps you've done some processing to some files and need to alert the user of the result. The easy way is to print the [basename](https://man7.org/linux/man-pages/man3/basename.3.html) of the files, one after the next. But, what if the files are from different directories? Well, we could print the absolute paths to each file, one after the next. This a great approach for most cases. However, what happens when we have many files?

### A more illustrative picture of a directory
You may have used or heard of the Linux tool [`tree`](https://linux.die.net/man/1/tree). It's an underrated tool that paints a better picture of a directory structure. For instance, consider the following file list.
```
/myProj/app/index.html
/myProj/css/style.css
/myProj/app/index.js
/myProj/res/logo.png
/myProj/res/logo.ico
/myProj/config.json
/myProj/package.json
/myProj/app/blog/post.html
```
By looking at this file list, can you quickly infer the directory structure? Perhaps you can, but I would argue that most do not, at least instinctively. In addition, this is a small example, imagine if we had 50 or 100 files to show. It would be difficult to infer the project structure from just the absolute path names.
This is where `tree` comes in. We can use `tree` to build a _visual file tree_ of a directory. Let's try it out with our example.
```
tree .
```
```
.
├── app
│   ├── blog
│   │   └── post.html
│   ├── index.html
│   └── index.js
├── config.json
├── css
│   └── style.css
├── package.json
└── res
    ├── logo.ico
    └── logo.png
```
Pretty cool, right? Now we can easily see how our project is structured. However, `tree` is a Linux command line tool. What if we want to use it in our code (without calling it from the command line)? Let's break down some of the logic and see if we can write our own in both Python and JavaScript.

### A fun application of recursion
The logic behind `tree` is simple. Let's break it down into some pseudocode.
1. Iterate through every item in the directory.
2. If the item is a file, print it.
3. If the item is a directory, recursively repeat this process.

Were we to code this up right now, we'd have a solution that prints the contents of a directory recursively. However, the real power of `tree` comes from the visual directory structure. When we dive into a directory, `tree` indents the filenames to visually represent the structure. In addition, there are "pretty" lines drawn between each item in the directory, with `└──` listing the last item in the directory and `├──` for everything else.
The key to achieving this is keeping track of how deep our recursion is. If we know we are two recursive calls deep, then we need to indent all the filenames in the directory and prefix them appropriately. Let's take a look at how to achieve this in practice.

### Using Python
First, we'll need a way to perform some file operations. Python has a nice standard library `os` for interacting with the file system, among other things.
```
import os
```
Next, we'll need to translate our pseudocode above into Python. In addition, we'll need to add a few variables to keep track of the line prefixes so we can properly indent our resulting directory strucutre.
```
def build_tree(entity, indent, is_head, is_tail, result):
    # determine if entity is a directory or file
    files = []
    if os.path.isdir(entity):
        files = os.listdir(entity)

    # keep track of line prefixes
    entity_prefix = '└── ' if is_tail else '├── '
    content_prefix = '    ' if is_tail else '|   '
    if is_head:
        entity_prefix = content_prefix = ''

    # add entity to the output
    result += indent + entity_prefix + os.path.basename(entity) + '\n'

    # if entity is a directory, recurse through its contents
    for index in range(len(files) - 1):
        result = build_tree(os.path.join(entity, files[index]), indent + content_prefix, False, False, result)
    if len(files) > 0:
        result = build_tree(os.path.join(entity, files[-1]), indent + content_prefix, False, True, result)
    return result
```
Finally, let's write a simple helper function. Our recursive function will be more usable if it only has one argument, which is the directory to print. The user of our recursive function doesn't need to know about the other arguments. Let's call this new helper function `generate_file_tree`.
```
def generate_file_tree(entity):
    tree = build_tree(entity, '', True, True, '')
    print(tree)
```
Now we can use our code with `generate_file_tree('~/myProj')`.

### Using JavaScript
The JavaScript version is a translation of the Python version; it uses the same logic. Let's write it asynchronously for now, but you can convert it to synchronous code if you'd like. We'll use `fs` and `path` to perform the file operations. We'll also promisify our file operations so they fit with our asynchronous code.
```
const fs = require('fs')
const path = require('path')
const util = require('util')
const readdirPromise = util.promisify(fs.readdir)
const statPromise = util.promisify(fs.stat)
```
The recursive function `buildTree` uses the pseudocode we developed above. It will keep track of the current indent to create the nested directory stucture, same as with the Python version.
```
const buildTree = async (entity, indent, isHead, isTail, result) => {
    // determine if entity is a directory or file
    let stats = await statPromise(entity)
    let files = []
    if (stats.isDirectory()) {
        files = await readdirPromise(entity)
    }

    // keep track of line prefixes
    let entityPrefix = isTail === true ? '└── ' : '├── '
    let contentPrefix = isTail === true ? '    ' : '|   '
    if (isHead === true) {
        entityPrefix = ''
        contentPrefix = ''
    }

    // add entity to the output
    result += indent + entityPrefix + path.basename(entity) + '\n'

    // if entity is a directory, recurse through its contents
    for (let index = 0; index < files.length - 1; index++) {
        result = await buildTree(path.join(entity, files[index]), indent + contentPrefix, false, false, result)
    }
    if (files.length > 0) {
        result = await buildTree(path.join(entity, files[files.length - 1]), indent + contentPrefix, false, true, result)
    }
    return result
}
```
Similar to the Python version, let's create a helper function `generateFileTree` so it appears our function only takes in one argument, which is the directory to print.
```
const generateFileTree = async (entity) => {
    let tree = await buildTree(entity, '', true, true, '')
    console.log(tree)
}
```
Now we can use our code with `await generateFileTree('~/myProj')`.

### Conclusion
Pulling back the curtain on `tree` is a great practice in recursion. Now we can use that functionality for all of our command line tools. If you'd like to replicate this logic in another language, it shouldn't be too hard based on the code we've developed here. If you'd like a complete copy of the code from this post, check out [this repository](https://github.com/wcarhart/willcarh.art-snippets/tree/master/how-to-print-file-trees-on-the-command-line). If you'd like to see this code in action, check out the code for [willcarh.art's]({{src:index}}) custom [static site generator](https://github.com/wcarhart/willcarh.art/blob/master/generator/generator.js), or check out my project [algos]({{src:project/algos}}) where I talk about the [Bubble Tree]({{src:blog/reducing-aws-s3-storage-costs-with-bubble-trees}}).

=🦉