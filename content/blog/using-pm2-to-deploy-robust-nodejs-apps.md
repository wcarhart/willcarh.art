### Wow, look at this new title!
You've done the work. [MongoDB](https://www.mongodb.com/) is up and running. [Redis](https://redis.io/) is hot and ready to go. Now you just need to deploy your fancy new web app, a [Node.js](https://nodejs.org/) application. How do you do it? There's a plethora of options these days. Perhaps you're already invested in [GCP](https://cloud.google.com/), so you pick [App Engine](https://cloud.google.com/appengine). Or, maybe you're not into one of the _Big 3_ cloud providers, so you pick [Heroku](https://www.heroku.com/). Heroku's great because you can get started relatively easily (code deploys are as easy as adding another Git remote) and it's relatively cheap (your "first" dyno is free). However, to actually run a decent site on Heroku, it costs [a minimum of $7/month for the hobby dynos](https://www.heroku.com/pricing#containers), as the free dynos sleep after 30 minutes. And back to GCP, AWS, and Azure, you've got to set up IAM, Billing, and a small army of other services to get started. What if you want to deploy your Node.js app on _bare-metal_ hardware, maybe even your laptop?

### Introducing PM2
[_Process Manager 2_](https://pm2.keymetrics.io/), or _PM2_ as it's referred to colloquially, is a powerful, production-ready process manager for Node.js (and other) applications. PM2 comes packed with a broad feature set and is ready to deploy your app quickly and easily. It's open source ([GNU AGPL 3](https://opensource.org/licenses/AGPL-3.0)) and its entire JavaScript codebase is publicly available on [GitHub](https://github.com/Unitech/pm2). Let's take a quick look at it what it takes to get PM2 up and running and how we can use it to deploy robust Node.js applications.

### Spinning up a server for your application
First things first, let's get our environment set up. I'm going to spin up a [droplet](https://www.digitalocean.com/products/droplets/) (a VM) from [DigitalOcean](https://www.digitalocean.com/), but these steps will work anywhere you have Linux. I'm also going to use [Ubuntu](https://ubuntu.com/) but the process is similar for [centOS](https://www.centos.org/) and other distros.
If you'd like to follow along with DigitalOcean (I'm assuming you have an account), [create a new droplet](https://cloud.digitalocean.com/droplets/new) and wait for it to spin up (usually less than a minute) before SSH'ing in. I'm using the cheapest droplet for $5/mo with Ubuntu.
Once your Ubuntu droplet is running, the first thing we'll do is create a new user to run our application. It's important that you use a user other than _root_ for your applications. If a nefarious individual was able to exploit a vulnerability of your application, the root user has total control over your machine. Let's create a user called `pm2` for our example.
```bash
# create a new user named pm2
sudo useradd -m pm2

# set a password for pm2
sudo passwd pm2

# set the default shell to bash
sudo usermod --shell /bin/bash pm2

# give pm2 sudo access
sudo usermod -aG sudo pm2

# if you need Docker access, make sure to give access to that too
sudo usermod -aG docker pm2

# switch users to pm2
sudo su pm2
cd

# prep the machine for installing
sudo apt-get update
```
Great, now we have a new user `pm2` and we're all set up to start our setup process. First, let's install, [NVM](https://github.com/nvm-sh/nvm), [Node.js](https://nodejs.org/en/), and [Yarn](https://yarnpkg.com/).
```bash
# get the latest NVM from GitHub: https://github.com/nvm-sh/nvm
# this version will change as new updates are released
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

# run the commands NVM suggests after install
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# verify installation
nvm --version

# install Node.js
nvm install 15.14.0 # or, pick your desired version

# install Yarn
npm install --global yarn
```
Since HTTP runs on port `80` and HTTPS on port `443`, we'll need to give Node.js access to those ports, as the first 1024 ports are restricted. We can do this with the `libcap2-bin` package.
```bash
sudo apt-get install libcap2-bin
sudo setcap cap_net_bind_service=+ep `readlink -f \`which node\``
```
At last, let's install PM2. Since PM2 is all written in JavaScript, we can use [NPM](https://www.npmjs.com/), which NVM installed for us with Node.js.
```bash
npm install --global pm2@latest
pm2 --version
```
Finally, let's get some Node.js code to run. I grabbed the snippet from the [Express.js Hello World Starter](https://expressjs.com/en/starter/hello-world.html) and modified it a bit. I saved the code in a file named `~/server.js`.
```javascript
const express = require('express')
const app = express()
const port = 80

app.get('/', (req, res) => {
  res.send('Hello PM2!')
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Listening at http://localhost on port ${port}`)
})
```
After all this, if you run `node server.js`, you'll see your application live at your VM's public IP address! Now, let's take a look at how PM2 can turn this from a simple Node.js process into a robust, persistent application.

### Using PM2: Basic Usage
With PM2 all set up, let's create our first PM2 app. First, make sure you're in the same directory as your code, whether you're using my `server.js` or your own app. Then, start the PM2 app.
```bash
pm2 start server.js
```
That's it! Now your application is accessible from your VM's public IP address.
PM2 is a powerful application. Here's a brief overview of what's possible with PM2's easy-to-use CLI. For more in-depth information, see the [PM2 documentation](https://pm2.keymetrics.io/docs/usage/process-management/).

#### Start
Start PM2 applications with `pm2 start`. When you start an app with PM2, PM2 drops the extension (e.g. `.js`), so if you started an app called `myapp.js` it would be registered with PM2 as just `myapp`.
```bash
# start a Node.js app
pm2 start index.js

# start multiple Node.js apps at once
pm2 start backend.js frontend.js api.js

# start a non Node.js app or shell command
pm2 start 'ls -al'

# start a Node.js app with a log stream in the foreground
pm2 start index.js --attach

# start a Node.js app with command line arguments
pm2 start index.js -- <arg> <arg>
```

#### Restart
Restart PM2 applications with `pm2 restart`. PM2 allows you to specify restart strategies, which restart your app based on configurable rules. I've only listed a couple here, see the full list in [PM2's restart strategies documentation](https://pm2.keymetrics.io/docs/usage/restart-strategies/).
```bash
# manually restart Node.js apps
pm2 restart <app> <app> ...

# use the 'all' keyword to manually restart all PM2 apps
pm2 restart all

# trigger a restart on when file changes are detected (great for development)
pm2 start index.js --watch

# trigger a restart when a memory limit is exceeded
pm2 start index.js --max-memory-restart 300M

# rename an existing PM2 app
pm2 restart index --name myapp
```

#### Stop
Stop PM2 application with `pm2 stop`.
```bash
# manually stop Node.js apps
pm2 stop <app> <app> ...

# use the 'all' keyword to manually stop all PM2 apps
pm2 stop all

# permanently delete PM2 apps
pm2 delete <app> <app> ...
```

#### Inspect
PM2 has a variety of ways to inspect applications, from view logs to system resources.
```bash
# list all PM2 apps
pm2 list

# bring up the PM2 monitoring command center (a tmux-like screen for monitoring apps)
pm2 monit

# show metadata for a specific PM2 app
pm2 show <app>

# show PM2 logs for a specific PM2 app
pm2 logs <app>
```

### Using PM2: Creating a Persistent Application
This is all fine and dandy, but what if our server goes down? How will PM2 know to restart the application when the server comes back up? Those are great questions. Let's create a systemd service for PM2 to automagically restart our applications.
If you've ever written a `.service` file for an application, I'm sure you know how tedious it can be. PM2 automates this step for us, which is awesome.
```bash
# this command will register PM2 as a startup service with systemd
pm2 startup systemd
# this will spit out another command to run, make sure you run it verbatim

# save the current PM2 state as system configurations
pm2 save

# we'll need to restart the kernel - we only need to do this once
sudo reboot
```
While your machine reboots, let's talk about what PM2 actually did. PM2 made a service file for the current user, which we named `pm2`. Now, whenever the `pm2` user starts up, it will start all of the applications it has registered with it. PM2 does this on a by-user basis, so you can have multiple configurations on the same machine. Once your machine is back up and running, SSH back into it so we can continue.
```bash
# change back to the pm2 user (don't continue as root!)
sudo su pm2
cd

# start the new PM2 service
# PM2 uses the format pm2-<user> for the service
# since our user is also called pm2, we end up with pm2-pm2
sudo systemctl start pm2-pm2

# check the status
sudo systemctl status pm2-pm2

# now, we can restart our example app from above and rename it something more accurate
pm2 restart index --name helloworld

# finally, make sure to save the PM2 state again after renaming the app
pm2 save
```
Now you have a persistent application! You should now always be able to navigate to your VM's public IP address and see your application.

### Using PM2: Configurations as Code
Now that we know how to interact with PM2 and and we have our app up and running, let's talk about automation. How would we automate this process? Well you might think to put all the commands we ran in a shell script, which isn't a terrible idea at first. In fact, many large software companies use shell scripts to deploy their applications. However, shell scripts can be fragile. PM2 has another way to configure app deployments: configuration files. PM2 allows us to create a JavaScript file to define our PM2 configurations. This is powerful because we can check this file into our repository as code so anyone (or any server) that clones our repository can run the application out-of-the-box with PM2.
To generate a simple config file, we can use `pm2 init`.
```bash
pm2 init simple
```
This will create an `ecosystem.config.js` file, which contains all of our PM2 configurations for our app. If we `cat` this file we can see a simple JavaScript structure describing our PM2 configuration.
```bash
cat ecosystem.config.js
```
```javascript
module.exports = {
  apps: [{
    name: "helloworld",
    script: "./server.js"
  }]
}
```
I could write a whole blog post just about PM2 configurations, so I'll just highlight some cool features for now (for more verbose details, check out the [PM2 configuration file documentation](https://pm2.keymetrics.io/docs/usage/application-declaration/)).
You can interact with PM2 config files the same as PM2 apps. The `start`, `restart`, and `stop` commands all work the same.
```bash
pm2 start ecosystem.config.js
pm2 restart ecosystem.config.js
pm2 stop ecosystem.config.js
```
In addition, you can specify multiple apps in a single config file (if you look at the config file above, you'll notice that the `apps` key in `module.exports` is an array). This means if you have multiple apps in one group as a larger application, perhaps `frontend.js`, `backend.js` and `api.js`, you can start them all at the same time. Even cooler, you can restart the apps individually.
```bash
pm2 start ecosystem.config.js --only api
```

### Using PM2: Deployment System
PM2 can also manage multiple hosts together as a _deployment system_. In the examples so far, we've talked about running multiple Node.js apps all together on one machine. As your application grows it may make sense to separate services out to different hosts (e.g. one for your database, one for your API server, etc.).
First, let's [create three DigitalOcean droplets](https://cloud.digitalocean.com/droplets/new) to serve as our deployment machines. Next, let's repeat the steps above for getting PM2 set up on each of these machines. In addition, make sure [Git](https://git-scm.com/) is installed, as we'll need it too. If this were a real application, it might make sense to have another tool, like [Puppet](https://puppet.com/) or [Pulumi](https://www.pulumi.com/), manage these system installations for us.
Next, let's create a PM2 configuration file for our deployment. For now, let's deploy the same app, `server.js` from above, on all the machines. In an actual deployment we'd probably have different apps on some of the machines.
```javascript
module.exports = {
  apps: [{
    script: 'server.js',
  }],
   
  // Deployment Configuration
  deploy: {
    production : {
       "user": "pm2",
       "host": ["192.168.0.13", "192.168.0.14", "192.168.0.15"],
       "ref": "origin/master",
       "repo": "git@github.com:wcarhart/willcarh.art.git",
       "path": "/code/willcarh.art",
       "post-deploy": "yarn install"
    }
  }
};
```
Replace the IP addresses in `deploy.production.host` with the public IP addresses of your newly created droplets. 
To deploy, we can use `pm2 deploy` and specify which deploy configuration we'd like to use (we only have one: `production`). First, we need to setup the server.
```bash
pm2 deploy production setup
```
Then, we can deploy the actual application based on our configuration file.
```bash
pm2 deploy production
```
There's a lot more to be said about PM2's deployment system. For a full rundown, check out [PM2's deployment documentation](https://pm2.keymetrics.io/docs/usage/deployment/).
>> Fun Fact! | All of the demos for [willcarh.art]({{src:index}}) are deployed via PM2 on a DigitalOcean droplet, same as in this blog post!

### Using PM2: Cluster Mode
The last thing I'll say about PM2 is its _Cluster Mode_, which is so powerful it probably deserves its own blog post (I'm noticing a trend here with PM2's features). Cluster Mode allows you to run multiple instances of PM2 applications across multiple cores or physical machines without any code modifications. This means that if you had an application with three components: a front-end server, a back-end server, and an API application, you could run multiple instances of each on the same machine listening on the same port _without any code changes_. That is incredible, and honestly feels like [MiniKube](https://minikube.sigs.k8s.io/docs/) or some kind of _Kubernetes Jr._.
Let's take our `server.js` example from above again. If we wanted to spin up multiple instances of this app behind PM2 as a load balancer, we can use the `-i` or `--instances` option.
```bash
pm2 start server.js -i max
```
The `-i max` allows PM2 to auto-detect the number of available CPU cores and spin up child processes accordingly via [Node.js's `cluster` module](https://nodejs.org/api/cluster.html).
We can also use this approach with a configuration file.
```javascript
module.exports = {
  apps: [{
    script: "server.js",
    instances: "max",
    exec_mode: "cluster"
  }]
}
```

### Conclusion
There's so much more I can say about PM2, like [PM2 modules](https://pm2.keymetrics.io/docs/advanced/pm2-module-system/), [using PM2 with Docker](https://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/), or [using PM2 as a static webserver](https://pm2.keymetrics.io/docs/usage/expose/). It's a mature and robust tool and I use it for many of my applications. I hope this has been an interesting initial dive into PM2 and its capabilities. If anything, I hope this adds yet another tool to your JavaScript ecosystem toolbox. If you're interested in learning more about PM2, I highly recommend reading [PM2's documentation](https://pm2.keymetrics.io/docs/usage/quick-start/), which is complete and verbose. In addition, the help menus found with `pm2 --help` and `pm2 <command> --help` are a great way to get unstuck too.

=🦉
