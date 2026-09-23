{{sys:headerjs}}

// rotate profile pictures on about page
$(document).ready(async () => {

	// registered photos
	const photos = [
		'{{asset:img/profile.jpg}}',
		'{{asset:img/profile4.jpeg}}',
		'{{asset:img/profile2.jpeg}}',
		'{{asset:img/profile6.jpg}}'
	]

	// preload local images
	for (const photo of photos) {
		let img = new Image()
		img.src = photo
	}

	// rotate through images
	let index = 0
	do {
		await new Promise(res => setTimeout(res, 7*1000));
		let image = $('#profile-img')
		let imageMobile = $('#profile-img-mobile')
		image.fadeOut('slow', async () => {
			image.attr('src', photos[index])
			image.fadeIn('slow')
		})
		imageMobile.fadeOut('slow', async () => {
			imageMobile.attr('src', photos[index])
			imageMobile.fadeIn('slow')
		})
		index += 1
		index = index % photos.length
	} while (true)

})