// This is an autogenerated file - DO NOT EDIT DIRECTLY
// This file was generated on Sun Nov 29 2020 20:00:28 GMT-0700 (Mountain Standard Time) via the forge in willcarh.art v2.0.0
// Learn more: https://github.com/wcarhart/willcarh.art

// jump to an anchor's scroll location on a page
$(document).ready(async () => {
	if (/#.*/.exec(window.location.pathname)) {
		let hash = /#.*/.exec(window.location.pathname)[0]
		window.scrollTo(getPosition(hash));
	}
})
