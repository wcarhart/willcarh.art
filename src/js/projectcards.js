// This is an autogenerated file - DO NOT EDIT DIRECTLY
// This file was generated on Mon Mar 08 2021 15:50:25 GMT-0800 (Pacific Standard Time) via the forge in willcarh.art v2.0.0
// Learn more: https://github.com/wcarhart/willcarh.art
// THIS IS A DEVELOPMENT BUILD, PROCEED WITH CAUTION!

// handle hover and click for project cards
$(document).ready(async () => {

	// handle animations for hover
	$('.project-border').hover(async function() {
		console.log(this.id)
		const id = `#title-${this.id.replace('proj-', '')}`
		$(id).css('background-size', '100% 0.125rem')
		$(this).css('cursor', 'pointer')
	}, async function() {
		const id = `#title-${this.id.replace('proj-', '')}`
		$(id).css('background-size', '0% 0.125rem')
	})

	// handle click to specific project
	// if a file name contains ('.'), like 'willcarh.art', we use '-----' to replace it
	// it's not a bulletproof approach, but it's unlikely a project name will naturally contain the string '----'
	$('.project-border').click(async function() {
		const name = this.id.replace('proj-', '').replace('super-', '').replace('featured-', '').replace('----', '.')
		window.location.href=`project/${name}.html`
	})

	// resize the project containers after the page loads
	await resizeProjectContainers()
	// TODO: fix this garbage, doesn't call function when window is resized
	$(window).resize(async () => { 
		await resizeProjectContainers()
	})
})

const resizeProjectContainers = async () => {

	// wait for page to settle
	await new Promise(r => setTimeout(r, 500));

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
