// This is an autogenerated file - DO NOT EDIT DIRECTLY
// This file was generated on Sat Nov 28 2020 17:22:05 GMT-0700 (Mountain Standard Time) via the forge in willcarh.art v2.0.0
// Learn more: https://github.com/wcarhart/willcarh.art

// full content data for client-side filtering

// TODO: make sure this is consistent with entities.js

class Blog{constructor({title:t="",subtitle:s="",blurb:e="",cover:i="",coverAuthor:r="",coverCredit:h="",published:o="",updated:u="",resources:c=[],author:l="",status:a="",tags:b=[],content:d=[]}){this.title=t,this.subtitle=s,this.blurb=e,this.cover=i,this.coverAuthor=r,this.coverCredit=h,this.published=o,this.updated=u,this.resources=c,this.author=l,this.status=a,this.tags=b,this.content=d}}
class Project{constructor({name:s="",blurb:t="",about:i=[],languages:e=[],technologies:n=[],img:l="",repo:o="",link:a="",demo:h="",latestVersion:r="",published:u="",status:c="",install:d="",documentation:b="",related:g=[],visibility:m="",tags:p=[]}){this.name=s,this.blurb=t,this.about=i,this.languages=e,this.technologies=n,this.img=l,this.repo=o,this.link=a,this.demo=h,this.latestVersion=r,this.published=u,["stable","in development","stale","archived"].includes(c)||console.error(`Unknown status '${c}'`),this.status=c,this.install=d,this.documentation=b,this.related=g,["super","featured","normal","less","none"].includes(m)||console.error(`Unknown visibility '${m}'`),this.visibility=m,this.tags=p}}

let ALL_PROJECTS = []
let ALL_BLOG_POSTS = []
let ALL_APPS = []

