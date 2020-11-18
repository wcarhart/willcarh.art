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

// TODO: add verbose comments

// TODO: add color
/*
Supported asset tags:
  {{css:...}}      --> static CSS file
  {{ico:...}}      --> static icon file
  {{font:...}}     --> static font file
  {{js:...}}       --> static built js file
  {{src:...}}      --> static built source file
  {{cdn:...}}      --> file stored in CDN
  {{color:...}}    --> color from the system color palette
  {{sys:header}}   --> generated header for HTML files
  {{sys:headerjs}} --> generated header for JS files
  {{sys:home}}     --> path to homepage
*/


// TODO: implement these
// TODO: do we need the specific proj,blog tags? Or will the generator just generate pages for all?
/*
Supported content tags:
  {{html:exp-tabs}}      --> build HTML for experience tabs on about page
  {{html:proj-featured}} --> build HTML for featured projects on project page
  {{html:proj-all}}      --> build HTML for all projects based on visibility
  {{html:vault-rows}}    --> built HTML for rows in the vault
  {{code:proj}}          --> load projects into code
  {{code:blog}}          --> load blogs into code
  {{meta:home}}          --> build HTML meta for home page
  {{meta:proj}}          --> build HTML meta for project index
  {{meta:proj:...}}      --> build HTML meta for specific project
  {{meta:blog}}          --> build HTML meta for blog index
  {{meta:blog:...}}      --> build HTML meta for specific blog post
  {{meta:vault}}         --> build HTML meta for vault
  {{meta:demo}}          --> build HTML meta for demo index
  {{meta:demo:...}}      --> build HTML meta for specific demo
*/

class Experience {
	constructor({
		company='',
		companyId = '',
		title=[],
		date=[],
		detail=[],
		languagesAndLibraries=[],
		tools=[],
		platforms=[],
		infrastructure=[],
		url=''
	}) {
		this.company = company
		this.companyId = companyId
		this.title = title
		this.date = date
		this.detail = detail
		this.languagesAndLibraries = languagesAndLibraries
		this.tools = tools
		this.platforms = platforms
		this.infrastructure = infrastructure
		this.url = url
	}
}

class Project {
	constructor({
		name='',
		blurb='',
		about=[],
		languages=[],
		technologies=[],
		img='',
		repo='',
		link='',
		demo='',
		latestVersion='',
		published='',
		status='',
		install='',
		documentation='',
		related=[],
		visibility='',
		tags=[]
	}) {
		this.name = name
		this.blurb = blurb
		this.about = about
		this.languages = languages
		this.technologies = technologies
		this.img = img
		this.repo = repo
		this.link = link
		this.demo = demo
		this.latestVersion = latestVersion
		this.published = published
		if (!['stable', 'in development', 'stale', 'archived'].includes(status)) {
			console.error(`Unknown status '${status}'`)
		}
		this.status = status
		this.install = install
		this.documentation = documentation
		this.related = related
		if (!['super', 'featured', 'normal', 'less', 'none'].includes(visibility)) {
			console.error(`Unknown visibility '${visibility}'`)
		}
		this.visibility = visibility
		this.tags = tags
	}
}

class Blog {
	constructor({
		title='',
		subtitle='',
		blurb='',
		cover='',
		coverAuthor='',
		coverCredit='',
		published='',
		updated='',
		resources=[],
		author='',
		status='',
		tags=[],
		content=[]
	}) {
		this.title = title
		this.subtitle = subtitle
		this.blurb = blurb
		this.cover = cover
		this.coverAuthor = coverAuthor
		this.coverCredit = coverCredit
		this.published = published
		this.updated = updated
		this.resources = resources
		this.author = author
		// TODO: enumerate possible statuses
		this.status = status
		this.tags = tags
		this.content = content
	}
}

// generate HTML files based on page type
const generate = async (page) => {
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
			await buildPageFromTemplate({template: 'templates/vault.html', page: 'src/vault.html', isIndex: false})
			break
		case 'demo':
			console.log('🏃‍♂️  Building demos...')
			await buildPageFromTemplate({template: 'templates/demo_index.html', page: 'src/demo_index.html', isIndex: false})
			await buildMultiplePages('demo')
			break
		case 'etc':
			console.log('👓  Building etc...')
			await buildPageFromTemplate({template: 'templates/etc.html', page: 'src/etc.html', isIndex: false})
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

	// TODO: this messes up html, need to fix
	// prettify text
	// data = html.prettyPrint(data, {indent_size: 4});

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
// TODO: copy css files to src/ and do the same as js
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
	const supportedTags = ['html', 'code', 'meta']

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
					case 'meta':
						resolvedData = await buildMeta(resolvedData, match, value)
						break
					default:
						throw new Error(`Unknown tag '${tag}'`)
				}
			}
		}
	}
	return resolvedData
}

