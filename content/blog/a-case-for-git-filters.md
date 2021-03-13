### Git's lesser known features
I'm starting to realize that every time I want to do something in Git that someone else has already written functionality for it. A quick web search shows some lesser known features like [`git stash`](https://git-scm.com/docs/git-stash) and [`git cherry-pick`](https://git-scm.com/docs/git-cherry-pick). But, what if I only want to commit a few lines of the code I've written in a file? Yes, feature already exists, use [`git add -p`](https://git-scm.com/docs/git-add#Documentation/git-add.txt---patch). Okay, but what if I found a bug in my current branch and don't know how to find what commit created it? Yes, feature already exists, use [`git bisect`](https://git-scm.com/docs/git-bisect). Since its birth in 2005, Git has become one of the most pleasant, fully-featured software tools I use day-to-day (when it does what I want). Let's look at one of the most powerful, underutilized Git features: Git filters.

### Git filters
Git filters are not a mainstream feature of Git - there's not even a dedicated page for them in the documentation. They're a subfeature of Git Attributes, or the path-specific Git Settings, specified in `.gitattributes`. You can use a `.gitattributes` file in your repository to change the settings for a specific repository and not Git as a whole on your machine. If you've used a `.gitattributes` file in the past, perhaps you've used it to specify merge strategies, which is a commonly used feature. You can explore all of the available Git customizations and functionality in [the documentation](https://git-scm.com/book/en/v2/Customizing-Git-Git-Attributes).
For today, we're going to talk about Git filters - or _keyword expansion_ as it's referenced in the docs. When you commit a file to Git, the file contents are **immutable**, meaning we cannot change the file contents without changing the commit's hash (the commit's unique identifier). If you change the contents of the file, you get a new hash, and need to create a new commit. You can try this yourself on the command line with `git hash-object`.
```
echo 'Hello, Git!' | git hash-object --stdin
```
>> Read more | If you're interested in learning more about Git's hashing algorithm `SHA-1`, [have a listen from Linus Torvalds himself](https://www.youtube.com/watch?v=4XpnKHJAok8&t=3376s). Git plans on transitioning to `SHA-256` in the future after security vulnerabilities have been [discovered in `SHA-1`](https://shattered.io/).

These hashes are what uniquely identify each commit, and so they can't be changed once blobs are committed. This can cause problems if we're not careful. Suppose I've written a super cool web application called **MyCoolApp**, which reads from a database. Suppose in my code somewhere I have the following lines.
```
const DBNAME = 'MyCoolApp_DB'
const DBPASS = 'pA$$w0rD'
```
MyCoolApp will need these credentials in order to function. However, if we check this file into Git as is, our database credentials will be hardcoded for all to see. This isn't ideal if we want to share our novel code for MyCoolApp without sharing the database credentials.
One way to avoid this is by using [environment variables](https://askubuntu.com/questions/58814/how-do-i-add-environment-variables/58826#58826), which is what many deployments use. If you've ever used a CI or PaaS provider, they almost always have a section for adding environment variables. Such is a great way for deploying the application, but it comes with one caveat - where do you put the actual _plaintext_ value after its read into an environment variable? What if you set `export DBPASS='pA$$w0rD'` but then restart your shell? Yes, there are ways to make this variable persistent, but there's another answer: Git keyword expansion, or **Git filters**.
At a high level, Git filters allow us to perform `sed`-like text substitution in a step between the _staging area_ and the _working repository_. Recall that there are 3 main settings in which code can reside in a local Git repository: the working area (the _workspace_), the staging area (the _index_), and repository area (the _local repository_). There is also the [_stash_](https://git-scm.com/docs/git-stash), but that's not relevant for now. To move files from the _workspace_ to the _index_, we use the command `git add`. To move files from the _index_ to the _local repository_, we use the command `git commit`. Finally, to move files from the _local repository_ to the _remote repository_, we use the command `git push`.
Git filters allow us to run some text substitution before files get moved from the _index_ to the _local repository_ (i.e. after `git add` and before `git push`). There are two main filters: `smudge` and `clean` (you can also define your own custom filters). `smudge` is run on checkout, and `clean` is run when files are staged. You can infer the function of `smudge` and `clean` based on their definitions in English; we _smudge_ a secret value before we check it out, and we _clean_ it before we check it back in.
![Diagram of smudge filter]({{cdn:img/blog/a-case-for-git-filters/smudge.png}})<The `smudge` filter is run at checkout.>
![Diagram of clean filter]({{cdn:img/blog/a-case-for-git-filters/clean.png}})<The `clean` filter is run when files are staged.>
These filters can be configured to do just about anything, which makes them super powerful. Another great use case is using them to resolve Windows vs. Unix line endings on file checkout if you develop on both Windows and Linux-like machines. For now, let's see how we can use Git filters to resolve our credentials issue from above.

### A simple use case
We're going to use `smudge` and `clean` to hide our secret values (i.e. our `DBPASS`) from Git, so when someone views our repository on GitHub they can't access our production database.
First, let's make a dummy repository for demonstration purposes.
```
mkdir ~/MyCoolApp
cd !$
git init
```
Next, let's add our secret text to a dummy file. In an actual application, you'd have much more code than just two variables.
```
echo -e 'const DBNAME = "MyCoolApp_DB"\nconst DBPASS = "pA$$w0rD"' > app.js
```
We can print the contents of `app.js` to confirm that we see our correct, plaintext credentials.
```
cat app.js
```
```
const DBNAME = 'MyCoolApp_DB'
const DBPASS = 'pA$$w0rD'
```
Should we commit `app.js` right now, `pA$$w0rD` will forever be written to the repository's history, which is not good. Let's configure our `smudge` and `clean` filters to avoid this undesired result.
There are two places you can define your Git filters, either in `.git/config` or `~/.gitconfig`. Putting your filters in `.git/config` means the filter is defined for this repository only, but they may be visible in your remote. Putting your filters in `~/.gitconfig` means the filter is defined for all Git repositories on this machine. Let's use latter, because we want to be sure we don't expose our sensitive credentials. To do, we'll need to make sure we use the `--global` flag when we configure our filters.
Let's create a new filter called `resolveSecret`. We'll use `sed` for the actual string manipulation.
```
git config --global filter.resolveSecret.smudge "sed 's/SMUDGED_DATABASE_PASSWORD/pA$$w0rD/g'"
git config --global filter.resolveSecret.clean "sed 's/pA$$w0rD/SMUDGED_DATABASE_PASSWORD/g'"
```
Next, let's wire up our filter to be used in MyCoolApp's local repository.
```
echo 'app.js filter=resolveSecret' > .gitattributes
```
We can confirm that our filter `resolveSecret` is properly defined in `~/.gitconfig`.
```
cat ~/.gitconfig
```
```
...
[filter "resolveSecret"]
    clean = sed 's/pA$$w0rD/SMUDGED_DATABASE_PASSWORD/g'
    smudge = sed 's/SMUDGED_DATABASE_PASSWORD/pA$$w0rD/g'
```
And, we can confirm that `resolveSecret` will be run on staging and checking out of `app.js`.
```
cat .gitattributes
```
```
app.js filter=resolveSecret
```
>> Watch Out! | If we don't use the `--global` flag when defining our filter, then Git will put it in the `.git/config` for the current repository. Although you can't see this in GitHub's UI, the secret value is still included in the repository, so a nefarious individual could expose it!

Next, we can commit our files normally.
```
git status
git add -A
git commit -m 'Initial commit'
```
We can create a new remote repository on GitHub using the [GitHub CLI `gh`](https://github.com/cli/cli). If you don't use `gh`, you can either make a repository manually or install it with `brew install gh`.
```
# create the remote
gh repo create --public $(basename "$(pwd)")

# confirm it added remote 'origin' to our local repository
git remote --verbose

# gh sets up remotes using HTTPS, if we want to use SSH we'll have to reconfigure 'origin'
git remote rm origin
git remote add origin git@github.com:$(whoami)/$(basename "$(pwd)").git
git remote --verbose

# push to remote
git push -u origin master

# open remote in browser
if [[ "$(uname -s)" == 'Darwin' ]] ; then open "https://github.com/$(whoami)/$(basename "$(pwd)")" ; fi
```
If we navigate to our remote repository in the browser, we'll see the string `SMUDGED_DATABASE_PASSWORD` instead of our plaintext password. Pretty cool!
There are a few caveats to be aware of. If we change our password or secret value in our code text, we'll also need to update our Git filter before we commit. In addition, this filter will only work on machines that have the filter configured correctly. If you push from a machine with the filter configured and pull from a different machine without the filter configured, you'll be stuck with the smudged string instead of the plaintext one.

### Conclusion
The `smudge` and `clean` filters are powerful. This is one cool example of their usage, but because you can run arbitrary code from within the filter, you can do just about anything. Perhaps you'd like to set up a server to receive pings whenever someone pulls from your repository and then send a push notification to your phone. Although a bit extra, this is definitely possible with Git filters. I'll leave the rest of that implementation to you.

=🦉