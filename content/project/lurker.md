## By utilizing the [Hacker News API](https://github.com/HackerNews/API), lurker exposes a simple to use CLI for reading HN stories and comments. It's massively parallelized, extremely portable, lightweight, and easy-to-use.

### Lightweight and portable
Lurker is a single Bash script with minimal dependencies, which means it can run almost anywhere. Install it with `brew install wcarhart/tools/lurker`.

### What hackers are reading, all from your terminal
Get trending stories with the command `lurker`.
```
 ____                  __                 
|    |    __ _________|  | __ ___________ 
|    |   |  |  \_  __ \  |/ // __ \_  __ \
|    |___|  |  /|  | \/    <\  ___/|  | \/
|_______ \____/ |__|  |__|_ \\___  >__|   
        \/                 \/    \/       
1. All systems go for UK’s £55M fusion energy experiment (ccfe.ukaea.uk)
   93 points by danboarder 3 hours ago | 12 comments
2. Dear ImGui – Bloat-free graphical user interface library for C++ (github.com)
   43 points by dragonsh 1 hour ago | 0 comments
3. How to seriously read a scientific paper (www.sciencemag.org)
   52 points by NalNezumi 2 hours ago | 13 comments
4. Scala 3.0.0-M1 (github.com)
   90 points by cwhy 4 hours ago | 40 comments
5. Why do printers still suck? (www.wired.com)
   307 points by harha 23 hours ago | 341 comments
6. Building an artificial sun that looks realistic [video] (www.youtube.com)
   361 points by julvo 10 hours ago | 82 comments
7. A nameless hiker and the case the internet can’t crack (www.wired.com)
   532 points by danso 15 hours ago | 288 comments
8. Thank You for 20 Years of Discogs (blog.discogs.com)
   20 points by paulcapewell 19 hours ago | 3 comments
9. Three Months of Go from a Haskeller’s perspective (memo.barrucadu.co.uk)
   100 points by amzans 6 hours ago | 38 comments
10. Scientist Believes Aging Is Optional (www.outsideonline.com)
    162 points by evo_9 10 hours ago | 93 comments
```

### Lurk through discussions in real time
Use the 'read' command to read the comments for a post.
```
> read 1
All systems go for UK’s £55M fusion energy experiment (ccfe.ukaea.uk)
97 points by danboarder 3 hours ago | 13 comments
    ncmncm | 4 minutes ago:
    There will be no earthbound, commercial Tokamak fusion power in the lifetime of anyone reading 
    this. For reasons.
    
    The energy density of the plasma is necessarily so low that a useful power plant would be 
    absolutely monstrous. Then, it would destroy itself with neutron flux in short order, leaving 
    thousands of tons of radioactive scrap. There is no possibility of such a plant being competitive 
    with solar and wind at current prices, and they are still on their way down.
    
    The prospect of commercial power generation is not the driver of fusion research. Rather, it is a 
    jobs program for high neutron flux physicists, to maintain a population available to draw upon for 
    weapons work. So, expect it to continue burning $billions indefinitely, with no deliverable.
    andyjohnson0 | 1 hour ago:
    Meanwhile the consortium running ITER [1] is spending €22 billion but the UK is no longer a member 
    because we left the EU. For engineering at this scale, cooperation is going to get results - not 
    small projects like this.
        Retric | 1 hour ago:
        Those are very different projects with very different goals.  ITER is designed conservatively to 
        produce 10x fusion energy output vs electrical energy input.  As in you out 1 MW of electricity in 
        and get 1 + 10 = 11MW of heat output.  While not designed to be an economic fusion system it would 
        unequivocally demonstrate a working design and a provide a test bed for experiments relating to 
        reactor materials and full scale operations.
        
        This however is aimed to explore novel geometries which may aid in future designs.  However, the 
        net efficiency at this scale would be vastly lower. It’s still a useful project, but it’s just one 
        of many possible designs.
        zeristor | 56 minutes ago:
        I’m not sure if you can quite say the UK has left.
        
        The UK is part of ITER via Euratom, which requires EU membership. It seems the UK is in a grace 
        period for the time being, but hasnt quite left:
        
        https://www.iter.org/newsline/-/3394
    ggm | 2 hours ago:
    "extracting the excess heat" is nice. Unless there is some other path to conversion of the fusion 
    energy to "useful" energy, this heat is the primary mechanism: you drive a heat exchanger, to drive 
    a turbine, to make electricity. This is what we want: excess heat, to drive a turbine.
    
    Clearly, _this_ tokomak isn't going to make net positive contribution to energy delivery. Some 
    future (30 years?) tokomak is meant to do it.
    
    I do get that for an experiment, "extracting" the heat is what its all about.
    
    (Happy to be put right by wiser heads, if there is some other path to useful energy out from fusion)
        ggm | 2 hours ago:
        I read up, the two other choices are fusion-fission driving: use the neutrons to activate 
        fissionable materials and then put them into a classic fission reactor as food (not what we want 
        really) and direct electic extraction of surplus charge, which is at 48% efficiency according to 
        the wiki.
        
        So yes: surplus heat is likely to be one of the useful products but not the only one, and if 48% 
        efficiency is acceptable, it might be better to do direct charge take-off and process the heat as a 
        problem as a much as the solution to a problem.
        
        Once the heat isn't a problem, its useful. You can have a hot bath. Or feed tomato roots in a 
        greenhouse. Or I guess, run a turbine...
    zeristor | 1 hour ago:
    The Royal Society has held a couple of talks on Fusion, there’s audio from the talks, but no 
    YouTube video alas:
    
    [0] https://royalsociety.org/science-events-and-lectures/2018/03/tokamak-development/
    
    I attended the second day of the 2018 talk [0], the talks are free and it was extremely interesting.
    danboarder | [OP] | 2 hours ago:
    Awesome to see that this project has achieved first plasma on their MAST Upgrade tokamak, see a 
    video of this at the end the article.
```

