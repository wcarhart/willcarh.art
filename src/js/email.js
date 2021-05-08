// This is an autogenerated file - DO NOT EDIT DIRECTLY
// This file was generated on Fri May 07 2021 18:23:55 GMT-0700 (Pacific Daylight Time) via the forge in willcarh.art v2.1.0
// Learn more: https://github.com/wcarhart/willcarh.art
// THIS IS A DEVELOPMENT BUILD, PROCEED WITH CAUTION!

// update copy email button based on hover and click
$(document).ready(async () => {
	let copyStatus = false
	let animated = false
	$('#email-contact').hover(async () => {
		if (!copyStatus && !animated) {
			$('#email-contact span').fadeOut( "fast", async () => {
				$('#email-contact span').html('<span>copy email &nbsp;✉️</span>')
				$('#email-contact span').fadeIn( "fast", async () => {
					animated = true
				})
			})
		}
	}, async () => {
		if (!copyStatus) {
			$('#email-contact span').fadeOut( "fast", async () => {
				$('#email-contact span').html('<span>say hello &nbsp;👋</span>')
				$('#email-contact span').fadeIn( "fast", async () => {
					animated = false
				})
			})
		}
	})
	$('#email-contact').click(async () => {
		copyStatus = true
		const el = document.createElement('textarea')
		el.value = 'hello@willcarh.art'
		el.setAttribute('readonly', '')
		el.style.position = 'absolute'
		el.style.left = '-9999px'
		document.body.appendChild(el)
		el.select()
		document.execCommand('copy')
		document.body.removeChild(el)
		$('#email-contact span').html('<span>copied &nbsp;✓</span>')
		await new Promise(res => setTimeout(res, 2000))
		$('#email-contact span').fadeOut( "fast", async () => {
			$('#email-contact span').html('<span>say hello &nbsp;👋</span>')
			$('#email-contact span').fadeIn( "fast", async () => {
				copyStatus = false
				animated = false
			})
		})
	})
})