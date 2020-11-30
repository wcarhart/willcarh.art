name: lurker
blurb: Hacker News terminal client
about: Lurker is a simple terminal client for reading Y Combinator's Hacker News. It uses the public Hacker News API and is written entirely in Bash so it runs smoothly in the majority of terminal environments.
about: Lurker embraces the hacker in Hacker News by exposing a simple CLI for reading stories, comments, and user information. This makes it easy to read Hacker News while completing other command line activities, especially when combined with tools like tmux.
about: In addition to browsing Hacker News, lurker can summarize most text articles and snippets via another one of my tools, smoosh.
languages: Bash
technologies: Hacker News API
img: {{cdn:img/logos/lurker.png}}
repo: https://github.com/wcarhart/lurker
link:
demo: false
latest_version: 1.7.0
published: 1566108000
status: stable
install: brew install wcarhart/tools/lurker
documentation: https://willcarhart.dev/docs/lurker
related: koi
related: smoosh
visibility: super
blogPost:
tags: cli

name: doku
blurb: Automated Sudoku solver
about: Doku is an automated Sudoku board solver. It uses dynamic programming to build a tree of possible subsequent Sudoku boards and performs a depth-first search for a viable solution.
languages: Deno
languages: JavaScript
technologies:
img: {{cdn:img/logos/doku.png}}
repo: https://github.com/wcarhart/doku
link:
demo: true
latest_version: 1.0.3
published: 1603087200
status: stable
install: brew install wcarhart/tools/doku
documentation:
related:
visibility: featured
blogPost:
tags: cli

name: smoosh
blurb: A simple algorithm for summarizing text
about: Inspired by SMMRY, smoosh is a simple tool for summarizing text snippets. It can effectively reduce new articles, blog posts, or any body of text into just a few sentences. Armed with some simple web scraping, smoosh is a powerful tool for riffling through text on the web.  
languages: Python
technologies: BeautifulSoup
img: {{cdn:img/logos/smoosh.png}}
repo: https://github.com/wcarhart/smoosh
link:
demo: true
latest_version: 2.2.0
published: 1528610400
status: stable
install: brew install wcarhart/tools/smoosh
documentation:
related:
visibility: super
blogPost:
tags: cli

name: koi
blurb: Bashful argument parsing
about: Koi is an argument parsing library for Bash. Initially inspired by Python's argparse, koi is a powerful and fully-featured Bash library for creating comprehensive CLI shell applications. It is used by a number of various applications, both open source and enterprise.
languages: Bash
technologies:
img: {{cdn:img/logos/koi.png}}
repo: https://github.com/wcarhart/koi
link:
demo: false
latest_version: 1.2.1
published: 1581490800
status: stable
install: brew install wcarhart/tools/koi
documentation: https://willcarhart.dev/docs/koi
related: lurker
related: birdhouse
related: konphig
related: chiller
related: thoth
related: docs
visibility: super
blogPost:
tags: library

name: snug
blurb: Automated cloud repository backup
about:
languages: Bash
languages: Node.js
languages: JavaScript
technologies: GitHub API
technologies: GCP Cloud Source Repositories
technologies: GCP Cloud Functions
technologies: GCP Cloud Scheduler
technologies: GCP Secrets Manager
img: {{cdn:img/logos/snug.png}}
repo: https://github.com/wcarhart/snug
link:
demo: false
latest_version:
published:
status: in development
documentation:
related:
visibility: none
blogPost:
tags: cli
tags: cloud

name: willcarh.art
blurb: Personal portfolio website
about: Willcarh.art is my personal website and software portfolio. It has evolved over time from a Django application to a static site built by a custom Node.js generator. Willcarh.art is home to all of my projects, blog posts, and software-related ideas.
languages: Node.js
languages: JavaScript
languages: HTML
languages: CSS
languages: Bash
technologies: Yarn
technologies: Netlify
technologies: GCP Cloud CDN
technologies: jQuery
technologies: Bootstrap
img: {{ico:home-about.png}}
repo: https://github.com/wcarhart/willcarh.art
link: https://willcarh.art
demo: false
latest_version: 2.0.0
published: 1555394400
status: stale
install:
documentation:
related:
visibility: featured
blogPost: {{src:blog/automating-emails-in-python.html}}
tags: cli
tags: web

