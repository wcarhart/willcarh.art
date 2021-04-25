// This is an autogenerated file - DO NOT EDIT DIRECTLY
// This file was generated on Sun Apr 25 2021 00:10:44 GMT-0700 (Pacific Daylight Time) via the forge in willcarh.art v2.1.0
// Learn more: https://github.com/wcarhart/willcarh.art
// THIS IS A DEVELOPMENT BUILD, PROCEED WITH CAUTION!

// make vault rows clickable
$(document).ready(async () => {
	$('.vault-row').hover(async function() {
		const titleEl = $(this).children('.vault-title')
		const typeEl = $(this).children('.vault-type')
		$(titleEl).css('background-size', '100% 0.125rem')
		$(typeEl).css('color', 'var(--color)')
		$(this).css('cursor', 'pointer')
	}, async function() {
		const titleEl = $(this).children('.vault-title')
		const typeEl = $(this).children('.vault-type')
		$(titleEl).css('background-size', '0% 0.125rem')
		$(typeEl).css('color', 'var(--subtitle)')
	})

	$('.vault-row').click(async function() {
		let href = $(this).children('.vault-link').text()
		console.log(href)
		window.location.href = href
	})
})
