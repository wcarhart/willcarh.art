// Update tagline text in HTML

// type out new text
const typeText = async (id, text) => {
	let typedText = ''
	while (text.length !== typedText.length) {
		$(id).text(typedText)
		await new Promise(res => setTimeout(res, 100))
		typedText += text[typedText.length]
	}
}

// backspace old text
const untypeText = async (id, text) => {
	let typedText = text
	while (typedText.length > 0) {
		$(id).text(typedText)
		await new Promise(res => setTimeout(res, 100))
		typedText = typedText.substring(0, typedText.length - 1)
	}
}

// taglines for 'about' page
const aboutTaglines = [
	'cool ',
	'exciting ',
	'impactful ',
	'well tested ',
	'maintainable ',
	'dynamic ',
	'robust ',
	'simple, clean ',
	'well documented ',
	'powerful ',
	'quirky ',
	'modern ',
	'user friendly ',
	'reliable ',
	'fun ',
	'performant ',
	'mission critical ',
	'secure ',
	'customer oriented ',
	'revolutionary ',
	'modular ',
	'dependable '
]

// taglines for 'home' page
const homeTaglines = [
	'a software engineer. ',
	'a tinkerer. ',
	'a solver of problems. ',
	'a full-stack developer. ',
	'a Hacker News lurker. ',
	'a night owl coder. ',
	'a bash addict. ',
	'a lifelong learner. ',
	'an internet denizen. ',
	'a practicer of radical empathy. ',
	'a daily boba drinker. ',
	'a proud owner of too many monsteras. ',
	'a ukulele aficionado. ',				
	'a rubix cube fan. ',
	'an outdoorsman. ',
	'a wearer of fuzzy socks. ',
	'a lover of cats and dogs. ',
	'a sidecar enthusiast. ',
	'a sucker for a good sunrise. ',
	'a passionate feminist. ',
	'an adventurous cook and eater. ',
	'a budding woodworker and DIY\'er. '
]

// update taglines
$(document).ready(async () => {
	let taglines = null
	if (window.location.pathname.split('/').pop().includes('about')) {
		taglines = aboutTaglines
	} else {
		taglines = homeTaglines
	}
	let index = 0
	do {
		await typeText('#tagline', taglines[index])
		await new Promise(res => setTimeout(res, 3*1000));
		await untypeText('#tagline', taglines[index])
		index += 1
		index = index % taglines.length
	} while (true)
})