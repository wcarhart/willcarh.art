{{sys:headerjs}}

// handle hover and click for demo rows
$(document).ready(async () => {
	const develop = '{{sys:develop}}'
	// handle animations for hover
	$('.demo-border').hover(async function() {
		const project = this.id.replace('demo-', '')
		$(`#title-${project}`).css('background-size', '100% 0.125rem')
		$(this).css('cursor', 'pointer')
		$(`#more-${project}`).fadeOut('fast', async () => {
			$(`#more-${project}`).html('See demo <span class="arrow">⟶</span>')
			$(`#more-${project}`).fadeIn('fast', async () => {})
		})
	}, async function() {
		const project = this.id.replace('demo-', '')
		$(`#title-${project}`).css('background-size', '0% 0.125rem')
		$(`#more-${project}`).fadeOut('fast', async () => {
			$(`#more-${project}`).html('')
		})
	})

	// handle click to specific demo
	$('.demo-border').click(async function() {
		const name = this.id.replace('demo-', '').replace('----', '.')
		let fullPath = `demo/${name}`
		if (develop === 'true') {
			fullPath += '.html'
		}
		window.location.href = fullPath
	})
})