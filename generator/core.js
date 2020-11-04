const fs = require('fs')
const html = require('html')
const util = require('util')

const minify = require('minify');

const config = require('../config.json')
const package = require('../package.json')

const readdirPromise = util.promisify(fs.readdir)
const readFilePromise = util.promisify(fs.readFile)
const copyFilePromise = util.promisify(fs.copyFile)
const writeFilePromise = util.promisify(fs.writeFile)
const mkdirPromise = util.promisify(fs.mkdir)

// TODO
class Blog {
	constuctor({
		title='',
		subtitle='',
		blurb='',
		cover='',
		coverCredit='',
		published='',
		updated='',
		author='',
		latest=false,
		featured=false,
		tags=[],
		content=[]
	}) {

	}
}

// TODO
class Project {
	constuctor({
		name='',
		blurb='',
		about=[],
		languages=[],
		technologies=[],
		img='',
		repo='',
		latestVersion='',
		status='',
		install='',
		documentation='',
		related=[],
		featured=false,
		tags=[]
	}) {

	}
}

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

/*
Supported asset tags:
  {{css:...}}    --> static CSS file
  {{ico:...}}    --> static icon file
  {{font:...}}   --> static font file
  {{js:...}}     --> static js file
  {{src:...}}    --> static compiled source file
  {{cdn:...}}    --> file stored in CDN
  {{sys:header}} --> generated header
  {{sys:home}}   --> path to homepage
*/


// TODO
/*
Supported content tags:
  {{content:exp:all}}       --> build interactive HTML for all experiences
  {{content:exp:...}}       --> build interactive HTML for specific experience
  {{content:proj:featured}} --> build interactive HTML for featured projects
  {{content:proj:all}}      --> build interactive HTML for all projects
  {{content:proj:...}}      --> build interactive HTML for specific project
  {{content:blog:latest}}   --> build interactive HTML for latest blog post
  {{content:blog:featured}} --> build interactive HTML for featured blog posts
  {{content:blog:all}}      --> build interactive HTML for all blog posts
  {{content:blog:...}}      --> build interactive HTML for specific blog post
*/

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
	let data = await readFilePromise(template)
	data = data.toString()
	data = await resolveTags(['css', 'cdn', 'font', 'ico', 'js', 'src', 'sys'], data, isIndex)
	data = await resolveContent(data, isIndex)
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
const resolveTags = async (assets, data, isIndex) => {
	let resolvedData = data
	const supportedAssets = ['css', 'cdn', 'font', 'ico', 'js', 'src', 'sys']


	// process each asset
	for (let asset of assets) {
		// verify supported asset
		if (!supportedAssets.includes(asset)) {
			throw new Error(`Unsupported asset '${asset}'`)
		}

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
					let path = isIndex || asset === 'js' ? file : `../${file}`
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
	switch (asset) {
		case 'header':
			const now = Date().toLocaleString()
			let headerData = []
			headerData.push('<!-- This is an autogenerated file - DO NOT EDIT DIRECTLY -->')
			headerData.push(`<!-- This file was generated on ${now} via the forge in willcarh.art v${package.version}-->`)
			headerData.push('<!-- Learn more: https://github.com/wcarhart/willcarh.art -->')
			resolvedData = resolvedData.replace(match, headerData.join('\n'))
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

// TODO
// replace content tags in template
const resolveContent = async (data, isIndex) => {
	return data
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