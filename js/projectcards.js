// handle hover and click for project cards
$(document).ready(async () => {
	// handle animations for hover
	$('.project-container').hover(async function() {
		const id = `#title-${this.id.split('-').pop()}`
		$(id).css('background-size', '100% 0.125rem')
		$(this).css('cursor', 'pointer')
	}, async function() {
		const id = `#title-${this.id.split('-').pop()}`
		$(id).css('background-size', '0% 0.125rem')
	})

	// TODO
	// handle click to specific project
	$('.project-container').click(async function() {
		console.log(this.id)
	})
})
