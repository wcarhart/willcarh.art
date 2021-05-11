{{sys:headerjs}}

// handle clicks on blog nav items
$(document).ready(async () => {
	$('#blog-navigation-back').click(async function() {
		window.location.href = window.location.href.replace(/blog.*$/, '{{src:blog.html}}')
	})

	$('#blog-navigation-next').click(async function() {
		let nextPost = $('#next-blog-link').text()
		window.location.href = window.location.href.replace(/blog.*$/, `blog/${nextPost}.html`)
	})
})
