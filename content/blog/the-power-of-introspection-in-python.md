### What is Introspection?
Introspection is one of those programming buzzwords that gets thrown around, but what does it actually mean? A quick Google search of introspection returns _the examination or observation of one's own mental and emotional processes._ For a human, introspection is essentially thinking about thinking, such as reconsidering why we acted a certain way or made a decision in the past.
Introspection with Python is conceptually the same as with humans. We are essentially asking Python to give us some information about itself, whether it be about an instance of a class, object, etc. On the surface, this can sound complex, but in practice it's quite simple. Let's dive right in.

### Introducing `getattr()`
Suppose we have the following Python class:
```
class Car():
    def __init__(self):
        self.miles = 0
    def drive(self, miles):
        self.miles += miles
```
Now, let's create a new `Car` and have it drive a little bit.
```
>>> car = Car()
>>> car.drive(10)
>>> car.miles
10
```
We can also use the Python builtin function `getattr` to accomplish this.
```
>>> car = Car()
>>> getattr(car, 'drive')(10)
>>> getattr(car, 'miles')
10
```
What just happened? We used the `getattr` function to get named attributes from our `Car` class. Even cooler, not only can we use `getattr` to get the value of class attributes, we can also use it to call functions!
>> Summary | `getattr(object, 'val')` is equivalent to `object.val`


### Why is this powerful?
On the surface, the introspective power of `getattr` may not be immediately apparent. After all, it took us the same number of steps to drive our `Car` with introspection as without. However, consider the case where you want to call a function via a variable, like a string. Let's rewrite our `Car` class to be a bit more generic:
```
class Car:
    def __init__(self):
        self.miles = 0
        self.velocity = 0
    def drive(self, miles):
        self.miles += miles
    def accelerate(self, velocity):
        self.velocity += velocity

    def do_action(name, value):
        getattr(self, name)(value)
```
Now we can drive our car by calling `drive()` or speed up by calling `accelerate()`. However, we can also use the new `do_action()` function:
```
>>> car = Car()
>>> car.do_action('drive', 10)
>>> car.miles
10
>>> car.do_action('accelerate', 30)
>>> car.velocity
30
```
This makes automating things in Python much easier!

### Why does this matter?
I'm definitely one to learn by example. Why does introspection matter? Where can I _actually_ use it in my Python? Here's a simple example.
Consider the Python builtin dunder `&#95;&#95;dict&#95;&#95;`. This returns a dictionary of the class attributes for a class. If we had our Car class from above, we could use `&#95;&#95;dict&#95;&#95;` to get its values:
```
>>> car = Car()
>>> car.miles = 10
>>> car.velocity = 30
>>> car.__dict__
{'miles': 10, 'velocity': 30}
```
Do you think we can recreate some of `&#95;&#95;dict&#95;&#95;`'s functionality using introspection? You bet we can! Let's use `getattr` to write a function that will _JSONize_ a class, or take its attributes and turn them into a JSON string.
```
def jsonize(self):
    variables = [var for var in dir(self) if not var.startswith(('_', '__')) and not callable(getattr(self, var))]
    return "{" + ",".join([f"\"{var}\": \"{getattr(self, var)}\"" for var in variables]) + "}"
```
This might seem like some Python mumbo-jumbo, so let's break it down! The first line of `jsonize` gets all of the variables in the class (`self`). Then, the second line calls `getattr` for each variable, and arranges them nicely into JSON format. See, not so bad! Check out the code [here](https://github.com/wcarhart/willcarh.art-snippets/blob/master/the-power-of-introspection-in-python/snippet.py).

### A real life example
`getattr` is actually used in [willcarh.art]({{src:index}})! All of the content for the site's database is read from a JSON file. Rather than hard coding this content in a Python file, I wrote a simple script called the `Scribe` to read from the JSON file and upload to [willcarh.art]({{src:index}})'s database. Now, there are multiple different models, or classes, in the database, so `Scribe` needs to be able to dynamically create Python objects. Here's how I used `getattr` to accomplish this...
My JSON schema is defined as such:
```
[
  {
    "class": "...",
    "contents": "..."
  }
]
```
After some data validation, I attempt to make an instance of the class, load in its content from the `contents` field in the JSON, and save it to the database. Note that in this call to `getattr`, the first argument is the _module_ and the second is the _class_, whereas in our earlier usage the first argument was the _class_ and the second argument was the _attribute_. `getattr` is very flexible!
```
def parse_data(entity):
    Class = getattr(models, entity['class'])
    instance = Class(**entity['content'])
    instance.save()
```
And that's it! These few lines of code save me the hassle of micromanaging my database. This is a watered down version of `Scribe` for demonstration purposes. If you'd like to see the full source code, check it out [here](https://github.com/wcarhart/willcarh.art-v1/blob/master/scribe.py).
>> Summary | `getattr` is a powerful Python builtin. You can use it to acquire a class instance from a module or an attribute from a class, as well as calling class functions.

If you're interested in learning more about [`getattr`](https://docs.python.org/3/library/functions.html#getattr), [here's a great introspection article](https://linux.die.net/diveintopython/html/power_of_introspection/index.html). You could also consider looking into [`setattr`](https://docs.python.org/3/library/functions.html#setattr), [`hasattr`](https://docs.python.org/3/library/functions.html#hasattr), and [`delattr`](https://docs.python.org/3/library/functions.html#delattr).

=🦉