{{sys:headerjs}}

// handle hover and click for project cards
$(document).ready(async () => {

	// resize the project containers after the page loads
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

const resizeProjectContainers = async () => {

	// TODO: fix this, it's janky af
	// wait for page to settle
	await new Promise(r => setTimeout(r, 100));

	// re-size columns in featured rows one at a time
	let index = -1
	do {
		// start with row 0
		index += 1

		// calculate dynamic row heights
		let miniTopHeight = 0
		let miniBottomHeight = 0
		for (let el of $(`.proj-row-${index}.proj-mini-top`)) {
			if ($(el).height() > miniTopHeight) {
				miniTopHeight = $(el).height()
			}
		}
		for (let el of $(`.proj-row-${index}.proj-mini-bottom`)) {
			if ($(el).height() > miniBottomHeight) {
				miniBottomHeight = $(el).height()
			}
		}

		// update row heights
		for (let el of $(`.proj-row-${index}.proj-mini-top`)) {
			$(el).height(miniTopHeight)
		}
		for (let el of $(`.proj-row-${index}.proj-mini-bottom`)) {
			$(el).height(miniBottomHeight)
		}

		// need to update super (featured) project too
		// spacer small is 2rem, and 1rem = 16px - need to add 4.5rem (72px) for spacing
		$(`.proj-row-${index}.proj-main`).height(miniTopHeight + 72 + miniBottomHeight)
		$(`.proj-row-${index}.proj-main`).css('padding-top', '2rem')

	} while ($(`.proj-row-${index+1}`).length !== 0)

	// re-size columns in normal rows one at a time
	index = -1
	do {
		// continue from featured rows
		index += 1

		// calculate dynamic row heights
		let height = 0
		for (let el of $(`.proj-normal-row-${index}.proj-normal`)) {
			if ($(el).height() > height) {
				height = $(el).height()
			}
		}

		// update row heights
		for (let el of $(`.proj-normal-row-${index}.proj-normal`)) {
			$(el).height(height)
		}
	} while ($(`.proj-row-${index+1}`).length !== 0)
}
