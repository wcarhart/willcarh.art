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
