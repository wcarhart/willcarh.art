// This is an autogenerated file - DO NOT EDIT DIRECTLY
// This file was generated on Thu Nov 12 2020 10:54:25 GMT-0800 (Pacific Standard Time) via the forge in willcarh.art v2.0.0
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
