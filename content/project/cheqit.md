# Monitor website status from your terminal
Cheqit (pronounced _check it_) is a simple command line utility for checking the status of a website or IP address. It was inspired by [downdetector](https://downdetector.com/), which is a website of the same functionality as cheqit. I got the idea when one day I went to use downdetector and it itself was down.

### A simple interface
Cheqit is a simple command line utility for checking website status. Usage is super simple.
```
python cheqit.py google.com amazon.com willcarh.art testy.mctesterson
```
```
google.com UP
amazon.com UP
willcarh.art UP
testy.mctesterson DOWN
```
Cheqit works on IP addresses, too.
```
python cheqit.py 172.217.4.174
```
```
172.217.4.174 UP
```
You can also stream status updates, so cheqit will check at a regular interval and update the terminal.
```
python cheqit.py --stream google.com
```
```
google.com: UP (2019-04-15 05:10:55)

^C to exit...
```