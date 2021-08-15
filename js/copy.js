{{sys:headerjs}}

// handle copy when code block is clicked
$(document).ready(async () => {
	// handle click on copy button
	$('.codeblock-copy-icon').click(async function() {

		// get parent of clicked
		const PRE = $(this).parent()
		let text = PRE.children()[1].innerText

		// copy text from <pre><code> to clipboard
		navigator.clipboard.writeText(text).then(async function() {
			console.log('Copied code to clipboard')

			// if dark mode when click
			if ($('html').hasClass('dark-mode')) {
				PRE.children()[0].style.backgroundImage = 'url("../ico/copy-dark-full.png")'
				await new Promise(r => setTimeout(r, 2000))

				// if dark mode after sleeping
				if ($('html').hasClass('dark-mode')) {
					PRE.children()[0].style.backgroundImage = 'url("../ico/copy-dark.png")'
				} else {
					PRE.children()[0].style.backgroundImage = 'url("../ico/copy-light.png")'
				}

			// if light mode when click
			} else {
				PRE.children()[0].style.backgroundImage = 'url("../ico/copy-light-full.png")'
				await new Promise(r => setTimeout(r, 2000))

				// if light mode after sleeping
				if ($('html').hasClass('dark-mode')) {
					PRE.children()[0].style.backgroundImage = 'url("../ico/copy-dark.png")'
				} else {
					PRE.children()[0].style.backgroundImage = 'url("../ico/copy-light.png")'
				}
			}
		}, async function(err) {
			console.error('Could not copy code to clipboard', err)

			// if could not copy, display error icon
			PRE.children()[0].style.backgroundImage = 'url("../ico/copy-error.png")'
			await new Promise(r => setTimeout(r, 2000))

			// we don't need to check dark mode twice here because there is only one error icon regardless of dark mode
			if ($('html').hasClass('dark-mode')) {
				PRE.children()[0].style.backgroundImage = 'url("../ico/copy-dark.png")'
			} else {
				PRE.children()[0].style.backgroundImage = 'url("../ico/copy-light.png")'
			}
		})
	})

	// if the dark mode changes, we need to fix all our icons
	$('#dark-mode-toggle').click(async () => {
		let darkMode = $('html').hasClass('dark-mode')
		let pres = document.querySelectorAll('.codeblock-copy-icon')
		for (let pre of pres) {
			if (darkMode) {
				pre.style.backgroundImage = 'url("../ico/copy-dark.png")'
			} else {
				pre.style.backgroundImage = 'url("../ico/copy-light.png")'
			}
		}
	})
})