### Summarize webpages in just a few sentences
Never leave the comfort of your terminal again with [smoosh]({{src:project/smoosh}}).
```
> smoosh 1
MAST Upgrade first plasma For the first time, after a seven-year build, UKAEA's labelled Mega 
Amp Spherical Tokamak (MAST) Upgrade, has achieved "first plasma" - where all the essential 
components work together Focus onNews By Nick 29, 2020No Comments Clean energy from fusion is a 
step closer with the launch of the MAST Upgrade tokamak. "Backed by PS55 million of government 
funding, powering up the MAST Upgrade device is a landmark moment for this national fusion 
experiment and takes us another step closer towards our goal of building the UK's first fusion 
power plant by 2040. mp4 Share this page: Nick 7, 2020 Focus onNews Nick 6, 2020 Focus onNews Nick 
24, 2020 There are a multitude of exciting career opportunities at UKAEA's fusion research and 
technology programme at Culham Science Centre. MAST Upgrade will be the forerunner of the UK's 
prototype fusion power plant, Spherical Tokamak for Energy Production ("STEP"), due for completion 
by 2040. The success of MAST Upgrade is another step along the way to designing future fusion power 
facilities, which could have an important role as part of a future portfolio of low-carbon energy. 
" Commenting on the achievement of first plasma, UKAEA CEO, Professor Ian Chapman, said: "MAST 
Upgrade will take us closer to delivering sustainable, clean fusion energy.
```

### And lots more functionality
Use the 'help' command to see the full list of commands.
```
> help
Available commands:
  help        - show this help menu
  read <ID>   - open the comment thread for post ID
  open <ID>   - open the URL for the post ID in your default browser (only available on macOS)
  copy <ID>   - copy the URL for the post ID to the clipboard (only available on macOS)
  hack <ID>   - open the Hacker News link for the post ID in your default browser (only available on macOS)
  smoosh <ID> - summarize (smoosh) the content from the URL for post ID (only available on macOS)
  user <ID>   - show info for user ID
  <ID>        - get info for post ID
  more        - show the next 10 posts (up to 500)
  less        - show the previous 10 posts
  back        - show the previous list of posts again
  refresh     - refresh the master post list, which will reset the ordering of posts
  clear       - clear the screen
  exit        - quit lurker
```