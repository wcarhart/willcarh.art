// This is an autogenerated file - DO NOT EDIT DIRECTLY
// This file was generated on Mon May 10 2021 14:26:08 GMT-0700 (Pacific Daylight Time) via the forge in willcarh.art v2.1.0
// Learn more: https://github.com/wcarhart/willcarh.art
// THIS IS A DEVELOPMENT BUILD, PROCEED WITH CAUTION

// prevent default when link icons are clicked - because some divs are clickable
$(document).ready(async () => {
	$('.link-icon-no-default').click((event) => {
		event.stopPropagation()
	})
})