{{sys:headerjs}}

// toggle experience modals on about page

// init tabs
$(document).ready(async () => {
	$('#exp-content-container').css('height', $('.exp-active').height())
})

// handle new click on experience
$(document).ready(async () => {
	$('.exp-selector').click(function() {

		// get our selected experience
		const exp = this.id.split('-').pop()

		// toggle selectors
		const selectors = $('.exp-selector')
		for (let s of selectors) {
			$(s).removeClass('exp-selector-active')
		}
		$(this).addClass('exp-selector-active')

		// toggle content
		const content = $('.exp-content')
		for (let c of content) {
			$(c).removeClass('exp-active')
			$(c).addClass('exp-hidden')
		}
		$(`#exp-details-${exp}`).removeClass('exp-hidden')
		$(`#exp-details-${exp}`).addClass('exp-active')

		// set height of content container
		$('#exp-content-container').css('height', $(`#exp-details-${exp}`).height())
	})
})