// This is an autogenerated file - DO NOT EDIT DIRECTLY
// This file was generated on Sun Nov 29 2020 15:59:03 GMT-0700 (Mountain Standard Time) via the forge in willcarh.art v2.0.0
// Learn more: https://github.com/wcarhart/willcarh.art

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
})