ALL_PROJECTS.push(new Project(JSON.parse('{"name":"lurker","blurb":"Hacker News terminal client","about":["Lurker is a simple terminal client for reading Y Combinator\'s Hacker News. It uses the public Hacker News API and is written entirely in Bash so it runs smoothly in the majority of terminal environments.","Lurker embraces the hacker in Hacker News by exposing a simple CLI for reading stories, comments, and user information. This makes it easy to read Hacker News while completing other command line activities, especially when combined with tools like tmux.","In addition to browsing Hacker News, lurker can summarize most text articles and snippets via another one of my tools, smoosh."],"languages":["Bash"],"technologies":["Hacker News API"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/lurker.png","repo":"https://github.com/wcarhart/lurker","latestVersion":"","published":"2019","status":"stable","install":"brew install wcarhart/tools/lurker","documentation":"https://willcarhart.dev/docs/lurker","related":["koi","smoosh"],"visibility":"super","tags":["cli"],"link:":"","demo":"false","latest_version":"1.7.0"}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"doku","blurb":"Automated Sudoku solver","about":["Doku is an automated Sudoku board solver. It uses dynamic programming to build a tree of possible subsequent Sudoku boards and performs a depth-first search for a viable solution."],"languages":["Deno","JavaScript"],"technologies":[],"img":"https://storage.googleapis.com/willcarh-art/img/logos/doku.png","repo":"https://github.com/wcarhart/doku","latestVersion":"","published":"2020","status":"stable","install":"brew install wcarhart/tools/doku","documentation":"","related":[],"visibility":"featured","tags":["cli"],"technologies:":"","link:":"","demo":"true","latest_version":"1.0.3","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"smoosh","blurb":"A simple algorithm for summarizing text","about":["Inspired by SMMRY, smoosh is a simple tool for summarizing text snippets. It can effectively reduce new articles, blog posts, or any body of text into just a few sentences. Armed with some simple web scraping, smoosh is a powerful tool for riffling through text on the web.  "],"languages":["Python"],"technologies":["BeautifulSoup"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/smoosh.png","repo":"https://github.com/wcarhart/smoosh","latestVersion":"","published":"2019","status":"stable","install":"brew install wcarhart/tools/smoosh","documentation":"","related":[],"visibility":"super","tags":["cli"],"link:":"","demo":"true","latest_version":"2.2.0","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"koi","blurb":"Bashful argument parsing","about":["Koi is an argument parsing library for Bash. Initially inspired by Python\'s argparse, koi is a powerful and fully-featured Bash library for creating comprehensive CLI shell applications. It is used by a number of various applications, both open source and enterprise."],"languages":["Bash"],"technologies":[],"img":"https://storage.googleapis.com/willcarh-art/img/logos/koi.png","repo":"https://github.com/wcarhart/koi","latestVersion":"","published":"2020","status":"stable","install":"brew install wcarhart/tools/koi","documentation":"https://willcarhart.dev/docs/koi","related":["lurker","birdhouse","konphig","chiller","thoth","docs"],"visibility":"super","tags":["library"],"technologies:":"","link:":"","demo":"false","latest_version":"1.2.1"}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"snug","blurb":"Automated cloud repository backup","about":[],"languages":["Bash","Node.js","JavaScript"],"technologies":["GitHub API","GCP Cloud Source Repositories","GCP Cloud Functions","GCP Cloud Scheduler","GCP Secrets Manager"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/snug.png","repo":"https://github.com/wcarhart/snug","latestVersion":"","published":"","status":"in development","install":"","documentation":"","related":[],"visibility":"none","tags":["cli","cloud"],"about:":"","link:":"","demo":"false","latest_version:":"","published:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"willcarh.art","blurb":"Personal portfolio website","about":["Willcarh.art is my personal website and software portfolio. It has evolved over time from a Django application to a static site built by a custom Node.js generator. Willcarh.art is home to all of my projects, blog posts, and software-related ideas."],"languages":["Node.js","JavaScript","HTML","CSS","Bash"],"technologies":["Yarn","Netlify","GCP Cloud CDN","jQuery","Bootstrap"],"img":"../ico/home-about.png","repo":"https://github.com/wcarhart/willcarh.art","latestVersion":"","published":"2019","status":"stale","install":"","documentation":"","related":[],"visibility":"featured","tags":["cli","web"],"link":"https://willcarh.art","demo":"false","latest_version":"2.0.0","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"docs","blurb":"Multiplexed tool documentation","about":["Docs is the source repository for my documentation website, deployed to willcarhart.dev. It contains documentation for many of the software tools I\'ve written, such as koi, birdhouse, and many others. It is a staticly generated site built via Docsify."],"languages":["JavaScript","HTML","CSS","Bash"],"technologies":["Netlify","Docsify","jQuery"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/docs.png","repo":"https://github.com/wcarhart/docs","latestVersion":"","published":"2020","status":"stable","install":"","documentation":"","related":["lurker","koi","birdhouse","konphig","chiller"],"visibility":"featured","tags":["web"],"link":"https://willcarhart.dev","demo":"false","latest_version:":"","install:":"","documentation:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"konphig","blurb":"Dotfiles, custom Bash configs, and more","about":["Konphig is my take on the classic dotfiles repository. Initially just a collection of configuration files, konphig has evolved into a fully-featured command line interface for managing system configurations, including custom Bash functions, Git configurations, and much, much more."],"languages":["Bash","Vim Script"],"technologies":[],"img":"https://storage.googleapis.com/willcarh-art/img/logos/konphig.png","repo":"https://github.com/wcarhart/konphig","latestVersion":"","published":"2018","status":"stable","install":"brew install wcarhart/tools/kn","documentation":"https://willcarhart.dev/docs/konphig","related":["koi"],"visibility":"featured","tags":["cli","configuration"],"technologies:":"","link:":"","demo":"false","latest_version":"1.0.4"}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"hustle","blurb":"Rapid & lightweight workflow management","about":[],"languages":["Node.js","JavaScript"],"technologies":[],"img":"https://storage.googleapis.com/willcarh-art/img/logos/hustle.png","repo":"https://github.com/wcarhart/hustle","latestVersion":"","published":"","status":"in development","install":"","documentation":"","related":[],"visibility":"none","tags":["api","cli","cloud"],"about:":"","technologies:":"","link:":"","demo":"false","latest_version:":"","published:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"soliloquy","blurb":"Project showcase website","about":["The word soliloquy means an act of speaking one\'s thoughts aloud when by oneself or regardless of any hearers. Soliloquy aims to live up to that definition; it is a portfolio website for showcasing software projects. Developers can add their own software projects to demo what they have been working on recently."],"languages":["Python","HTML","CSS","JavaScript","Bash"],"technologies":["Django","jQuery","Bootstrap","Heroku","Travis CI"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/soliloquy.png","repo":"https://github.com/wcarhart/soliloquy","latestVersion":"","published":"2019","status":"stale","install":"","documentation":"","related":[],"visibility":"normal","tags":["web"],"link":"https://soliloquy.dev","demo":"false","latest_version:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"odin","blurb":"Personal financial portfolio manager","about":[],"languages":["Node.js","JavaScript","HTML","CSS","Bash","SQL"],"technologies":["Electron","SQLite"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/odin.png","repo":"https://github.com/wcarhart/odin","latestVersion":"","published":"","status":"in development","install":"","documentation":"","related":[],"visibility":"none","tags":["desktop","cli"],"about:":"","link:":"","demo":"false","latest_version:":"","published:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"birdhouse","blurb":"🐦 Passive tweet watcher from the command line","about":["Birdhouse is a CLI for interacting with tweets. It can stream tweets bash on author and hashtag and exposes and easy-to-use interface for interacting with Twitter from the command line."],"languages":["Bash"],"technologies":["Twitter API"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/birdhouse.png","repo":"https://github.com/wcarhart/birdhouse","latestVersion":"","published":"2020","status":"stable","install":"brew install wcarhart/tools/birdhouse","documentation":"https://willcarhart.dev/docs/birdhouse","related":["koi"],"visibility":"featured","tags":["cli"],"link:":"","demo":"true","latest_version":"12"}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"thoth","blurb":"Helpful English diction tools for the command line","about":["Thoth is a set of command line tools for defining and understanding works in the English language. It contains functionality for defining words, finding synonyms, and using words in sentences."],"languages":["Bash"],"technologies":[],"img":"https://storage.googleapis.com/willcarh-art/img/logos/thoth.png","repo":"https://github.com/wcarhart/thoth","latestVersion":"","published":"2020","status":"stable","install":"brew install wcarhart/tools/thoth","documentation":"","related":["koi"],"visibility":"normal","tags":["cli"],"technologies:":"","link:":"","demo":"false","latest_version":"1","documentation:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"chiller","blurb":"🍺 Helpful GitHub repository and Homebrew tools","about":["Chiller is a command line tool for managing GitHub releases and Homebrew formulae. It makes it easy to bump Homebrew formulae when a newer version of a repository is published."],"languages":["Bash"],"technologies":["GitHub API","Homebrew"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/chiller.png","repo":"https://github.com/wcarhart/chiller","latestVersion":"","published":"2020","status":"stable","install":"brew install wcarhart/tools/chiller","documentation":"https://willcarhart.dev/docs/chiller","related":["koi"],"visibility":"normal","tags":["cli","configuration"],"link:":"","demo":"false","latest_version":"1.1.5"}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"wanda","blurb":"Timeline site for Will and Alexx","about":["Wanda is the timeline site for Will and Alexx. It is a fun way to take a trip down memory lane and showcase Will and Alexx\'s relationship."],"languages":["Python","HTML","CSS","JavaScript"],"technologies":["Netlify"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/wanda.png","repo":"https://github.com/wcarhart/wanda","latestVersion":"","published":"2019","status":"stable","install":"","documentation":"","related":[],"visibility":"featured","tags":["web"],"link":"https://alexxandwill.us","demo":"false","latest_version":"1.2.0","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"aerogram","blurb":"Serverless chat via ssh/scp","about":["Aerogram is a CLI chat application based on ssh. It allows you to chat with other users on remote machines without setting up an intermediate server or any other infrastructure."],"languages":["Bash"],"technologies":["ssh","scp"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/aerogram.png","repo":"https://github.com/wcarhart/aerogram","latestVersion":"","published":"2019","status":"stale","install":"","documentation":"","related":["koi"],"visibility":"normal","tags":["cli"],"link:":"","demo":"false","latest_version:":"","install:":"","documentation:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"beaver","blurb":"Logs querier","about":["Beaver is a simple tool for parsing logs. It can query logs in a file tree based on content and timestamps."],"languages":["Python"],"technologies":[],"img":"https://storage.googleapis.com/willcarh-art/img/logos/beaver.png","repo":"https://github.com/wcarhart/beaver","latestVersion":"","published":"2019","status":"stale","install":"","documentation":"","related":[],"visibility":"normal","tags":["cli"],"technologies:":"","link:":"","demo":"false","latest_version:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"despicable","blurb":"Lightweight multithreading framework for shell tasks","about":["Despicable is a lightweight multithreading framework. Originally written for managing complex compression algorithms, it has been generalized to run shell commands."],"languages":["Python"],"technologies":[],"img":"https://storage.googleapis.com/willcarh-art/img/logos/despicable.png","repo":"https://github.com/wcarhart/despicable","latestVersion":"","published":"2018","status":"archived","install":"","documentation":"","related":[],"visibility":"less","tags":["cli"],"technologies:":"","link:":"","demo":"false","latest_version:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"cheqit","blurb":"URL status checker","about":["Cheqit is a simple CLI tool for monitoring the status of websites. It was inspired by Downdetector."],"languages":["Python"],"technologies":[],"img":"https://storage.googleapis.com/willcarh-art/img/logos/cheqit.png","repo":"https://github.com/wcarhart/cheqit","latestVersion":"","published":"2019","status":"stale","install":"","documentation":"","related":[],"visibility":"normal","tags":["cli"],"technologies:":"","link:":"","demo":"false","latest_version:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"locksmith","blurb":"Repository secret manager","about":["Locksmith, a Python library, is your liaison between repository secrets and the great beyond. By utilizing GPG, locksmith allows you to store secrets in your repository and interact with them locally without having to publish them with your source code."],"languages":["Python"],"technologies":[],"img":"https://storage.googleapis.com/willcarh-art/img/logos/locksmith.png","repo":"https://github.com/wcarhart/locksmith","latestVersion":"","published":"2019","status":"stale","install":"","documentation":"","related":[],"visibility":"normal","tags":["library"],"technologies:":"","link:":"","demo":"false","latest_version:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"othello","blurb":"Terminal board game","about":["Othello is a command line implementation of the popular board game by the same name (also known as Reversi). It has functionality for local multiplayer as well as single player against AIs of varying difficulty."],"languages":["Python"],"technologies":[],"img":"https://storage.googleapis.com/willcarh-art/img/logos/othello.png","repo":"https://github.com/wcarhart/othello","latestVersion":"","published":"2018","status":"stale","install":"","documentation":"","related":[],"visibility":"normal","tags":["cli"],"technologies:":"","link:":"","demo":"false","latest_version:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"Cheers","blurb":"iOS Happy Hour Finder app","about":["Cheers is an iOS application for finding local happy hours. Based around the Yelp Fusion API, Cheers uses your location to find local deals and happy hours from nearby locations. It can schedule trips via rideshare applications and create plans for spending a fun night out in a new, unknown city."],"languages":["Swift","Objective-C"],"technologies":["iOS","Yelp Fusion API","Lyft API","Uber API","Firebase","CocoaPods"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/cheers.png","repo":"https://github.com/wcarhart/cheers","latestVersion":"","published":"2018","status":"archived","install":"","documentation":"","related":[],"visibility":"less","tags":["mobile"],"link:":"","demo":"false","latest_version:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"FitPals","blurb":"Social networking iOS app for fitness","about":["FitPals is a prototype iOS application for a social network based our fitness and working out. The initial prototype had standard features of social media apps, such as users, connections, and posts, but also had functionality for creating and sharing workout plans, as well as following fitness influencers."],"languages":["Swift","Objective-C"],"technologies":["iOS","Firebase","CocoaPods"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/fitpals.png","repo":"https://github.com/wcarhart/fitpals","latestVersion":"","published":"2018","status":"archived","install":"","documentation":"","related":[],"visibility":"less","tags":["mobile"],"link:":"","demo":"false","latest_version:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"Chordpanion","blurb":"iOS app to build chord progressions and help write music","about":["Chordpanion is an iOS application for building chord progressions. Given a starting key, Chordpanion automatically builds a number of progressions based on commonly used progressions and music theory. It also has functionality for transcribing progressions into different keys, as well as finding progressions to facilitate key changes."],"languages":["Swift","Objective-C"],"technologies":["iOS","CocoaPods"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/chordpanion.png","repo":"https://github.com/wcarhart/chordpanion","latestVersion":"","published":"2018","status":"archived","install":"","documentation":"","related":[],"visibility":"less","tags":["mobile"],"link:":"","demo":"false","latest_version:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"NASA APOD","blurb":"Simple iOS app to display the NASA Astronomy Picture of the Day","about":["APOD is a simple iOS application to display the NASA Astronomy Picture of the Day. Given a date, APOD returns NASA\'s astronomy picture for that day, as well as some metadata and relevant links to the media."],"languages":["Swift","Objective-C"],"technologies":["iOS","NASA APOD API"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/nasa_apod.png","repo":"https://github.com/wcarhart/nasa_apod","latestVersion":"","published":"2018","status":"archived","install":"","documentation":"","related":[],"visibility":"less","tags":["mobile"],"link:":"","demo":"false","latest_version:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"TI Checkers","blurb":"Checkers for the TI-84 calculator","about":["TI Checkers is a simple implementation of the game checkers for the TI-83/84 family of calculators. I originally learned programming on a TI calculator and this was one of my first programs."],"languages":["Z80 Assembly","TI-BASIC"],"technologies":[],"img":"https://storage.googleapis.com/willcarh-art/img/logos/ti_checkers.png","repo":"https://github.com/wcarhart/ti84-checkers","latestVersion":"","published":"2012","status":"archived","install":"","documentation":"","related":[],"visibility":"less","tags":["calculator"],"technologies:":"","link:":"","demo":"false","latest_version:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"TI TicTacToe","blurb":"TicTacToe for the TI-84 calculator","about":["TI TicTacToe is a simple implementation of the game tic-tac-toe for the TI-83/84 family of calculators. I originally learned programming on a TI calculator and this was one of my first programs."],"languages":["Z80 Assembly","TI-BASIC"],"technologies":[],"img":"https://storage.googleapis.com/willcarh-art/img/logos/ti_tictactoe.png","repo":"https://github.com/wcarhart/ti84-tictactoe","latestVersion":"","published":"2012","status":"archived","install":"","documentation":"","related":[],"visibility":"less","tags":["calculator"],"technologies:":"","link:":"","demo":"false","latest_version:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"kartracer","blurb":"Simple OpenGL racing game","about":["Kartracer was a my final project for my university graphics class. It is incredibly basic, utilizing no prebuilt models and only OpenGL primitives, but still has a small array of features. It has 3 different car models, a full race track, and a number of various camera views."],"languages":["C"],"technologies":["OpenGL"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/kartracer.png","repo":"https://github.com/wcarhart/kartracer","latestVersion":"","published":"2016","status":"archived","install":"","documentation":"","related":[],"visibility":"normal","tags":["desktop"],"link:":"","demo":"false","latest_version:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"algos","blurb":"Common algorithms and data structures for safe keeping","about":["Algos is my repository of common data structures and algorithms for safe keeping, so I don\'t have to reimplement them over time. It has implementations for common sorting algorithms, data structures, and design patterns."],"languages":["Python"],"technologies":[],"img":"https://storage.googleapis.com/willcarh-art/img/logos/algos.png","repo":"https://github.com/wcarhart/algos","latestVersion":"","published":"2019","status":"stale","install":"","documentation":"","related":[],"visibility":"normal","tags":["library"],"technologies:":"","link:":"","demo":"false","latest_version:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"Rise and Shine","blurb":"Automatic daylight-based coffee maker","about":["Rise and Shine was my final project for one my university embedded classes. At a high level, it was an alarm clock with a daylight sensor. When the sensor determined that it is daytime, it would automatically turn on the coffee maker to brew a new cup of coffee."],"languages":["C"],"technologies":["Microchip PIC18F4321"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/rise-and-shine.png","repo":"https://github.com/wcarhart/rise-and-shine","latestVersion":"","published":"2017","status":"archived","install":"","documentation":"","related":[],"visibility":"none","tags":["embedded"],"link:":"","demo":"false","latest_version:":"","intall:":"","documentation:":"","related:":""}')))