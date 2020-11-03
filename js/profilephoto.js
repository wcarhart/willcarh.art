// rotate profile pictures on about page
$(document).ready(async () => {
	// const photos = [
	// 	'{{cdn:img/profile.jpg}}',
	// 	'{{cdn:img/...}}',
	// 	'{{cdn:img/...}}'
	// ]

	const photos = [
		'https://storage.googleapis.com/willcarh-art/img/profile.jpg',
		'https://storage.googleapis.com/willcarh-art/img/profile4.jpeg',
		'https://storage.googleapis.com/willcarh-art/img/profile2.jpeg'
	]

	let index = 0
	do {
		let image = $('#profile-img')
		image.fadeOut('slow', async () => {
	        image.attr('src', photos[index])
	        image.fadeIn('slow')
	    })
		await new Promise(res => setTimeout(res, 7*1000));
		index += 1
		index = index % photos.length
	} while (true)

})