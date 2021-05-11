{{sys:headerjs}}

// handle clicks on project nav items
$(document).ready(async () => {
	$('#project-navigation-back').click(async function() {
		window.location.href = window.location.href.replace(/project.*$/, '{{src:projects.html}}')
	})
})
