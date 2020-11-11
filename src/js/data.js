// This is an autogenerated file - DO NOT EDIT DIRECTLY
// This file was generated on Tue Nov 10 2020 19:16:53 GMT-0800 (Pacific Standard Time) via the forge in willcarh.art v2.0.0
// Learn more: https://github.com/wcarhart/willcarh.art

class Blog{constructor({title:t="",subtitle:e="",blurb:r="",cover:l="",coverCredit:o="",published:s="",updated:u="",author:a="",latest:c=!1,featured:d=!1,tags:b=[],content:i=[]}){}}
class Project{constructor({name:t="",blurb:s="",about:i=[],languages:e=[],technologies:n=[],img:o="",repo:a="",latestVersion:l="",status:r="",install:h="",documentation:u="",related:c=[],visibility:b="",tags:g=[]}){this.name=t,this.blurb=s,this.about=i,this.languages=e,this.technologies=n,this.img=o,this.repo=a,this.latestVersion=l,["stable","in development","stale","archived"].includes(r)||console.error(`Unknown status '${r}'`),this.status=r,this.install=h,this.documentation=u,this.related=c,["super","featured","normal","less","none"].includes(b)||console.error(`Unknown visibility '${b}'`),this.visibility=b,this.tags=g}}

let ALL_PROJECTS = []
let ALL_BLOG_POSTS = []
let ALL_APPS = []

