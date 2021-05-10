class Experience {
	constructor({
		company='',
		companyId = '',
		title=[],
		date=[],
		displayDate='',
		detail=[],
		languagesAndLibraries=[],
		tools=[],
		platforms=[],
		infrastructure=[],
		url='',
		blogPost=''
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
		this.blogPost = blogPost
	}
}

class Project {
	constructor({
		name='',
		blurb='',
		about='',
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
		blogPost='',
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
		this.status = status
		this.install = install
		this.documentation = documentation
		this.related = related
		this.visibility = visibility
		this.blogPost = blogPost
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
		authorImg='',
		status='',
		tags=[],
		id='',
		hidden='',
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
		this.authorImg = authorImg
		this.status = status
		this.tags = tags
		this.id = id
		this.hidden = hidden
	}
}

module.exports = {
	Experience: Experience,
	Project: Project,
	Blog: Blog
}