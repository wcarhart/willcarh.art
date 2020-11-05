// handle hover and click for project cards
$(document).ready(async () => {
	// handle animations for hover
	$('.project-border').hover(async function() {
		const id = `#title-${this.id.replace('proj-', '')}`
		$(id).css('background-size', '100% 0.125rem')
		$(this).css('cursor', 'pointer')
	}, async function() {
		const id = `#title-${this.id.replace('proj-', '')}`
		$(id).css('background-size', '0% 0.125rem')
	})

	// TODO
	// handle click to specific project
	$('.project-border').click(async function() {
		console.log(this.id)
	})
})
