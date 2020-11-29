# Your liaison between repository secrets and the great beyond.

### A simple use case
Consider the following scenario: Your cool new app requires a slick, unique API key to run. Perhaps your framework requires you to put this API key in a `manifest.json` or similar configuration file. However, your manifest file(s) need to be checked into GitHub, thus exposing your precious API key. Locksmith provides a layer of security to prevent you from having to type out your secrets in plaintext anywhere in your repository.

### Backed by GPG
Locksmith uses [GPG](https://www.gnupg.org/) to encrypt secrets, so you know they'll be safe. Once you've installed and set up locksmith (with `pip install locksmith`), locksmith exposes a simple API.
First, decide on who's going to be using your secrets. Locksmith looks for secrets based on users, which are programmer-defined. For example, if I was the only user of my repo, the only user would be _wcarhart_. However, perhaps you're collaborating on a repo, where you'd have two users, such as _wcarhart_ and _friend_user_. Or, perhaps you're collaborating on a repo but you'd only like to use one joint user for locksmith, such as _locksmith_user_.
If you have one user, _locksmith_user_, add the following file `locksmith_user.lcksmth` to your repository (but do NOT check it into version control):
```
secret0=secret_value0
secret1=secret_value1
...
secretN=secret_valueN
```
An example of this file with actual values could be:
```
API_KEY=3eWhJtewSr0sSshNX9STOLUV1nGtFznxQM8UfyYH
DATABASE_USER=admin
DATABASE_AUTH=password
```
If you named this file `locksmith_user.lcksmth`, then these secrets will be available to the user locksmith_user, or to any user that knows locksmith_user's password.
Now, encrypt the file using gpg:
```
gpg -c locksmith_user.lcksmth
```
Enter a desired password. This will produce a file `locksmith_user.lcksmth.gpg`. You can now safely check this into your version control.

### Protect your repository secrets
Locksmith exposes a simple API with `get_secret(parameter)`.
In your code, replace:
```
api_key = 'D4kTnNOp5lwKYJGwHkai'
```
With:
```
from locksmith import Locksmith
lock = Locksmith('your_username')
api_key = lock.get_secret('API_KEY')
```
When the above lines are executed, you will be prompted for locksmith_user's password. This will happen only when you instatiate a new Locksmith object and not every time you access a secret. It's that easy!