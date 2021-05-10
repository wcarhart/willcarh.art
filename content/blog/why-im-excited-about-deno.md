### What is Deno?
[Deno](https://deno.land) is a simple, modern, and secure runtime for JavaScript and TypeScript that uses V8 and is built in Rust. Without the software buzzwords and technical jargon, Deno is an up-and-coming library for JavaScript that rivals [Node.js](https://nodejs.org/), written by Node.js' original author, [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl). It was originally announced by Dahl at [JSConf EU 2018](https://2018.jsconf.eu/) and now has stable releases.
Deno is interesting because it attempts to fix Node.js' shortcomings. It introduces novel features to address Dahl's complaints of Node.js without making a new language and ecosystem that is too complex for existing JS devs to approach. It still uses the [V8 JavaScript engine](https://v8.dev) (Google's JavaScript engine), which means it will compile JavaScript (and TypeScript) down to C++. Different from Node.js, however, Deno is written in Rust and embraces modern web development practices that have emerged organically within the existing JavaScript ecosystem. I'm excited to talk about its prospects, drawbacks, and potential uses, so let's dive in!

### So, why Deno over Node.js?
The Node.js ecosystem and community has grown into one of the largest in the world. So, why change it? Deno’s design was informed by Dahl’s [10 Things I Regret About Node.js](https://www.youtube.com/watch?v=M3BM9TB-8yA) talk where he shared his motivations for moving away from Node.js. He stated that while he does enjoy coding in Node.js, his _problems with Node.js are almost entirely around how it manages user code_, and broke down some key features he wished he had implemented from the outset with Node.js. Here's the TL;DW.
**Not sticking with promises**
If you're familiar with the history of Node.js, you'll remember that the language had a rocky path of getting to promises, where it actually added them in one release and removed them in a later one. It took a while for Node.js to then arrive at the `await`/`async` pattern, which finally gave developers a break from ["callback hell"](http://callbackhell.com/).
**Security**
Any Node.js script by default can access the file system, the network stack, environment variables, and more. While this is a boon during development, it can be dangerous if left unmitigated during production. If someone can figure out how to inject malicious code into your application, they could wreak havoc on your file system and application secrets.
**The build system**
At its inception, Node.js utilized [Generate Your Projects](https://gyp.gsrc.io/), or GYP, for building. This is because at the time GYP was used by [Google Chrome](https://www.google.com/chrome/) (which also runs on V8). However, Google changed to [GN](https://gn.googlesource.com/gn/) as fundemental Node.js development was underway. Rather than follow suit, Node.js dug into GYP, creating [node-gyp](https://github.com/nodejs/node-gyp) and becoming the sole user of GYP. Dahl argues this is the biggest individual failure of the Node.js leadership team.
**package.json**
The `package.json` file in Node.js and [NPM](https://www.npmjs.com/) has become a requirement for all Node.js applications. It is the source of truth for dependency versions, package description, license, and other information defined by the developer, which Dahl argues is _boilerplate noise_ and should not be included. In addition, he argues that allowing `package.json` gave rise to the concept of a "module" as a directory of files, which is an abstraction that does not exist on the web.
**node_modules**
If you've spent any time with NPM, I'm sure you know the classic fix to dependency resolution problems: `rm -rf node_modules/ && npm install`. Dahl argues that because the `node_modules/` folder is recreated for every project (even if a dependency is shared between projects), it complicates the module resolution algorithm and bloats the total application size.
**Omitting extensions when importing packages**
In Node.js, when you import a package using the `require('module')` syntax, you don't include the extension (e.g. `.js`). Dahl argues that this is needlessly less explicit in favor of a "clean" syntax and requires the module loader to query the file system at multiple locations to _attempt_ to resolve what the developer intended.
**index.js**
NPM initially looked for the application entrypoint called `index.js`, which was derived from how browsers load `index.html` as home/landing pages for websites. Dahl argues that this is just as unnecessary as `package.json`.

### Why I'm excited about Deno
The result of Dahl's reflection upon Node.js is [Deno](https://deno.land/), a new runtime for JavaScript and TypeScript built in Rust. While still in its infancy, Deno has the potential to become a thriving ecosystem rival to Node.js. Here's what I'm most excited about.
**Native TypeScript support**
No more transpiling! Deno supports TypeScript out of the box, so you can write native `.ts` files and use them alongside `.js` files.
**All async actions return a promise by default**
If you peruse the Node.js documentation, the standard library is a fragmented and aging mess that reflects Node.js' slow acceptance of promises. Deno is designed to work with promises out of the box, as _all the asynchronous APIs in Deno return a promise_. In addition, you can use the `await` keyword at the top-level.
**Improved security and permissions**
By default, all permissions are reserved in Deno (thus the "secure runtime" portion of the tagline). What this means in practice is that a standard Deno script cannot access the file system, network stack, etc. without explicit permission. To access a local file or execute a network request, you must specify the necessary permission with the `--allow-read=...` or `--allow-net` options.
**A standard library that is actually standardized**
In Dahl's talk he mentioned that in his hiatus from using Node.js he switched to Go, where he saw how much cleaner the standard library was. With Deno, a myriad of helpful functionality comes with the standard library, such as HTTP and networking operations, linting, testing, logging, datetime format manipulation, encryption, command line parsing, UUID generation, and much more. With Node.js, most, if not all, of this functionality was relegated to external libraries and modules, creating standardization confusion among developers.
**No more NPM, `package.json`, or `node_modules/`**
This one has caused a little bit of controversy (check out this [GitHub issue](https://github.com/denoland/deno/issues/47) for ~~some drama~~ a heated discussion). Deno allows developers to import modules via a local path and a URL, and uses a built-in package manager to resolve dependencies. Dependencies are cached on the machine so they are not needlessly duplicated between projects. You can use `deno bundle` to bundle all of your application's code into one shippable product. This allows developers to do things like `deno run https://deno.land/std/examples/welcome.ts` without something like `git clone https://deno.land/std/examples && yarn install` first.
**Emphasis on coding standards**
Deno comes packed out of the box with bundling, testing, and linting. Deno's [bundler](https://deno.land/manual/tools/bundler) outputs a single JavaScript file which includes all dependencies of the specified input. Running [`deno test`](https://deno.land/manual/testing) will use Deno's built-in test runner to search recursively for test files and execute them. Deno's [linter](https://github.com/denoland/deno_lint) has functionality comparable to [ESLint](https://eslint.org/) while executing _100x faster_ on average.

### A few caveats
**Lack of clarity around installed Deno Packages**
When a dependency is installed, Deno caches the files in `$DENO_DIR`, which on macOS is `$HOME/Library/Caches/deno` or `$HOME/.deno` (run `deno info` for system specific configuration). Suppose one local Deno project utilizes `v1.x` of a dependency, while another utilizes `v1.y`. At the time of development, both local projects installed the latest version of the dependency, which happened to be `v1.x` for the first project and `v1.y` for the second. From the developer's perspective, it is not immediately apparent what version the first project is using after the second project installs `v1.y`. This is a difference in design philosophy between Node.js and Deno. Node.js relies heavily on `package.json`, while Dahl argues that `package.json` is largely unnecessary. Only time will tell if Deno's dependency management system will become as stable as that of Node.js.
>> Note | Since writing this article, there have been changes to Deno. Deno has developed [`deps.ts`](https://deno.land/manual/examples/manage_dependencies), which can act as a single-source-of-truth for dependencies in a project. However, the differing opinions in design philosophies between Deno and Node.js still exist.

**Backwards compatibility**
Deno applications are not backwards compatible with Node.js, but that's not really the point. Deno is seen by many as the "next interation" of the server-side JavaScript ecosystem unburdened by the shortcomings of Node.js. One caveat is the lack of backwards compatibility with Node.js, but frankly, I think that's OK.

### Install
If you want to take Deno for a spin, it's easy to install.
| Installation | Command |
|--------------|---------|
| Shell (Linux) | `-fsSL https://deno.land/x/install/install.sh | sh` |
| Homebrew (macOS, Linux) | `brew install deno` |
| PowerShell (Windows) | `iwr https://deno.land/x/install/install.ps1 -useb | iex` |
| Chocolatey (Windows) | `choco install deno` |
| Scoop (Windows) | `scoop install deno` |
| Build from source | `cargo install deno --locked` |


### Demo
Here's a really quick demo that showcases Deno's dependency resolution, sandboxing permissions, and standard library.
First, create a file called `server.ts`.
```
import { serve } from "https://deno.land/std@0.59.0/http/server.ts";
const s = serve({ port: 8000 });
for await (const req of s) {
   req.respond({ body: "Hello World\n" });
}
```
Then, start the server.
```
deno run --allow-net server.ts
```
Finally, navigate to `localhost:8000`.

### My own Deno experiment
I wanted to play around with Deno myself in a non-trivial fashion. I decided to create an automated Sudoku solver, dubbed [doku]({{src:project/doku.html}}), to test out Deno. I had a fun time with Deno and built a cool project, so it was a win-win. You can try out doku yourself via `brew install wcarhart/tools/doku`, or check out its [project page]({{src:project/doku.html}}) or its [repository](https://github.com/wcarhart/doku).

### Conclusion
Node.js has stablized to a very functional and competent toolset, but it has been a bumpy road and has not been without its problems. I think Deno is a cool evolution of the Node.js ecosystem and brings a lot of helpful changes to the table that are rooted in experience. It's not without its own issues, but I hope it is here to stay. I doubt it will ever fully replace Node.js, but I would be happy to move over fully to Deno in the future if it truly became the standard for server-side JS. If you want to learn more about Deno, check out its [website](https://deno.land), its [source code](https://github.com/denoland/deno), or other [awesome Deno projects](https://github.com/denolib/awesome-deno).

=🦉