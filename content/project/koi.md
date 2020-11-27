# Create powerful CLI applications with ease. All in Bash.

### Easily add command line arguments for Bash functions!
Inspired by Python's argparse.
```
function sendrequest {
    __addarg "-h" "--help" "help" "optional" "" "Send an HTTP request"
    __addarg "-m" "--method" "storevalue" "optional" "GET" "The HTTP method"
    __addarg "-u" "--url" "storevalue" "required" "" "The url of the HTTP request"
    __parseargs "$@"
    curl -X "$method" "$url"
}
```
```
function checkstockprice {
    __addarg "-h" "--help" "help" "optional" "" "Check a stock's price"
    __addarg "" "symbol" "positionalarray" "required" "" "The ticker symbol(s) to check"
    __addarg "-e" "--exchange" "storevalue" "optional" "NYSE" "The exchange to use"
    __addarg "-p" "--port" "storevalue" "required" "" "The port to use"
    __addarg "-q" "--quiet" "flag" "optional" "" "If included, run in quiet mode"
    __parseargs "$@"
    # check the stock price
}
```

### Verbose and complete documentation
For detailed descriptions and in-depth examples of koi's functionality, checkout its [documentation site](https://willcarhart.dev/docs/koi).
Koi's documentation site is built via another one of my projects, [docs]({{src:project/docs.html}}).