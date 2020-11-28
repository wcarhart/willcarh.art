{{sys:headerjs}}

$(document).ready(async () => {
	// TODO: add underline to titles on blog cards
	// TODO: handle clicks on individual blog cards

	await resizeBlogCards()
	// TODO: verify this actually works
	$(window).resize(async () => {
		await resizeBlogCards()
	})
})

const resizeBlogCards = async () => {

	// TODO: fix this, it's janky af
	// wait for page to settle
	await new Promise(r => setTimeout(r, 500));

	// re-size cards in rows one at a time
	let index = -1
	do {
		// start with row 0
		index += 1

		// calculate dynamic row heights
		let maxRowHeight = 0
		let rowHeights = []
		for (let el of $(`.blog-row-${index}`)) {
			let height = $(el).height()
			if (height > maxRowHeight) {
				maxRowHeight = height
			}
			rowHeights.push(height)
		}

		// update row heights
		for (let columnIndex = 0; columnIndex < 2; columnIndex++) {
			let finalIndex = index*2 + columnIndex
			let height = rowHeights[columnIndex]
			if (height < maxRowHeight) {
				// we add 1rem to the additional height because that's how much margin there was to begin with
				$(`#blog-spacer-${finalIndex}`).css('margin-bottom', 16 + maxRowHeight - height)
			}
		}

	} while ($(`.blog-row-${index+1}`).length !== 0)
}