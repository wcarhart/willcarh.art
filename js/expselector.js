{{sys:headerjs}}

// toggle experience modals on about page

// init tabs
$(document).ready(async () => {
	// if URL contains query parameter 'exp', we want to switch to that experience tab
	let urlParams = new URLSearchParams(window.location.search)
	if (urlParams.has('exp')) {
		selectExperience({'override': urlParams.get('exp')})
	}

	// dynamically update div height after selecting experience
	$('#exp-content-container').css('height', $('.exp-active').height())
})

// handle new click on experience
$(document).ready(async () => {
	$('.exp-selector').click(selectExperience)
})

function selectExperience({override=''}) {
	// get our selected experience
	let exp = ''
	if (override === '') {
		exp = this.id.split('-').pop()
	} else {
		exp = override
	}

	// toggle selectors
	const selectors = $('.exp-selector')
	for (let s of selectors) {
		$(s).removeClass('exp-selector-active')
	}
	$(`#exp-selector-${exp}`).addClass('exp-selector-active')

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
}
