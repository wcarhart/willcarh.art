// rotate profile pictures on about page
$(document).ready(async () => {
	const photos = [
		'{{cdn:img/profile.jpg}}',
		'{{cdn:img/profile4.jpeg}}',
		'{{cdn:img/profile2.jpeg}}'
	]

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