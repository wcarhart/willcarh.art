{{sys:headerjs}}

// // jump to an anchor's scroll location on a page
// function scrollTo(hash) {
//     location.hash = "#" + hash;
// }

// scrollTo('experience')

$(document).ready(async () => {
	if (/#.*/.exec(window.location.pathname)) {
		let hash = /#.*/.exec(window.location.pathname)[0]
		window.scrollTo(getPosition(hash));
	}
})

// window.location = window.location.origin + window.location.pathname + '#experience';