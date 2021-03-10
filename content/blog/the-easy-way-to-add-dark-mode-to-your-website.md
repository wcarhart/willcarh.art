>> Heads Up! | You can find the completed sample code in [this JSFiddle](https://jsfiddle.net/wcarhart/kzgr1tja/40/) or [this repository](https://github.com/wcarhart/willcarh.art-snippets/tree/master/the-easy-way-to-add-dark-mode-to-your-website) if you'd like to follow along.


### Everyone's doing it
2019 began [the year of dark mode](https://www.theverge.com/2019/3/15/18261967/dark-mode-battery-saving-feature-apps-os-platforms-developments) as most software companies jumped on the trend. Now you can find many different apps with dark mode available: Gmail, GitHub, Stack Overflow, even iOS. Being the trendy developers we are, let's come up with an easy way to implement dark mode on our websites with just a little bit of CSS, HTML, and jQuery.

### Using CSS variables
First, let's pick a color scheme and keep track of it with standard CSS. If you use [Sass](https://sass-lang.com/) or [Less](http://lesscss.org/) the concept is the same. You can steal mine from my [etc]({{src:etc.html}}) page if you'd like. I usually have 4-5 colors in my scheme, but you can choose as many as you like.
We'll need to pick colors for _light mode_ and _dark mode_. Create a new file `style.css` for our styling. Set your variables for _light mode_ in `:root` and _dark mode_ in `:root.dark-mode`. This will make it super easy to switch between them.
```
:root {
    --background: #ecf0f1;
    --detail: #bdc3c7;
    --color: #e67e22;
    --text: #252323;
}
:root.dark-mode {
    --background: #292929;
    --detail: #34495e;
    --color: #6642ac;
    --text: #ecf0f1;
}
```
Next, let's add an HTML skeleton in a new file called `index.html` to display our color scheme.
```
<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <h1>Dark Mode Test</h1>
        <p>This is a test of our new <span class="color-text">dark mode</span>!</p>
    </body>
</html>
```
And, let's style our HTML according to our color scheme.
```
body {
    color: var(--text);
    background-color: var(--background);
}
.color-text {
    color: var(--color);
}
```
Now, try adding the class `dark-mode` to the parent-most `<html>` tag. When we add the `dark-mode` class, our site switches to dark mode!
>> Note | If for whatever reason you aren't able to target the outermost `<html>` tag, you can also target the `<body>` tag, which may make sense for some websites. To do this, place your CSS color variables in `body` and `body.dark-mode` instead of `:root` and `:root.dark-mode`. Don't forget to update the JavaScipt down below, too.


### Adding the toggle
Next, let's add a button to toggle dark mode on and off. I'm going to use [this icon](https://fontawesome.com/icons/lightbulb?style=solid) from [FontAwesome](https://fontawesome.com/). Let's update our HTML with this new button.
```
<!DOCTYPE html>
<html>
    <head>
      <script src="https://use.fontawesome.com/releases/v5.5.0/js/all.js"></script>
    </head>
    <body>
        <h1>Dark Mode Test</h1>
        <p>This is a test of our new <span class="color-text">dark mode!</span></p>
        <i id="dark-mode-toggle" class="fas fa-lightbulb"></i>
    </body>
</html>
```
Let's style our button as well.
```
#dark-mode-toggle {
    position: fixed;
    top: 1.5rem;
    right: 1.5rem;
}
#dark-mode-toggle:hover {
    cursor: pointer;
}
```
Note that we'll have to include an external script for FontAwesome to access the icon.

### Wiring it together
Who said [jQuery](https://jquery.com/) was going out of style? Let's use a little bit of jQuery to wire up our dark mode toggle button in a new file `darkmode.js`.
```
$(document).ready(async () => {
    $('#dark-mode-toggle').click(async () => {
        $('html').toggleClass('dark-mode')
    })
})
```
Don't forget to include the jQuery and `darkmode.js` scripts in your `<head>` tag.
```
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="darkmode.js"></script>
```
Now you can click the lightbulb button to toggle dark mode! Notice how the lightbulb icon turns on and off interactively. This is because we're using an `<i>` tag for the icon, which means our CSS property `color` affects it!
This code is really easy to understand. Whenever the user clicks on our `#dark-mode-toggle` button, we toggle the `dark-mode` class on our HTML, which in turn toggles the dark mode.

### Making it persistent
This is a great start. However, what happens if the user navigates to a new page on our website? They'd have to toggle dark mode every time they navigate to a new route, which isn't great UX, especially if their eyes were used to dark mode being active.
Let's use the [`localStorage` API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) to persist the user's dark mode preference. This means that once the user toggles dark mode, it will persist between page navigations, reloads, and even leaving the site. Let's revamp our jQuery.
```
// initialize dark mode
(async () => {
    let update = false
    if (localStorage.getItem('darkMode') === 'true') {
        if (!$('html').hasClass('dark-mode')) {
            update = true
        }
    } else {
        if ($('html').hasClass('dark-mode')) {
            update = true
        }
        localStorage.setItem('darkMode', 'false')
    }

    if (update === true) {
        $('html').toggleClass('dark-mode')
    }
})();

// toggle dark mode
$(document).ready(async () => {
    $('#dark-mode-toggle').click(async () => {
        if (localStorage.getItem('darkMode') === 'true') {
            localStorage.setItem('darkMode', 'false')
        } else {
            localStorage.setItem('darkMode', 'true')
        }
        $('html').toggleClass('dark-mode')
    })
})
```
There are two parts to this code. _First_, we initialize the property `darkMode` in the browser using JavaScript's `localStorage` functionality. Once the property is initialized, we can read from it to set the dark mode state. _Second_, we wire up the dark mode toggle button to read from and update the `darkMode` property. Now the user's preference is persistent as long as they don't clear their cookies!
>> Hold up! | **If I use `localStorage`, do I need to show one of those annoying cookie notifications on my website?**===<br>===Nope! Cookie notifications are generally for tracking users, not simply using `localStorage`. Read more [here](https://law.stackexchange.com/a/30766/8708) (IANAL, YMMV).


### Conclusion
With a few simple steps, we have a robust way of implementing dark mode for any website. You can access the full code from this post in [this JSFiddle](https://jsfiddle.net/wcarhart/kzgr1tja/40/) or [this repository](https://github.com/wcarhart/willcarh.art-snippets/tree/master/the-easy-way-to-add-dark-mode-to-your-website). The content of this tutorial is almost verbatim what I use for [willcarh.art]({{sys:home}}). If you'd like to see it in action, click the icon in the top right of the webpage, check out its [repository](https://github.com/wcarhart/willcarh.art), or simply press `⌘+i` or `Ctrl+i`.

=🦉