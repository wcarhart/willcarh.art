### You should be using progress indicators
Have you ever done a `cp -a` and then waited five minutes, wondering if your files were still copying? Progress indicators on the command line share the state of your script with the terminal user. It could be anything from copying a file to executing a particularly expensive query, indicating that your script is thinking is a good thing.
One way to do this is to simply log what your script is doing.
```
echo "Copying the files..."
cp -a "$src/*" "$dest"
echo "Done!"
```
Sharing the state of your script with the user via logging what has happened is a great start. However, this doesn't exactly solve the problem, as long running commands can still prevent log statements from occurring while the script is processing.

### A simple spinner
A simple way around this is a spinner. I'm sure you've seen them on websites. When a resource or asset is loading, a webpage might throw up a spinning wheel or other animation to communicate to the user that the machine is working. Despite this animation not knowing the actual progress of the task, it still provides the user with the comfort that the task has been started.
We can accomplish the same thing on the terminal, where tasks can often take a long time. Let's start with the simplest of spinners.
```
while :; do for s in / - \\ \|; do printf "\r$s"; sleep .1; done; done
```
What does this do? Well, `while :` creates an infinite loop, `for s in / - \\ \|` iterates over four different characters, and `printf "\r$s" ; sleep .1` clears the line and prints the next character in the sequence. With a 100ms delay, this creates the animation of a spinner. Go ahead and try running the above command on your terminal to see it in action.
This is pretty cool! We could create an alias to automate this process on the command line.
```
alias spin='while :; do for s in / - \\ \|; do printf "\r$s"; sleep .1; done; done'
```
Now, you might think we've solved the problem. We could just do `cp -a "$src/*" "$dest" && spin` to create a spinner while we run long commands, right? Well, no, at least not yet. When we use our spinner this way, we run it in the same process as our long running command, meaning that our command will have to complete before the spinner even starts.
You might say, why don't we run our spinner in the background? Perhaps we attempt this with `&`.
```
spin &
cp -a "$src/*" "$dest"
```
This means our spinner will run in the background while our long running command, `cp -a "$src/*" "$dest"`, runs. However, there are still a number of other issues. First off, what if our long running command needs to output some information? That would interfere with the spinner's output. In addition, how do we _stop_ the spinner after we've started it? Let's think about how we can modularize our spinner logic to make it a little bit easier to use.

### Adding some modularity
For starters, let's define some goals for our spinner.
* The spinner should run in the background.
* The spinner should be able to be started and stopped independently.
* The spinner should not interfere with other command line output.

