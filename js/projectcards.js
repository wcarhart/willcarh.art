{{sys:headerjs}}

// handle hover and click for project cards
$(document).ready(async () => {

	// TODO: why does this fail when doing hard refresh
	await resizeProjectContainers()
	// TODO: fix this garbage, doesn't call function when window is resized
	$(window).resize(async () => { 
		await resizeProjectContainers()
	})

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

// TODO: do we need this for resizing after DOM is ready?
// $(window).on('load', function() { });

const resizeProjectContainers = async () => {
	// calculate dynamic row heights
	let miniTopHeight = 0
	let miniBottomHeight = 0
	for (let el of $('.proj-mini-top')) {
		if ($(el).height() > miniTopHeight) {
			miniTopHeight = $(el).height()
		}
	}
	for (let el of $('.proj-mini-bottom')) {
		if ($(el).height() > miniBottomHeight) {
			miniBottomHeight = $(el).height()
		}
	}

	// update row heights
	for (let el of $('.proj-mini-top')) {
		$(el).height(miniTopHeight)
	}
	for (let el of $('.proj-mini-bottom')) {
		$(el).height(miniBottomHeight)
	}
	// spacer small is 2rem, and 1rem = 16px - need to add 4.5rem (72px) for spacing
	$('.proj-main').height(miniTopHeight + 72 + miniBottomHeight)
	$('.proj-main').css('padding-top', '2rem')
}
