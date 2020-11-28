// This is an autogenerated file - DO NOT EDIT DIRECTLY
// This file was generated on Sat Nov 28 2020 16:29:34 GMT-0700 (Mountain Standard Time) via the forge in willcarh.art v2.0.0
// Learn more: https://github.com/wcarhart/willcarh.art

// handle hover and click for demo rows
$(document).ready(async () => {
	// TODO: handle cases where HTML class has nonalphanumeric character (e.g. willcarh.art)
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

	// TODO
	// handle click to specific demo
	$('.demo-border').click(async function() {
		console.log(this.id)
	})
})