const fs = require('fs')
// eslint-disable-next-line no-unused-vars
const html = require('html')
const path = require('path')
const util = require('util')

// eslint-disable-next-line no-unused-vars
const minify = require('minify')
// eslint-disable-next-line no-unused-vars
const tryToCatch = require('try-to-catch')

const config = require('../config.json')
const package = require('../package.json')

const builder = require('./builder.js')

const readdirPromise = util.promisify(fs.readdir)
const readFilePromise = util.promisify(fs.readFile)
const writeFilePromise = util.promisify(fs.writeFile)
const mkdirPromise = util.promisify(fs.mkdir)
const truncatePromise = util.promisify(fs.truncate)
const appendFilePromise = util.promisify(fs.appendFile)
const copyFilePromise = util.promisify(fs.copyFile)

// TODO: add verbose comments

// generate HTML files based on page type
const generate = async (page, develop) => {
	// set up file structure
	try {
		await fs.promises.access('src')
	} catch (e) {
		await mkdirPromise('src')
	}
	try {
		await fs.promises.access('src/project')
	} catch (e) {
		await mkdirPromise('src/project')
	}
	try {
		await fs.promises.access('src/blog')
	} catch (e) {
		await mkdirPromise('src/blog')
	}
	try {
		await fs.promises.access('src/demo')
	} catch (e) {
		await mkdirPromise('src/demo')
	}

	// process pages
	switch (page) {
		case 'home':
			console.log('🏠  Building home...')
			await buildPageFromTemplate({template: 'templates/home.html', page: 'src/index.html', level: 1, develop: develop})
			break
		case 'about':
			console.log('💁‍♂️  Building about...')
			await buildPageFromTemplate({template: 'templates/about.html', page: 'src/about.html', level: 1, develop: develop})
			break
		case 'blog':
			console.log('📖  Building blog...')
			await buildPageFromTemplate({template: 'templates/blog_index.html', page: 'src/blog.html', level: 1, develop: develop})
			await buildMultiplePages('blog', develop)
			break
		case 'projects':
			console.log('🏗  Building projects...')
			await buildPageFromTemplate({template: 'templates/project_index.html', page: 'src/projects.html', level: 1, develop: develop})
			await buildMultiplePages('project', develop)
			break
		case 'scripts':
			console.log('🖋  Building scripts...')
			await buildScripts(develop)
			break
		case 'style':
			console.log('💄  Building styles')
			await buildStyles(develop)
			break
		case 'vault':
			console.log('🗄  Building vault...')
			await buildPageFromTemplate({template: 'templates/vault.html', page: 'src/vault.html', level: 1, develop: develop})
			break
		case 'demo':
			console.log('🏃‍♂️  Building demos...')
			await buildPageFromTemplate({template: 'templates/demo_index.html', page: 'src/demo.html', level: 1, develop: develop})
			await buildMultiplePages('demo', develop)
			break
		case 'etc':
			console.log('👓  Building etc...')
			await buildPageFromTemplate({template: 'templates/etc.html', page: 'src/etc.html', level: 1, develop: develop})
			break
		default:
			throw new Error(`Unknown page '${page}'`)
	}
}

// build HTML page from template
const buildPageFromTemplate = async ({template='', page='', level=0, develop=false}) => {
	// read from template
	let data = await readFilePromise(template)
	data = data.toString()

	// we must resolve content first, because some content might resolve to asset tags
	data = await builder.resolveContent(data, page)

	// resolve static and dynamic assets
	data = await resolveAssets(data, level, develop)

	// TODO: this messes up html, need to fix
	// prettify text
	// data = html.prettyPrint(data, {indent_size: 4});

	// write to source file
	await writeFilePromise(page, data)
}

// build multiple pages in a repo
const buildMultiplePages = async (kind, develop) => {
	let files = await findFiles({kind: kind})
	for (let file of files) {
		let name = file.split('/').pop().split('.md').shift()
		await buildPageFromTemplate({template: `templates/${kind}_specific.html`, page: `src/${kind}/${name}.html`, level: 2, develop: develop})
	}
}

// build JS scripts
const buildScripts = async (develop) => {
	try {
		await fs.promises.access('src/js')
	} catch (e) {
		await mkdirPromise('src/js')
	}
	let scripts = await findFiles({kind: 'js', prefix: ''})
	for (let script of scripts) {
		await buildPageFromTemplate({template: `js/${script}`, page: `src/js/${script}`, level: 1, develop: develop})
	}
}

