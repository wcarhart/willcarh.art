## Stream tweets from hashtags like `#covid19` and `#2020election` straight to your terminal
>> Try it out! | Try out birdhouse yourself on [the demo page]({{src:demo}}).

### What it is
Birdhouse is a command-line tweet watcher. It has functionality for streaming tweets from users and hashtags, as well as viewing individual tweets and Twitter users.

### How it works
Believe it or not, but birdhouse is written entirely in Bash. It gets a little freaky with [`jq`](https://github.com/stedolan/jq) and [`curl`](https://github.com/curl/curl) and is both a robust and lightweight way to interact with Twitter.

### Give it a whirl
Stream tweets.
```
birdhouse listen -a @CNN @CNNPolitics @cnni @cnnbrk '#coronavirus'
```
```
Streaming tweets by @CNN + @CNNPolitics + @cnni + @cnnbrk, for #coronavirus
➤ @CNN | Mar 14, 2020 @ 13:44:05
  Republican National Committee Chairwoman Ronna McDaniel was tested for 
  coronavirus Friday night after experiencing a fever and flu-like symptoms, a 
  committee spokesman said in a statement https://cnn.it/2vpLF9W 

➤ @CNN | Mar 14, 2020 @ 14:00:19
  What can we learn about past pandemics to fight future outbreaks? The CNN 
  Film “Unseen Enemy: Pandemic” airs tonight at 11 p.m. ET 
  https://twitter.com/CNN/status/1238932998285930499/photo/1 

➤ @CNNPolitics | Mar 14, 2020 @ 14:03:07
  Joe Biden endorses Elizabeth Warren's bankruptcy plan, calling it "one of 
  the things that I think Bernie and I will agree on" https://cnn.it/2WfbLY4  
  https://twitter.com/CNNPolitics/status/1238933702538862594/photo/1 

➤ @cnnbrk | Mar 14, 2020 @ 14:09:13
  All public schools in North Carolina will be closed for at least two weeks 
  starting Monday, the governor says https://cnn.it/2TQPwpL  
  https://twitter.com/cnnbrk/status/1238935237582893058/photo/1 

➤ @cnni | Mar 14, 2020 @ 14:15:02
  Saudi Arabia has abandoned efforts to support crude prices and is preparing 
  to flood global markets with cheap oil. It's a risky strategy that could result 
  in lean years for a country that still relies on crude sales to drive much of 
  its domestic economy. https://cnn.it/2WdEZGJ

➤ @rottersclubx | Mar 15, 2020 @ 16:16:36 
  The latest The Federico Ferri Daily! 
  https://paper.li/rottersclubx/1309216321?edition_id=03c122d0-6713-11ea-a645-0cc4
  7a0d1609  Thanks to @albertomelloni @breveinutile #coronavirus #covid19
```
Get recent tweets from specific users.
```
birdhouse chirps @elonmusk -n 3
```
```
➤ @elonmusk | 4 hours ago
  Falcon 9’s first stage supporting this mission has flown to orbit four times 
  https://twitter.com/SpaceX/status/1238610282550714369/photo/1 

➤ @elonmusk | 4 hours ago
  Static fire test of Falcon 9 complete—targeting Sunday, March 15 at 9:22 
  a.m. EDT, 13:22 UTC, for launch of 60 Starlink satellites from LC-39A in 
  Florida

➤ @BHMoors | 4 hours ago
  @elonmusk cars should have saved driver preferences linked to profiles on 
  their Phones so that when they connect their Bluetooth the seat, mirrors and 
  temperature control adjust automatically to the drivers saved preference. Can 
  you make this happen?
    @elonmusk | 4 hours ago
    @BHMoors Coming soon
```
Get recent tweets for specific hashtags.
```
birdhouse chirps -n 3 --language en '#covid19'
```
```
➤ @Tooseyboy3 | 1 second ago 
  RT @sahouraxo Holy moly.
  
  Massive anti-government protests in #Paris, #France today, defying #coronavirus 
  lockdown.
  
  But barely a peep from the corporate media. #YellowVests #GiletsJaunes 
  https://twitter.com/actufrparis/status/1238825419631181826/video/1 

➤ @PClots | 2 seconds ago 
  RT @UrijiJami Meditate from your homes @Jugodeparchita 
  https://www.urijijami.com/stories/5e6e3dde37193230e8463b5c 
  #pandemia #COVIDー19 #coronavirus #15Mar #meditation #MeQuedoEnCasa #StayHome

➤ @rrrrrrrrraydon | 2 seconds ago 
  RT @AdoptionsUk Please share Rory and his mum to help them find a home 
  toegther, currently with rspca DERBYSHIRE 
  
  #HORSES #ponies #uk #coronavirus #MondayMotivaton 
  https://twitter.com/AdoptionsUk/status/1237327150962937859
```
View information about Twitter accounts.
```
birdhouse bird @BillGates
```
```
Bill Gates (@BillGates) | Seattle, WA
Sharing things I'm learning through my foundation work and other interests.
  49066807 followers
  216 friends
  3272 tweets
  created on Jun 24, 2009
```