name: docs
blurb: Multiplexed tool documentation
about: Docs is the source repository for my documentation website, deployed to willcarhart.dev. It contains documentation for many of the software tools I've written, such as koi, birdhouse, and many others. It is a staticly generated site built via Docsify.
languages: JavaScript
languages: HTML
languages: CSS
languages: Bash
technologies: Netlify
technologies: Docsify
technologies: jQuery
img: {{cdn:img/logos/docs.png}}
repo: https://github.com/wcarhart/docs
link: https://willcarhart.dev
demo: false
latest_version:
published: 1587189600
status: stable
install:
documentation:
related: lurker
related: koi
related: birdhouse
related: konphig
related: chiller
visibility: featured
blogPost:
tags: web

name: konphig
blurb: Dotfiles, custom Bash configs, and more
about: Konphig is my take on the classic dotfiles repository. Initially just a collection of configuration files, konphig has evolved into a fully-featured command line interface for managing system configurations, including custom Bash functions, Git configurations, and much, much more.
languages: Bash
languages: Vim Script
technologies:
img: {{cdn:img/logos/konphig.png}}
repo: https://github.com/wcarhart/konphig
link:
demo: false
latest_version: 1.0.4
published: 1535608800
status: stable
install: brew install wcarhart/tools/kn
documentation: https://willcarhart.dev/docs/konphig
related: koi
visibility: featured
blogPost:
tags: cli
tags: configuration

name: hustle
blurb: Rapid & lightweight workflow management
about:
languages: Node.js
languages: JavaScript
technologies:
img: {{cdn:img/logos/hustle.png}}
repo: https://github.com/wcarhart/hustle
link:
demo: false
latest_version:
published:
status: in development
install:
documentation:
related:
visibility: none
blogPost:
tags: api
tags: cli
tags: cloud

name: soliloquy
blurb: Project showcase website
about: The word soliloquy means an act of speaking one's thoughts aloud when by oneself or regardless of any hearers. Soliloquy aims to live up to that definition; it is a portfolio website for showcasing software projects. Developers can add their own software projects to demo what they have been working on recently.
languages: Python
languages: HTML
languages: CSS
languages: JavaScript
languages: Bash
technologies: Django
technologies: jQuery
technologies: Bootstrap
technologies: Heroku
technologies: Travis CI
img: {{cdn:img/logos/soliloquy.png}}
repo: https://github.com/wcarhart/soliloquy
link: https://soliloquy.dev
demo: false
latest_version:
published: 1566108000
status: stale
install:
documentation:
related:
visibility: normal
blogPost: {{src:blog/building-chatbots-for-github.html}}
tags: web

name: odin
blurb: Personal financial portfolio manager
about:
languages: Node.js
languages: JavaScript
languages: HTML
languages: CSS
languages: Bash
languages: SQL
technologies: Electron
technologies: SQLite
img: {{cdn:img/logos/odin.png}}
repo: https://github.com/wcarhart/odin
link:
demo: false
latest_version:
published:
status: in development
install:
documentation:
related:
visibility: none
blogPost:
tags: desktop
tags: cli

name: birdhouse
blurb: Streaming tweets to the command line
about: Birdhouse is a CLI for interacting with tweets. It can stream tweets bash on author and hashtag and exposes and easy-to-use interface for interacting with Twitter from the command line.
languages: Bash
technologies: Twitter API
img: {{cdn:img/logos/birdhouse.png}}
repo: https://github.com/wcarhart/birdhouse
link:
demo: true
latest_version: 12
published: 1584165600
status: stable
install: brew install wcarhart/tools/birdhouse
documentation: https://willcarhart.dev/docs/birdhouse
related: koi
visibility: featured
blogPost:
tags: cli

name: thoth
blurb: Helpful English diction tools for the command line
about: Thoth is a set of command line tools for defining and understanding works in the English language. It contains functionality for defining words, finding synonyms, and using words in sentences.
languages: Bash
technologies:
img: {{cdn:img/logos/thoth.png}}
repo: https://github.com/wcarhart/thoth
link:
demo: false
latest_version: 1
published: 1581577200
status: stable
install: brew install wcarhart/tools/thoth
documentation:
related: koi
visibility: normal
blogPost:
tags: cli

name: chiller
blurb: Helpful GitHub repository and Homebrew tools 🍺
about: Chiller is a command line tool for managing GitHub releases and Homebrew formulae. It makes it easy to bump Homebrew formulae when a newer version of a repository is published.
languages: Bash
technologies: GitHub API
technologies: Homebrew
img: {{cdn:img/logos/chiller.png}}
repo: https://github.com/wcarhart/chiller
link:
demo: false
latest_version: 1.1.5
published: 1583906400
status: stable
install: brew install wcarhart/tools/chiller
documentation: https://willcarhart.dev/docs/chiller
related: koi
visibility: normal
blogPost:
tags: cli
tags: configuration

