// This is an autogenerated file - DO NOT EDIT DIRECTLY
// This file was generated on Mon May 10 2021 11:17:03 GMT-0700 (Pacific Daylight Time) via the forge in willcarh.art v2.1.0
// Learn more: https://github.com/wcarhart/willcarh.art
// THIS IS A DEVELOPMENT BUILD, PROCEED WITH CAUTION

// handle clicks on project nav items
$(document).ready(async () => {
	$('#project-navigation-back').click(async function() {
		window.location.href = window.location.href.replace(/project.*$/, 'project_index.html')
	})
})