// build meta objects for webpages
const buildMeta = async (data, match, key) => {
	let resolvedData = data
	let meta = ''
	switch (key) {
		case 'home':
			meta = await buildMetaHtml({description: 'Will Carhart\'s personal portfolio website', url: 'https://willcarh.art'})
			resolvedData = resolvedData.replace(match, meta)
			break
		case 'proj':
			meta = await buildMetaHtml({description: 'Will Carhart\'s projects', url: 'https://willcarh.art/projects'})
			resolvedData = resolvedData.replace(match, meta)
			break
		case (key.match(/^proj:.*$/) || {}):
			// TODO
			break
		case 'blog':
			meta = await buildMetaHtml({description: 'Will Carhart\'s blog', url: 'https://willcarh.art/blog'})
			resolvedData = resolvedData.replace(match, meta)
			break
		case (key.match(/^blog:.*$/) || {}):
			// TODO
			break
		case 'vault':
			meta = await buildMetaHtml({description: 'Will Carhart\'s vault', url: 'https://willcarh.art/vault'})
			resolvedData = resolvedData.replace(match, meta)
			break
		case 'demo':
			meta = await buildMetaHtml({description: 'Will Carhart\'s demos', url: 'https://willcarh.art/demo'})
			resolvedData = resolvedData.replace(match, meta)
			break
		case (key.match(/^demo:.*$/) || {}):
			// TODO
			break
		default:
			throw new Error(`Unknown meta type '${key}'`)
	}
	return resolvedData
}

// build actual HTML meta tags for meta objects
const buildMetaHtml = async ({description='', url=''}) => {
	let template = await readFilePromise('snippets/meta/meta.html')
	template = template.toString()

	template = template.replace(/\{\{description\}\}/g, description)
	template = template.replace(/\{\{url\}\}/g, url)

	return template
}

// replace {{html:...}} tags
const buildHtml = async (data, match, key) => {
	let resolvedData = data
	let experiences = null, projects = null, blogs = null
	let html = null
	switch (key) {
		case 'exp-tabs':
			experiences = await parseExperiences()
			html = await buildExpTabs(experiences)
			resolvedData = resolvedData.replace(match, html)
			break
		case 'proj-super':
			projects = await parseProjects()
			html = await buildProjSuper(projects.filter(p => p.visibility === 'super'))
			resolvedData = resolvedData.replace(match, html)
			break
		case 'proj-all':
			//TODO
			break
		case 'vault-rows':
			experiences = await parseExperiences()
			projects = await parseProjects()
			blogs = await parseBlogs()
			html = await buildVaultRows(experiences, projects, blogs)
			resolvedData = resolvedData.replace(match, html)
			break
		default:
			throw new Error(`Unknown {{html}} key '${key}'`)
	}
	return resolvedData
}

// parse experiences from markdown file
const parseExperiences = async () => {
	const experienceData = await readFilePromise('content/experience.md')
	let experiences = []
	let newExperience = new Experience({})

	for (let line of experienceData.toString().split('\n')) {
		if (line !== '') {
			let elements = line.split(':')
			let key = elements.shift()
			let value = elements.join(':')
			if (value[0] === ' ') {
				value = value.slice(1)
			}
			if(['title', 'date', 'detail', 'languagesAndLibraries', 'tools', 'platforms', 'infrastructure'].includes(key)) {
				newExperience[key].push(value)
			} else {
				newExperience[key] = value
			}
		} else {
			experiences.push(newExperience)
			newExperience = new Experience({})
		}
	}

	return experiences
}

// parse projects from markdown file
const parseProjects = async () => {
	const projectData = await readFilePromise('content/projects.md')
	let projects = []
	let newProject = new Project({})

	for (let line of projectData.toString().split('\n')) {
		if (line !== '') {
			let elements = line.split(':')
			let key = elements.shift()
			let value = elements.join(':')
			if (value[0] === ' ') {
				value = value.slice(1)
			}
			if (['about', 'languages', 'technologies', 'related', 'tags'].includes(key)) {
				newProject[key].push(value)
			} else {
				newProject[key] = value
			}
		} else {
			projects.push(newProject)
			newProject = new Project({})
		}
	}

	return projects
}

