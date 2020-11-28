const fs = require('fs')
const html = require('html')
const path = require('path')
const util = require('util')

const minify = require('minify')
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

// TODO: add verbose comments

// generate HTML files based on page type
const generate = async (page, develop) => {
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
	switch (page) {
		case 'home':
			console.log('🏠  Building home...')
			await buildPageFromTemplate({template: 'templates/home.html', page: 'index.html', level: 0, develop: develop})
			break
		case 'about':
			console.log('💁‍♂️  Building about...')
			await buildPageFromTemplate({template: 'templates/about.html', page: 'src/about.html', level: 1, develop: develop})
			break
		case 'blog':
			console.log('📖  Building blog...')
			await buildPageFromTemplate({template: 'templates/blog_index.html', page: 'src/blog_index.html', level: 1, develop: develop})
			await buildMultiplePages('blog', develop)
			break
		case 'projects':
			console.log('🏗  Building projects...')
			await buildPageFromTemplate({template: 'templates/project_index.html', page: 'src/project_index.html', level: 1, develop: develop})
			await buildMultiplePages('project', develop)
			break
		case 'apps':
			console.log('🖥  Building apps...')
			break
		case 'scripts':
			console.log('🖋  Building scripts...')
			await buildScripts(develop)
			break
		case 'vault':
			console.log('🗄  Building vault...')
			await buildPageFromTemplate({template: 'templates/vault.html', page: 'src/vault.html', level: 1, develop: develop})
			break
		case 'demo':
			console.log('🏃‍♂️  Building demos...')
			await buildPageFromTemplate({template: 'templates/demo_index.html', page: 'src/demo_index.html', level: 1, develop: develop})
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

	// update redirects for Netlify
	await updateRedirects(page)

	// write to source file
	await writeFilePromise(page, data)
}

// build multiple pages in a repo
const buildMultiplePages = async (kind, develop) => {
	let files = await findFiles({kind: kind})
	for (let file of files) {
		let name = file.split('/').pop().split('.md').shift()
		await buildPageFromTemplate({template: `templates/${kind}_specific.html`, page: `src/${kind}/${name}.html`, level: 2, develop: develop})
		// TODO: fix redirects
		// await updateRedirects(`${kind}/${file.split('/').pop()}`, `${kind}/${name}`)
	}
}

// TODO: minify scripts - should we minify HTML and CSS as well?
// TODO: copy css files to src/ and do the same as js
// build JS scripts
const buildScripts = async (develop) => {
	try {
		await fs.promises.access('src/js')
	} catch (e) {
		await mkdirPromise('src/js')
	}
	let scripts = await findFiles({kind: 'js', prefix: ''})
	for (let script of scripts) {
		await buildPageFromTemplate({template: `js/${script}`, page: `src/js/${script}`, level: 1, develop: false})
	}
}

// TODO: fix this, still showing .html ending
const updateRedirects = async (page) => {
	if (page.endsWith('.html')) {
		let redirect = ''
		switch(page) {
			case 'index.html':
				// await appendFilePromise('_redirects', `/index /\n`)
				// await appendFilePromise('_redirects', `/index.html /\n`)
				break
			case 'src/demo_index.html':
				await appendFilePromise('_redirects', `/src/demo_index /demo\n`)
				// await appendFilePromise('_redirects', `/src/demo_index.html /demo\n`)
				break
			case 'src/project_index.html':
				await appendFilePromise('_redirects', `/src/project_index /projects\n`)
				// await appendFilePromise('_redirects', `/src/project_index.html /projects\n`)
				await appendFilePromise('_redirects', '/project /projects\n')
				break
			case 'src/blog_index.html':
				await appendFilePromise('_redirects', `/src/blog_index /blog\n`)
				// await appendFilePromise('_redirects', `/src/blog_index.html /blog\n`)
				break
			case 'src/vault.html':
				await appendFilePromise('_redirects', `/src/vault /vault\n`)
				// await appendFilePromise('_redirects', `/src/vault.html /vault\n`)
				break
			case 'src/etc.html':
				await appendFilePromise('_redirects', `/src/etc /etc\n`)
				// await appendFilePromise('_redirects', `/src/etc.html /etc\n`)
				break
			case 'src/about.html':
				await appendFilePromise('_redirects', `/src/about /about\n`)
				// await appendFilePromise('_redirects', `/src/about.html /about\n`)
				break
			case String(page.match(/^src\/project\/.*$/)):
				// TODO
				break
			case String(page.match(/^src\/blog\/.*$/)):
				// TODO
				break
			case String(page.match(/^src\/demo\/.*$/)):
				// TODO
				break
			default:
				throw new Error(`Unknown redirect file: '${page}'`)
		}
	}
}

// replace static asset tags in template
const resolveAssets = async (data, level, develop) => {
	let resolvedData = data
	const supportedAssets = ['css', 'cdn', 'font', 'ico', 'js', 'src', 'sys']

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

				// css, ico, and font static files are stored outside the src/ directory
				} else if (['css', 'ico', 'font'].includes(asset)) {
					let file = `${asset}/${value}`
					let assetPath = path.join(...Array(level).fill('..'), file)
					resolvedData = resolvedData.replace(match, assetPath)

				// src + js files, which are generated from templates into the src/ directory
				} else {
					let file = value

					// TODO: should CSS files follow the same pattern as JS files?
					// js files are a special folder in src/ because they are also generated from templates
					if (asset === 'js') {
						file = path.join('js', file)
					}

					// make sure file exists
					if (develop === false) {
						try {
							await fs.promises.access(`src/${file}`)
						} catch (e) {
							throw new Error(`No such referenced file: 'src/${file}'`)
						}
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
	switch (asset) {
		case 'header':
			let headerData = []
			headerData.push('<!-- This is an autogenerated file - DO NOT EDIT DIRECTLY -->')
			headerData.push(`<!-- This file was generated on ${now} via the forge in willcarh.art v${package.version}-->`)
			headerData.push('<!-- Learn more: https://github.com/wcarhart/willcarh.art -->')
			if (develop === true) {
				headerData.push('<!-- THIS IS A DEVELOPMENT BUILD, PROCEED WITH CAUTION! -->')
			}
			resolvedData = resolvedData.replace(match, headerData.join('\n'))
			break
		case 'headerjs':
			let headerjsData = []
			headerjsData.push('// This is an autogenerated file - DO NOT EDIT DIRECTLY')
			headerjsData.push(`// This file was generated on ${now} via the forge in willcarh.art v${package.version}`)
			headerjsData.push('// Learn more: https://github.com/wcarhart/willcarh.art')
			if (develop === true) {
				headerData.push('// THIS IS A DEVELOPMENT BUILD, PROCEED WITH CAUTION!')
			}
			resolvedData = resolvedData.replace(match, headerjsData.join('\n'))
			break
		case 'home':
			let file = 'index.html'
			let assetPath = path.join(...Array(level).fill('..'), file)
			resolvedData = resolvedData.replace(match, assetPath)
			break
		case 'pokemon':
			let charizard = await readFilePromise('generator/charizard.txt')
			charizard = charizard.toString()
			let message = '<!-- Hmm, what are you doing here?? Bet you weren\'t expecting to see ASCII charizard, were you! -->\n'
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
const findFiles = async ({kind='', prefix="content/"}) => {
	let files = []
	try {
		files = await readdirPromise(`${prefix}${kind}`)
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