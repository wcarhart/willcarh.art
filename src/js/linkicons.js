// This is an autogenerated file - DO NOT EDIT DIRECTLY
// This file was generated on Fri May 07 2021 18:14:54 GMT-0700 (Pacific Daylight Time) via the forge in willcarh.art v2.1.0
// Learn more: https://github.com/wcarhart/willcarh.art
// THIS IS A DEVELOPMENT BUILD, PROCEED WITH CAUTION!

// prevent default when link icons are clicked - because some divs are clickable
$(document).ready(async () => {
	$('.link-icon-no-default').click((event) => {
		event.stopPropagation()
	})
})