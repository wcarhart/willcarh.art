// This is an autogenerated file - DO NOT EDIT DIRECTLY
// This file was generated on Tue Mar 09 2021 21:30:29 GMT-0800 (Pacific Standard Time) via the forge in willcarh.art v2.0.0
// Learn more: https://github.com/wcarhart/willcarh.art
// THIS IS A DEVELOPMENT BUILD, PROCEED WITH CAUTION!

// handle hover and click for demo rows
$(document).ready(async () => {
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
		window.location.href=`demo/${name}.html`
	})
})