name: wanda
blurb: Timeline site for Will and Alexx
about: Wanda is the timeline site for Will and Alexx. It is a fun way to take a trip down memory lane and showcase Will and Alexx's relationship.
languages: Python
languages: HTML
languages: CSS
languages: JavaScript
technologies: Netlify
img: {{cdn:img/logos/wanda.png}}
repo: https://github.com/wcarhart/wanda
link: https://alexxandwill.us
demo: false
latest_version: 1.2.0
published: 1576566000
status: stable
install:
documentation:
related:
visibility: featured
blogPost:
tags: web

name: aerogram
blurb: Serverless chat via ssh and scp
about: Aerogram is a CLI chat application based on ssh. It allows you to chat with other users on remote machines without setting up an intermediate server or any other infrastructure.
languages: Bash
technologies: ssh
technologies: scp
img: {{cdn:img/logos/aerogram.png}}
repo: https://github.com/wcarhart/aerogram
link:
demo: false
latest_version:
published: 1561960800
status: stale
install:
documentation:
related: koi
visibility: normal
blogPost:
tags: cli

name: beaver
blurb: Logs querier
about: Beaver is a simple tool for parsing logs. It can query logs in a file tree based on content and timestamps.
languages: Python
technologies:
img: {{cdn:img/logos/beaver.png}}
repo: https://github.com/wcarhart/beaver
link:
demo: false
latest_version:
published: 1554530400
status: stale
install:
documentation:
related:
visibility: normal
blogPost:
tags: cli

name: despicable
blurb: Lightweight multithreading framework for shell tasks
about: Despicable is a lightweight multithreading framework. Originally written for managing complex compression algorithms, it has been generalized to run shell commands.
languages: Python
technologies:
img: {{cdn:img/logos/despicable.png}}
repo: https://github.com/wcarhart/despicable
link:
demo: false
latest_version:
published: 1535868000
status: archived
install:
documentation:
related:
visibility: less
blogPost:
tags: cli

name: cheqit
blurb: Website status checker
about: Cheqit is a simple CLI tool for monitoring the status of websites. It was inspired by Downdetector.
languages: Python
technologies:
img: {{cdn:img/logos/cheqit.png}}
repo: https://github.com/wcarhart/cheqit
link:
demo: false
latest_version:
published: 1553925600
status: stale
install:
documentation:
related:
visibility: normal
blogPost:
tags: cli

name: locksmith
blurb: Repository secret manager
about: Locksmith, a Python library, is your liaison between repository secrets and the great beyond. By utilizing GPG, locksmith allows you to store secrets in your repository and interact with them locally without having to publish them with your source code.
languages: Python
technologies:
img: {{cdn:img/logos/locksmith.png}}
repo: https://github.com/wcarhart/locksmith
link:
demo: false
latest_version:
published: 1550991600
status: stale
install:
documentation:
related:
visibility: normal
blogPost:
tags: library

name: othello
blurb: Terminal board game
about: Othello is a command line implementation of the popular board game by the same name (also known as Reversi). It has functionality for local multiplayer as well as single player against AIs of varying difficulty.
languages: Python
technologies:
img: {{cdn:img/logos/othello.png}}
repo: https://github.com/wcarhart/othello
link:
demo: false
latest_version:
published: 1545634800
status: stale
install:
documentation:
related:
visibility: normal
blogPost:
tags: cli

name: Cheers
blurb: iOS Happy Hour Finder app
about: Cheers is an iOS application for finding local happy hours. Based around the Yelp Fusion API, Cheers uses your location to find local deals and happy hours from nearby locations. It can schedule trips via rideshare applications and create plans for spending a fun night out in a new, unknown city.
languages: Swift
languages: Objective-C
technologies: iOS
technologies: Yelp Fusion API
technologies: Lyft API
technologies: Uber API
technologies: Firebase
technologies: CocoaPods
technologies: Balsamiq
img: {{cdn:img/logos/cheers.png}}
repo: https://github.com/wcarhart/cheers
link:
demo: false
latest_version:
published: 1526450400
status: archived
install:
documentation:
related:
visibility: less
blogPost:
tags: mobile

