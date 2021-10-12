{{sys:headerjs}}

// dynamically update items on etc page

$(document).ready(async () => {
	// dynamically add color hex values based on page color
	await updateColorSwatch()
	$('#dark-mode-toggle').click(async () => {
		await updateColorSwatch()
	})
})

// update the color swatch items
const updateColorSwatch = async () => {
	// standard
	$('#color-palette-color-background').text(await rgb2hex($('#color-palette-color-background').css('color')))
	$('#color-palette-color-detail').text(await rgb2hex($('#color-palette-color-detail').css('color')))
	$('#color-palette-color-subtitle').text(await rgb2hex($('#color-palette-color-subtitle').css('color')))
	$('#color-palette-color-color').text(await rgb2hex($('#color-palette-color-color').css('color')))
	$('#color-palette-color-text').text(await rgb2hex($('#color-palette-color-text').css('color')))

	// mobile
	$('#color-palette-color-background-mobile').text(await rgb2hex($('#color-palette-color-background-mobile').css('color')))
	$('#color-palette-color-detail-mobile').text(await rgb2hex($('#color-palette-color-detail-mobile').css('color')))
	$('#color-palette-color-subtitle-mobile').text(await rgb2hex($('#color-palette-color-subtitle-mobile').css('color')))
	$('#color-palette-color-color-mobile').text(await rgb2hex($('#color-palette-color-color-mobile').css('color')))
	$('#color-palette-color-text-mobile').text(await rgb2hex($('#color-palette-color-text-mobile').css('color')))
}

// convert RGB to hex color values
const rgb2hex = async (rgb) => {
	rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	function hex(x) {
		return ("0" + parseInt(x).toString(16)).slice(-2);
	}
	return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}
