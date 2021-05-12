const fs = require('fs')
const util = require('util')

const minify = require('minify')
const tryToCatch = require('try-to-catch')

const parser = require('./parser.js')
const markdown = require('./markdown.js')

const package = require('../package.json')

const readdirPromise = util.promisify(fs.readdir)
const readFilePromise = util.promisify(fs.readFile)

/*
Supported static asset tags:
  {{css:...}}            --> static CSS file
  {{ico:...}}            --> static icon file
  {{font:...}}           --> static font file
  {{js:...}}             --> static built js file
  {{src:...}}            --> static built source file
  {{cdn:...}}            --> file stored in CDN
*/

/*
Support dynamic asset tags:
  {{sys:develop}}        --> 'true' if develop mode is active
  {{sys:header}}         --> generated header for HTML files
  {{sys:headerjs}}       --> generated header for JS files
  {{sys:charizard}}      --> Charizard ascii art
  {{sys:preload}}        --> list of all images to preload
*/

/*
Supported HTML tags:
  {{html:exp-tabs}}      --> build HTML for experience tabs on about page
  {{html:proj-featured}} --> build HTML for featured projects on project page
  {{html:proj-all}}      --> build HTML for all projects based on visibility
  {{html:proj-spec}}     --> build HTML for specific project page
  {{html:blog-latest}}   --> build HTML for latest blog post on blog page
  {{html:blog-all}}      --> build HTML for all blog posts
  {{html:blog-spec}}     --> build HTML for specific blog post
  {{html:vault-rows}}    --> build HTML for rows in the vault
  {{html:demo-rows}}     --> build HTML for rows on demo index
  {{html:credits}}       --> build HTML for credits
  {{html:analytics}}     --> build HTML for site analytics
  {{html:logo}}          --> build HTML for site logo
  {{html:darkmode}}      --> build HTML for dark mode toggle
  {{html:email}}         --> build HTML for email contact button

Supported code tags:
  {{code:proj}}          --> load projects into code
  {{code:blog}}          --> load blogs into code

Supported meta tags:
  {{meta:about}}         --> build HTML meta for about page
  {{meta:home}}          --> build HTML meta for home page
  {{meta:proj}}          --> build HTML meta for project index
  {{meta:proj-spec}}     --> build HTML meta for specific project
  {{meta:blog}}          --> build HTML meta for blog index
  {{meta:blog-spec}}     --> build HTML meta for specific blog post
  {{meta:vault}}         --> build HTML meta for vault
  {{meta:demo}}          --> build HTML meta for demo index
  {{meta:demo-spec}}     --> build HTML meta for specific demo
*/

// build meta objects for webpages
const buildMeta = async (data, match, key, page) => {
	let resolvedData = data
	let meta = '', name = ''
	let projects = '', project = ''
	let blogs = '', blog = ''
	let metaOptions = {}

	switch (key) {
		case 'about':
			metaOptions = {
				'title': 'About | Will Carhart',
				'description': 'Will Carhart is a software engineer based in the San Francisco Bay Area specializing in back-end architectures, cloud infrastructures, and API development.',
				'url': 'https://willcarh.art/about',
				'author': 'Will Carhart',
				'cover': '{{cdn:img/og.png}}'
			}
			break
		case 'home':
			metaOptions = {
				'title': 'Home | Will Carhart',
				'description': 'Will Carhart is a software engineer based in the San Francisco Bay Area specializing in back-end architectures, cloud infrastructures, and API development.',
				'url': 'https://willcarh.art',
				'author': 'Will Carhart',
				'cover': '{{cdn:img/og.png}}'
			}
			break
		case 'proj':
			metaOptions = {
				'title': 'Projects | Will Carhart',
				'description': 'Building quality software is what I do. For me, coding is as much a hobby as it is a career. Here are some of the projects I\'ve built.',
				'url': 'https://willcarh.art/projects',
				'author': 'Will Carhart',
				'cover': '{{cdn:img/og.png}}'
			}
			break
		case 'proj-spec':
			projects = await parser.parse('project')
			name = page.split('/').pop().split('.html')[0]
			project = projects.filter(p => p.name.toLowerCase().replace(/ /g, '_') === name)[0]
			metaOptions = {
				'title': `${project.name} | Project | Will Carhart`,
				'description': project.blurb,
				'url': `https://willcarh.art/projects/${project.name}`,
				'author': 'Will Carhart',
				'cover': project.img
			}
			break
		case 'blog':
			blogs = await parser.parse('blog')
			blog = blogs.reduce((latest, current) => { return current.published > latest.published ? current : latest })
			metaOptions = {
				'title': 'Blog | Will Carhart',
				'description': 'Building quality software is what I do. For me, coding is as much a hobby as it is a career. Here are some of the lessons I\'ve learned along the way.',
				'url': 'https://willcarh.art/blog',
				'author': 'Will Carhart',
				'cover': blog.cover
			}
			break
		case 'blog-spec':
			blogs = await parser.parse('blog')
			name = page.split('/').pop().split('.html')[0]
			blog = blogs.filter(b => b.id.toLowerCase().replace(/ /g, '_') === name)[0]
			metaOptions = {
				'title': `${blog.title} | Will Carhart`,
				'description': blog.blurb,
				'url': `https://willcarh.art/blog/${blog.id}`,
				'author': 'Will Carhart',
				'cover': blog.cover
			}
			break
		case 'vault':
			metaOptions = {
				'title': 'Vault | Will Carhart',
				'description': 'Over the years I\'ve written a plethora of software-related paraphernalia. The vault contains my comprehensive history.',
				'url': 'https://willcarh.art/vault',
				'author': 'Will Carhart',
				'cover': '{{cdn:img/og.png}}'
			}
			break
		case 'demo':
			metaOptions = {
				'title': 'Demo | Will Carhart',
				'description': 'Building quality software is what I do. For me, coding is as much a hobby as it is a career. Demos are a great way to try out some of my projects.',
				'url': 'https://willcarh.art/demo',
				'author': 'Will Carhart',
				'cover': '{{cdn:img/og.png}}'
			}
			break
		case 'demo-spec':
			projects = await parser.parse('project')
			name = page.split('/').pop().split('.html')[0]
			project = projects.filter(p => p.name.toLowerCase().replace(/ /g, '_') === name)[0]
			metaOptions = {
				'title': `${project.name} | Demo | Will Carhart`,
				'description': 'Building quality software is what I do. For me, coding is as much a hobby as it is a career. Demos are a great way to try out some of my projects.',
				'url': `https://willcarh.art/demo/${project.id}`,
				'author': 'Will Carhart',
				'cover': project.img
			}
			break
		default:
			throw new Error(`Unknown meta type '${key}'`)
	}
	meta = await buildMetaHtml(metaOptions)
	resolvedData = resolvedData.replace(match, meta)
	return resolvedData
}

