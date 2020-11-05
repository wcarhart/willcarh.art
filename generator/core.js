const fs = require('fs')
const html = require('html')
const util = require('util')

const minify = require('minify');
const tryToCatch = require('try-to-catch');

const config = require('../config.json')
const package = require('../package.json')

const readdirPromise = util.promisify(fs.readdir)
const readFilePromise = util.promisify(fs.readFile)
const copyFilePromise = util.promisify(fs.copyFile)
const writeFilePromise = util.promisify(fs.writeFile)
const mkdirPromise = util.promisify(fs.mkdir)

/*
Supported asset tags:
  {{css:...}}      --> static CSS file
  {{ico:...}}      --> static icon file
  {{font:...}}     --> static font file
  {{js:...}}       --> static js file
  {{src:...}}      --> static compiled source file
  {{cdn:...}}      --> file stored in CDN
  {{sys:header}}   --> generated header for HTML files
  {{sys:headerjs}} --> generated header for JS files
  {{sys:home}}     --> path to homepage
*/


// TODO
/*
Supported content tags:
  {{html:exp-tabs}}      --> build HTML for experience tabs on about page
  {{html:proj-featured}} --> build HTML for featured projects on project page
  {{html:proj-all}}      --> build HTML for all projects based on visibility
  {{code:proj}}          --> load projects into code
  {{code:blog}}          --> load blogs into code
*/

// TODO
class Experience {
	constructor({
		company='',
		title=[],
		date='',
		detail=[],
		languagesAndLibraries=[],
		tools=[],
		platforms=[],
		infrastructure=[],
		url=''
	}) {}
}

// generate HTML files based on page type
const generate = async (page) => {
	try {
		await fs.promises.access('src')
	} catch (e) {
		await mkdirPromise('src')
	}
	switch (page) {
		case 'home':
			console.log('🏠  Building home...')
			await buildPageFromTemplate({template: 'templates/home.html', page: 'index.html', isIndex: true})
			break
		case 'about':
			console.log('💁‍♂️  Building about...')
			await buildPageFromTemplate({template: 'templates/about.html', page: 'src/about.html', isIndex: false})
			break
		case 'blog':
			console.log('📖  Building blog...')
			await buildPageFromTemplate({template: 'templates/blog_index.html', page: 'src/blog_index.html', isIndex: false})
			await buildMultiplePages('blog')
			break
		case 'projects':
			console.log('🏗  Building projects...')
			await buildPageFromTemplate({template: 'templates/project_index.html', page: 'src/project_index.html', isIndex: false})
			await buildMultiplePages('project')
			break
		case 'apps':
			console.log('🖥  Building apps...')
			break
		case 'scripts':
			console.log('🖋  Building scripts...')
			await buildScripts()
			break
		case 'vault':
			console.log('🗄  Building vault...')
			await buildVault()
			break
		default:
			throw new Error(`Unknown page '${page}'`)
	}
}

// build HTML page from template
const buildPageFromTemplate = async ({template='', page='', isIndex=false}) => {
	// read from template
	let data = await readFilePromise(template)
	data = data.toString()

	// we must resolve content first, because some content might resolve to asset tags
	data = await resolveContent(data, isIndex)

	// resolve static and dynamic assets
	data = await resolveAssets(data, isIndex)

	// write to source file
	await writeFilePromise(page, data)
}

// build multiple pages in a repo
const buildMultiplePages = async (kind) => {
	let files = await findFiles({kind: kind})
	for (let file of files) {
		let name = file.split('/').pop().split('.').shift()
		await buildPageFromTemplate({template: `templates/${kind}_specific.html`, page: `src/${kind}/${name}.html`, isIndex: false})
		await updateRedirects(`${kind}/${file.split('/').pop()}`, `${kind}/${name}`)
	}
}

// TODO: minify scripts - should we minify HTML and CSS as well?
// build JS scripts
const buildScripts = async () => {
	try {
		await fs.promises.access('src/js')
	} catch (e) {
		await mkdirPromise('src/js')
	}
	let scripts = await findFiles({kind: 'js', prefix: ''})
	for (let script of scripts) {
		await buildPageFromTemplate({template: `js/${script}`, page: `src/js/${script}`, isIndex: false})
	}
}

// TODO
const buildVault = async () => {
	await buildPageFromTemplate({template: 'templates/vault.html', page: 'src/vault.html', isIndex: false})
}

// TODO
const updateRedirects = async (from, to) => {
	return
}

// replace static asset tags in template
const resolveAssets = async (data, isIndex) => {
	let resolvedData = data
	const supportedAssets = ['css', 'cdn', 'font', 'ico', 'js', 'src', 'sys']

	// process each asset
	for (let asset of supportedAssets) {
		// build regex
		let query = `{{${asset}:.*}}`
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
				} else if (asset === 'sys') {
					resolvedData = await buildDynamicAsset(resolvedData, match, value, isIndex)
				} else {
					let file = `${asset}/${value}`
					await fs.promises.access(file)

					// configure relative file path
					let path = ''
					if (isIndex === true) {
						if (asset === 'js') {
							path = `src/${file}`
						} else {
							path = file
						}
					} else {
						if (asset === 'js') {
							path = file
						} else {
							path = `../${file}`
						}
					}
					resolvedData = resolvedData.replace(match, path)
				}
			}
		}
	}
	return resolvedData
}

