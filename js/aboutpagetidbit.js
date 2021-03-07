{{sys:headerjs}}

// update text below blocks on about page
$(document).ready(async () => {
	// handle projects bubble hover
	$('#about-projects-container').hover(async () => {
		$('#tidbit-title').text('Projects')
		$('#tidbit-text').text('See what I\'ve been working on.')
		$('#more-information').animate({'opacity': 100}, 'fast', async () => {})
	}, async () => {
		$('#more-information').animate({'opacity': 0}, 'fast')
		$('#tidbit-title').html('&nbsp;')
		$('#tidbit-text').html('&nbsp;')
	})

	// handle blog bubble hover
	$('#about-blog-container').hover(async () => {
		$('#tidbit-title').text('Blog')
		$('#tidbit-text').text('Read my blog.')
		$('#more-information').animate({'opacity': 100}, 'fast', async () => {})
	}, async () => {
		$('#more-information').animate({'opacity': 0}, 'fast')
		$('#tidbit-title').html('&nbsp;')
		$('#tidbit-text').html('&nbsp;')
	})
})