// build actual HTML meta tags for meta objects
const buildMetaHtml = async ({title='', description='', url='', keywords=[], author='', cover=''}) => {
	let metaSnippet = await readFilePromise('snippets/meta/meta.html')
	metaSnippet = metaSnippet.toString()

	metaSnippet = metaSnippet.replace(/\{\{title\}\}/g, title)
	metaSnippet = metaSnippet.replace(/\{\{description\}\}/g, description)
	metaSnippet = metaSnippet.replace(/\{\{url\}\}/g, url)
	if (keywords.length === 0) {
		keywords = description.replace(',', '').replace('\'', '').replace(/\./g, '').split(' ')
	}
	metaSnippet = metaSnippet.replace(/\{\{keywords\}\}/g, keywords.filter((v, i, a) => a.indexOf(v) === i).join(','))
	metaSnippet = metaSnippet.replace(/\{\{author\}\}/g, author)
	metaSnippet = metaSnippet.replace(/\{\{version\}\}/g, package.version)
	metaSnippet = metaSnippet.replace(/\{\{cover\}\}/g, cover)

	return metaSnippet
}

// replace {{html:...}} tags
const buildHtml = async (data, match, key, page) => {
	let resolvedData = data
	let experiences = null, projects = null, blogs = null, common = null
	let html = null
	switch (key) {
		case 'exp-tabs':
			experiences = await parser.parse('experience')
			html = await buildExpTabs(experiences)
			break
		case 'proj-super':
			projects = await parser.parse('project')
			html = await buildProjSuper(projects.filter(p => p.visibility === 'super'))
			break
		case 'proj-all':
			projects = await parser.parse('project')
			html = await buildProjAll(projects)
			break
		case 'proj-spec':
			projects = await parser.parse('project')
			html = await buildProjSpec(projects, page)
			break
		case 'blog-latest':
			blogs = await parser.parse('blog')
			html = await buildBlogLatest(blogs)
			break
		case 'blog-all':
			blogs = await parser.parse('blog')
			html = await buildBlogAll(blogs)
			break
		case 'blog-spec':
			blogs = await parser.parse('blog')
			html = await buildBlogSpec(blogs, page)
			break
		case 'vault-rows':
			experiences = await parser.parse('experience')
			projects = await parser.parse('project')
			blogs = await parser.parse('blog')
			html = await buildVaultRows(experiences, projects, blogs)
			break
		case 'demo-rows':
			projects = await parser.parse('project')
			html = await buildDemoRows(projects)
			break
		case 'credits':
		case 'analytics':
		case 'logo':
		case 'darkmode':
		case 'email':
			common = await readFilePromise(`snippets/common/${key}.html`)
			html = common.toString()
			break
		default:
			throw new Error(`Unknown {{html}} key '${key}'`)
	}
	resolvedData = resolvedData.replace(match, html)
	return resolvedData
}

