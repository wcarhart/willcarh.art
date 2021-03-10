// This is an autogenerated file - DO NOT EDIT DIRECTLY
// This file was generated on Tue Mar 09 2021 23:11:33 GMT-0800 (Pacific Standard Time) via the forge in willcarh.art v2.0.0
// Learn more: https://github.com/wcarhart/willcarh.art
// THIS IS A DEVELOPMENT BUILD, PROCEED WITH CAUTION!

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
