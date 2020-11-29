{{sys:headerjs}}

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