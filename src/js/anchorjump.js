// This is an autogenerated file - DO NOT EDIT DIRECTLY
// This file was generated on Tue Dec 01 2020 02:30:32 GMT-0800 (Pacific Standard Time) via the forge in willcarh.art v2.0.0
// Learn more: https://github.com/wcarhart/willcarh.art
// THIS IS A DEVELOPMENT BUILD, PROCEED WITH CAUTION!

// jump to an anchor's scroll location on a page
$(document).ready(async () => {
	if (/#.*/.exec(window.location.pathname)) {
		let hash = /#.*/.exec(window.location.pathname)[0]
		window.scrollTo(getPosition(hash));
	}
})