// replace {{code:...}} tags
const buildCode = async (data, match, key) => {
	let resolvedData = data
	let classes = null, files = null, error = null, verifiedData = null
	let projectData = null, newProjects = null, attributes = null
	switch (key) {
		case 'classes':
			classes = []
			files = await readdirPromise('snippets/js')
			for (let file of files) {
				[error, verifiedData] = await tryToCatch(minify, `snippets/js/${file}`, {})
				if (error) {
					throw new Error(error)
				}
				classes.push(verifiedData)
			}
			resolvedData = resolvedData.replace(match, classes.join('\n'))
			break
		case 'proj':
			projectData = await readFilePromise('content/projects.md')
			newProjects = []
			attributes = []
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

// build HTML for latest blog post on blog index
const buildBlogLatest = async (blogs) => {
	// determine latest blog
	let blog = blogs.reduce((latest, current) => { return current.published > latest.published ? current : latest })
	let date = new Date(blog.published * 1000)
	let displayDate = `${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`

	// parse HTML snippets
	let blogLatestSnippet = await readFilePromise('snippets/blog/blog-latest.html')
	blogLatestSnippet = blogLatestSnippet.toString()

	// build HTML
	let html = blogLatestSnippet

	// determine information
	html = html.replace(/\{\{name\}\}/g, blog.id)
	html = html.replace('{{cover}}', blog.cover)
	html = html.replace('{{subtitle}}', blog.subtitle)
	html = html.replace('{{title}}', blog.title)
	html = html.replace('{{technologies}}', blog.resources.join(' · '))
	html = html.replace('{{blurb}}', blog.blurb)
	html = html.replace('{{author}}', blog.author)
	html = html.replace('{{author-img}}', blog.authorImg)
	html = html.replace('{{published}}', displayDate)

	// calculate read time
	let blogMarkdownContent = await readFilePromise(`content/blog/${blog.id}.md`)
	blogMarkdownContent = blogMarkdownContent.toString()
	let wordCount = blogMarkdownContent.split(' ').length
	let readTime = Math.ceil(wordCount / 200)
	html = html.replace('{{readtime}}', `${readTime} min read`)

	return html
}

// build HTML for all blog posts on blog index
const buildBlogAll = async (blogs) => {
	// sort blogs
	let sortedBlogs = blogs.sort((a, b) => {
		if (a.published > b.published) {
			return -1
		} else if (a.published < b.published) {
			return 1
		}
		return 0
	})

	// parse HTML snippets
	let blogRowSnippet = await readFilePromise('snippets/blog/blog-row.html')
	let blogRegularSnippet = await readFilePromise('snippets/blog/blog-regular.html')
	blogRowSnippet = blogRowSnippet.toString()
	blogRegularSnippet = blogRegularSnippet.toString()

	sortedBlogs = sortedBlogs.filter(b => b.hidden === 'false')

	// build HTML
	let html = ''
	for (let rowIndex = 0; rowIndex < sortedBlogs.length / 2; rowIndex++) {
		let rowHtml = blogRowSnippet
		for (let columnIndex = 0; columnIndex < 2; columnIndex++) {
			let index = rowIndex*2 + columnIndex
			if (index >= sortedBlogs.length) {
				rowHtml = rowHtml.replace('{{blog-regular}}', '<div class="col-md-6 row"></div>')
				continue
			}

			// build individual container for each blog
			let blogHtml = blogRegularSnippet
			blogHtml = blogHtml.replace(/\{\{name\}\}/g, sortedBlogs[index].id)
			blogHtml = blogHtml.replace('{{cover}}', sortedBlogs[index].cover)
			blogHtml = blogHtml.replace('{{subtitle}}', sortedBlogs[index].subtitle)
			blogHtml = blogHtml.replace('{{title}}', sortedBlogs[index].title)
			blogHtml = blogHtml.replace('{{technologies}}', sortedBlogs[index].resources.join(' · '))
			blogHtml = blogHtml.replace('{{blurb}}', sortedBlogs[index].blurb)
			blogHtml = blogHtml.replace('{{index}}', index)
			blogHtml = blogHtml.replace('{{row-index}}', rowIndex)
			blogHtml = blogHtml.replace('{{author}}', sortedBlogs[index].author)
			blogHtml = blogHtml.replace('{{author-img}}', sortedBlogs[index].authorImg)

			// calculate date
			let date = new Date(sortedBlogs[index].published * 1000)
			let displayDate = `${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
			blogHtml = blogHtml.replace('{{published}}', displayDate)
			
			// calculate read time
			let blogMarkdownContent = await readFilePromise(`content/blog/${sortedBlogs[index].id}.md`)
			blogMarkdownContent = blogMarkdownContent.toString()
			let wordCount = blogMarkdownContent.split(' ').length
			let readTime = Math.ceil(wordCount / 200)
			blogHtml = blogHtml.replace('{{readtime}}', `${readTime} min read`)

			rowHtml = rowHtml.replace('{{blog-regular}}', blogHtml)
		}
		html += rowHtml
	}

	return html
}

// build HTML for specific blog
const buildBlogSpec = async (blogs, page) => {
	// determine blog
	let blogId = page.split('/').pop().split('.html')[0]
	let blog = blogs.filter(b => b.id === blogId)
	if (blog.length === 0) {
		throw new Error(`No blog data found for '${blogId}'`)
	}
	if (blog.length !== 1) {
		throw new Error(`Multiple blogs found for '${blogId}'`)
	}
	blog = blog[0]

	// sort blogs
	let sortedBlogs = blogs.sort((a, b) => {
		if (a.published > b.published) {
			return -1
		} else if (a.published < b.published) {
			return 1
		}
		return 0
	})

	// get blog markdown comment
	let blogContentFile = `content/blog/${blog.id}.md`
	try {
		await fs.promises.access(blogContentFile)
	} catch (e) {
		throw new Error(`No content file found for blog: '${blog.id}'`)
	}
	blogContentFile = await readFilePromise(blogContentFile)

	// parse HTML snippets
	let specSnippet = await readFilePromise('snippets/blog-spec/spec.html')
	let staleSnippet = await readFilePromise('snippets/blog-spec/stale.html')
	specSnippet = specSnippet.toString()
	staleSnippet = staleSnippet.toString()

	// build HTML
	let html = specSnippet

	// build blog information
	html = html.replace(/\{\{title\}\}/g, blog.title)
	html = html.replace('{{author}}', blog.author)
	html = html.replace('{{author-img}}', blog.authorImg)

	// date calculation
	let date = new Date(blog.published * 1000)
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	const dayEndings = {
		'st': [1,21],
		'nd': [2,22],
		'rd': [3,23],
		'th': [4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,24,25,26,27,28,29,30,31]
	}
	let month = months[date.getMonth()]
	let day = date.getDate()
	let ending = Object.keys(dayEndings).reduce((solution, ending) => { return dayEndings[ending].includes(day) ? ending : solution }, null)
	let year = date.getFullYear()
	let timestamp = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
	let tz = date.toLocaleTimeString('en-us',{timeZoneName:'short'}).split(' ')[2]
	let displayDate = `${month} ${day}${ending}, ${year} at ${timestamp} ${tz}`
	html = html.replace('{{full-datetimestamp}}', displayDate)

	displayDate = ''
	if (blog.updated !== '') {
		date = new Date(blog.updated * 1000)
		month = months[date.getMonth()]
		day = date.getDate()
		ending = Object.keys(dayEndings).reduce((solution, ending) => { return dayEndings[ending].includes(day) ? ending : solution }, null)
		year = date.getFullYear()
		timestamp = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
		tz = date.toLocaleTimeString('en-us',{timeZoneName:'short'}).split(' ')[2]
		displayDate = `Updated on ${month} ${day}${ending}, ${year} at ${timestamp} ${tz}`
	}
	html = html.replace('{{updated-full-datetimestamp}}', displayDate)

	// calculate read time
	let blogMarkdownContent = await readFilePromise(`content/blog/${blog.id}.md`)
	blogMarkdownContent = blogMarkdownContent.toString()
	let wordCount = blogMarkdownContent.split(' ').length
	let readTime = Math.ceil(wordCount / 200)
	html = html.replace('{{word-count}}', wordCount)
	html = html.replace(/\{\{readtime\}\}/g, `${readTime} min read`)
	html = html.replace('{{cover}}', blog.cover)
	html = html.replace('{{subtitle}}', blog.subtitle)
	html = html.replace('{{cover-credit}}', blog.coverCredit)
	html = html.replace('{{cover-author}}', blog.coverAuthor)

	// add next blog link, if possible
	let blogIndex = sortedBlogs.indexOf(blog) + 1
	if (blogIndex === sortedBlogs.length) {
		html = html.replace('{{blog-next}}', await sortedBlogs[0].id)
		html = html.replace('{{blog-title}}', sortedBlogs[0].title)
	} else {
		html = html.replace('{{blog-next}}', await sortedBlogs[blogIndex].id)
		html = html.replace('{{blog-title}}', sortedBlogs[blogIndex].title)
	}

	// build blog content
	let blogContent = await markdown.convert(blogContentFile.toString(), page)
	html = html.replace('{{blog-content}}', blogContent)

	// check if is stale
	if (blog.status === 'stale') {
		html = html.replace('{{stale}}', staleSnippet)
	} else {
		html = html.replace('{{stale}}', '')
	}

	return html
}

// build HTML for specific project
const buildProjSpec = async (projects, page) => {
	// determine project name
	let name = page.split('/').pop().split('.html')[0]

	// we need to replace space with an underscore in order for filename to resolve
	let project = projects.filter(p => p.name.toLowerCase().replace(/ /g, '_') === name)
	if (project.length === 0) {
		throw new Error(`No project data found for '${name}'`)
	}
	if (project.length !== 1) {
		throw new Error(`Multiple projects found for '${name}'`)
	}
	project = project[0]

	// get project markdown content
	let projectContentFile = `content/project/${name}.md`
	try {
		await fs.promises.access(projectContentFile)
	} catch (e) {
		throw new Error(`No content file found for project: '${name}'`)
	}
	projectContentFile = await readFilePromise(projectContentFile)

	// parse HTML snippets
	let specSnippet = await readFilePromise('snippets/project-spec/spec.html')
	let technologiesMetadataSnippet = await readFilePromise('snippets/project-spec/metadata/technologies-project-metadata.html')
	let githubStarsMetadataSnippet = await readFilePromise('snippets/project-spec/metadata/github-stars-project-metadata.html')
	let installMetadataSnippet = await readFilePromise('snippets/project-spec/metadata/install-project-metadata.html')
	let latestReleaseMetadataSnippet = await readFilePromise('snippets/project-spec/metadata/latest-release-project-metadata.html')
	let publishDateMetadataSnippet = await readFilePromise('snippets/project-spec/metadata/publish-date-project-metadata.html')
	let relatedProjectsMetadataSnippet = await readFilePromise('snippets/project-spec/metadata/related-projects-project-metadata.html')
	let relatedProjectLinkMetadataSnippet = await readFilePromise('snippets/project-spec/metadata/related-project-link-project-metadata.html')
	let statusMetadataSnippet = await readFilePromise('snippets/project-spec/metadata/status-project-metadata.html')
	let demoIconSnippet = await readFilePromise('snippets/linkicons/demo-icon.html')
	let docsIconSnippet = await readFilePromise('snippets/linkicons/docs-icon.html')
	let githubIconSnippet = await readFilePromise('snippets/linkicons/github-icon.html')
	let linkIconSnippet = await readFilePromise('snippets/linkicons/link-icon.html')
	let blogIconSnippet = await readFilePromise('snippets/linkicons/blog-icon.html')
	specSnippet = specSnippet.toString()
	technologiesMetadataSnippet = technologiesMetadataSnippet.toString()
	githubStarsMetadataSnippet = githubStarsMetadataSnippet.toString()
	installMetadataSnippet = installMetadataSnippet.toString()
	latestReleaseMetadataSnippet = latestReleaseMetadataSnippet.toString()
	publishDateMetadataSnippet = publishDateMetadataSnippet.toString()
	relatedProjectsMetadataSnippet = relatedProjectsMetadataSnippet.toString()
	relatedProjectLinkMetadataSnippet = relatedProjectLinkMetadataSnippet.toString()
	statusMetadataSnippet = statusMetadataSnippet.toString()
	demoIconSnippet = demoIconSnippet.toString()
	docsIconSnippet = docsIconSnippet.toString()
	githubIconSnippet = githubIconSnippet.toString()
	linkIconSnippet = linkIconSnippet.toString()
	blogIconSnippet = blogIconSnippet.toString()

	// build HTML
	let html = specSnippet

	// build basic information
	html = html.replace('{{name}}', project.name)
	html = html.replace('{{logo}}', project.img)
	html = html.replace('{{title}}', project.name[0].toUpperCase() + project.name.slice(1))
	html = html.replace('{{blurb}}', project.blurb)
	html = html.replace(
		'{{technologies}}',
		project.languages.concat(project.technologies).filter(p => p !== '').join(' · ')
	)

	// build links
	let githubIconHtml = '', docsIconHtml = '', demoIconHtml = '', linkIconHtml = '', blogIconHtml=''
	if (project.repo !== '') {
		githubIconHtml = githubIconSnippet.replace('{{repo}}', project.repo)
	}
	if (project.documentation !== '') {
		docsIconHtml = docsIconSnippet.replace('{{docs}}', project.documentation)
	}
	if (project.demo === 'true') {
		demoIconHtml = demoIconSnippet.replace('{{name}}', project.name.toLowerCase())
	}
	if (project.link !== '') {
		linkIconHtml = linkIconSnippet.replace('{{url}}', project.link)
	}
	if (project.blogPost !== '') {
		blogIconHtml = blogIconSnippet.replace('{{blog}}', project.blogPost)
	}
	html = html.replace(/\{\{github-icon\}\}/g, githubIconHtml)
	html = html.replace(/\{\{docs-icon\}\}/g, docsIconHtml)
	html = html.replace(/\{\{demo-icon\}\}/g, demoIconHtml)
	html = html.replace(/\{\{link-icon\}\}/g, linkIconHtml)
	html = html.replace(/\{\{blog-icon\}\}/g, blogIconHtml)

	// build project metadata
	let technologiesMetadataHtml = technologiesMetadataSnippet.replace('{{technologies}}', project.languages.concat(project.technologies).filter(p => p !== '').join(' · '))
	// TODO: implement github stars
	let githubStarsMetadataHtml = githubStarsMetadataSnippet.replace('{{github-stars}}', '-')
	let installMetadataHtml = ''
	if (project.install === '') {
		installMetadataHtml = installMetadataSnippet.replace('{{install}}', '-')
	} else {
		installMetadataHtml = installMetadataSnippet.replace('{{install}}', `<code class="inline-code">${project.install}</code>`)
	}
	let latestReleaseMetadataHtml = latestReleaseMetadataSnippet.replace('{{version}}', project.latest_version === '' ? '-' : project.latest_version)
	let dateText = '-'
	if (project.published !== '') {
		let date = new Date(project.published * 1000)
		dateText = `${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
	}
	let publishDateMetadataHtml = publishDateMetadataSnippet.replace('{{publish-date}}', dateText)
	let relatedProjectLinks = []
	for (let related of project.related) {
		if (related === '') {
			continue
		}
		let linkHtml = relatedProjectLinkMetadataSnippet.replace(/\{\{name\}\}/g, related)
		relatedProjectLinks.push(linkHtml)
	}
	let relatedProjectsMetadataHtml = ''
	if (relatedProjectLinks.length !== 0) {
		relatedProjectsMetadataHtml = relatedProjectsMetadataSnippet.replace('{{links}}', relatedProjectLinks.join('&nbsp;&nbsp;·&nbsp;&nbsp;'))
	} else {
		relatedProjectsMetadataHtml = relatedProjectsMetadataSnippet.replace('{{links}}', '-')
	}
	let statusMetadataHtml = statusMetadataSnippet.replace('{{status}}', project.status)
	html = html.replace('{{technologies-metadata}}', technologiesMetadataHtml)
	html = html.replace('{{github-stars-metadata}}', githubStarsMetadataHtml)
	html = html.replace('{{install-metadata}}', installMetadataHtml)
	html = html.replace('{{publish-date-metadata}}', latestReleaseMetadataHtml)
	html = html.replace('{{latest-release-metadata}}', publishDateMetadataHtml)
	html = html.replace('{{status-metadata}}', relatedProjectsMetadataHtml)
	html = html.replace('{{related-projects-metadata}}', statusMetadataHtml)

	// build project content
	let projectContent = await markdown.convert(projectContentFile.toString(), page)
	html = html.replace('{{project-content}}', projectContent)

	return html
}

// build demo rows
const buildDemoRows = async (projects) => {
	// parse HTML snippets
	let demoProjectContainerSnippet = await readFilePromise('snippets/demo/demo-project-container.html')
	demoProjectContainerSnippet = demoProjectContainerSnippet.toString()

	// build HTML
	let html = ''
	for (let p of projects) {
		if (p.demo !== 'true') {
			continue
		}
		let rowHtml = demoProjectContainerSnippet

		rowHtml = rowHtml.replace(/\{\{name\}\}/g, p.name)
		rowHtml = rowHtml.replace('{{logo}}', p.img)

		html += rowHtml
	}

	return html
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
	let blogIconSnippet = await readFilePromise('snippets/linkicons/blog-icon.html')
	projectContainerSuperSnippet = projectContainerSuperSnippet.toString()
	projectRowSuperSnippet = projectRowSuperSnippet.toString()
	demoIconSnippet = demoIconSnippet.toString()
	docsIconSnippet = docsIconSnippet.toString()
	githubIconSnippet = githubIconSnippet.toString()
	linkIconSnippet = linkIconSnippet.toString()
	blogIconSnippet = blogIconSnippet.toString()

	// build HTML
	let html = ''
	for (let superIndex = 0; superIndex < projects.length / 2 ; superIndex++) {
		let rowHtml = projectRowSuperSnippet
		let superContainer = ''
		for (let subIndex = 0; subIndex < 2 ; subIndex++) {

			let index = 2*superIndex + subIndex
			if (index >= projects.length) {
				rowHtml = rowHtml.replace('{{project-container-super}}', '')
				continue
			}
			superContainer = projectContainerSuperSnippet.replace(/\{\{name\}\}/g, await htmlSafify(projects[index].name))
			superContainer = superContainer.replace('{{title}}', projects[index].name)
			superContainer = superContainer.replace('{{blurb}}', projects[index].blurb)
			superContainer = superContainer.replace(
				'{{technologies}}',
				projects[index].languages.concat(projects[index].technologies).filter(p => p !== '').join(' · ')
			)

			let githubIconHtml = '', docsIconHtml = '', demoIconHtml = '', linkIconHtml = '', blogIconHtml = ''
			if (projects[index].repo !== '') {
				githubIconHtml = githubIconSnippet.replace('{{repo}}', projects[index].repo)
			}
			if (projects[index].documentation !== '') {
				docsIconHtml = docsIconSnippet.replace('{{docs}}', projects[index].documentation)
			}
			if (projects[index].demo === 'true') {
				demoIconHtml = demoIconSnippet.replace('{{name}}', projects[index].name.toLowerCase())
			}
			if (projects[index].link !== '') {
				linkIconHtml = linkIconSnippet.replace('{{url}}', projects[index].link)
			}
			if (projects[index].blogPost !== '') {
				linkIconHtml = blogIconSnippet.replace('{{blog}}', projects[index].blogPost)
			}

			superContainer = superContainer.replace('{{github-icon}}', githubIconHtml)
			superContainer = superContainer.replace('{{docs-icon}}', docsIconHtml)
			superContainer = superContainer.replace('{{demo-icon}}', demoIconHtml)
			superContainer = superContainer.replace('{{link-icon}}', linkIconHtml)
			superContainer = superContainer.replace('{{blog-icon}}', blogIconHtml)
			rowHtml = rowHtml.replace('{{project-container-super}}', superContainer)
		}
		html += rowHtml
	}
	return html
}

const htmlSafify = async (string) => {
	return string.toLowerCase().replace(/\./g, '----').replace(/#/g, '').replace(/ /g, '_').replace(/,/g, '').replace(/'/g, '')
}

// build all project rows
const buildProjAll = async (projects) => {
	// parse HTML snippets
	let projectContainerFeaturedSnippet = await readFilePromise('snippets/projects/project-container-featured.html')
	let projectContainerRegularSnippet = await readFilePromise('snippets/projects/project-container-regular.html')
	let projectRowFeaturedLeftSnippet = await readFilePromise('snippets/projects/project-row-featured-left.html')
	let projectRowFeaturedRightSnippet = await readFilePromise('snippets/projects/project-row-featured-right.html')
	let projectRowNormalSnippet = await readFilePromise('snippets/projects/project-row-normal.html')
	let demoIconSnippet = await readFilePromise('snippets/linkicons/demo-icon.html')
	let docsIconSnippet = await readFilePromise('snippets/linkicons/docs-icon.html')
	let githubIconSnippet = await readFilePromise('snippets/linkicons/github-icon.html')
	let linkIconSnippet = await readFilePromise('snippets/linkicons/link-icon.html')
	let blogIconSnippet = await readFilePromise('snippets/linkicons/blog-icon.html')
	projectContainerFeaturedSnippet = projectContainerFeaturedSnippet.toString()
	projectContainerRegularSnippet = projectContainerRegularSnippet.toString()
	projectRowFeaturedLeftSnippet = projectRowFeaturedLeftSnippet.toString()
	projectRowFeaturedRightSnippet = projectRowFeaturedRightSnippet.toString()
	projectRowNormalSnippet = projectRowNormalSnippet.toString()
	demoIconSnippet = demoIconSnippet.toString()
	docsIconSnippet = docsIconSnippet.toString()
	githubIconSnippet = githubIconSnippet.toString()
	linkIconSnippet = linkIconSnippet.toString()
	blogIconSnippet = blogIconSnippet.toString()

	// sort projects
	let superProjects = []
	let featuredProjects = []
	let normalProjects = []
	let lessProjects = []
	for (let p of projects) {
		switch (p.visibility) {
			case 'super':
				superProjects.push(p)
				break
			case 'featured':
				featuredProjects.push(p)
				break
			case 'normal':
				normalProjects.push(p)
				break
			case 'less':
				lessProjects.push(p)
				break
			case 'none':
				break
			default:
				throw new Error(`Unknown project visibility: '${p.visibility}'`)
		}
	}

	// build HTML
	let html = ''

	// build featured rows first
	for (let [index, project] of superProjects.entries()) {

		// build row HTML
		let rowHtml = index % 2 === 0 ? projectRowFeaturedLeftSnippet : projectRowFeaturedRightSnippet 
		let featuredContainer = projectContainerFeaturedSnippet

		// build container for super project in proj-all
		featuredContainer = featuredContainer.replace('{{class}}', `proj-row-${index}`)
		featuredContainer = featuredContainer.replace(/\{\{name\}\}/g, await htmlSafify(project.name))
		featuredContainer = featuredContainer.replace('{{title}}', project.name)
		featuredContainer = featuredContainer.replace('{{blurb}}', project.blurb)
		featuredContainer = featuredContainer.replace('{{about}}', project.about)
		featuredContainer = featuredContainer.replace(
			'{{technologies}}',
			project.languages.concat(project.technologies).filter(p => p !== '').join(' · ')
		)
		let githubIconHtml = '', docsIconHtml = '', demoIconHtml = '', linkIconHtml = '', blogIconHtml = ''
		if (project.repo !== '') {
			githubIconHtml = githubIconSnippet.replace('{{repo}}', project.repo)
		}
		if (project.documentation !== '') {
			docsIconHtml = docsIconSnippet.replace('{{docs}}', project.documentation)
		}
		if (project.demo === 'true') {
			demoIconHtml = demoIconSnippet.replace('{{name}}', project.name.toLowerCase())
		}
		if (project.link !== '') {
			linkIconHtml = linkIconSnippet.replace('{{url}}', project.link)
		}
		if (project.blogPost !== '') {
			linkIconHtml = blogIconSnippet.replace('{{blog}}', project.blogPost)
		}

		featuredContainer = featuredContainer.replace('{{github-icon}}', githubIconHtml)
		featuredContainer = featuredContainer.replace('{{docs-icon}}', docsIconHtml)
		featuredContainer = featuredContainer.replace('{{demo-icon}}', demoIconHtml)
		featuredContainer = featuredContainer.replace('{{link-icon}}', linkIconHtml)
		featuredContainer = featuredContainer.replace('{{blog-icon}}', blogIconHtml)
		rowHtml = rowHtml.replace('{{project-container-featured}}', featuredContainer)

		// build additional tile containers to fit in row
		// this could probably be more DRY....but I am lazy
		for (let i = 0; i < 4; i++) {
			let tileProject = null
			if (featuredProjects.length !== 0) {
				tileProject = featuredProjects.pop()
			} else if (normalProjects.length !== 0) {
				tileProject = normalProjects.pop()
			} else {
				throw new Error('Insufficient project combinations, either too many super projects or too few featured + normal projects')
			}

			let projRowClass = 'proj-mini-top'
			if (i > 1) {
				projRowClass = 'proj-mini-bottom'
			}

			let tileContainer = projectContainerRegularSnippet
			tileContainer = tileContainer.replace('{{class}}', `proj-row-${index} ${projRowClass}`)
			tileContainer = tileContainer.replace(/\{\{name\}\}/g, await htmlSafify(tileProject.name))
			tileContainer = tileContainer.replace('{{title}}', tileProject.name)
			tileContainer = tileContainer.replace('{{blurb}}', tileProject.blurb)
			tileContainer = tileContainer.replace('{{logo}}', tileProject.img)
			tileContainer = tileContainer.replace(
				'{{technologies}}',
				tileProject.languages.concat(tileProject.technologies).filter(p => p !== '').join(' · ')
			)
			let githubIconHtml = '', docsIconHtml = '', demoIconHtml = '', linkIconHtml = '', blogIconHtml = ''
			if (tileProject.repo !== '') {
				githubIconHtml = githubIconSnippet.replace('{{repo}}', tileProject.repo)
			}
			if (tileProject.documentation !== '') {
				docsIconHtml = docsIconSnippet.replace('{{docs}}', tileProject.documentation)
			}
			if (tileProject.demo === 'true') {
				demoIconHtml = demoIconSnippet.replace('{{name}}', tileProject.name.toLowerCase())
			}
			if (tileProject.link !== '') {
				linkIconHtml = linkIconSnippet.replace('{{url}}', tileProject.link)
			}
			if (tileProject.blogPost !== '') {
				blogIconHtml = blogIconSnippet.replace('{{blog}}', tileProject.blogPost)
			}

			tileContainer = tileContainer.replace('{{github-icon}}', githubIconHtml)
			tileContainer = tileContainer.replace('{{docs-icon}}', docsIconHtml)
			tileContainer = tileContainer.replace('{{demo-icon}}', demoIconHtml)
			tileContainer = tileContainer.replace('{{link-icon}}', linkIconHtml)
			tileContainer = tileContainer.replace('{{blog-icon}}', blogIconHtml)
			rowHtml = rowHtml.replace('{{project-container-regular}}', tileContainer)
		}

		html += rowHtml
	}

	// then, build normal rows
	let normalIndex = 0
	while (featuredProjects.length !== 0 || normalProjects.length !== 0 || lessProjects.length !== 0) {
		let rowHtml = projectRowNormalSnippet

		for (let i = 0; i < 4; i++) {
			let project = null
			if (featuredProjects.length !== 0) {
				project = featuredProjects.pop()
			} else if (normalProjects.length !== 0) {
				project = normalProjects.pop()
			} else if (lessProjects.length !== 0) {
				project = lessProjects.pop()
			} else {
				continue
			}

			let projContainer = projectContainerRegularSnippet
			projContainer = projContainer.replace('{{class}}', `proj-normal-row-${normalIndex} proj-normal`)
			projContainer = projContainer.replace(/\{\{name\}\}/g, await htmlSafify(project.name))
			projContainer = projContainer.replace('{{title}}', project.name)
			projContainer = projContainer.replace('{{blurb}}', project.blurb)
			projContainer = projContainer.replace('{{logo}}', project.img)
			projContainer = projContainer.replace(
				'{{technologies}}',
				project.languages.concat(project.technologies).filter(p => p !== '').join(' · ')
			)
			let githubIconHtml = '', docsIconHtml = '', demoIconHtml = '', linkIconHtml = '', blogIconHtml = ''
			if (project.repo !== '') {
				githubIconHtml = githubIconSnippet.replace('{{repo}}', project.repo)
			}
			if (project.documentation !== '') {
				docsIconHtml = docsIconSnippet.replace('{{docs}}', project.documentation)
			}
			if (project.demo === 'true') {
				demoIconHtml = demoIconSnippet.replace('{{name}}', project.name.toLowerCase())
			}
			if (project.link !== '') {
				linkIconHtml = linkIconSnippet.replace('{{url}}', project.link)
			}
			if (project.blogPost !== '') {
				blogIconHtml = blogIconSnippet.replace('{{blog}}', project.blogPost)
			}

			projContainer = projContainer.replace('{{github-icon}}', githubIconHtml)
			projContainer = projContainer.replace('{{docs-icon}}', docsIconHtml)
			projContainer = projContainer.replace('{{demo-icon}}', demoIconHtml)
			projContainer = projContainer.replace('{{link-icon}}', linkIconHtml)
			projContainer = projContainer.replace('{{blog-icon}}', blogIconHtml)
			rowHtml = rowHtml.replace('{{project-container-regular}}', projContainer)
		}

		normalIndex += 1
		rowHtml = rowHtml.replace(/\{\{project-container-regular\}\}/g, '')
		html += rowHtml
	}

	return html
}

// build vault rows HTML
const buildVaultRows = async (experiences, projects, blogs) => {
	// parse HTML snippets
	let vaultRowsSnippet = await readFilePromise('snippets/vault/vault-row.html')
	let demoIconSnippet = await readFilePromise('snippets/linkicons/demo-icon.html')
	let docsIconSnippet = await readFilePromise('snippets/linkicons/docs-icon.html')
	let githubIconSnippet = await readFilePromise('snippets/linkicons/github-icon.html')
	let linkIconSnippet = await readFilePromise('snippets/linkicons/link-icon.html')
	let blogIconSnippet = await readFilePromise('snippets/linkicons/blog-icon.html')
	vaultRowsSnippet = vaultRowsSnippet.toString()
	demoIconSnippet = demoIconSnippet.toString()
	docsIconSnippet = docsIconSnippet.toString()
	githubIconSnippet = githubIconSnippet.toString()
	linkIconSnippet = linkIconSnippet.toString()
	blogIconSnippet = blogIconSnippet.toString()

	// template for how we will fill in the rows
	class RowTemplate {
		constructor({year='', sortDate='', title='', type='', resources=[], demoName='', docsName='', githubName='', linkUrl='', blogPost='', vaultLink=''}) {
			this.year = year
			this.sortDate = sortDate
			this.title = title
			this.type = type
			this.resources = resources
			this.demoName = demoName
			this.docsName = docsName
			this.githubName = githubName
			this.linkUrl = linkUrl
			this.blogPost = blogPost
			this.vaultLink = vaultLink
		}
	}
	let rows = []

	// parse experiences into rows
	for (let experience of experiences) {
		for (let [index, ] of experience.title.entries()) {
			let r = new RowTemplate({})
			let yearDate = new Date(experience.date[index]*1000)
			r.year = yearDate.getFullYear()
			r.sortDate = experience.date[index]
			r.title = `${experience.title[index]} @ ${experience.company}`
			r.type = 'experience'
			r.resources = experience.languagesAndLibraries.concat(experience.platforms.concat(experience.infrastructure))
			r.demoName = ''
			r.docsName = ''
			r.githubName = ''
			r.linkUrl = experience.url
			r.blogPost = experience.blogPost
			r.vaultLink = `{{src:about}}?exp=${experience.companyId}#experience`

			rows.push(r)
		}
	}

	// parse projects into rows
	for (let project of projects) {
		if (project.status === 'in development') {
			continue
		}
		let r = new RowTemplate({})
		let date = new Date(project.published * 1000)
		r.year = date.getFullYear()
		r.sortDate = project.published
		r.title = project.name
		r.type = 'project'
		r.resources = project.languages.concat(project.technologies)
		r.demoName = project.demo === 'true' ? project.name.toLowerCase() : ''
		r.docsName = project.documentation
		r.githubName = project.repo
		r.linkUrl = project.link
		r.blogPost = project.blogPost
		r.vaultLink = `{{src:project/${project.id}}}`

		rows.push(r)
	}

	// parse blog posts into rows
	for (let blog of blogs) {
		let r = new RowTemplate({})
		let date = new Date(blog.published * 1000)
		r.year = date.getFullYear()
		r.sortDate = blog.published
		r.title = blog.title
		r.type = 'blog'
		r.resources = blog.resources
		r.demoName = ''
		r.docsName = ''
		r.githubName = ''
		r.linkUrl = ''
		r.blogPost = `{{src:blog/${blog.id}}}`
		r.vaultLink = r.blogPost

		rows.push(r)
	}

	// sort rows based on year, prioritizing projects
	rows.sort((a, b) => {
		if (a.sortDate > b.sortDate) {
			return -1
		} else if (a.sortDate < b.sortDate) {
			return 1
		} else {
			if (a.type === 'experience') {
				return -1
			} else {
				return 1
			}
		}
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

		let linkHtml = ''
		if (row.githubName !== '') {
			linkHtml += githubIconSnippet.replace('{{repo}}', row.githubName)
		}
		if (row.docsName !== '') {
			linkHtml += docsIconSnippet.replace('{{docs}}', row.docsName)
		}
		if (row.blogPost !== '') {
			linkHtml += blogIconSnippet.replace('{{blog}}', row.blogPost)
		}
		if (row.demoName !== '') {
			linkHtml += demoIconSnippet.replace('{{name}}', row.demoName)
		}
		if (row.linkUrl !== '') {
			linkHtml += linkIconSnippet.replace('{{url}}', row.linkUrl)
		}
		newRow = newRow.replace('{{links}}', linkHtml)
		newRow = newRow.replace('{{vault-link}}', row.vaultLink)

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
		content = content.replace('{{date}}', experience.displayDate)
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

// build string for instatiating a new project
const buildNewProjectString = async (attributes) => {
	let template = {
		name: '',
		blurb: '',
		about: '',
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
		if (['languages', 'technologies', 'related', 'tags'].includes(key)) {
			template[key].push(value)
		} else {
			template[key] = value
		}
	}
	// eslint-disable-next-line quotes
	return `ALL_PROJECTS.push(new Project(JSON.parse('${JSON.stringify(template).replace("'", "\\'")}')))`
}

// TODO
// build string for instatiating a new blog post
// eslint-disable-next-line no-unused-vars
const buildNewBlogString = async (attributes) => {
	return
}

// replace content tags in template
const resolveContent = async (data, page) => {
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
						resolvedData = await buildHtml(resolvedData, match, value, page)
						break
					case 'code':
						resolvedData = await buildCode(resolvedData, match, value)
						break
					case 'meta':
						resolvedData = await buildMeta(resolvedData, match, value, page)
						break
					default:
						throw new Error(`Unknown tag '${tag}'`)
				}
			}
		}
	}
	return resolvedData
}

module.exports = {
	resolveContent: resolveContent
}