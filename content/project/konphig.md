# Dotfiles, on steroids.
Konphig comes packed out of the box with tons of cool functionality. Here are a few highlights.

> Read the docs | Konphig has a plethora of shell-related features. To explore them all, check out its [documentation site](https://willcarhart.dev/docs/konphig).

### A powerful CLI
Pull multiple registered repositories at once
```
kn repo --pull
Pulling birdhouse...
Pulling koi...
Pulling lurker...
```
Add Homebrew, Yarn, and other packages to track in version control
```
kn new --brew yarn
Added brew formula 'yarn' to konphig
```

### Helpful Bash functions
Join a list of strings
```
merge '-' 'a b' c d
a b-c-d
```
Add a permanent alias on the fly
```
adda e echo
e 'Hello, konphig!'
Hello, konphig!
```
Move up and down directories
```
pwd
# /dir0/dir1/dir2/dir3/dir4
up 4
# /dir0
down 2
# /dir0/dir1/dir2
```

### Clever Git extras
Remove local branches not present in the remote
```
git tidy
```
Review local commits not present in the current branch in the remote
```
git local
```
Get the commits for the last sprint
```
git sprint
```
Get the primary authors for the repository
```
git leaderboard
```
Get all available git aliases
```
git alias
```

### Much, much more
Reset the macOS Touch Bar
```
resetbar
```
Get your public IP address
```
publicip
```
Change your command prompt on the fly
```
dp 5    # change to 'different prompt' #5
```