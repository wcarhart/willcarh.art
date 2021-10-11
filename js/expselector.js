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

// handle new click on experience (mobile)
$(document).ready(async () => {
	$('.mobile-exp-tab').click(selectExperienceMobile)
})

function selectExperienceMobile() {
	// get our selected experience
	let exp = this.id.split('-').pop()

	// toggle tab
	const tabs = $('.mobile-exp-tab')
	for (let t of tabs) {
		$(t).removeClass('mobile-exp-tab-active')
	}
	$(`#mobile-exp-tab-${exp}`).addClass('mobile-exp-tab-active')

	// toggle details
	const details = $('.mobile-exp-details')
	for (let d of details) {
		$(d).removeClass('mobile-exp-details-active')
	}
	$(`#mobile-exp-details-${exp}`).addClass('mobile-exp-details-active')
}

// set up edge fading on mobile exp tabs
$(document).ready(async () => {
	$('#exp-tabs-mobile').on('scroll', function() {
		let scrollPercentage = 100 * this.scrollLeft / (this.scrollWidth-this.clientWidth);
		if (scrollPercentage === 0.0) {
			$('#edge-container').removeClass()
			$('#edge-container').addClass('right-edge')
		} else if (scrollPercentage === 100.0) {
			$('#edge-container').removeClass()
			$('#edge-container').addClass('left-edge')
		} else {
			$('#edge-container').removeClass()
			$('#edge-container').addClass('both-edge')
		}
	})
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
