## Chord progressions, at your fingertips.

### An easy way to compose and tranpose
Did you know that music is more like code than most people realize? Notes and chords can be abstracted into numbers and relationships, just like code.
Given my musical background, I wanted an iOS application that could write chord progressions for me and help me tranpose music easily. Given a starting key, Chordpanion generates a set of commonly used progressions in said key, and provides formulaic progressions to change to another key.
Chorpanion is not currently published to the App Store, but I hope to finish and publish it at some point in the future!

### General premise
Chordpanion is currently a work-in-progress iOS app. It uses no external models for its graphics; they are all built programmatically in Swift. It has pages for chord progressions, transposing, and configuration management.
![Chordpanion demo]({{cdn:img/project/Chordpanion/chordpaniondemo.png}})<Chordpanion's menu for picking a key, with dynamically built keyboard graphics in Swift>
Music can be broken into scales and chords, which can then be further divided into notes. There are only 12 unique notes that can be played (although they can be replicated in other octaves). If we assign a number 0 through 11 to each of these notes, we can process them with programming. Chordpanion uses commonly known chord progressions and trasposition techniques to build progressions for a given key.

### A simple example
One of the most common progressions is `I vi IV V`. This progression can be replicated in any key. However, we can also make observations between the relationships between each chord in this progression. The `I` and `iv` chords are built off the same scale, meaning that any transition from `I` to `iv` or from `iv` to `I` will sound powerful. Similar conclusions about other chord relationships, such as knowledge of the Circle of Fifths, allows Chordpanion to build great-sounding progressions.