ALL_PROJECTS.push(new Project(JSON.parse('{"name":"lurker","blurb":"Hacker News terminal client","about":["Lurker is a simple terminal client for reading Y Combinator\'s Hacker News. It uses the public Hacker News API and is written entirely in Bash so it runs smoothly in the majority of terminal environments.","Lurker embraces the hacker in Hacker News by exposing a simple CLI for reading stories, comments, and user information. This makes it easy to read Hacker News while completing other command line activities, especially when combined with tools like tmux."],"languages":["Bash"],"technologies":["Hacker News API"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/lurker.png","repo":"https://github.com/wcarhart/lurker","latestVersion":"","status":"stable","install":"brew install wcarhart/tools/lurker","documentation":"https://willcarhart.dev/docs/lurker","related":["koi","smoosh"],"visibility":"super","tags":["cli"],"latest_version":"1.7.0"}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"doku","blurb":"Automated Sudoku solver","about":[],"languages":["Deno, JavaScript"],"technologies":[],"img":"https://storage.googleapis.com/willcarh-art/img/logos/doku.png","repo":"https://github.com/wcarhart/doku","latestVersion":"","status":"stable","install":"brew install wcarhart/tools/doku","documentation":"","related":[],"visibility":"featured","tags":["cli"],"about:":"","technologies:":"","latest_version":"1.0.3","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"smoosh","blurb":"A simple algorithm for summarizing text","about":[],"languages":["Python"],"technologies":["BeautifulSoup"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/smoosh.png","repo":"https://github.com/wcarhart/smoosh","latestVersion":"","status":"stable","install":"brew install wcarhart/tools/smoosh","documentation":"","related":[],"visibility":"featured","tags":["cli"],"about:":"","latest_version":"2.2.0","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"koi","blurb":"Bashful argument parsing","about":[],"languages":["Bash"],"technologies":[],"img":"https://storage.googleapis.com/willcarh-art/img/logos/koi.png","repo":"https://github.com/wcarhart/koi","latestVersion":"","status":"stable","install":"brew install wcarhart/tools/koi","documentation":"https://willcarhart.dev/docs/koi","related":[],"visibility":"super","tags":["library"],"about:":"","technologies:":"","latest_version":"1.2.1","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"snug","blurb":"Automated cloud repository backup","about":[],"languages":["Bash, Node.js, JavaScript"],"technologies":["GitHub API, GCP Cloud Source Repositories, GCP Cloud Functions, GCP Cloud Scheduler, GCP Secrets Manager"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/snug.png","repo":"https://github.com/wcarhart/snug","latestVersion":"","status":"in development","install":"","documentation":"","related":[],"visibility":"none","tags":["cli, cloud"],"about:":"","latest_version:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"willcarh.art","blurb":"Personal portfolio website","about":[],"languages":["Node.js, Express.js, JavaScript, HTML, CSS, Bash"],"technologies":["Yarn, Netlify, GCP Cloud CDN, jQuery, Bootstrap"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/willcarh.art.png","repo":"https://github.com/wcarhart/willcarh.art","latestVersion":"","status":"in development","install":"","documentation":"","related":[],"visibility":"featured","tags":["cli, web"],"about:":"","latest_version":"2.0.0","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"docs","blurb":"Multiplexed tool documentation","about":[],"languages":["JavaScript, HTML, CSS, Bash"],"technologies":["Netlify, Docsify"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/docs.png","repo":"https://github.com/wcarhart/docs","latestVersion":"","status":"stable","install":"","documentation":"","related":[],"visibility":"normal","tags":["web"],"about:":"","latest_version:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"konphig","blurb":"Dotfiles, custom Bash configs, and more","about":[],"languages":["Bash, Vim Script"],"technologies":[],"img":"https://storage.googleapis.com/willcarh-art/img/logos/konphig.png","repo":"https://github.com/wcarhart/konphig","latestVersion":"","status":"stable","install":"brew install wcarhart/tools/kn","documentation":"https://willcarhart.dev/docs/konphig","related":["koi"],"visibility":"normal","tags":["cli, configuration"],"about:":"","technologies:":"","latest_version":"1.0.4"}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"hustle","blurb":"Rapid & lightweight workflow management","about":[],"languages":["Node.js, JavaScript"],"technologies":[],"img":"https://storage.googleapis.com/willcarh-art/img/logos/hustle.png","repo":"https://github.com/wcarhart/hustle","latestVersion":"","status":"in development","install":"","documentation":"","related":[],"visibility":"none","tags":["api, cli, cloud"],"about:":"","technologies:":"","latest_version:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"soliloquy","blurb":"(n) an act of speaking one\'s thoughts aloud when by oneself or regardless of any hearers","about":[],"languages":["Python, HTML, CSS, JavaScript, Bash"],"technologies":["Django, jQuery, Bootstrap, Heroku"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/soliloquy.png","repo":"https://github.com/wcarhart/soliloquy","latestVersion":"","status":"stale","install":"","documentation":"","related":[],"visibility":"normal","tags":["web"],"about:":"","latest_version:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"odin","blurb":"Desktop portfolio manager","about":[],"languages":["Node.js, JavaScript, HTML, CSS, Bash, SQL"],"technologies":["Electron, SQLite"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/odin.png","repo":"https://github.com/wcarhart/odin","latestVersion":"","status":"in development","install":"","documentation":"","related":[],"visibility":"none","tags":["desktop, cli"],"about:":"","latest_version:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"birdhouse","blurb":"🐦 Passive tweet watcher from the command line","about":[],"languages":["Bash"],"technologies":["Twitter API"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/birdhouse.png","repo":"https://github.com/wcarhart/birdhouse","latestVersion":"","status":"stable","install":"brew install wcarhart/tools/birdhouse","documentation":"https://willcarhart.dev/docs/birdhouse","related":["koi"],"visibility":"normal","tags":["cli"],"about:":"","latest_version":"12"}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"thoth","blurb":"Helpful English diction tools for the command line","about":[],"languages":["Bash"],"technologies":[],"img":"https://storage.googleapis.com/willcarh-art/img/logos/thoth.png","repo":"https://github.com/wcarhart/thoth","latestVersion":"","status":"stable","install":"brew install wcarhart/tools/thoth","documentation":"","related":["koi"],"visibility":"normal","tags":["cli"],"about:":"","technologies:":"","latest_version":"1","documentation:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"chiller","blurb":"🍺 Helpful GitHub repository and Homebrew tools","about":[],"languages":["Bash"],"technologies":["GitHub API"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/chiller.png","repo":"https://github.com/wcarhart/chiller","latestVersion":"","status":"stable","install":"brew install wcarhart/tools/chiller","documentation":"https://willcarhart.dev/docs/chiller","related":["koi"],"visibility":"normal","tags":["cli, configuration"],"about:":"","latest_version":"1.1.5"}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"wanda","blurb":"Timeline site for Will and Alexx","about":[],"languages":["Python, HTML, CSS, JavaScript"],"technologies":["Netlify"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/wanda.png","repo":"https://github.com/wcarhart/wanda","latestVersion":"","status":"stable","install":"","documentation":"","related":[],"visibility":"normal","tags":["web"],"about:":"","latest_version":"1.2.0","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"aerogram","blurb":"Serverless chat via ssh/scp","about":[],"languages":["Bash"],"technologies":["ssh, scp"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/aerogram.png","repo":"https://github.com/wcarhart/aerogram","latestVersion":"","status":"stale","install":"","documentation":"","related":["koi"],"visibility":"normal","tags":["cli"],"about:":"","latest_version:":"","install:":"","documentation:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"beaver","blurb":"An animal that eats logs","about":[],"languages":["Python"],"technologies":[],"img":"https://storage.googleapis.com/willcarh-art/img/logos/beaver.png","repo":"https://github.com/wcarhart/beaver","latestVersion":"","status":"stale","install":"","documentation":"","related":[],"visibility":"normal","tags":["cli"],"about:":"","technologies:":"","latest_version:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"despicable","blurb":"Lightweight multithreading framework for shell tasks","about":[],"languages":["Python"],"technologies":[],"img":"https://storage.googleapis.com/willcarh-art/img/logos/despicable.png","repo":"https://github.com/wcarhart/despicable","latestVersion":"","status":"archived","install":"","documentation":"","related":[],"visibility":"less","tags":["cli"],"about:":"","technologies:":"","latest_version:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"cheqit","blurb":"Check the status of a URL or IP address","about":[],"languages":["Python"],"technologies":[],"img":"https://storage.googleapis.com/willcarh-art/img/logos/cheqit.png","repo":"https://github.com/wcarhart/cheqit","latestVersion":"","status":"stale","install":"","documentation":"","related":[],"visibility":"normal","tags":["cli"],"about:":"","technologies:":"","latest_version:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"locksmith","blurb":"Your liaison between repository secrets and the great beyond","about":[],"languages":["Python"],"technologies":[],"img":"https://storage.googleapis.com/willcarh-art/img/logos/locksmith.png","repo":"https://github.com/wcarhart/locksmith","latestVersion":"","status":"stale","install":"","documentation":"","related":[],"visibility":"normal","tags":["library"],"about:":"","technologies:":"","latest_version:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"othello","blurb":"Command line implementation of the board game Othello (also known as Reversi)","about":[],"languages":["Python"],"technologies":[],"img":"https://storage.googleapis.com/willcarh-art/img/logos/othello.png","repo":"https://github.com/wcarhart/othello","latestVersion":"","status":"stale","install":"","documentation":"","related":[],"visibility":"normal","tags":["cli"],"about:":"","technologies:":"","latest_version:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"Cheers","blurb":"iOS Happy Hour Finder app","about":[],"languages":["Swift, Objective-C"],"technologies":["iOS, Yelp Fusion API, Lyft API, Uber API, Firebase"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/cheer.png","repo":"https://github.com/wcarhart/cheers","latestVersion":"","status":"archived","install":"","documentation":"","related":[],"visibility":"less","tags":["mobile"],"about:":"","latest_version:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"FitPals","blurb":"Social networking iOS app for fitness","about":[],"languages":["Swift, Objective-C"],"technologies":["iOS, Firebase"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/fitpals.png","repo":"https://github.com/wcarhart/fitpals","latestVersion":"","status":"archived","install":"","documentation":"","related":[],"visibility":"less","tags":["mobile"],"about:":"","latest_version:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"Chordpanion","blurb":"","about":["iOS app to build chord progressions and help write music"],"languages":["Swift, Objective-C"],"technologies":["iOS"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/chordpanion.png","repo":"https://github.com/wcarhart/chordpanion","latestVersion":"","status":"archived","install":"","documentation":"","related":[],"visibility":"less","tags":["mobile"],"blurb:":"","latest_version:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"NASA APOD","blurb":"","about":["Simple iOS app to display the NASA Astronomy Picture of the Day"],"languages":["Swift, Objective-C"],"technologies":["iOS"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/nasa_apod.png","repo":"https://github.com/wcarhart/nasa_apod","latestVersion":"","status":"archived","install":"","documentation":"","related":[],"visibility":"less","tags":["mobile"],"blurb:":"","latest_version:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"TI Checkers","blurb":"","about":["Implementation of Checkers for the TI-84 calculator"],"languages":["Z80 Assembly, TI-BASIC"],"technologies":[],"img":"https://storage.googleapis.com/willcarh-art/img/logos/ti_checkers.png","repo":"https://github.com/wcarhart/ti84-checkers","latestVersion":"","status":"archived","install":"","documentation":"","related":[],"visibility":"less","tags":["calculator"],"blurb:":"","technologies:":"","latest_version:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"TI TicTacToe","blurb":"","about":["Implementation of TicTacToe for the TI-84 calculator"],"languages":["Z80 Assembly, TI-BASIC"],"technologies":[],"img":"https://storage.googleapis.com/willcarh-art/img/logos/ti_tictactoe.png","repo":"https://github.com/wcarhart/ti84-tictactoe","latestVersion":"","status":"archived","install":"","documentation":"","related":[],"visibility":"less","tags":["calculator"],"blurb:":"","technologies:":"","latest_version:":"","install:":"","documentation:":"","related:":""}')))
ALL_PROJECTS.push(new Project(JSON.parse('{"name":"kartracer","blurb":"","about":["Simple OpenGL car game"],"languages":["C"],"technologies":["OpenGL"],"img":"https://storage.googleapis.com/willcarh-art/img/logos/kartracer.png","repo":"https://github.com/wcarhart/kartracer","latestVersion":"","status":"archived","install":"","documentation":"","related":[],"visibility":"normal","tags":["desktop"],"blurb:":"","latest_version:":"","install:":"","documentation:":"","related:":""}')))