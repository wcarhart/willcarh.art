# The modern web browsing experience has become encumbered with cookie notices, newsletter signups, and browser notifications. Smoosh allows you to read just the important bits from most webpages by using a smart summarizing algorithm.

> Try it out! | Try out smoosh yourself on [the demo page]({{src:demo_index.html}}).

### What it is
Smoosh is a simple tool that summarizes (smooshes) text, either locally or from the web. For example, smoosh can take any New York Times, CNN, or Fox News article and smoosh it (reduce its length) by ~70-80% on average. This means that most news articles can be read in just a few sentences!

### How it works
Smoosh was inspired by [SMMRY](https://smmry.com/), which powers the [autotldr bot](https://www.reddit.com/r/autotldr/) on Reddit. It uses a similar algorithm with some minor tweaks. Essentially, smoosh determines the most important sentences in a text snippet and then creates an intelligent summary based on the ordering of those sentences.

### How to use it
You can use smoosh on a webpage.
```
smoosh 'https://www.cnn.com/2020/10/27/investing/amd-xilinx-purchase/index.html'
```

Or, on a local file.
```
smoosh my_articles/spacex.txt
```

Output shows the summary and some metrics, which you can silence with the `--quiet` flag or make verbose with the `--verbose` flag.
```
It will be an operational monument to Elon Musk's vision: a towering SpaceX launch control center,
a hangar and a rocket garden rising in the heart of Kennedy Space Center. According to plans
detailed in a draft environmental review published recently by KSC, SpaceX will undertake a major
expansion of its facilities at the space center sometime in the future. The site would replace or
add to SpaceX's current launch and landing control center, which is tucked in a small office space
outside the south gate to Cape Canaveral Air Force Station near Port Canaveral. The tower would
include a data center; firing room; engineering room; control center for Falcon 9, Falcon Heavy and
Dragon vehicles; customer control center; and meeting spaces. "As SpaceX's launch cadence and
manifest for missions from Florida continues to grow, we are seeking to expand our capabilities and
streamline operations to launch, land and re-fly our Falcon family of rockets," said James Gleeson,
a SpaceX spokesman. Rivaling the open-air exhibit of famous spacecraft at the nearby KSC Visitor
Complex, SpaceX plans to display "historic space vehicles" in its own rocket garden, potentially
including Falcon boosters or Dragon capsules staged vertically or horizontally. SpaceX opted not to
build near the other companies in Exploration Park or to repurpose or share legacy NASA facilities,
such as KSC's own Launch Control Center.

-_-_-_-_-_-_ METRICS _-_-_-_-_-_-
Original length: 6035 characters
Smooshed length: 1411 characters
Original smooshed by 76.62%
```