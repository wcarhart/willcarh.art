# Remote messenging. Without a server.

### Overview
Aerogram is a messenging app built for the terminal. It has similar functionality to other messaging services, but without as much setup. Unlike Slack, Mattermost, or other messaging platforms, aerogram does not require a server or 3rd party service to run. As long as you can SSH into a host, you can send it a message with aerogram.
Aerogram piggybacks off of the existing functionality of SSH and SCP, allowing it to be portable to lots of different environments. This allows aerogram to be incredibly lightweight, as well.

### Live chatting between remote hosts
Aerogram utilizes the existing functionality of SSH and SCP to send messages between hosts. It accomplishes this by spawning two processes: a _message listener_ in the background and a _message renderer_ in the foreground. The listener waits for a specific file to appear in a buffer directory and then sends a signal to the renderer, which reads the message and displays it on the screen. This simple protocol, loosely-based off of protocols like TCP, allows aerogram to create seemingly complex messaging functionality without reinventing the "networking" wheel.
Traditionally, an aerogram is a thin, lightweight piece of foldable paper for writing a letter for transit via airmail, in which the letter and envelope are one and the same. Given that aerogram is lightweight and requires no server, I thought this was an apt name for the program.
![aerogram CLI demo](https://github.com/wcarhart/aerogram/blob/master/demo.gif?raw=true)<Simulating two separate hosts via DigitalOcean droplets and using aerogram to talk to each other>