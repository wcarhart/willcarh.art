### Emails in Python: An Introduction
Ever want to set up an email newsletter on your own? Or have you ever wondered how services like [MailChimp](https://mailchimp.com/) send automated emails? Sending emails programmatically is very common practice, and Python comes out of the box with some awesome packages to help us send emails. Let's dive in!
>> Note | You can download all the demo code from this blog post [here](https://github.com/wcarhart/willcarh.art-snippets/blob/master/automating-emails-in-python/snippet.py).


### What is SMTP?
The [Simple Mail Transfer Protocol](https://www.geeksforgeeks.org/simple-mail-transfer-protocol-smtp/), or _SMTP_, is one of the most common protocols for sending outgoing emails. SMTP servers are responsible for connecting individual email clients like Gmail and Yahoo to the greater Internet, which in turn allows you to send an email to (almost) anyone in the world! I'm not going to delve into the details of SMTP right now, but a high-level take away is that **SMTP is an interface that allows you to send emails to other recipients' inboxes.**

### Using the `smtplib` package in Python
Python has a powerful vanilla package for sending emails: `smtplib`. This package abstracts away a lot of the heavily lifting from the user and exposes a simple API. Let's look at some quick examples.
Let's suppose I'd like to send an email, via Python, from my super cool email address _pythonista@gmail.com_, where my very secure password is simply _password_. Gmail actually won't like this method, but let's disregard that for now.
```python
import smtplib, ssl
from email.mime.text import MIMEText

port = 465
smtp_server = 'smtp.gmail.com'

email_content = "Hi! How's it going?"
sender = 'pythonista@gmail.com'
password = 'password'
receiver = 'receiver@gmail.com'
subject = 'Just checking in!'
message = MIMEText(email_content)
message['to'] = receiver
message['from'] = sender
message['subject'] = subject

context = ssl.create_default_context()
with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
    server.login(sender, password)
    server.sendmail(sender, receiver, message.as_string())
```
This is just a simple example - Python can do a _lot_ more when it comes to emails! I'm not going to dive into all of its features, but there are plenty of great tutorials for learning how to send emails with Python, such as over at [RealPython](https://realpython.com/python-send-email/).

### Let's talk security
Before we go any further, let's take a look at a specific snippet from the code above:
```python
context = ssl.create_default_context()
with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
    ...
```
What do the lines `ssl.create_default_context()` and `smtplib.SMTP_SSL()` do? In order to set up a secure connection for sending our emails, we use [SSL](https://www.websecurity.symantec.com/security-topics/what-is-ssl-tls-https), which is a transport security layer protocol. This encrypts our messages and protects us from nefarious individuals who might be trying to read them without our knowledge! Security is something that Gmail takes very seriously, and if we want to send emails through an _@gmail_ address, we'll have to make sure we're following the proper protocols.

### Insert Gmail
Remember earlier when I said that Gmail won't let us send emails through an _@gmail_ address normally? This is because doing so allows _less secure_ applications to access our Gmail address. Anyone who knows our password could write some code to send malicious emails through _pythonista@gmail.com_, which is very bad!

In order for us to send emails with the above code snippet, we'd have to go into a [hidden Gmail setting](https://support.google.com/accounts/answer/6010255?hl=en) and turn off protections which prevent sending emails from insecure applications. This will allow us to send emails freely with the code we've already written, but Gmail often complains! The email utility I wrote for [willcarh.art]({{src:index}}), the [Herald](https://github.com/wcarhart/willcarh.art-v1/blob/master/herald.py), used this implementation for the site's initial architecture. However, whenever someone would send an email through the site, I'd get a **critical security alert** from Google, claiming that _"Someone just used your password to try to sign in to your account. Google blocked them, but you should check what happened!"_
**Yes, Google, that was me.**
![Picture of Google critical security alert]({{cdn:img/blog/automating-emails-in-python/criticalalert.png}})<What the Google Security Alert looks like>
What's troublesome is not the annoying email itself, but Gmail's behavior: _it locked out my application until I manually confirmed its access._ This can't be a valid implementation, because then nobody can send emails from [willcarh.art]({{src:index}}) while Gmail has it blocked! How do we get around this?

### Our saving grace: the official Gmail API
In order to allow secure applications to send automated emails, Gmail exposes an API that helps ensure that automated email access is intended. And, it's got some _"decent"_ [documentation](https://developers.google.com/gmail/api/quickstart/python) for how to get started. Let's take a look at the quickstart Python guide in Gmail's API docs. I've modified it a little bit to simplify it for us. First, let's install the necessary dependencies with `pip`.
```bash
pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib
```
Next, go ahead and click the **Enable the Gmail API** button from the documentation to acquire your Gmail API keys. Save this file as `credentials.json`.
Then, let's write a simple script to set up our credentials.
```python
import os
import pickle
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

SCOPES = ['https://www.googleapis.com/auth/gmail.send']

def main():
    creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('gmail', 'v1', credentials=creds)
```
When we run this script, it'll open a browser window and walk you through your API key setup. During the setup, if Gmail states that your app isn't secure, just click the **Advanced** button to continue past the checkpoint. The good news is once you've run this script once, you just need the `token.pickle` file that is produced; we can do away with `credentials.json` and most of our code from above.
>> Watch out! | Although `token.pickle` is a serialized Python object, it is not encrypted! Anyone who has access to this file can open it and extract the contents with Python, so you should _not_ check it into version control!

Pay close attention to this line:
```python
SCOPES = ['https://www.googleapis.com/auth/gmail.send']
```
This is how Gmail defines the permissions of your application. We have selected the **gmail.send** permission, but the Gmail API specifies quite a few more. You can read about all of the available authorization scopes [here](https://developers.google.com/gmail/api/auth/scopes). A good rule to follow is to only give your application the bare minimum permissions that still allow it to function properly. If you look at the list of authorization scopes available for the Gmail API, you'll see that there are other options that also allow for sending emails, such as **gmail.compose** and **gmail.modify**. However, we can minimize the potential security risk of our application by restricting its permissions to only **gmail.send**.

### Using the Gmail API to send emails
Great! Now we can write some code to actually send emails! First, let's revise our code from above to be a little bit more succinct.
```python
import os
import pickle

def get_gmail_api_instance():
    if not os.path.exists('token.pickle'):
        return None
    with open('token.pickle', 'rb') as token:
        creds = pickle.load(token)
    service = build('gmail', 'v1', credentials=creds)
    return service
```
Cool! Now, let's write a quick function to draft an email that the Gmail API will send for us. The Gmail API doesn't work with regular strings, unlike `smtplib` from earlier. We'll have to use `base64` encodings.
```python
import base64
from email.mime.text import MIMEText

def create_message(sender, to, subject, message_text):
    message = MIMEText(message_text)
    message['to'] = to
    message['from'] = sender
    message['subject'] = subject
    raw = base64.urlsafe_b64encode(message.as_bytes())
    raw = raw.decode()
    body = {'raw': raw}
    return body
```
Nice! Next, we'll write another function for actually sending emails that we've drafted using our code above.
```python
def send_email(service, user_id, message):
    try:
        message = (service.users().messages().send(userId=user_id, body=message).execute())
        return message
    except Exception as e:
        print("err: problem sending email")
        print(e)
```
Almost there! Finally, we'll write a little bit of code to string everything together!
```python
import sys

# draft our message
sender = 'pythonista@gmail.com'
receiver = 'receiver@gmail.com'
subject = 'Just checking in!'
message_text = "Hi! How's it going?"

# authenticate with Gmail API
service = get_gmail_api_instance()
if service == None:
    print("err: no credentials .pickle file found")
    sys.exit(1)

# create message structure
message = create_message(sender, receiver, subject, message_text)

# send email
result = send_email(service, sender, message)
if not result == None:
    print(f"Message sent successfully! Message id: {result['id']}")
```
And that's it! Now when we send emails, Gmail won't complain anymore! 🎉

### Parting Notes
There you have it! You're now a pythonista armed with the power, and responsibility, of Gmail. Note that when you use the Gmail API, you're subject to its Terms of Service, so please don't use it nefariously 😊
If you'd like to use the code from this blog post, I've uploaded it all to a [here](https://github.com/wcarhart/willcarh.art-snippets/blob/master/automating-emails-in-python/snippet.py) for your convenience. Many of the code samples were derived from Gmail's API documentation for Python, which you can access [here](https://developers.google.com/gmail/api/quickstart/python).
In addition, I used this architecture for my own email utility, the Herald, for [willcarh.art]({{src:index}}). You can see it in action by going to the [contact]({{src:index}}) section of the homepage. If you'd like to take a peek at the [source code](https://github.com/wcarhart/willcarh.art-v1/blob/master/herald.py), please be my guest!
>> Note | In [v1 of willcarh.art](https://github.com/wcarhart/willcarh.art-v1), email sending was backed by a Django application running on a Heroku dyno. The website no longer sends automated emails, but the code from this blog post is still totally valid!

=🦉