// parse blog posts from markdown file
const parseBlogs = async () => {
	const blogData = await readFilePromise('content/blogs.md')
	let blogs = []
	let newBlog = new Blog({})

	for (let line of blogData.toString().split('\n')) {
		if (line !== '') {
			let elements = line.split(':')
			let key = elements.shift()
			let value = elements.join(':')
			if (value[0] === ' ') {
				value = value.slice(1)
			}
			if (['resources', 'tags', 'content'].includes(key)) {
				newBlog[key].push(value)
			} else {
				newBlog[key] = value
			}
		} else {
			blogs.push(newBlog)
			newBlog = new Blog({})
		}
	}

	return blogs
}

// build super project rows
const buildProjSuper = async (projects) => {
	// parse HTML snippets
	let projectContainerSuperSnippet = await readFilePromise('snippets/projects/project-container-super.html')
	let projectRowSuperSnippet = await readFilePromise('snippets/projects/project-row-super.html')
	let demoIconSnippet = await readFilePromise('snippets/linkicons/demo-icon.html')
	let docsIconSnippet = await readFilePromise('snippets/linkicons/docs-icon.html')
	let githubIconSnippet = await readFilePromise('snippets/linkicons/github-icon.html')
	let linkIconSnippet = await readFilePromise('snippets/linkicons/link-icon.html')

	projectContainerSuperSnippet = projectContainerSuperSnippet.toString()
	projectRowSuperSnippet = projectRowSuperSnippet.toString()
	demoIconSnippet = demoIconSnippet.toString()
	docsIconSnippet = docsIconSnippet.toString()
	githubIconSnippet = githubIconSnippet.toString()
	linkIconSnippet = linkIconSnippet.toString()

	// build html
	let html = ''
	// TODO: change i to index
	for (let superIndex = 0; superIndex < projects.length / 2 ; superIndex++) {
		let rowHtml = projectRowSuperSnippet
		let superContainer = ''
		for (let subIndex = 0; subIndex < 2 ; subIndex++) {

			let index = 2*superIndex + subIndex
			if (index >= projects.length) {
				rowHtml = rowHtml.replace('{{project-container-super}}', '')
				continue
			}
			superContainer = projectContainerSuperSnippet.replace(/\{\{name\}\}/g, projects[index].name.toLowerCase())
			superContainer = superContainer.replace('{{title}}', projects[index].name)
			superContainer = superContainer.replace('{{blurb}}', projects[index].blurb)
			superContainer = superContainer.replace(
				'{{technologies}}',
				projects[index].languages.concat(projects[index].technologies).filter(p => p !== '').join(' · ')
			)
			let githubIconHtml = '', docsIconHtml = '', demoIconHtml = '', linkIconHtml = ''
			if (projects[index].repo !== '') {
				githubIconHtml = githubIconSnippet.replace('{{name}}', projects[index].name.toLowerCase())
			}
			if (projects[index].documentation !== '') {
				docsIconHtml = docsIconSnippet.replace('{{name}}', projects[index].name.toLowerCase())
			}
			if (projects[index].demo !== '') {
				demoIconHtml = demoIconSnippet.replace('{{name}}', projects[index].name.toLowerCase())
			}
			if (projects[index].link !== '') {
				linkIconHtml = linkIconSnippet.replace('{{url}}', projects[index].link)
			}

			superContainer = superContainer.replace('{{github-icon}}', githubIconHtml)
			superContainer = superContainer.replace('{{docs-icon}}', docsIconHtml)
			superContainer = superContainer.replace('{{demo-icon}}', demoIconHtml)
			superContainer = superContainer.replace('{{link-icon}}', linkIconHtml)
			rowHtml = rowHtml.replace('{{project-container-super}}', superContainer)
		}
		html += rowHtml
		// html += '<div class="spacer-small"></div>'
	}
	return html
}

// TODO
// build all project rows
const buildProjAll = async (projects) => {
	// parse HTML snippets
	let projectContainerFeaturedSnippet = await readFilePromise('snippets/projects/project-container-featured.html')
	let projectContainerRegularSnippet = await readFilePromise('snippets/projects/project-container-regular.html')
	let projectRowFeaturedLeftSnippet = await readFilePromise('snippets/projects/project-row-featured-left.html')
	let projectRowFeaturedRightSnippet = await readFilePromise('snippets/projects/project-row-featured-right.html')
	let projectRowNormalSnippet = await readFilePromise('snippets/projects/project-row-normal.html')
	return
}

