// This is an autogenerated file - DO NOT EDIT DIRECTLY
// This file was generated on Wed Nov 25 2020 23:32:23 GMT-0700 (Mountain Standard Time) via the forge in willcarh.art v2.0.0
// Learn more: https://github.com/wcarhart/willcarh.art

// rotate profile pictures on about page
$(document).ready(async () => {
	const photos = [
		'https://storage.googleapis.com/willcarh-art/img/profile.jpg',
		'https://storage.googleapis.com/willcarh-art/img/profile4.jpeg',
		'https://storage.googleapis.com/willcarh-art/img/profile2.jpeg'
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