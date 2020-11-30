{{sys:headerjs}}

// dynamically update items on etc page

$(document).ready(async () => {
	$('#color-palette-color-background').text(rgb2hex($('#color-palette-color-background').css('color')))
	$('#color-palette-color-detail').text(rgb2hex($('#color-palette-color-detail').css('color')))
	$('#color-palette-color-subtitle').text(rgb2hex($('#color-palette-color-subtitle').css('color')))
	$('#color-palette-color-color').text(rgb2hex($('#color-palette-color-color').css('color')))
	$('#color-palette-color-text').text(rgb2hex($('#color-palette-color-text').css('color')))
})

function rgb2hex(rgb) {
	rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	function hex(x) {
		return ("0" + parseInt(x).toString(16)).slice(-2);
	}
	return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}