// build vault rows HTML
const buildVaultRows = async (experiences, projects, blogs) => {
	// parse HTML snippets
	let vaultRowsSnippet = await readFilePromise('snippets/vault/vault-row.html')
	let demoIconSnippet = await readFilePromise('snippets/linkicons/demo-icon.html')
	let docsIconSnippet = await readFilePromise('snippets/linkicons/docs-icon.html')
	let githubIconSnippet = await readFilePromise('snippets/linkicons/github-icon.html')
	let linkIconSnippet = await readFilePromise('snippets/linkicons/link-icon.html')

	vaultRowsSnippet = vaultRowsSnippet.toString()
	demoIconSnippet = demoIconSnippet.toString()
	docsIconSnippet = docsIconSnippet.toString()
	githubIconSnippet = githubIconSnippet.toString()
	linkIconSnippet = linkIconSnippet.toString()

	// template for how we will fill in the rows
	class RowTemplate {
		constructor({year='', title='', type='', resources=[], demoName='', docsName='', githubName='', linkUrl=''}) {
			this.year = year
			this.title = title
			this.type = type
			this.resources = resources
			this.demoName = demoName
			this.docsName = docsName
			this.githubName = githubName
			this.linkUrl = linkUrl
		}
	}
	let rows = []

	// parse experiences into rows
	for (let experience of experiences) {
		for (let [index, title] of experience.title.entries()) {
			let r = new RowTemplate({})
			if (/[a-zA-Z]/g.test(experience.date)) {
				let matches = experience.date[index].match(/[0-9]+/g)
				r.year = matches[0]
			} else {
				let matches = experience.date[index].match(/[0-9]+/g)
				r.year = matches[1]
			}
			r.title = `${experience.title[index]} @ ${experience.company}`
			r.type = 'experience'
			r.resources = experience.languagesAndLibraries.concat(experience.platforms.concat(experience.infrastructure))
			r.demoName = ''
			r.docsName = ''
			r.githubName = ''
			r.linkUrl = experience.url

			rows.push(r)
		}
	}

	// parse projects into rows
	for (let project of projects) {
		if (project.status === 'in development') {
			continue
		}
		let r = new RowTemplate({})
		r.year = project.published
		r.title = project.name
		r.type = 'project'
		r.resources = project.languages.concat(project.technologies)
		r.demoName = project.demo
		r.docsName = project.documentation
		r.githubName = project.repo
		r.linkUrl = project.link

		rows.push(r)
	}

	// parse blog posts into rows
	for (let blog of blogs) {
		let r = new RowTemplate({})
		r.year = blog.published
		r.title = blog.title
		r.type = 'blog'
		r.resources = blog.resources
		r.demoName = ''
		r.docsName = ''
		r.githubName = ''
		r.linkUrl = ''

		rows.push(r)
	}

	// TODO: this sort is greedy, need to rethink how to store dates on projects, experiences, and blog posts
	// sort rows based on year, prioritizing projects
	rows.sort((a, b) => {
		if (a.year > b.year) {
			return -1
		} else if (a.year < b.year) {
			return 1
		} else {
			if (a.type === 'experience') {
				return -1
			} else {
				return 1
			}
		}
		return 0
	})

	// build html
	let html = ''
	for (let row of rows) {
		let newRow = vaultRowsSnippet.replace('{{year}}', row.year)
		newRow = newRow.replace('{{title}}', row.title)
		switch (row.type) {
			case 'experience':
				newRow = newRow.replace('{{type}}', 'user-circle')
				break
			case 'project':
				newRow = newRow.replace('{{type}}', 'terminal')
				break
			case 'blog':
				newRow = newRow.replace('{{type}}', 'book')
				break
			default:
				throw new Error(`Unknown vault row type ${row.type}`)
		}
		newRow = newRow.replace('{{resources}}', row.resources.flatMap(r => r === '' ? [] : r).join(' · '))

		linkHtml = ''
		if (row.githubName !== '') {
			linkHtml += githubIconSnippet.replace('{{name}}', row.title)
		}
		if (row.docsName !== '') {
			linkHtml += docsIconSnippet.replace('{{name}}', row.title)
		}
		if (row.demoName !== '') {
			linkHtml += demoIconSnippet.replace('{{name}}', row.demoName)
		}
		if (row.linkUrl !== '') {
			linkHtml += linkIconSnippet.replace('{{url}}', row.linkUrl)
		}
		newRow = newRow.replace('{{links}}', linkHtml)

		html += newRow
	}

	return html
}

