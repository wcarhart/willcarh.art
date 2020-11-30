class Experience {
	constructor({
		company='',
		companyId = '',
		title=[],
		date=[],
		displayDate=[],
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
		this.displayDate = displayDate
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
		// TODO: should this be dynamic based on commit date?
		if (status !== '') {
			if (!['stable', 'in development', 'stale', 'archived'].includes(status)) {
				console.error(`Unknown status '${status}'`)
			}
		}
		this.status = status
		this.install = install
		this.documentation = documentation
		this.related = related
		// super:    is in the big featured projects at the top, as well as bigger tiles in the proj-all list
		// featured: is prioritized when building tiles with super projects in proj-all list
		// normal:   can be used in tiles with super projects in proj-all list, but not necessarily
		// less:     cannot be used in tiles with super projects in proj-all list
		// none:     is likely archived and should not be displayed in proj-all list (will still be in vault)
		if (visibility !== '') {
			if (!['super', 'featured', 'normal', 'less', 'none'].includes(visibility)) {
				console.error(`Unknown visibility '${visibility}'`)
			}
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
		id=''
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
		// active: blog post was written under a current version of willcarh.art and included links + code should be valid
		// stale:  blog post was written under a previous version of willcarh.art and included links + code may contain flaws
		if (status !== '') {
			if (!['active', 'stale'].includes(status)) {
				console.error(`Unknown status '${status}'`)
			}
		}
		this.status = status
		this.tags = tags
		this.id = id
	}
}

module.exports = {
	Experience: Experience,
	Project: Project,
	Blog: Blog
}