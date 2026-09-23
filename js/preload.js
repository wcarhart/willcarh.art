{{sys:headerjs}}

// images to preload
const photos = {{sys:preload}}

// preload local images
for (const photo of photos) {
	let img = new Image()
	img.src = photo
}
