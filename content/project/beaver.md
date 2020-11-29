# Perform powerful queries against logs.
### Overview
Beaver is a command line utility that parses log files. When modern applications run, they generate a plethora of logging content, and it is often cumbersome to find the small tidbit of information that's actually useful.
Beaver uses an English-like syntax, where the user can essentially specify _show me the logs from yesterday to today_. Beaver is smart enough to understand what the user is looking for and automatically searches for `.log` files in the project directory, and then prints all logs whose timestamps are between yesterday and today.
It's called _beaver_ because beavers eat logs.

### A quick example
Beaver parses log files based on a given date and time range, so you don't have to. Perhaps you'd like to see the logs for your website since the last time you pushed to production last Wednesday. This can be accomplished easily with beaver.
```
python beaver.py Wednesday to today
```
```
>> logfile1.log
2019-04-03 15:10:26,618 - simple_example - DEBUG - debug message
2019-04-03 15:12:45,124 - simple_example - DEBUG - debug message
...
```
Beaver can handle a wide variety of datetime ranges.
```
python beaver.py 10:35 to 11:35
python beaver.py yesterday to today
python beaver.py Mar 2nd, 2012 to now
python beaver.py 2017-06-18 to May 3rd 2018 at 3:17pm
python beaver.py 1:23pm on August 15th 2017 to 10:35 PM on 2 April 2018
```
Beaver automatically looks for any files ending in `.log` or `.logs`, but you can also specify a specific file to parse with the `-f/--file` option.
```
python beaver.py -f my_log_file.txt May 17th to today
```
Beaver's English-like syntax was inspired by Dan Bader's [schedule](https://github.com/dbader/schedule) module, which uses a similar syntax.