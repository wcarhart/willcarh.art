const fs = require('fs')
const util = require('util')

const entities = require('./entities.js')

const readFilePromise = util.promisify(fs.readFile)

// parse experiences from markdown file
const parseExperiences = async () => {
	const experienceData = await readFilePromise('content/experience.md')
	let experiences = []
	let newExperience = new entities.Experience({})

	for (let line of experienceData.toString().split('\n')) {
		if (line !== '') {
			let elements = line.split(':')
			let key = elements.shift()
			let value = elements.join(':')
			if (value[0] === ' ') {
				value = value.slice(1)
			}
			if(['title', 'date', 'displayDate', 'detail', 'languagesAndLibraries', 'tools', 'platforms', 'infrastructure'].includes(key)) {
				newExperience[key].push(value)
			} else {
				newExperience[key] = value
			}
		} else {
			experiences.push(newExperience)
			newExperience = new entities.Experience({})
		}
	}

	return experiences
}

// parse projects from markdown file
const parseProjects = async () => {
	const projectData = await readFilePromise('content/projects.md')
	let projects = []
	let newProject = new entities.Project({})

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
			newProject = new entities.Project({})
		}
	}

	return projects
}

// parse blog posts from markdown file
const parseBlogs = async () => {
	const blogData = await readFilePromise('content/blogs.md')
	let blogs = []
	let newBlog = new entities.Blog({})

	for (let line of blogData.toString().split('\n')) {
		if (line !== '') {
			let elements = line.split(':')
			let key = elements.shift()
			let value = elements.join(':')
			if (value[0] === ' ') {
				value = value.slice(1)
			}
			if (['resources', 'tags'].includes(key)) {
				newBlog[key].push(value)
			} else {
				newBlog[key] = value
			}
		} else {
			blogs.push(newBlog)
			newBlog = new entities.Blog({})
		}
	}

	return blogs
}

module.exports = {
	parseExperiences: parseExperiences,
	parseProjects: parseProjects,
	parseBlogs: parseBlogs
}