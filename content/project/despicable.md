## A simple multithreading framework.

### What it is
Despicable is a lightweight CLI for multithreading shell commands. Consider the case where you have to scp many large files across a network. Despicable provides an easy-to-use CLI to run the commands in parallel. The framework can either run commands from a file, or can take commands typed out on the command line.
In addition, Despicable distinguishes itself by providing a progress bar and indicator for how many tasks have been completed.
Despicable got its name from its worker threads, which I dubbed _minions_ during development. The naming scheme continues in the vein [Despicable Me](https://www.imdb.com/title/tt1323594/), as the manager of the minions is called _Gru_, while the spawner of the minion threads is called _Nefario_.

### Usage
Despicable can take commands from the command line.
```
python despicable.py -c "cmd0" "cmd1" "cmd2"
```
Or, it can read from a file.
```
python despicable.py -f command_list.txt
```
Despicable has a clean and informative terminal UI.
```
$ python despicable.py -f command_list.txt
[>>>>>>>>>>>>>>>               ] 50% (Processing)
 \ 2 tasks remaining
```

### Example
Suppose you wanted to parallelize the following tasks.
```
cp /source/largefile.csv /destination/
bzip2 -z data.txt
scp big_file.json username@remotehost.edu:/some/remote/directory
aws s3 cp /tmp/foo/ s3://bucket/ --recursive --exclude "*" --include "*.jpg"
```
If these commands were in the `Despicablefile` (default file for commands), you could run it with the command below.
```
python despicable.py
```
```
[>>>>>>>>>>>>>>>               ] 50% (Processing)
 \ 2 tasks remaining
```