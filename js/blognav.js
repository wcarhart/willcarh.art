{{sys:headerjs}}

// handle clicks on blog nav items
$(document).ready(async () => {
	const develop = '{{sys:develop}}'

	$('#blog-navigation-back').click(async function() {
		let fullPath = 'blog'
		if (develop === 'true') {
			fullPath += '.html'
		}
		window.location.href = window.location.href.replace(/blog.*$/, fullPath)
	})

	$('#blog-navigation-back-mobile').click(async function() {
		let fullPath = 'blog'
		if (develop === 'true') {
			fullPath += '.html'
		}
		window.location.href = window.location.href.replace(/blog.*$/, fullPath)
	})

	$('#blog-navigation-next').click(async function() {
		let nextPost = $('#next-blog-link').text()
		let fullPath = `blog/${nextPost}`
		if (develop === 'true') {
			fullPath += '.html'
		}
		window.location.href = window.location.href.replace(/blog.*$/, fullPath)
	})

	$('#blog-navigation-next-mobile').click(async function() {
		let nextPost = $('#next-blog-link').text()
		let fullPath = `blog/${nextPost}`
		if (develop === 'true') {
			fullPath += '.html'
		}
		window.location.href = window.location.href.replace(/blog.*$/, fullPath)
	})
})