// build experience tabs HTML
const buildExpTabs = async (experiences) => {
	let tabsSnippet = await readFilePromise('snippets/experience/tabs.html')
	let selectorSnippet = await readFilePromise('snippets/experience/selector.html')
	let contentSnippet = await readFilePromise('snippets/experience/content.html')
	let detailSnippet = await readFilePromise('snippets/experience/detail.html')
	let highlightSnippet = await readFilePromise('snippets/experience/highlight.html')
	let titleSnippet = await readFilePromise('snippets/experience/title.html')
	let tidbitSnippet = await readFilePromise('snippets/experience/tidbit.html')

	tabsSnippet = tabsSnippet.toString()
	selectorSnippet = selectorSnippet.toString()
	contentSnippet = contentSnippet.toString()
	detailSnippet = detailSnippet.toString()
	highlightSnippet = highlightSnippet.toString()
	titleSnippet = titleSnippet.toString()
	tidbitSnippet = tidbitSnippet.toString()

	let selectors = ''
	let contents = ''

	for (let [index, experience] of experiences.entries()) {
		// add selector
		let selector = selectorSnippet.replace('{{company_upper}}', experience.company)
		selector = selector.replace('{{company_lower}}', experience.companyId)
		selector = selector.replace('{{is_active}}', index === 0 ? 'exp-selector-active' : '')
		selectors += selector

		// add content
		let titles = ''
		for (let t of experience.title) {
			titles += titleSnippet.replace('{{title}}', t)
		}
		let details = ''
		for (let d of experience.detail) {
			let detail = detailSnippet.replace('{{detail}}', d)
			let matches = d.match(/\*\*.+?\*\*/g)
			if (matches !== null) {
				for (let match of matches) {
					let text = match.replace(/^\*\*/, '').replace(/\*\*$/, '')
					detail = detail.replace(match, highlightSnippet.replace('{{hightlight}}', text))
				}
			}
			details += detail
		}
		let content = contentSnippet.replace('{{titles}}', titles)
		content = content.replace('{{company_lower}}', experience.companyId)
		content = content.replace('{{date}}', experience.date[0])
		content = content.replace('{{details}}', details)
		if (experience.languagesAndLibraries.length !== 0) {
			let tidbit = tidbitSnippet.replace('{{handle}}', 'Languages and libraries').replace('{{tidbit}}', experience.languagesAndLibraries.join(', '))
			content = content.replace('{{languages_and_libraries}}', tidbit)
		} else {
			content = content.replace('{{languages_and_libraries}}', '')
		}
		if (experience.tools.length !== 0) {
			let tidbit = tidbitSnippet.replace('{{handle}}', 'Tools').replace('{{tidbit}}', experience.tools.join(', '))
			content = content.replace('{{tools}}', tidbit)
		} else {
			content = content.replace('{{tools}}', '')
		}
		if (experience.platforms.length !== 0) {
			let tidbit = tidbitSnippet.replace('{{handle}}', 'Platforms').replace('{{tidbit}}', experience.platforms.join(', '))
			content = content.replace('{{platforms}}', tidbit)
		} else {
			content = content.replace('{{platforms}}', '')
		}
		if (experience.infrastructure.length !== 0) {
			let tidbit = tidbitSnippet.replace('{{handle}}', 'Infrastructure').replace('{{tidbit}}', experience.infrastructure.join(', '))
			content = content.replace('{{infrastructure}}', tidbit)
		} else {
			content = content.replace('{{infrastructure}}', '')
		}
		content = content.replace('{{url}}', experience.url)
		content = content.replace('{{is_active}}', index === 0 ? 'exp-active' : 'exp-hidden')
		contents += content
	}

	return tabsSnippet.replace('{{selectors}}', selectors).replace('{{contents}}', contents)
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
		published: '',
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
const buildNewBlogString = async (attributes) => {
	return
}

// return list of files in a specific content subdirectory
const findFiles = async ({kind='', prefix="content/"}) => {
	let files = []
	try {
		files = await readdirPromise(`${prefix}${kind}`)
	} catch (e) {}
	return files
}

module.exports = {
	generate: generate
}