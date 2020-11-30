{{sys:headerjs}}

// prevent default when link icons are clicked - because some divs are clickable
$(document).ready(async () => {
	$('.link-icon-no-default').click((event) => {
		event.stopPropagation()
	})
})