### A brief intro into DigitalOcean
If you've done any kind of web development in the past decade, I'm sure you've run into at least one of the three big [IaaS](https://azure.microsoft.com/en-us/overview/what-is-iaas/) providers: [Amazon Web Services (AWS)](https://aws.amazon.com/), [Google Cloud Platform (GCP)](https://cloud.google.com/), and [Microsoft Azure](https://azure.microsoft.com/en-us/). While many companies (and independent developers) rely on these three companies for lots of services and products, there are other smaller Iaas and [PaaS](https://azure.microsoft.com/en-us/overview/what-is-paas/) providers. One of these is [DigitalOcean](https://www.digitalocean.com/).
DigitalOcean is a company I use regularly for compute resources. I like their platform because unlike some of the bigger companies in this space, the VM creation workflow is much more streamlined on DigitalOcean (VMs are called [_droplets_](https://www.digitalocean.com/products/droplets/) on DigitalOcean). The simplest droplet is $5/month, can be created in seconds with the UI, API, or CLI. Is there any functionality not offered by AWS, GCP, or Azure? No, but I still enjoy using DigitalOcean more for personal projects, _especially_ in the early stages.

### A look at DigitalOcean's services
DigitalOcean has a variety of services, from VMs to managed web apps to S3-like storage to databases, Kubernetes, and more. The most basic resource on DigitalOcean is the [droplet](https://www.digitalocean.com/products/droplets/), which is DigitalOcean's name for their VM product. You can usually get one spun up in less than an minute and be ssh'ed in making changes immediately after. I use droplets whenever I need to test out projects - you can actually see a video of two droplets communicating with each other for the demo of my project [aerogram]({{src:project/aerogram.html}}). What makes DigitalOcean even more powerful is their [API](https://developers.digitalocean.com/documentation/v2/) and [CLI tool `doctl`](https://github.com/digitalocean/doctl). Using the API and `doctl` we can create and tear down droplets programatically.

### Being a power user with the DigitalOcean API
Let's take a look at how we can spin up droplets using the [DigitalOcean API](https://developers.digitalocean.com/documentation/v2/). First, make sure you [create an API token](https://cloud.digitalocean.com/account/api/tokens). We'll `POST` to the [`/v2/droplets` endpoint](https://developers.digitalocean.com/documentation/v2/#create-a-new-droplet) to create our new droplet. Let's write some [Node.js](https://nodejs.org) code to automate our droplet creation. First, let's install some standard libraries we'll need for making network requests.
```
yarn add node-fetch
```
Next, let's write a quick set of functions to create our SSH fingerprint.
```
const crypto = require('crypto')

// compute MD5 fingerprint from SSH public key
const fingerprint = (pub) => {
    const pubre = /^(ssh-[dr]s[as]\s+)|(\s+.+)|\n/g
    const cleanpub = pub.replace(pubre, '')
    const pubbuffer = Buffer.from(cleanpub, 'base64')
    const key = hash(pubbuffer)
    return colons(key)
}

// compute MD5 hash
const hash = (s) => {
    return crypto.createHash('md5').update(s).digest('hex')
}

// add colons, 'hello' => 'he:ll:o'
const colons = (s) => {
    return s.replace(/(.{2})(?=.)/g, '$1:')
}
```
Finally, let's write a simple function to create a droplet using our API token.
```
const fs = require('fs')
const fetch = require('node-fetch')

const createDroplet = async () => {
    // set up authentication
    let token = '<YOUR API TOKEN>'
    let sshKey = fs.readFileSync('~/.ssh/id_rsa.pub').toString()

    // configure droplet
    let configs = {
        name: 'my-test-droplet',
        region: 'sfo2',
        size: 's-1vcpu-1gb',
        image: 'ubuntu-18-04-x64',
        ssh_keys: [`${fingerprint(sshKey)}`],
        backups: false,
        ipv6: false,
        user_data: null,
        private_networking: null,
        volumes: null,
        tags: []
    }

    // create droplet with DigitalOcean API v2
    let response = await fetch('https://api.digitalocean.com/v2/droplets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(configs)
    })
    let data = await response.json()

    // report creation result
    if (data.droplet !== undefined) {
        console.log(`Created droplet: ${data.droplet.id}`)
    } else {
        console.error('Could not create droplet')
    }
}
```
Great! Now when we create a droplet using `createDroplet()`, we get the following result.
```
Created droplet: my-test-droplet
```
Next, we'll want to SSH into our droplet. When a new droplet is created, it's starts in the `NEW` state. This means that the droplet is spinning up and is configuring itself. Once the droplet moves to the `ACTIVE` state, it will be assigned an IPv4 address and then we can SSH in using the SSH key-pair on our machine. In the first few lines of the `createDroplet()` function we specify our SSH public key as `~/.ssh/id_rsa.pub`.
To wait for our new droplet to become active, let's write some code to ping the `/v2/droplets` endpoint with a `GET` request to check the droplet status.
```
// wait for the droplet to become active
const waitForDroplet = async (id) => {
    let done = false
    let token = '<YOUR API TOKEN>'
    let droplet = null
    while (!done) {
        droplet = await inspectDroplet(id)
        if (droplet.status === 'active') {
            done = true
        }
    }
    return droplet
}

// inspect a droplet based on ID
const inspectDroplet = async (id) => {
    let result = {
        id: null,
        status: null,
        ip: null,
        error: null
    }
    let token = '<YOUR API TOKEN>'
    let response = await fetch(`https://api.digitalocean.com/v2/droplets/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    let data = await response.json()
    if (data.droplet === undefined) {
        result.error = data.message
        return result
    }
    result.id = data.droplet.id
    result.status = data.droplet.status
    if (result.status === 'active') {
        result.ip = data.droplet.networks.v4.filter(ip => ip.type === 'public')[0].ip_address
    }
    return result
}
```
Cool! Now, let's add the following lines to the end of `createDroplet()` so we print our droplet's metadata after it's been created.
```
droplet = await waitForDroplet(data.droplet.id)
console.log(`Status: ${droplet.status}`)
console.log(`ID: ${droplet.id}`)
console.log(`IP address: ${droplet.ip}`)
```
Now when when our code prints out the new droplet's IP address, we can SSH in!

### Being a power user with the DigitalOcean CLI
The [DigitalOcean API](https://developers.digitalocean.com/documentation/v2/) is powerful when you're creating programs to provision and tear down infrastructure, but what if we wanted to create a droplet quickly from the command line? DigitalOcean also has a CLI tool, [called `doctl`](https://github.com/digitalocean/doctl) (short for _DO control_), for interacting with DigitalOcean products. Let's see what it takes to create a droplet using `doctl` and Bash.
To get started, let's install `doctl` via [Homebrew](https://brew.sh). If you don't use Homebrew, there are other installation options available in its [GitHub repository](https://github.com/digitalocean/doctl).
```
brew install doctl
```
In order for `doctl` to be authenticated against our DigitalOcean account, we need to use our [authentication token](https://cloud.digitalocean.com/account/api/tokens) from before with `doctl auth`.
```
doctl auth init
```
Now for the code. First, we create our SSH fingerprint, same as before.
```
fingerprint="$(ssh-keygen -E md5 -lf ~/.ssh/id_rsa.pub | awk '{print $2}' | cut -c 5-)"
```
Then, we use `doctl compute droplet create` to create a new droplet.
```
doctl compute droplet create 'my-test-droplet' \
    --size s-1vcpu-1gb --image ubuntu-18-04-x64 \
    --region sfo2 \
    --format ID \
    --no-header \
    --ssh-keys "$fingerprint"
```
Finally, let's again wait for the droplet to become active. Let's write this in a way so if we need to create multiple droplets later we wait for them _all_ to become active.
```
complete=0
while [[ complete -eq 0 ]] ; do
    complete=1
    ran=0
    statuses=( `doctl compute droplet list --no-header --format "Status"` )
    for status in "${statuses[@]}" ; do
        if [[ "$status" != active ]] ; then complete=0 ; fi
        ran=1
    done
    if [[ $ran -eq 0 ]] ; then complete=0 ; fi
done
```
Great! As you can see, both `doctl` and and the DigitalOcean API allow us to rapidly create droplets.

### Spinning up a fleet of DigitalOcean droplets
What if we wanted to spin up 10 droplets and kick off a job on each of them? Let's see how we could accomplish this with `doctl`.
First, let's write a Bash function to create `x` number of droplets (with default of 10).
```
function create {
    fingerprint="$(ssh-keygen -E md5 -lf ~/.ssh/id_rsa.pub | awk '{print $2}' | cut -c 5-)"
    for index in $(seq 1 ${1:-10}) ; do
        echo "Creating droplet-$index"
        continue
        doctl compute droplet create "droplet-$index" \
            --size s-1vcpu-1gb --image ubuntu-18-04-x64 \
            --region sfo2 \
            --format ID \
            --no-header \
            --ssh-keys "$fingerprint"
    done
    wait
}
```
Next, we'll use our same code from above as our `wait` function.
```
function wait {
    complete=0
    while [[ complete -eq 0 ]] ; do
        complete=1
        ran=0
        statuses=( `doctl compute droplet list --no-header --format "Status"` )
        for status in "${statuses[@]}" ; do
            if [[ "$status" != active ]] ; then complete=0 ; fi
            ran=1
        done
        if [[ $ran -eq 0 ]] ; then complete=0 ; fi
    done
}
```
Finally, let's write one last function to kick off our job on each droplet.
```
function run {
    for index in $(seq 1 ${1:-10}) ; do
        echo -n "Starting droplet-$index"
        
        doctl compute ssh "droplet-$index" --ssh-port 22 <<EndSSH > /dev/null 2>&1
cat << EndOfScript > run.sh
telnet towel.blinkenlights.nl
EndOfScript
EndSSH
        doctl compute ssh "droplet-$index" --ssh-command "\
            chmod +x ~/run.sh ; \
            echo '~/run.sh &' | script 'screen -' \
        " > /dev/null 2>&1
        echo "Started the job on droplet-$index"
    done
}
```
We could also write some code to check if the job has completed and then tear down the droplet, but I'm going to err on that being outside the scope of this article.

### Conclusion
As we've demonstrated, DigitalOcean is a powerful competitor in the IaaS and PaaS space. It may not have as extensive a product lineup as AWS, GCP, and Azure, but they do have robust automation tooling in the form of [`doctl`](https://github.com/digitalocean/doctl) and the [DigitalOcean API](https://developers.digitalocean.com/documentation/v2/), and the products they do have are straightforward and easy-to-use. For instance, have you ever tried setting up an AWS or GCP project _from scratch_ with properly configured IAM roles and API and CLI support? Sometimes just installing [`gcloud`](https://cloud.google.com/sdk/gcloud) can be a pain. DigitalOcean is lightweight enough to get rolling within minutes, and that's why I continue using it for my projects.
If you want a complete copy of all the code from this post, check out [this repository](https://github.com/wcarhart/willcarh.art-snippets/tree/master/spinning-up-a-fleet-of-digitalocean-droplets). Until next time, see you on the ocean.

=🦉