// This is an autogenerated file - DO NOT EDIT DIRECTLY
// This file was generated on Fri Mar 12 2021 16:32:54 GMT-0800 (Pacific Standard Time) via the forge in willcarh.art v2.1.0
// Learn more: https://github.com/wcarhart/willcarh.art
// THIS IS A DEVELOPMENT BUILD, PROCEED WITH CAUTION!

// set up dark mode

// init dark mode
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