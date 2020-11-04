// dynamically update footer year
const year = new Date().getFullYear();
$(document).ready(async () => {
	$('#year').text(year)
})
