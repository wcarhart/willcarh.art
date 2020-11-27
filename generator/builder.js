const fs = require('fs')
const util = require('util')

const minify = require('minify')
const tryToCatch = require('try-to-catch')

const parser = require('./parser.js')
const markdown = require('./markdown.js')

const readdirPromise = util.promisify(fs.readdir)
const readFilePromise = util.promisify(fs.readFile)
const copyFilePromise = util.promisify(fs.copyFile)

// build meta objects for webpages
const buildMeta = async (data, match, key, page) => {
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
		case 'proj-spec':
			let projectName = page.split('/').pop().split('.html')[0]
			meta = await buildMetaHtml({description: projectName, url: `https://willcarh.art/project/${projectName}`})
			resolvedData = resolvedData.replace(match, meta)
			break
		case 'blog':
			meta = await buildMetaHtml({description: 'Will Carhart\'s blog', url: 'https://willcarh.art/blog'})
			resolvedData = resolvedData.replace(match, meta)
			break
		case 'blog-spec':
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
		case 'demo-spec':
			let demoName = page.split('/').pop().split('.html')[0]
			meta = await buildMetaHtml({description: `${demoName} demo`, url: `https://willcarh.art/project/${demoName}`})
			resolvedData = resolvedData.replace(match, meta)
			break
		default:
			throw new Error(`Unknown meta type '${key}'`)
	}
	return resolvedData
}

// build actual HTML meta tags for meta objects
const buildMetaHtml = async ({description='', url=''}) => {
	let metaSnippet = await readFilePromise('snippets/meta/meta.html')
	metaSnippet = metaSnippet.toString()

	metaSnippet = metaSnippet.replace(/\{\{description\}\}/g, description)
	metaSnippet = metaSnippet.replace(/\{\{url\}\}/g, url)

	return metaSnippet
}

