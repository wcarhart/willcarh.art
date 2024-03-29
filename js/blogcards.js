{{sys:headerjs}}

// handle clicks and resizing
$(document).ready(async () => {
	const develop = '{{sys:develop}}'
	$('.blog-border').click(async function() {
		let blog = this.id.replace(/^blog-card-/, '')
		blog = blog.replace(/^latest-/, '')
		let fullPath = `blog/${blog}`
		if (develop === 'true') {
			fullPath += '.html'
		}
		window.location.href = fullPath
	})

	// don't resize cards on mobile
	if ($(window).width() < 480) {
		return
	}

	// resize cards
	await resizeBlogCards()
	$(window).resize(async () => {
		await resizeBlogCards()
	})
})

// resize blog cards based on screen size
const resizeBlogCards = async () => {

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