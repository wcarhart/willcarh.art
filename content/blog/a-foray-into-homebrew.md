### What even is Homebrew, anyways?
Perhaps you've stumbled upon a new software tool and seen the instructions `brew install <name>`. As I'm sure you're aware, `brew` is the CLI for [Homebrew](https://brew.sh), the _missing package manager_ for macOS and Linux. Homebrew started as a standard package manager for macOS, as Apple didn't include one by default. You can think of it as macOS's equivalent to [`apt`](https://linuxize.com/post/how-to-use-apt-command/) or [`yum`](https://www.redhat.com/sysadmin/how-manage-packages). Homebrew has since expanded beyond macOS and now supports Linux as well. It uses a modern approach for installing third-party software to your machine, and makes it easy to distribute your home-grown software tools. Let's take a look at Homebrew's nomenclature, how it works, and explore how we can distribute our own software via Homebrew.

### A brief primer of Homebrew's internals
The most common use case for Homebrew is the aforementioned `brew install <name>`. What actually happens when we run this? Let's break this command down.
When we type `brew install <name>`, Homebrew attempts to install, or "brew," the **formula** `<name>`. Formulae in Homebrew are package definitions, or the description of how a piece of software should be installed for the current system. We can define a formula for a software package by creating a Ruby file that describes how we should install the package. Homebrew installs formulae to the **cellar**, a hardcoded location on the local machine. For most Macs, the cellar is `/usr/local/Cellar`. Homebrew prefixes formulae with a **keg**, or an installation prefix, to avoid collisions when different versions of the same package are installed. Finally, Homebrew installs formulae from a **tap**, or a remote repository. The default tap is [Homebrew core](https://github.com/Homebrew/homebrew-core), but Homebrew can install from any tap.
This may sound confusing, but keep in mind that Homebrew's nomenclature is based off of homebrewing beer. You **brew** your **formulae** in **kegs** in your **cellar** from a **tap**. Homebrew also does a great job at explaining this in their [formula cookbook](https://docs.brew.sh/Formula-Cookbook).
Still confused? Let's look at an example.
Let's say I want to install [`bash`](https://www.gnu.org/software/bash/) on my Mac. Macs with macOS prior to 10.15 [shipped with Bash 3.2.57](https://news.ycombinator.com/item?id=20102597), but macOS 10.15+ changed the default shell to [`zsh`](https://www.zsh.org/), so if we want to stick with Bash as the default shell we'll need to manually install it. We can install Bash with Homebrew by using `brew install bash`.
First, Homebrew determines which taps are available on the current machine. If the user has not specified any additional taps, then it will default to [Homebrew core](https://github.com/Homebrew/homebrew-core). Next, Homebrew will look for a formula in the core tap for Bash, called `bash.rb`. If one exists, then it will attempt to install it. Homebrew then follows the instructions defined in [Bash's formula](https://github.com/Homebrew/homebrew-core/blob/master/Formula/bash.rb), and installs Bash 5.x into the cellar, with the keg `/usr/local/Cellar/bash/5.x`. Finally, Homebrew symlinks Bash to `usr/local` so it is available on the `$PATH`. After installation is complete, we can use Bash just by typing `bash`.

### How is Homebrew useful to me?
Homebrew is a feature-rich and robust package installer. It has many different features, many of which could have their own articles written about them. I think there are two benefits of Homebrew that I use day-to-day.

**Installing stuff**
The biggest benefit of Homebrew is using it to actually install software. Homebrew makes installing third-party software a breeze, even if the software I'd like to install isn't included in the default [Homebrew core](https://github.com/Homebrew/homebrew-core) tap.

**Distributing my own software**
The other benefit of Homebrew, which I think is less utilized by individual developers, is the ability to maintain your own tap. Perhaps you've written a new CLI tool (or even a desktop application) that you'd like to distribute to your users. Homebrew makes it easy to set up your own tap and distribute your software without many extra steps, and is built atop existing technologies like Git. Let's take a look at how to do this ourselves.

### Setting up your own Homebrew tap
Suppose we've written the tool `hi`, saved in its own repository on GitHub. For now, let's say that repository was [wcarhart/hi](https://github.com/wcarhart/willcarh.art). Here's what the source code for `hi` looks like.
```
#!/bin/bash
for name in "$@" ; do
    echo "Hi, $name"
done
```
We want to make our CLI tool `hi` installable with Homebrew. To start, we'll need to make sure we go into the repository for `hi` and tag a commit as the `v1.0` release. Then, we'll need to set up our own tap, which is simply a remote Git repository that will describe how to install `hi`. As a result we will have two repositories for `hi`, one for source code and one as a Homebrew tap.
To set up the tap for `hi`, let's first make a new repository on GitHub. The name of this repository is important, as it will be the name of the tap we reference in our `brew install` command. The name of our repository on GitHub must be prefixed with `homebrew-` to tell Homebrew that the repository is a tap. Once we create a new repository `homebrew-<tap>`, we can install software from our tap with `brew install <GitHub username>/<tap>/<formula>`. Let's call our new repository `homebrew-tools` so we can later install `hi` with `brew install wcarhart/tools/hi`.
Next, we'll make a new file in our repository `Formula/hi.rb`. Again, the naming here is important. The `Formula/` directory tells Homebrew that all files in this directory are Homebrew formulae. The filename `hi.rb` lets Homebrew know that this formula is for a tool named `hi`. Note that there can be many formulae in a single tap, specified by each `.rb` file in the `Formula/` directory. Here's what `Formula/hi.rb` should look like.
```
require "formula"

class Hi < Formula
    desc "A command line tool for saying hello"
    homepage "https://github.com/wcarhart/hi"
    url "https://github.com/wcarhart/hi/archive/v1.0.tar.gz"
    sha256 "ec1f1fc76e228ec3853c95d7c1e46d68ee2b33335c855db65f80f7c208d880c2"

    depends_on "bash"

    def install
        bin.install "hi"
    end
end
```
Let's break down this formula. You don't really need to understand how Ruby works as formulae definitions are not heavy in Ruby-specific features. First, we define the metadata for `hi`. There are lots of available [different metadata](https://docs.brew.sh/Formula-Cookbook) that you can define in a formula, but we'll need to include at least _four_ required fields.
|Metadata|Description|
|:------:|-----------|
|`desc`|A simple description of the tool.|
|`homepage`|The homepage for the tool, usually the GitHub repository or similar.|
|`url`|The URL that contains the zipped tarball for the tool. For GitHub, this is usually the repository's URL appended with `archive/<version>.tar.gz`.|
|`sha256`|The SHA-256 hash of the zipped tarball, which will act as a checksum.|


Next, we define any dependencies of `hi`. If your tool does not have any dependencies, then this part can be omitted. Since our tool is written in Bash, we specify Bash as a dependency with `depends_on "bash"`. Here, `"bash"` does not refer to the actual tool Bash, but rather the Homebrew formula `bash.rb`. Since no tap is specified (i.e. not `"wcarhart/tools/bash"`), it's assumed that `bash.rb` will be found in the default [Homebrew core](https://github.com/Homebrew/homebrew-core) tap, which [it is](https://github.com/Homebrew/homebrew-core/blob/master/Formula/bash.rb).
Finally, we specify what steps should be taken to install `hi` with the `install` method. Since this is a simple shell script, all we need to do is move the `hi` script to the `bin/` directory. Note that the actual script is called `hi` and not `hi.sh`, so the command to run the tool will be `hi` and not `hi.sh`. If your tool's file has an extension like `.sh` or `.py`, you'll have to add some logic if you want the tool to be invoked without the extension.
There are many other supported features that we can add to our formula, like licenses, build steps, tests, and more. For now, we'll leave our formula nice and simple, but in practice you'll probably see longer formulae than just what we have here.
Now we should be able to install `hi` with `brew install wcarhart/tools/hi`, and subsequently the command `hi` should be globally available from the terminal. Pretty cool!
>> Note | The tool `hi` does not actually exist, so the command `brew install wcarhart/tools/hi` will not work in reality. However, if you'd like to install one of my real tools, check out [my tap homebrew-tools](https://github.com/wcarhart/homebrew-tools).

### Adding some automation
As you may have noticed, some of this process can be quite tedious and manual. Every time we bump `hi`, say to `v1.1`, we need to update `Formula/hi.rb` in order for Homebrew to install the latest version. Since I do this regularly, I've written a tool to automate this process, called [chiller]({{src:project/chiller}}). Chiller exposes helpful commands like `update` that will look at the latest release on GitHub and update the formula accordingly, including the SHA-256 hash. You can [check out its code](https://github.com/wcarhart/chiller), [read its documentation](https://willcarhart.dev/docs/chiller), and even [view its formula](https://github.com/wcarhart/homebrew-tools/blob/master/Formula/chiller.rb).

### Conclusion
Homebrew makes distributing and installing third-party software a breeze. I use Homebrew to distribute a number of my tools, including [koi]({{src:project/koi}}), [smoosh]({{src:project/smoosh}}), and more. There are many more features of Homebrew that I didn't discuss here, like [casks](https://github.com/Homebrew/homebrew-cask) for desktop applications or brewing from [private taps](https://medium.com/prodopsio/creating-homebrew-taps-for-private-internal-tools-c41363d58ab0). To learn more, check out [Homebrew's documentation](https://docs.brew.sh/). If you'd like to take a look at the tap that I maintain, see [homebrew-tools](https://github.com/wcarhart/homebrew-tools). If you'd like a complete copy of the code developed in this post, check out [this repository](https://github.com/wcarhart/willcarh.art-snippets/tree/master/a-foray-into-homebrew).

=🦉