name: FitPals
blurb: Social networking iOS app for fitness
about: FitPals is a prototype iOS application for a social network based our fitness and working out. The initial prototype had standard features of social media apps, such as users, connections, and posts, but also had functionality for creating and sharing workout plans, as well as following fitness influencers.
languages: Swift
languages: Objective-C
technologies: iOS
technologies: Firebase
technologies: CocoaPods
img: {{cdn:img/logos/fitpals.png}}
repo: https://github.com/wcarhart/fitpals
link:
demo: false
latest_version:
published: 1523599200
status: archived
install:
documentation:
related:
visibility: none
blogPost:
tags: mobile

name: Chordpanion
blurb: iOS app to build chord progressions and help write music
about: Chordpanion is an iOS application for building chord progressions. Given a starting key, Chordpanion automatically builds a number of progressions based on commonly used progressions and music theory. It also has functionality for transcribing progressions into different keys, as well as finding progressions to facilitate key changes.
languages: Swift
languages: Objective-C
technologies: iOS
technologies: CocoaPods
img: {{cdn:img/logos/chordpanion.png}}
repo: https://github.com/wcarhart/chordpanion
link:
demo: false
latest_version:
published: 1524290400
status: archived
install:
documentation:
related:
visibility: less
blogPost:
tags: mobile

name: NASA APOD
blurb: Simple iOS app to display the NASA Astronomy Picture of the Day
about: APOD is a simple iOS application to display the NASA Astronomy Picture of the Day. Given a date, APOD returns NASA's astronomy picture for that day, as well as some metadata and relevant links to the media.
languages: Swift
languages: Objective-C
technologies: iOS
technologies: NASA APOD API
img: {{cdn:img/logos/nasa_apod.png}}
repo: https://github.com/wcarhart/nasa_apod
link:
demo: false
latest_version:
published: 1525327200
status: archived
install:
documentation:
related:
visibility: less
blogPost:
tags: mobile

name: TI Checkers
blurb: Checkers for the TI-84 calculator
about: TI Checkers is a simple implementation of the game checkers for the TI-83/84 family of calculators. I originally learned programming on a TI calculator and this was one of my first programs.
languages: Z80 Assembly
languages: TI-BASIC
technologies:
img: {{cdn:img/logos/ti_checkers.png}}
repo: https://github.com/wcarhart/ti84-checkers
link:
demo: false
latest_version:
published: 1337925600
status: archived
install:
documentation:
related:
visibility: less
blogPost:
tags: calculator

name: TI TicTacToe
blurb: TicTacToe for the TI-84 calculator
about: TI TicTacToe is a simple implementation of the game tic-tac-toe for the TI-83/84 family of calculators. I originally learned programming on a TI calculator and this was one of my first programs.
languages: Z80 Assembly
languages: TI-BASIC
technologies:
img: {{cdn:img/logos/ti_tictactoe.png}}
repo: https://github.com/wcarhart/ti84-tictactoe
link:
demo: false
latest_version:
published: 1337925600
status: archived
install:
documentation:
related:
visibility: less
blogPost:
tags: calculator

name: kartracer
blurb: Simple OpenGL racing game
about: Kartracer was a my final project for my university graphics class. It is incredibly basic, utilizing no prebuilt models and only OpenGL primitives, but still has a small array of features. It has 3 different car models, a full race track, and a number of various camera views.
languages: C
technologies: OpenGL
img: {{cdn:img/logos/kartracer.png}}
repo: https://github.com/wcarhart/kartracer
link:
demo: false
latest_version:
published: 1463983200
status: archived
install:
documentation:
related:
visibility: normal
blogPost:
tags: desktop

name: algos
blurb: Common algorithms and data structures for safe keeping
about: Algos is my repository of common data structures and algorithms for safe keeping, so I don't have to reimplement them over time. It has implementations for common sorting algorithms, data structures, and design patterns.
languages: Python
technologies:
img: {{cdn:img/logos/algos.png}}
repo: https://github.com/wcarhart/algos
link:
demo: false
latest_version:
published: 1569132000
status: stale
install:
documentation:
related:
visibility: normal
blogPost:
tags: library

name: Rise and Shine
blurb: Automatic daylight-based coffee maker
about: Rise and Shine was my final project for one my university embedded classes. At a high level, it was an alarm clock with a daylight sensor. When the sensor determined that it is daytime, it would automatically turn on the coffee maker to brew a new cup of coffee.
languages: C
technologies: Microchip PIC18F4321
img: {{cdn:img/logos/rise_and_shine.png}}
repo: https://github.com/wcarhart/rise-and-shine
link:
demo: false
latest_version:
published: 1495346400
status: archived
intall:
documentation:
related:
visibility: none
blogPost:
tags: embedded
