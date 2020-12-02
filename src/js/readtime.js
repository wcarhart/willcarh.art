// This is an autogenerated file - DO NOT EDIT DIRECTLY
// This file was generated on Wed Dec 02 2020 02:11:40 GMT-0800 (Pacific Standard Time) via the forge in willcarh.art v2.0.0
// Learn more: https://github.com/wcarhart/willcarh.art
// THIS IS A DEVELOPMENT BUILD, PROCEED WITH CAUTION!

// convert read time to word count on hover
$(document).ready(async () => {
	$('.readtime-hover').hover(async function() {
		let wordCount = $('#word-count').text()
		originalHtml = $(this).html()
		if (wordCount !== '') {
			$(this).html(`<span class="color">~${wordCount} words</span>`)
			$(this).css('cursor', 'crosshair')
		}
	}, async function() {
		$(this).html(`<span class="color">${$('#read-time').text()}</span>`)
	})
})