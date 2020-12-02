// This is an autogenerated file - DO NOT EDIT DIRECTLY
// This file was generated on Wed Dec 02 2020 02:11:40 GMT-0800 (Pacific Standard Time) via the forge in willcarh.art v2.0.0
// Learn more: https://github.com/wcarhart/willcarh.art
// THIS IS A DEVELOPMENT BUILD, PROCEED WITH CAUTION!

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
	$('#color-palette-color-background').text(await rgb2hex($('#color-palette-color-background').css('color')))
	$('#color-palette-color-detail').text(await rgb2hex($('#color-palette-color-detail').css('color')))
	$('#color-palette-color-subtitle').text(await rgb2hex($('#color-palette-color-subtitle').css('color')))
	$('#color-palette-color-color').text(await rgb2hex($('#color-palette-color-color').css('color')))
	$('#color-palette-color-text').text(await rgb2hex($('#color-palette-color-text').css('color')))
}

// convert RGB to hex color values
const rgb2hex = async (rgb) => {
	rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	function hex(x) {
		return ("0" + parseInt(x).toString(16)).slice(-2);
	}
	return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}
