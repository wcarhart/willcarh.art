const fs = require('fs')
const util = require('util')

const readFilePromise = util.promisify(fs.readFile)

// convert markdown to HTML
const convert = async (md, page) => {
	// parse snippets
	let contentSubtitleSnippet = await readFilePromise('snippets/markdown/content-subtitle.html')
	let contentTextSnippet = await readFilePromise('snippets/markdown/content-text.html')
	let centeredTextSnippet = await readFilePromise('snippets/markdown/centered-text.html')
	let startContentTextSnippet = await readFilePromise('snippets/markdown/start-content-text.html')
	let blockCodeSnippet = await readFilePromise('snippets/markdown/block-code.html')
	let shoutoutSnippet = await readFilePromise('snippets/markdown/shoutout.html')
	let ulSnippet = await readFilePromise('snippets/markdown/ul.html')
	let liSnippet = await readFilePromise('snippets/markdown/li.html')
	let imgSnippet = await readFilePromise('snippets/markdown/img.html')
	let imgSubtitleSnippet = await readFilePromise('snippets/markdown/img-subtitle.html')
	let youtubeVideoSnippet = await readFilePromise('snippets/markdown/youtube.html')

	contentSubtitleSnippet = contentSubtitleSnippet.toString()
	contentTextSnippet = contentTextSnippet.toString()
	centeredTextSnippet = centeredTextSnippet.toString()
	startContentTextSnippet = startContentTextSnippet.toString()
	blockCodeSnippet = blockCodeSnippet.toString()
	shoutoutSnippet = shoutoutSnippet.toString()
	ulSnippet = ulSnippet.toString()
	liSnippet = liSnippet.toString()
	imgSnippet = imgSnippet.toString()
	imgSubtitleSnippet = imgSubtitleSnippet.toString()
	youtubeVideoSnippet = youtubeVideoSnippet.toString()

	// convert MD to HTML
	let lines = md.split('\n')
	let html = ''

	let inCodeBlock = false
	let codeblock = []
	let inList = false
	let listItems = []
	let inTable = false
	let tableHeaders = []
	let tableConfigs = []
	let tableRows = []

	for (let [index, line] of lines.entries()) {

		// TODO: add support for ol
		// TODO: add support for nested lists
		// TODO: add support for block quotes (lines starting with '>')
		// TODO: add support for syntax highlighting with ```language and class="language-..." (see https://github.com/highlightjs/highlight.js/)

		// we'll need to keep track of the state of the markdown
		// there are three states - in code block, in table, and normal

		// normal state
		if (inCodeBlock === false && inTable === false) {

			// lines that start with '#' are interpreted to be the start of the content text and should only occur once
			if (line.startsWith('# ')) {
				let text = line.replace(/^# /, '')
				let subcomponent = await buildSubcomponents(text)
				html += startContentTextSnippet.replace('{{text}}', subcomponent)

			// lines that start with '###' are interpreted to be subtitles in the content text
			} else if (line.startsWith('### ')) {
				let text = line.replace(/^### /, '')
				let subcomponent = await buildSubcomponents(text)
				html += contentSubtitleSnippet.replace('{{subtitle}}', subcomponent)

			// lines that start with '>>' are interpreted to be shoutouts
			} else if (line.startsWith('>> ')) {
				let shoutout = line.replace(/^>> /, '')
				let components = shoutout.split(' | ')
				let shoutoutTitle = components.shift()
				let shoutoutText = components.join(' | ')
				shoutoutTitle = await buildSubcomponents(shoutoutTitle)
				shoutoutText = await buildSubcomponents(shoutoutText)
				html += shoutoutSnippet.replace('{{title}}', shoutoutTitle).replace('{{text}}', shoutoutText)

			// lines that start with '*' are interpreted to be lists
			}  else if (line.startsWith('* ')) {
				inList = true
				let text = line.replace(/^\* /, '')
				listItems.push(text)

			// lines that start with '!' are interpreted to be images
			} else if (line.startsWith('![')) {
				let imgAlt = line.replace(/^!\[/, '').replace(/\].*$/, '')
				let imgSrc = line.replace(/^.*\(/, '').replace(/\).*$/, '')
				let remaining = line.replace(/^!\[.*\]\(.*\)/, '')
				let subtitleText = ''
				if (remaining[0] === '<' && remaining[remaining.length-1] === '>') {
					subtitleText = line.replace(/^.*</, '').replace(/>$/, '')
				}
				let imgSubtitle = imgSubtitleSnippet.replace('{{subtitle}}', subtitleText)
				html += imgSnippet.replace('{{alt}}', imgAlt).replace('{{src}}', imgSrc).replace('{{img-subtitle}}', imgSubtitle)

			// lines that start with '~' are interpreted to be YouTube vides
			} else if (line.startsWith('~(')) {
				let videoId = line.replace(/^~\(/, '').replace(/\)$/, '')
				html += youtubeVideoSnippet.replace('\{\{video-id\}\}', videoId)

			// lines that start with '=' are interpreted to be centered
			} else if (line.startsWith('=')) {
				let text = line.replace(/^=/, '')
				let subcomponent = await buildSubcomponents(text)
				html += centeredTextSnippet.replace('{{text}}', subcomponent)

			// lines that start with '?' are interpretted to be comments and should not be rendered as HTML
			} else if (line.startsWith('?')) {
				continue

			// lines that start with '|' are interpretted to be table contents
			} else if (line.startsWith('|')) {
				inTable = true
				let tableComponents = line.split('|')
				await validateTableRow(line, index, page)
				tableComponents = tableComponents.filter(tc => tc !== '')
				let isConfig = tableComponents.reduce((result, tc) => { return Boolean(/^:?-+:?$/.exec(tc.trim())) && result }, true)
				if (isConfig === false) {
					tableHeaders = tableHeaders.concat(tableComponents.map(tc => tc.trim()))
				} else {
					tableConfigs = tableConfigs.concat(tableComponents.map(tc => tc.trim().replace(/-+/, '-')))
					await validateTableConfigs(tableConfigs, index, page)
				}

			// lines that are '```' are interpreted to be the start or end of a code block
			} else if (line === '```') {
				inCodeBlock = true

			// lines that are '---' or '___' are interpreted to be horizontal rules
			} else if (line === '---' || line === '___') {
				html += '<hr>'

			// empty lines are interpreted to be line breaks
			} else if (line === '') {
				if (inList) {
					html += ulSnippet.replace('{{list-items}}', listItems.map(li => liSnippet.replace('{{text}}', li)).join(''))
					listItems = []
					inList = false
				} else {
					html += '<br>'
				}

			// all other lines are interpreted to be regular content text
			} else {
				if (inList) {
					html += ulSnippet.replace('{{list-items}}', listItems.map(li => liSnippet.replace('{{text}}', li)).join(''))
					listItems = []
					inList = false
				} else {
					let subcomponent = await buildSubcomponents(line)
					html += contentTextSnippet.replace('{{text}}', subcomponent)
				}
			}

		// in table state
		} else if (inTable === true) {
			// table ends when we encounter a blank line
			if (line === '') {
				inTable = false
				let tableHtml = await buildTable(tableHeaders, tableConfigs, tableRows, page)
				html += tableHtml
				tableHeaders = []
				tableConfigs = []
				tableRows = []
			} else {
				if (!line.startsWith('|')) {
					throw new Error(`Invalid table row (line ${index}): did you forget to end the table with an empty newline?`)
				}
				let tableComponents = line.split('|')
				await validateTableRow(line, index, page)
				tableComponents = tableComponents.filter(tc => tc !== '')
				if (tableConfigs.length === 0) {
					tableConfigs = tableConfigs.concat(tableComponents.map(tc => tc.trim().replace(/-+/, '-')))
					await validateTableConfigs(tableConfigs, index, page)
				} else {
					tableRows.push(await Promise.all(tableComponents.map(async (tc) => { return await buildSubcomponents(tc) })))
				}
			}

		// in code block state
		} else if (inCodeBlock === true) {
			// if we encounter another '```', close the code block
			if (line === '```') {
				inCodeBlock = false
				codeblock = codeblock.map(b => b.replace('<', '&lt;').replace('>', '&gt;'))
				html += blockCodeSnippet.replace('{{code}}', codeblock.join('<br>'))
				codeblock = []
			} else {
				// append to the code block
				// TODO: add colors via color.css and span tags (especially for othello)
				codeblock.push(line)
			}

		} else {
			throw new Error(`Ambiguous markdown state: in table and in code block at the same time`)
		}
	}

	// handle invalid markdown cases
	if (inCodeBlock) {
		throw new Error(`Invalid markdown: unclosed code block in '${page}'`)
	}
	if (inList) {
		throw new Error(`Invalid markdown: unclosed list in '${page}'`)
	}
	if (inTable) {
		throw new Error(`Invalid markdown: unclosed table in '${page}', did you forget to end the table with an empty newline?`)
	}

	return html
}

// make sure tables start and end with '|'
const validateTableRow = async (row, lineNumber, page) => {
	if (row[0] !== '|' || row[row.length-1] !== '|') {
		throw new Error(`Invalid table row in '${page}' (line ${lineNumber}): line does not start and end with '|'`)
	}
}

// make sure table configs are valid
const validateTableConfigs = async (configs, lineNumber, page) => {
	let isConfig = configs.reduce((result, tc) => { return Boolean(/^:?-+:?$/.exec(tc.trim())) && result }, true)
	if (isConfig === false) {
		throw new Error(`Invalid table row in '${page}' (line ${lineNumber}): invalid table configuration`)
	}
}

// build table HTML
const buildTable = async (headers, configs, rows, page) => {
	// parse HTML snippets
	let tableSnippet = await readFilePromise('snippets/markdown/table/table.html')
	let theadSnippet = await readFilePromise('snippets/markdown/table/thead.html')
	let trSnippet = await readFilePromise('snippets/markdown/table/tr.html')
	let thSnippet = await readFilePromise('snippets/markdown/table/th.html')
	let tbodySnippet = await readFilePromise('snippets/markdown/table/tbody.html')
	let tdSnippet = await readFilePromise('snippets/markdown/table/td.html')
	tableSnippet = tableSnippet.toString()
	theadSnippet = theadSnippet.toString()
	trSnippet = trSnippet.toString()
	thSnippet = thSnippet.toString()
	tbodySnippet = tbodySnippet.toString()
	tdSnippet = tdSnippet.toString()

	// verify table is sized properly
	//  - all data rows must have same number of cols
	//  - configs and all rows must have same number of cols
	//  - if table has headers, headers, configs, and all rows must have same number of cols
	let rowColumnCounts = rows.reduce((result, row) => { return result.includes(row.length) ? result : result.concat(row.length) }, [])
	if (rowColumnCounts.length !== 1) {
		throw new Error(`Invalid markdown: invalid table in '${page}', unequal columns found in table data`)
	}
	rowColumnCounts = rowColumnCounts[0]
	if (headers.length !== 0) {
		if (headers.length !== configs.length && configs.length !== rowColumnCounts) {
			throw new Error(`Invalid markdown: invalid table in '${page}', unequal table headers, configurations, and rows`)
		}
	} else {
		if (configs.length !== rowColumnCounts) {
			throw new Error(`Invalid markdown: invalid table in '${page}', unequal table configurations and rows`)
		}
	}

	// build html templates
	let table = tableSnippet
	let headerRow = ''
	let bodyRows = []

	// determine column alignments
	let columnAligns = configs.map(col => {
		switch(col) {
			case '-':
			case ':-':
				return 'left'
			case ':-:':
				return 'center'
			case '-:':
				return 'right'
		}
	})
	
	// compute colspan for each header
	let colspan = 1
	let previous = null
	let headerMap = []
	for (let [index, header] of headers.entries()) {
		if (previous === null) {
			previous = header
			continue
		}
		if (previous === header) {
			colspan += 1
		} else {
			headerMap.push([previous, colspan])
			previous = header
			colspan = 1
		}
		if (index === headers.length - 1) {
			headerMap.push([previous, colspan])
		}
	}

	// build optional header row
	headerRow = trSnippet.replace(
		'{{row}}',
		headerMap.map((elements, i) => {
			return thSnippet
				.replace('{{header-align}}', columnAligns[i])
				.replace('{{colspan}}', elements[1])
				.replace('{{header}}', elements[0])
		}).join('\n')
	)

	// build body rows
	for (let [index, row] of rows.entries()) {
		// append row to body
		bodyRows.push(trSnippet.replace(
			'{{row}}',
			row.map((col, i) => {
				return tdSnippet
					.replace('{{data-align}}', columnAligns[i])
					.replace('{{data}}', col)
			}).join('\n')
		))
	}

	// construct table
	table = table
		.replace(
			'{{table-headers}}',
			theadSnippet.replace('{{headers}}', headerRow)
		)
		.replace(
			'{{table-rows}}',
			tbodySnippet.replace('{{body}}', bodyRows.join('\n'))
		)
	return table
}

// build markdown subcomponents for each line
const buildSubcomponents = async (text) => {
	// parse HTML snippets
	let inlineCodeSnippet = await readFilePromise('snippets/markdown/inline-code.html')
	inlineCodeSnippet = inlineCodeSnippet.toString()

	// build components
	let subcomponent = text

	// handle links: [...](...)
	while (/\[.+?\]\(.+?\)/.exec(subcomponent)) {
		let match = /\[.+?\]\(.+?\)/.exec(subcomponent)[0]
		let anchor = match.replace(/^\[/, '').replace(/\].*$/, '')
		let href = match.replace(/^.*\(/, '').replace(/\)$/, '')
		let html = ''
		if (/\{\{src:.*\}\}/.exec(match) || /\{\{sys:home\}\}/.exec(match)) {
			html = `<a class="fancy-link" href="${href}">${anchor}</a>`
		} else {
			html = `<a class="fancy-link" href="${href}" target="_blank">${anchor}</a>`
		}
		subcomponent = subcomponent.replace(match, html)
	}

	// handle inline code
	while (/`.+?`/.exec(subcomponent)) {
		let match = /`.+?`/.exec(subcomponent)[0]
		let code = match.replace(/`/g, '')
		let html = inlineCodeSnippet.replace('{{code}}', code)
		subcomponent = subcomponent.replace(match, html)
	}

	// handle italics: _..._
	// middle of string
	while (/[^A-Za-z0-9"'`]_.+?_[^A-Za-z0-9"'`]/.exec(subcomponent)) {
		let match = /[^A-Za-z0-9"'`]_.+?_[^A-Za-z0-9"'`]/.exec(subcomponent)[0]
		let startChar = match[0]
		let endChar = match[match.length - 1]
		let cleansedMatch = match.substring(1, match.length - 2)
		let italics = cleansedMatch.replace(/^_/, '').replace(/_$/, '')
		subcomponent = subcomponent.replace(match, `${startChar}<i>${italics}</i>${endChar}`)
	}
	// start of string
	while (/^_.+?_[^A-Za-z0-9"'`]/.exec(subcomponent)) {
		let match = /^_.+?_[^A-Za-z0-9"'`]/.exec(subcomponent)[0]
		let endChar = match[match.length - 1]
		let cleansedMatch = match.substring(0, match.length - 2)
		let italics = cleansedMatch.replace(/^_/, '').replace(/_$/, '')
		subcomponent = subcomponent.replace(match, `<i>${italics}</i>${endChar}`)
	}
	// end of string
	while (/[^A-Za-z0-9"'`]_.+?_$/.exec(subcomponent)) {
		let match = /[^A-Za-z0-9"'`]_.+?_$/.exec(subcomponent)[0]
		let startChar = match[0]
		let cleansedMatch = match.substring(1, match.length - 1)
		let italics = cleansedMatch.replace(/^_/, '').replace(/_$/, '')
		subcomponent = subcomponent.replace(match, `${startChar}<i>${italics}</i>`)
	}
	// whole string
	while (/^_.+?_$/.exec(subcomponent)) {
		let match = /^_.+?_$/.exec(subcomponent)[0]
		let italics = match.replace(/^_/, '').replace(/_$/, '')
		subcomponent = subcomponent.replace(match, `<i>${italics}</i>`)
	}

	// handle bold: **...**
	// middle of string
	while (/[^A-Za-z0-9"'`]\*\*.+?\*\*[^A-Za-z0-9"'`]/.exec(subcomponent)) {
		let match = /[^A-Za-z0-9"'`]\*\*.+?\*\*[^A-Za-z0-9"'`]/.exec(subcomponent)[0]
		let startChar = match[0]
		let endChar = match[match.length - 1]
		let cleansedMatch = match.substring(1, match.length - 3)
		let bold = cleansedMatch.replace(/^\*\*/, '').replace(/\*\*$/, '')
		subcomponent = subcomponent.replace(match, `${startChar}<b class="bold-text">${bold}</b>${endChar}`)
	}
	// start of string
	while (/^\*\*.+?\*\*[^A-Za-z0-9"'`]/.exec(subcomponent)) {
		let match = /^\*\*.+?\*\*[^A-Za-z0-9"'`]/.exec(subcomponent)[0]
		let endChar = match[match.length - 1]
		let cleansedMatch = match.substring(0, match.length - 3)
		let bold = cleansedMatch.replace(/^\*\*/, '').replace(/\*\*$/, '')
		subcomponent = subcomponent.replace(match, `<b class="bold-text">${bold}</b>${endChar}`)
	}
	// end of string
	while (/[^A-Za-z0-9"'`]\*\*.+?\*\*$/.exec(subcomponent)) {
		let match = /[^A-Za-z0-9"'`]\*\*.+?\*\*$/.exec(subcomponent)[0]
		let startChar = match[0]
		let cleansedMatch = match.substring(1, match.length - 2)
		let bold = cleansedMatch.replace(/^\*\*/, '').replace(/\*\*$/, '')
		subcomponent = subcomponent.replace(match, `${startChar}<b class="bold-text">${bold}</b>`)
	}
	// whole string
	while (/^\*\*.+?\*\*$/.exec(subcomponent)) {
		let match = /^\*\*.+?\*\*$/.exec(subcomponent)[0]
		let bold = match.replace(/^\*\*/, '').replace(/\*\*$/, '')
		subcomponent = subcomponent.replace(match, `<b class="bold-text">${bold}</b>`)
	}

	// handle strikethrough: ~~...~~
	// middle of string
	while (/[^A-Za-z0-9"'`]~~.+?~~[^A-Za-z0-9"'`]/.exec(subcomponent)) {
		let match = /[^A-Za-z0-9"'`]~~.+?~~[^A-Za-z0-9"'`]/.exec(subcomponent)[0]
		let startChar = match[0]
		let endChar = match[match.length - 1]
		let cleansedMatch = match.substring(1, match.length - 3)
		let strikethrough = cleansedMatch.replace(/^~~/, '').replace(/~~$/, '')
		subcomponent = subcomponent.replace(match, `${startChar}<s>${strikethrough}</s>${endChar}`)
	}
	// start of string
	while (/^~~.+?~~[^A-Za-z0-9"'`]/.exec(subcomponent)) {
		let match = /^~~.+?~~[^A-Za-z0-9"'`]/.exec(subcomponent)[0]
		let endChar = match[match.length - 1]
		let cleansedMatch = match.substring(0, match.length - 3)
		let strikethrough = cleansedMatch.replace(/^~~/, '').replace(/~~$/, '')
		subcomponent = subcomponent.replace(match, `<s>${strikethrough}</s>${endChar}`)
	}
	// end of string
	while (/[^A-Za-z0-9"'`]~~.+?~~$/.exec(subcomponent)) {
		let match = /[^A-Za-z0-9"'`]~~.+?~~$/.exec(subcomponent)[0]
		let startChar = match[0]
		let cleansedMatch = match.substring(1, match.length - 2)
		let strikethrough = cleansedMatch.replace(/^~~/, '').replace(/~~$/, '')
		subcomponent = subcomponent.replace(match, `${startChar}<s>${strikethrough}</s>`)
	}
	// whole string
	while (/^~~.+?~~$/.exec(subcomponent)) {
		let match = /^~~.+?~~$/.exec(subcomponent)[0]
		let strikethrough = match.replace(/^~~/, '').replace(/~~$/, '')
		subcomponent = subcomponent.replace(match, `<s>${strikethrough}</s>`)
	}

	return subcomponent
}

module.exports = {
	convert: convert
}