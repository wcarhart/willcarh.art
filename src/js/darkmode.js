// This is an autogenerated file - DO NOT EDIT DIRECTLY
// This file was generated on Thu Nov 26 2020 23:36:52 GMT-0700 (Mountain Standard Time) via the forge in willcarh.art v2.0.0
// Learn more: https://github.com/wcarhart/willcarh.art

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