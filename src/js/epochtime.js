// This is an autogenerated file - DO NOT EDIT DIRECTLY
// This file was generated on Wed Dec 02 2020 02:11:40 GMT-0800 (Pacific Standard Time) via the forge in willcarh.art v2.0.0
// Learn more: https://github.com/wcarhart/willcarh.art
// THIS IS A DEVELOPMENT BUILD, PROCEED WITH CAUTION!

// convert timestamp to epoch time on hover
$(document).ready(async () => {
	let originalText = ''
	$('.epochtime-hover').hover(async function() {
		originalText = $(this).text()
		let width = $(this).width()
		let datetime = $(this).text()
			.replace(/^Published on /, '')
			.replace(/^Updated on /, '')
			.replace(/,/g, '')
			.replace(/at /g, '')
			.replace(/([0-9])+(st|nd|rd|th)/g, '$1')
		let epochtime = Date.parse(datetime) / 1000
		if (!isNaN(epochtime)) {
			$(this).css('cursor', 'crosshair')
			$(this).width(width)
			$(this).text(`${epochtime} seconds since the epoch`)
		}
	}, async function() {
		$(this).text(originalText)
	})
})