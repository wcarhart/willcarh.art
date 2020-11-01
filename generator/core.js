const fs = require('fs')
const html = require('html')
const util = require('util')

const readdirPromise = util.promisify(fs.readdir)

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

class Project {
	constuctor({
		name='',
		blurb='',
		description='',
		technologies=[],
		source=''
		install='',
		documentation='',
		cover='',
		links={},
		content=[]
	}) {

	}
}

const generate = async (page) => {
	switch (page) {
		case 'home':
			break
		case 'about':
			break
		case 'blog':
			await buildBlogIndex()
			await buildBlogPosts()
			break
		case 'projects':
			await buildProjectIndex()
			await buildProjectPages()
			break
		case 'apps':
			break
		default:
			throw new Exception(`Unknown page '${page}'`)
	}
}

const buildBlogIndex = async () => {
	return
}

const buildBlogPosts = async () => {
	let posts = await findFiles('blog')
	console.log(posts)
}

const buildProjectIndex = async () => {
	return
}

const buildProjectPages = async () => {
	let projects = await findFiles('projects')
	console.log(projects)
}

const findFiles = async (kind) => {
	let files = await readdirPromise(`../content/${kind}`)
	files = files.flatMap(file => file !== 'index.md' ? file : [])
	return files
}

module.exports = {
	Blog: Blog,
	Project: Project,
	generate: generate
}