# Optimize your night out.

### About the project
Cheers started as a concept while I attended the [University of San Diego](https://www.sandiego.edu). The goal was to develop an iOS app that would show nearby bars and restaurants with ongoing happy hours. Our team observed that often in San Diego there are many fun bars to explore, but sometimes it's hard to know where to look. That's where Cheers comes in!
During the project's development, we wrote a proof-of-concept iOS app, which did all processing on the client. The app uses the Yelp Fusion API to acquire its restaurant data and Firebase as a data store. Given that I had the original idea for the app and I had written more than half the code base, I decided to continue the project after my time at USD.
The complete version of the app is still a work in progress. I would love to continue development on it at some point in the future. The client is written entirely in Swift + iOS, while the prototype backend is an API written in Flask and Python, using the SQLAlchemy adapter for the PostgreSQL database.

### The prototype iOS app
Cheers utilizes the Yelp Fusion API, combined with a proprietary dataset stored in a Firebase database and the user's location, to display nearby happy hours.

?![Cheers demo](https://s3.gifyu.com/images/cheers_demo.gif)<Prototype iOS Cheers app>
~(epnlkO3lzeY)

### Features
**Nearby happy hours, when you want them**
Cheers uses the your location to compute ongoing happy hours within a reasonable distance, so it's easy to see what's going on around you. You can also see all bars nearby, to plan ahead for a night out.
**Built on the Yelp Fusion API**
Cheers acquires most of its data from Yelp, so you know you're getting an accurate, up-to-date record of each establishment. Cheers then sprinkles in the stuff Yelp doesn't provide.
**List and Map Views**
Like browsing lists? Use the list view with filtering and search functionality to find the exact bar you want. More of a visual person? Use the map view to see what's around you right now.
**All your favorites in one place**
Love a bar? Add it to your favorites! Cheers will remember your favorites so you can view them anytime.
**Take me there!**
Cheers supports Uber, Lyft, and Apple Maps. To discourage drinking and driving, Cheers makes it easy to use ridesharing apps to get from bar to bar.

### Future plans
The demo above is of the proof-of-concept Cheers prototype. I have been developing the production version off-and-on, which utilizes a complete Flask API backend, rather than a dummy Firebase database. I would love to be able to release it to TestFlight and more publically at some point.