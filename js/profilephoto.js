{{sys:headerjs}}

// rotate profile pictures on about page
$(document).ready(async () => {
	const photos = [
		'{{cdn:img/profile.jpg}}',
		'{{cdn:img/profile4.jpeg}}',
		'{{cdn:img/profile2.jpeg}}'
	]

	// preload images from CDN
	for (const photo of photos) {
		let img = new Image()
		img.src = photo
	}

	// rotate through images
	let index = 0
	do {
		await new Promise(res => setTimeout(res, 7*1000));
		let image = $('#profile-img')
		image.fadeOut('slow', async () => {
	        image.attr('src', photos[index])
	        image.fadeIn('slow')
	    })
		index += 1
		index = index % photos.length
	} while (true)

})