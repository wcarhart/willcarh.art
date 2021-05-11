===
<div>
	<script>
		const typeText = async (id, text, delay) => {
			if (delay === 0) {
				$(id).text(text)
				return
			}
			let typedText = ''
			while (text.length >= typedText.length) {
				$(id).text(typedText)
				await new Promise(res => setTimeout(res, delay))
				typedText += text[typedText.length]
			}
		}
		const untypeText = async (id, text, delay) => {
			if (delay === 0) {
				$(id).text(text)
				return
			}
			let typedText = text
			while (typedText.length > 0) {
				$(id).text(typedText)
				await new Promise(res => setTimeout(res, delay))
				typedText = typedText.substring(0, typedText.length - 1)
			}
		}
		$(document).ready(async () => {
			let typewriterText = 'some text that automatically types itself?'
			do {
				await typeText('#typewriter-text-0', typewriterText, 75)
				await new Promise(res => setTimeout(res, 3*1000));
				await untypeText('#typewriter-text-0', typewriterText, 75)
			} while (true)
		})
		$(document).ready(async () => {
			let typewriterText = 'typing automatically!'
			do {
				await typeText('#typewriter-text-1', typewriterText, 75)
				await new Promise(res => setTimeout(res, 3*1000));
				await untypeText('#typewriter-text-1', typewriterText, 75)
			} while (true)
		})
		$(document).ready(async () => {
			let typewriterText = ['10','9','8','7','6','5','4','3','2','1','BOOM']
			let index = 0
			do {
				await typeText('#typewriter-text-2', typewriterText[index], 0)
				await new Promise(res => setTimeout(res, 500));
				await untypeText('#typewriter-text-2', typewriterText[index], 0)
				index += 1
				index = index % typewriterText.length
			} while (true)
		})
		$(document).ready(async () => {
			let typewriterText = [
				'guac lover.',
				'boba drinker.',
				'corgi snuggler.'
			]
			let index = 0
			do {
				await typeText('#typewriter-text-3', typewriterText[index], 75)
				await new Promise(res => setTimeout(res, 3*1000));
				await untypeText('#typewriter-text-3', typewriterText[index], 75)
				index += 1
				index = index % typewriterText.length
			} while (true)
		})
	</script>
	<style>
		[id^="typewriter-text-"] {
			color: var(--color) !important;
		}
	</style>
</div>
===
### The typewriter effect
Have you ever seen on a conversion page for a SaaS company and seen ===<span id="typewriter-text-0"></span>===
This effect is called the _typewriter effect_, and is a cool way of calling attention to some text on your webpage. Let's take a look at how we can implement this ourselves in just a few minutes.
>> Heads Up! | If you're looking for the complete sample code, check out [this JSFiddle](https://jsfiddle.net/wcarhart/cm18efbz/4/) or [this repository](https://github.com/wcarhart/willcarh.art-snippets/tree/master/how-to-create-the-typewriter-effect-in-javascript).


### Start with some interesting text
First, we'll need to decide what to type. We'll need some static text, like `Hi, my name is Will, and I'm a` and then we'll need some dynamic text to complete the sentence, like `software engineer`.
Let's make a basic HTML skeleton in a file called `index.html`.
```
<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <h1>Typewriter Effect Test</h1>
        <p>Hi, my name is Will, and I'm a <span id="typewriter-text"></span></p>
    </body>
</html>
```
We'll use the `#typewriter-text` element for our dynamic text.

### Target the dynamic text element
Next, we'll need to target our `#typewriter-text` element and change it dynamically. I'm going to use a little bit of [jQuery](https://jquery.com/) for brevity and simplicity, and because I'm already using it for the webpage on which the typewriter effect will appear, but you can replicate this with vanilla JavaScript fairly easily as well. Let's make a new file `typewriter.js`. First, we'll write some code to interact with our `#typewriter-text` element and tell it to type and untype dynamically. We'll use a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to wait for `3s` between typing and untyping, so the user can actually read our dynamic text.
```
$(document).ready(async () => {
    let typewriterText = 'software engineer.'
    do {
        await typeText('#typewriter-text', typewriterText)
        await new Promise(res => setTimeout(res, 3*1000));
        await untypeText('#typewriter-text', typewriterText)
    } while (true)
})
```
Next, we'll need to write the `typeText()` and `untypeText()` functions. For `typeText()`, we'll want to sequentially add letters to our `#typewriter-text` element until it becomes the desired dynamic text. Let's again use a Promise to slow down the typing speed. I'm using a delay of `75ms` between each typed character, but you can change the typing speed as desired by increasing or decreasing the delay.
```
const typeText = async (id, text) => {
    let typedText = ''
    let delay = 75
    while (text.length >= typedText.length) {
        $(id).text(typedText)
        await new Promise(res => setTimeout(res, delay))
        typedText += text[typedText.length]
    }
}
```
Now let's use the same logic for `untypeText()`.
```
const untypeText = async (id, text) => {
    let typedText = text
    let delay = 75
    while (typedText.length > 0) {
        $(id).text(typedText)
        await new Promise(res => setTimeout(res, delay))
        typedText = typedText.substring(0, typedText.length - 1)
    }
}
```
Great! Don't forget to link to `typewriter.js` in `index.html`.
Now our text is ===<span id="typewriter-text-1"></span>===

### Adding a circular queue of dynamic content
This is a great start. Now, what if we wanted the typed text to be even more dynamic?
For example, we could set up a countdown: ===<span id="typewriter-text-2"></span>===
Let's come up with a few more dynamic phrases for our typewriter text.
```
guac lover
boba drinker
corgi snuggler
```
Now, let's update our jQuery to rotate through our list of dynamic texts. We'll make our queue of texts circular, so it never runs out of content to type dynamically.
```
$(document).ready(async () => {
    let typewriterText = [
        'guac lover.',
        'boba drinker.',
        'corgi snuggler.'
    ]
    let index = 0
    do {
        await typeText('#typewriter-text', typewriterText[index])
        await new Promise(res => setTimeout(res, 3*1000));
        await untypeText('#typewriter-text', typewriterText[index])
        index += 1
        index = index % typewriterText.length
    } while (true)
})
```
Here's what the result looks like:
**Hi, my name is Will, and I'm a **===<span id="typewriter-text-3"></span>===

### Wrap up
There you have it, the typewriter effect done easy! You can download the complete code from this post from [this JSFiddle](https://jsfiddle.net/wcarhart/cm18efbz/4/) or [this repository](https://github.com/wcarhart/willcarh.art-snippets/tree/master/how-to-create-the-typewriter-effect-in-javascript). If you'd like more examples of the typewriter effect, check out the [home]({{src:index}}) and [about]({{src:about}}) pages. Now you're ready to create marketing homepages across the internet.

=🦉