// build style elements
const buildStyles = async (develop) => {
	try {
		await fs.promises.access('src/css')
	} catch (e) {
		await mkdirPromise('src/css')
	}

	try {
		await fs.promises.access('src/ico')
	} catch (e) {
		await mkdirPromise('src/ico')
	}

	try {
		await fs.promises.access('src/font')
	} catch (e) {
		await mkdirPromise('src/font')
	}

	let cssfiles = await findFiles({kind: 'css', prefix: ''})
	let icofiles = await findFiles({kind: 'ico', prefix: ''})
	let fontfiles = await findFiles({kind: 'font', prefix: ''})

	for (let cssfile of cssfiles) {
		await copyFilePromise(`css/${cssfile}`, `src/css/${cssfile}`)
	}

	for (let icofile of icofiles) {
		await copyFilePromise(`ico/${icofile}`, `src/ico/${icofile}`)
	}

	for (let fontfile of fontfiles) {
		await copyFilePromise(`font/${fontfile}`, `src/font/${fontfile}`)
	}
}

// replace static asset tags in template
const resolveAssets = async (data, level, develop) => {
	let resolvedData = data
	const supportedAssets = ['css', 'cdn', 'font', 'ico', 'js', 'src', 'sys', 'blog', 'project']

	// process each asset
	for (let asset of supportedAssets) {
		// build regex
		let query = `{{${asset}:.*?}}`
		let regex = new RegExp(query, 'g')
		let matches = data.match(regex)

		// process regex matches
		if (matches !== null) {
			for (let match of matches) {
				// get asset value
				let value = match.replace('{{', '').replace('}}', '').replace(`${asset}:`, '')

				// CDN files have a different prefix
				if (asset === 'cdn') {
					resolvedData = resolvedData.replace(match, `${config.cdn}${value}`)

				// sys is used for dynamically generated assets (not static files)
				} else if (asset === 'sys') {
					resolvedData = await buildDynamicAsset(resolvedData, match, value, level, develop)

				// src + js files are generated from templates into the src/ directory
				// css, ico, + font files are static, copied from source directory to src/ directory
				} else {
					// resolve 'blog' and 'project' shortcuts
					if (['blog', 'project'].includes(asset)) {
						asset = 'src'
						console.log(value)
						asdf
					}

					let file = value

					// if in assset subdir
					if (['css', 'ico', 'font', 'js'].includes(asset)) {
						file = path.join(asset, file)
					}

					// configure relative path based on nesting level
					let assetPath = ''
					switch (level) {
						case 0:
							assetPath = `src/${file}`
							break
						case 1:
							assetPath = file
							break
						case 2:
							assetPath = `../${file}`
							break
						default:
							throw new Error(`Level above 2 is not currently supported, found level: ${level}`)
					}
					resolvedData = resolvedData.replace(match, assetPath)
				}
			}
		}
	}
	return resolvedData
}

// replace dynamic asset tags in template
const buildDynamicAsset = async (data, match, asset, level, develop) => {
	let resolvedData = data
	const now = Date().toLocaleString()
	let headerData = null, headerjsData = null, file = null, assetPath = null, charizard = null, message = null
	switch (asset) {
		case 'header':
			headerData = []
			headerData.push('<!-- This is an autogenerated file - DO NOT EDIT DIRECTLY -->')
			headerData.push(`<!-- This file was generated on ${now} via the forge in willcarh.art v${package.version}-->`)
			headerData.push('<!-- Learn more: https://github.com/wcarhart/willcarh.art -->')
			if (develop === true) {
				headerData.push('<!-- THIS IS A DEVELOPMENT BUILD, PROCEED WITH CAUTION -->')
			}
			resolvedData = resolvedData.replace(match, headerData.join('\n'))
			break
		case 'headerjs':
			headerjsData = []
			headerjsData.push('// This is an autogenerated file - DO NOT EDIT DIRECTLY')
			headerjsData.push(`// This file was generated on ${now} via the forge in willcarh.art v${package.version}`)
			headerjsData.push('// Learn more: https://github.com/wcarhart/willcarh.art')
			if (develop === true) {
				headerjsData.push('// THIS IS A DEVELOPMENT BUILD, PROCEED WITH CAUTION')
			}
			resolvedData = resolvedData.replace(match, headerjsData.join('\n'))
			break
		case 'charizard':
			charizard = await readFilePromise('generator/charizard.txt')
			charizard = charizard.toString()
			message = '<!-- Hmm, what are you doing here? Bet you weren\'t expecting to see ASCII charizard, were you! -->\n'
			message += '<!--\n'
			message += charizard
			message += '\n-->\n'
			resolvedData = resolvedData.replace(match, message)
			break
		default:
			throw new Error(`Unknown system asset: '${asset}'`)
	}
	return resolvedData
}

// return list of files in a specific content subdirectory
const findFiles = async ({kind='', prefix='content/'}) => {
	let files = []
	try {
		files = await readdirPromise(`${prefix}${kind}`)
	// eslint-disable-next-line no-empty
	} catch (e) {}
	return files
}

// clear the redirects file
const refreshRedirects = async () => {
	console.log('👉  Building redirects...')
	await truncatePromise('_redirects', 0)
}

module.exports = {
	generate: generate,
	refreshRedirects: refreshRedirects
}