// replace dynamic asset tags in template
const buildDynamicAsset = async (data, match, asset, isIndex) => {
	let resolvedData = data
	const now = Date().toLocaleString()
	switch (asset) {
		case 'header':
			let headerData = []
			headerData.push('<!-- This is an autogenerated file - DO NOT EDIT DIRECTLY -->')
			headerData.push(`<!-- This file was generated on ${now} via the forge in willcarh.art v${package.version}-->`)
			headerData.push('<!-- Learn more: https://github.com/wcarhart/willcarh.art -->')
			resolvedData = resolvedData.replace(match, headerData.join('\n'))
			break
		case 'headerjs':
			let headerjsData = []
			headerjsData.push('// This is an autogenerated file - DO NOT EDIT DIRECTLY')
			headerjsData.push(`// This file was generated on ${now} via the forge in willcarh.art v${package.version}`)
			headerjsData.push('// Learn more: https://github.com/wcarhart/willcarh.art')
			resolvedData = resolvedData.replace(match, headerjsData.join('\n'))
			break
		case 'home':
			let path = 'index.html'
			if (!isIndex) {
				path = `../${path}`
			}
			resolvedData = resolvedData.replace(match, path)
			break
		default:
			throw new Error(`Unknown system asset: '${asset}'`)
	}
	return resolvedData
}

// replace content tags in template
const resolveContent = async (data, isIndex) => {
	let resolvedData = data
	const supportedTags = ['html', 'code']

	// process each tag
	for (let tag of supportedTags) {
		// build regex
		let query = `{{${tag}:.*}}`
		let regex = new RegExp(query, 'g')
		let matches = data.match(regex)

		// process regex matches
		if (matches !== null) {
			for (let match of matches) {
				// get asset value
				let value = match.replace('{{', '').replace('}}', '').replace(`${tag}:`, '')

				// handle each tag
				switch (tag) {
					case 'html':
						resolvedData = await buildHtml(resolvedData, match, value)
						break
					case 'code':
						resolvedData = await buildCode(resolvedData, match, value)
						break
					default:
						throw new Error(`Unknown tag '${tag}'`)
				}
			}
		}
	}
	return resolvedData
}

// TODO
// replace {{html:...}} tags
const buildHtml = async (data, match, key) => {
	let resolvedData = data
	switch (key) {
		case 'exp-tabs':
			break
		case 'proj-featured':
			break
		case 'proj-all':
			break
		default:
			throw new Error(`Unknown {{html}} key '${key}'`)
	}
	return data
}

// replace {{code:...}} tags
const buildCode = async (data, match, key) => {
	let resolvedData = data
	switch (key) {
		case 'classes':
			let classes = []
			let files = await readdirPromise('snippets/js')
			for (let file of files) {
				let [error, data] = await tryToCatch(minify, `snippets/js/${file}`, {})
				if (error) {
					throw new Error(error)
				}
				classes.push(data)
			}
			resolvedData = resolvedData.replace(match, classes.join('\n'))
			break
		case 'proj':
			let projectData = await readFilePromise('content/projects.md')
			let newProjects = []
			let attributes = []
			for (let line of projectData.toString().split('\n')) {
				if (line !== '') {
					attributes.push(line)
				} else {
					newProjects.push(await buildNewProjectString(attributes))
					attributes = []
				}
			}
			console.log(match)
			resolvedData = resolvedData.replace(match, newProjects.join('\n'))
			break
		case 'blog':
			// TODO
			break
		default:
			throw new Error(`Unknown {{code}} key '${key}'`)
	}
	return resolvedData
}

// build string for instatiating a new project
const buildNewProjectString = async (attributes) => {
	let template = {
		name: '',
		blurb: '',
		about: [],
		languages: [],
		technologies: [],
		img: '',
		repo: '',
		latestVersion: '',
		status: '',
		install: '',
		documentation: '',
		related: [],
		visibility: '',
		tags: []
	}
	for (let line of attributes) {
		let elements = line.split(': ')
		let key = elements.shift()
		let value = elements.join(': ')
		if (['about', 'languages', 'technologies', 'related', 'tags'].includes(key)) {
			template[key].push(value)
		} else {
			template[key] = value
		}
	}
	return `ALL_PROJECTS.push(new Project(JSON.parse('${JSON.stringify(template).replace("'", "\\'")}')))`
}

// TODO
// build string for instatiating a new blog post
const buildNewBlogPostString = async (attributes) => {
	return
}

// return list of files in a specific content subdirectory
const findFiles = async ({kind='', prefix="content/"}) => {
	let files = []
	try {
		files = await readdirPromise(`${prefix}${kind}`)
		files = files.flatMap(file => file !== 'index.md' ? file : [])
	} catch (e) {}
	return files
}

module.exports = {
	generate: generate
}