How might we make our spinner accomplish all this? First off, let's handle that background process. We can assign the spinner's process ID, or PID, to a variable using `$!`. In Bash, `$!` means the PID of the most recently spawned background process (learn more [here](https://stackoverflow.com/a/5163260/6246128)). We can use this to store our spinner's PID so we can kill it whenever we need to.
```
spin &
pid=$!
...
kill -9 $pid
```
Great! Now we can stop our spinner when we're done with our long running command. However, you may notice that `$pid` still gets printed when we start the new spinner in the background. We can disable this by turning off [Job Control](https://www.gnu.org/software/bash/manual/html_node/Job-Control-Basics.html#Job-Control-Basics) in Bash via `set +m`. Let's modify our code some to add this.
```
set +m
spin &
pid=$!
...
kill -9 $pid
```
But wait, what if we wanted to start and stop the spinner on command? What if we needed to run a number of different functions between starting and stopping the spinner? Let's try to organize this a bit better.
First, lets create a `start_spinner` function to handle what should happen when our spinner starts. Note that we'll have to make `$pid` a global variable, so let's rename it to `$spinner_pid` to be a bit more specific
```
spinner_pid=
function start_spinner {
    set +m
    spin &
    spinner_pid=$!
}
```
Okay, and now let's make another function `stop_spinner` to handle what should happen when our spinner stops.
```
function stop_spinner {
    kill -9 $spinner_pid
    set -m
}
```
Great! Now we can refactor our spinner code like so.
```
spinner_pid=
start_spinner
... # do some long running code
stop_spinner
```

### Handling edge cases
We've got a great foundation for a reproducible spinner. However, we should be careful of some edge cases. If we need to print to the command line, simply stopping the spinner will leave one of the spinner's characters around (`\`, `|`, `/`, or `-`). In addition, what happens if the script crashes? We'd be left with our out of control spinner on the command line and without knowledge of `$spinner_pid` to kill it.
First, let's add some logic to `stop_spinner` to clear the current line when the spinner stops, so we don't leave any extra characters around. We can do this by using [ANSI Escape Sequences](https://tldp.org/HOWTO/Bash-Prompt-HOWTO/c327.html). You can get a quick overview of ANSI escape sequences [here](https://askubuntu.com/questions/831971/what-type-of-sequences-are-escape-sequences-starting-with-033). In addition, we should use the `wait` function to wait for our killed process to exit.
```
function stop_spinner {
    kill -9 $spinner_pid && wait
    set -m
    echo -en "\033[2K\r"
}
```
What does `echo -en "\033[2K\r"` do? Let's break it down. First, `echo -e` will allow `echo` to interpret escape sequences in its arguments and not print them as-is. Next, `echo -n` will print its arguments without a new line. The escape sequence `\033[2K` will erase the contents of the current line, and the carriage return `\r` will reset the cursor to the beginning of the line. This allows us to continue printing to the terminal normally after stopping our spinner.
Next, let's handle what should happen should our script fail. With the current implementation, we'd be left with an out of control spinner on the terminal with no way of stopping it. We can implement a safeguard against this via a [trap](https://tldp.org/LDP/Bash-Beginners-Guide/html/sect_12_02.html). Essentially, we can specify a bit of code that runs when Bash exits. We already have the perfect code snippet that should run when the script exits, `stop_spinner`. Let's register an exit trap to use `stop_spinner`.
```
trap stop_spinner EXIT
```
There's one more gotcha we need to look our for. This trap will now run _every time the script exits_, even if it exits successfully. If the script exits cleanly, our `stop_spinner` function will try to execute `kill -9 $spinner_pid`, even though no process with PID `$spinner_pid` is running. To guard against this case, let's redirect `stderr` to the [null device](https://askubuntu.com/questions/350208/what-does-2-dev-null-mean) in both `start_spinner` and `stop_spinner`. We'll need to wrap `spin` in curly braces for the job control to still function properly.
```
function start_spinner {
    set +m
    { spin & } 2>/dev/null
    spinpid=$!
}

function stop_spinner {
    { kill -9 $spinner_pid && wait; } 2>/dev/null
    set -m
    echo -en "\033[2K\r"
}
```

### More complex spinners
Maybe you've used tools like [Heroku](https://heroku.com/) and seen their fancy spinners. While using `\`, `-`, `/`, and `|` is a great start, we can use some other characters to create even more powerful spinners.
Let's upgrade our `spin` alias to a function and beef it up some.
```
function spin {
	while : ; do for X in '┤' '┘' '┴' '└' '├' '┌' '┬' '┐' ; do echo -en "\b$X" ; sleep 0.1 ; done ; done
}
```
Run this on the commad line to see how it looks! For even more fun spinners, check out [Heroku's CLI spinners](https://github.com/heroku/heroku-cli-util/blob/master/lib/spinners.json).
Could we also print some output with our spinner? What about spinners that are more than one character? Yes and yes! Let's update `start_spinner` and `stop_spinner` to support this.
```
function start_spinner {
    set +m
    echo -n "$1         "
    { while : ; do for X in '  •     ' '   •    ' '    •   ' '     •  ' '      • ' '     •  ' '    •   ' '   •    ' '  •     ' ' •      ' ; do echo -en "\b\b\b\b\b\b\b\b$X" ; sleep 0.1 ; done ; done & } 2>/dev/null
    spinner_pid=$!
}

function stop_spinner {
    { kill -9 $spinner_pid && wait; } 2>/dev/null
    set -m
    echo -en "\033[2K\r"
}
```
Now we can call our spinner with a caption!
```
spinner_pid=
start_spinner "I'm thinking! "
...
stop_spinner
```
Try this out yourself on the command line!

### The final product
Now that we've written `start_spinner` and `stop_spinner` once, we can just include these functions in all of our shell scripts going forward to enable some pretty awesome spinners. If you'd like to see the final, complete version of our spinner code, please refer to [willcarh.art's snippet repo](https://github.com/wcarhart/willcarh.art-snippets/blob/master/how-to-write-better-bash-spinners/snippet.bash).
If you'd like to see how I've used this spinner in practice, checkout [lurker]({{src:project/lurker.html}}) and [birdhouse]({{src:project/birdhouse.html}}), as they both use a modified version of the code snippets developed in this blog post.
Please spin responsibly.
=🦉