// replace {{html:...}} tags
const buildHtml = async (data, match, key, page) => {
	let resolvedData = data
	let experiences = null, projects = null, blogs = null
	let html = null
	switch (key) {
		case 'exp-tabs':
			experiences = await parser.parseExperiences()
			html = await buildExpTabs(experiences)
			resolvedData = resolvedData.replace(match, html)
			break
		case 'proj-super':
			projects = await parser.parseProjects()
			html = await buildProjSuper(projects.filter(p => p.visibility === 'super'))
			resolvedData = resolvedData.replace(match, html)
			break
		case 'proj-all':
			projects = await parser.parseProjects()
			html = await buildProjAll(projects)
			resolvedData = resolvedData.replace(match, html)
			break
		case 'proj-spec':
			projects = await parser.parseProjects()
			html = await buildProjectSpec(projects, page)
			resolvedData = resolvedData.replace(match, html)
			break
		case 'vault-rows':
			experiences = await parser.parseExperiences()
			projects = await parser.parseProjects()
			blogs = await parser.parseBlogs()
			html = await buildVaultRows(experiences, projects, blogs)
			resolvedData = resolvedData.replace(match, html)
			break
		case 'demo-rows':
			projects = await parser.parseProjects()
			html = await buildDemoRows(projects)
			resolvedData = resolvedData.replace(match, html)
			break
		default:
			throw new Error(`Unknown {{html}} key '${key}'`)
	}
	return resolvedData
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

const buildProjectSpec = async (projects, page) => {
	// determine project name
	let name = page.split('/').pop().split('.html')[0]
	let project = projects.filter(p => p.name.toLowerCase() === name)
	if (project.length === 0) {
		throw new Error(`No project data found for '${name}'`)
	}
	if (project.length !== 1) {
		throw new Error(`Multiple projects found for '${name}'`)
	}
	project = project[0]

	// read in snippets
	let specSnippet = await readFilePromise('snippets/project/spec.html')
	
	let technologiesMetadataSnippet = await readFilePromise('snippets/project/metadata/technologies-project-metadata.html')
	let githubStarsMetadataSnippet = await readFilePromise('snippets/project/metadata/github-stars-project-metadata.html')
	let installMetadataSnippet = await readFilePromise('snippets/project/metadata/install-project-metadata.html')
	let latestReleaseMetadataSnippet = await readFilePromise('snippets/project/metadata/latest-release-project-metadata.html')
	let publishDateMetadataSnippet = await readFilePromise('snippets/project/metadata/publish-date-project-metadata.html')
	let relatedProjectsMetadataSnippet = await readFilePromise('snippets/project/metadata/related-projects-project-metadata.html')
	let relatedProjectLinkMetadataSnippet = await readFilePromise('snippets/project/metadata/related-project-link-project-metadata.html')
	let statusMetadataSnippet = await readFilePromise('snippets/project/metadata/status-project-metadata.html')
	let demoIconSnippet = await readFilePromise('snippets/linkicons/demo-icon.html')
	let docsIconSnippet = await readFilePromise('snippets/linkicons/docs-icon.html')
	let githubIconSnippet = await readFilePromise('snippets/linkicons/github-icon.html')
	let linkIconSnippet = await readFilePromise('snippets/linkicons/link-icon.html')

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
	let githubIconHtml = '', docsIconHtml = '', demoIconHtml = '', linkIconHtml = ''
	if (project.repo !== '') {
		githubIconHtml = githubIconSnippet.replace('{{name}}', project.name.toLowerCase())
	}
	if (project.documentation !== '') {
		docsIconHtml = docsIconSnippet.replace('{{name}}', project.name.toLowerCase())
	}
	if (project.demo === 'true') {
		demoIconHtml = demoIconSnippet.replace('{{name}}', project.name.toLowerCase())
	}
	if (project.link !== '') {
		linkIconHtml = linkIconSnippet.replace('{{url}}', project.link)
	}
	html = html.replace(/\{\{github-icon\}\}/g, githubIconHtml)
	html = html.replace(/\{\{docs-icon\}\}/g, docsIconHtml)
	html = html.replace(/\{\{demo-icon\}\}/g, demoIconHtml)
	html = html.replace(/\{\{link-icon\}\}/g, linkIconHtml)

	// build project metadata
	let technologiesMetadataHtml = technologiesMetadataSnippet.replace('{{technologies}}', project.languages.concat(project.technologies).filter(p => p !== '').join(' · '))
	// TODO: implement github stars
	let githubStarsMetadataHtml = githubStarsMetadataSnippet.replace('{{github-stars}}', '-')
	// TODO: if install is empty, should not use color nor monospace font
	let installMetadataHtml = installMetadataSnippet.replace('{{install}}', project.install === '' ? '-' : project.install)
	let latestReleaseMetadataHtml = latestReleaseMetadataSnippet.replace('{{version}}', project.latest_version === '' ? '-' : project.latest_version)
	let publishDateMetadataHtml = publishDateMetadataSnippet.replace('{{publish-date}}', project.published === '' ? '-' : project.published)
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
	let projectMarkdown = await readFilePromise(`content/project/${name}.md`)
	let projectContent = await markdown.convert(projectMarkdown.toString())
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

	projectContainerSuperSnippet = projectContainerSuperSnippet.toString()
	projectRowSuperSnippet = projectRowSuperSnippet.toString()
	demoIconSnippet = demoIconSnippet.toString()
	docsIconSnippet = docsIconSnippet.toString()
	githubIconSnippet = githubIconSnippet.toString()
	linkIconSnippet = linkIconSnippet.toString()

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
			if (projects[index].demo === 'true') {
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
	}
	return html
}

// TODO: 'about' for projects shouldn't be an array, and we shouldn't use about[0]
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
	
	projectContainerFeaturedSnippet = projectContainerFeaturedSnippet.toString()
	projectContainerRegularSnippet = projectContainerRegularSnippet.toString()
	projectRowFeaturedLeftSnippet = projectRowFeaturedLeftSnippet.toString()
	projectRowFeaturedRightSnippet = projectRowFeaturedRightSnippet.toString()
	projectRowNormalSnippet = projectRowNormalSnippet.toString()
	demoIconSnippet = demoIconSnippet.toString()
	docsIconSnippet = docsIconSnippet.toString()
	githubIconSnippet = githubIconSnippet.toString()
	linkIconSnippet = linkIconSnippet.toString()

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
		featuredContainer = featuredContainer.replace(/\{\{name\}\}/g, project.name.toLowerCase())
		featuredContainer = featuredContainer.replace('{{title}}', project.name)
		featuredContainer = featuredContainer.replace('{{blurb}}', project.blurb)
		featuredContainer = featuredContainer.replace('{{about}}', project.about[0])
		featuredContainer = featuredContainer.replace(
			'{{technologies}}',
			project.languages.concat(project.technologies).filter(p => p !== '').join(' · ')
		)
		let githubIconHtml = '', docsIconHtml = '', demoIconHtml = '', linkIconHtml = ''
		if (project.repo !== '') {
			githubIconHtml = githubIconSnippet.replace('{{name}}', project.name.toLowerCase())
		}
		if (project.documentation !== '') {
			docsIconHtml = docsIconSnippet.replace('{{name}}', project.name.toLowerCase())
		}
		if (project.demo === 'true') {
			demoIconHtml = demoIconSnippet.replace('{{name}}', project.name.toLowerCase())
		}
		if (project.link !== '') {
			linkIconHtml = linkIconSnippet.replace('{{url}}', project.link)
		}

		featuredContainer = featuredContainer.replace('{{github-icon}}', githubIconHtml)
		featuredContainer = featuredContainer.replace('{{docs-icon}}', docsIconHtml)
		featuredContainer = featuredContainer.replace('{{demo-icon}}', demoIconHtml)
		featuredContainer = featuredContainer.replace('{{link-icon}}', linkIconHtml)
		rowHtml = rowHtml.replace('{{project-container-featured}}', featuredContainer)

		// build additional tile containers to fit in row
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
			tileContainer = tileContainer.replace(/\{\{name\}\}/g, tileProject.name.toLowerCase())
			tileContainer = tileContainer.replace('{{title}}', tileProject.name)
			tileContainer = tileContainer.replace('{{blurb}}', tileProject.blurb)
			tileContainer = tileContainer.replace('{{logo}}', tileProject.img)
			tileContainer = tileContainer.replace(
				'{{technologies}}',
				tileProject.languages.concat(tileProject.technologies).filter(p => p !== '').join(' · ')
			)
			let githubIconHtml = '', docsIconHtml = '', demoIconHtml = '', linkIconHtml = ''
			if (tileProject.repo !== '') {
				githubIconHtml = githubIconSnippet.replace('{{name}}', tileProject.name.toLowerCase())
			}
			if (tileProject.documentation !== '') {
				docsIconHtml = docsIconSnippet.replace('{{name}}', tileProject.name.toLowerCase())
			}
			if (tileProject.demo === 'true') {
				demoIconHtml = demoIconSnippet.replace('{{name}}', tileProject.name.toLowerCase())
			}
			if (tileProject.link !== '') {
				linkIconHtml = linkIconSnippet.replace('{{url}}', tileProject.link)
			}

			tileContainer = tileContainer.replace('{{github-icon}}', githubIconHtml)
			tileContainer = tileContainer.replace('{{docs-icon}}', docsIconHtml)
			tileContainer = tileContainer.replace('{{demo-icon}}', demoIconHtml)
			tileContainer = tileContainer.replace('{{link-icon}}', linkIconHtml)
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
			projContainer = projContainer.replace(/\{\{name\}\}/g, project.name.toLowerCase())
			projContainer = projContainer.replace('{{title}}', project.name)
			projContainer = projContainer.replace('{{blurb}}', project.blurb)
			projContainer = projContainer.replace('{{logo}}', project.img)
			projContainer = projContainer.replace(
				'{{technologies}}',
				project.languages.concat(project.technologies).filter(p => p !== '').join(' · ')
			)
			let githubIconHtml = '', docsIconHtml = '', demoIconHtml = '', linkIconHtml = ''
			if (project.repo !== '') {
				githubIconHtml = githubIconSnippet.replace('{{name}}', project.name.toLowerCase())
			}
			if (project.documentation !== '') {
				docsIconHtml = docsIconSnippet.replace('{{name}}', project.name.toLowerCase())
			}
			if (project.demo === 'true') {
				demoIconHtml = demoIconSnippet.replace('{{name}}', project.name.toLowerCase())
			}
			if (project.link !== '') {
				linkIconHtml = linkIconSnippet.replace('{{url}}', project.link)
			}

			projContainer = projContainer.replace('{{github-icon}}', githubIconHtml)
			projContainer = projContainer.replace('{{docs-icon}}', docsIconHtml)
			projContainer = projContainer.replace('{{demo-icon}}', demoIconHtml)
			projContainer = projContainer.replace('{{link-icon}}', linkIconHtml)
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
		r.demoName = project.demo === 'true' ? project.name.toLowerCase() : ''
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