{{sys:headerjs}}

// jump to an anchor's scroll location on a page
$(document).ready(async () => {
	if (/#.*/.exec(window.location.pathname)) {
		let hash = /#.*/.exec(window.location.pathname)[0]
		window.scrollTo(getPosition(hash));
	}
})
