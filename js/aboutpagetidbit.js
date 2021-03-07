{{sys:headerjs}}

// update text below blocks on about page
$(document).ready(async () => {
	$('#about-projects-container').hover(async () => {
		$('#more-information').fadeOut('fast', async () => {
			$('#tidbit-title').text('Projects')
			$('#tidbit-text').text('See what I\'ve been working on.')
			$('#more-information').fadeIn('fast', async () => {})
		})
	}, async () => {
		$('#more-information').fadeOut('fast', async () => {})
	})

	$('#about-blog-container').hover(async () => {
		$('#more-information').fadeOut('fast', async () => {
			$('#tidbit-title').text('Blog')
			$('#tidbit-text').text('Read my blog.')
			$('#more-information').fadeIn('fast', async () => {})
		})
	}, async () => {
		$('#more-information').fadeOut('fast', async () => {})
	})
})
