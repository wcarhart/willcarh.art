// This is an autogenerated file - DO NOT EDIT DIRECTLY
// This file was generated on Sun Nov 29 2020 11:51:52 GMT-0700 (Mountain Standard Time) via the forge in willcarh.art v2.0.0
// Learn more: https://github.com/wcarhart/willcarh.art

// update text below blocks on homepage
$(document).ready(async () => {
	$('#home-about-container').hover(async () => {
		$('#more-information').fadeOut('fast', async () => {
			$('#tidbit-title').text('About')
			$('#tidbit-text').text('Learn more about me.')
			$('#more-information').fadeIn('fast', async () => {})
		})
	}, async () => {
		$('#more-information').fadeOut('fast', async () => {})
	})

	$('#home-projects-container').hover(async () => {
		$('#more-information').fadeOut('fast', async () => {
			$('#tidbit-title').text('Projects')
			$('#tidbit-text').text('See what I\'ve been working on.')
			$('#more-information').fadeIn('fast', async () => {})
		})
	}, async () => {
		$('#more-information').fadeOut('fast', async () => {})
	})

	$('#home-blog-container').hover(async () => {
		$('#more-information').fadeOut('fast', async () => {
			$('#tidbit-title').text('Blog')
			$('#tidbit-text').text('Read my blog.')
			$('#more-information').fadeIn('fast', async () => {})
		})
	}, async () => {
		$('#more-information').fadeOut('fast', async () => {})
	})
})
