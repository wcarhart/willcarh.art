// This is an autogenerated file - DO NOT EDIT DIRECTLY
// This file was generated on Mon Mar 08 2021 04:01:52 GMT-0800 (Pacific Standard Time) via the forge in willcarh.art v2.0.0
// Learn more: https://github.com/wcarhart/willcarh.art
// THIS IS A DEVELOPMENT BUILD, PROCEED WITH CAUTION!

// prevent default when link icons are clicked - because some divs are clickable
$(document).ready(async () => {
	$('.link-icon-no-default').click((event) => {
		event.stopPropagation()
	})
})