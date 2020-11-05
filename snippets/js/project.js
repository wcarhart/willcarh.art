class Project {
	constructor({
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
		this.latestVersion = latestVersion
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