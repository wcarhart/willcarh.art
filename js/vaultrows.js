{{sys:headerjs}}

// make vault rows clickable
$(document).ready(async () => {
	$('.vault-row').hover(async function() {
		const titleEl = $(this).children('.vault-title')
		const typeEl = $(this).children('.vault-type')
		$(titleEl).css('background-size', '100% 0.125rem')
		$(typeEl).css('color', 'var(--color)')
		$(this).css('cursor', 'pointer')
	}, async function() {
		const titleEl = $(this).children('.vault-title')
		const typeEl = $(this).children('.vault-type')
		$(titleEl).css('background-size', '0% 0.125rem')
		$(typeEl).css('color', 'var(--subtitle)')
	})
})
