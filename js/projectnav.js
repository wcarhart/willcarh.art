{{sys:headerjs}}

// handle clicks on project nav items
$(document).ready(async () => {
	const develop = '{{sys:develop}}'

	$('#project-navigation-back').click(async function() {
		let fullPath = '{{{{src:projects'
		if (develop === 'true') {
			fullPath += '.html'
		}
		fullPath += '}}'
		window.location.href = window.location.href.replace(/project.*$/, fullPath)
	})
})
