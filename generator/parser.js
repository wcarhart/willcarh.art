const fs = require('fs')
const util = require('util')

const entities = require('./entities.js')

const readFilePromise = util.promisify(fs.readFile)

const SUPPORTED_ENTITIES = {
	experience: {
		content: 'content/experience.md',
		object: 'Experience',
		arrayProperties: ['title', 'date', 'detail', 'languagesAndLibraries', 'tools', 'platforms', 'infrastructure']
	},
	project: {
		content: 'content/projects.md',
		object: 'Project',
		arrayProperties: ['languages', 'technologies', 'related', 'tags']
	},
	blog: {
		content: 'content/blogs.md',
		object: 'Blog',
		arrayProperties: ['resources', 'tags']
	},
}

// validation entrypoint
const validate = async (entity, instances) => {
	if (!Object.keys(SUPPORTED_ENTITIES).includes(entity)) {
		throw new Error(`Unsupported entity: '${entity}'`)
	}

	for (let [index, instance] of instances.entries()) {
		let entityName = `validate${entity.charAt(0).toUpperCase() + entity.slice(1)}`
		await FUNCS[entityName](index, instance)
	}
}

// validate an experience
const validateExperience = async (index, experience) => {
	await verifyString(index, 'experience', 'company', experience.company, '')

	for (let p of ['title', 'detail']) {
		await verifyArray('string', true, index, 'experience', p, experience[p], experience.company)
	}
	for (let p of ['languagesAndLibraries', 'tools', 'platforms', 'infrastructure']) {
		await verifyArray('string', false, index, 'experience', p, experience[p], experience.company)
	}
	await verifyStringUrlSafe(index, 'experience', 'companyId', experience.companyId, experience.company)
	await verifyArray('date', true, index, 'experience', 'date', experience.date, experience.company)
	await verifyString(index, 'experience', 'displayDate', experience.displayDate, experience.company)
	await verifyUrl(index, 'experience', 'url', experience.url, experience.company)
	await verifyOptionalString(index, 'experience', 'blogPost', experience.blogPost, experience.company)
}

// validate an project
const validateProject = async (index, project) => {
	await verifyString(index, 'project', 'name', project.name, '')
	for (let p of ['blurb', 'img', 'status', 'visibility']) {
		await verifyString(index, 'project', p, project[p], project.name)
	}
	for (let p of ['languages', 'technologies', 'related', 'tags']) {
		await verifyArray('string', false, index, 'project', p, project[p], project.name)
	}
	for (let p of ['about', 'link', 'latestVersion', 'documentation', 'install', 'blogPost']) {
		await verifyOptionalString(index, 'project', p, project[p], project.name)
	}
	await verifyOptionalDate(index, 'project', 'published', project.published, project.name)
	await verifyOptionalUrl(index, 'project', 'repo', project.repo, project.name)
	await verifyBoolean(index, 'project', 'demo', project.demo, project.name)

	// ensure valid project.status
	// stable:         actively developed or maintained
	// in development: currently in development
	// stale:          lagging updates and maintenance
	// archived:       no longer maintained
	if (!['stable', 'in development', 'stale', 'archived'].includes(project.status)) {
		await reject(index, 'project', 'status', project.status, project.name, `has invalid status: '${project.status}'`)
	}

	// ensure valid project.visibility
	// super:    is in the big featured projects at the top, as well as bigger tiles in the proj-all list
	// featured: is prioritized when building tiles with super projects in proj-all list
	// normal:   can be used in tiles with super projects in proj-all list, but not necessarily
	// less:     cannot be used in tiles with super projects in proj-all list
	// none:     is likely archived and should not be displayed in proj-all list (will still be in vault)
	if (!['super', 'featured', 'normal', 'less', 'none'].includes(project.visibility)) {
		await reject(index, 'project', 'visibility', project.visibility, project.name, `has invalid visibility: '${project.visibility}'`)
	}
}

// validate an blog
const validateBlog = async (index, blog) => {
	await verifyString(index, 'blog', 'title', blog.title, '')
	for (let p of ['subtitle', 'blurb', 'cover', 'coverAuthor', 'author', 'authorImg', 'status']) {
		await verifyString(index, 'blog', p, blog[p], blog.title)
	}
	await verifyDate(index, 'blog', 'published', blog.published, blog.title)
	await verifyOptionalDate(index, 'blog', 'updated', blog.updated, blog.title)
	await verifyUrl(index, 'blog', 'coverCredit', blog.coverCredit, blog.title)
	await verifyStringUrlSafe(index, 'blog', 'id', blog.id, blog.title)
	for (let p of ['resources', 'tags']) {
		await verifyArray('string', false, index, 'blog', p, blog[p], blog.title)
	}

	// ensure valid blog.status
	// active: blog post was written under a current version of willcarh.art and included links + code should be valid
	// stale:  blog post was written under a previous version of willcarh.art and included links + code may contain flaws
	if (!['active', 'stale'].includes(blog.status)) {
		await reject(index, 'blog', 'status', blog.status, blog.status, `has invalid status: '${blog.status}'`)
	}
}

// verify string property of entity
const verifyString = async (index, entity, property, value, identifier) => {
	if (value === '') {
		await reject(index, entity, property, value, identifier, '')
	}
}

// verify optional string property of entity
const verifyOptionalString = async (index, entity, property, value, identifier) => {
	if (value !== '') {
		await verifyString(index, entity, property, value, identifier)
	}
}

// verify URL safe string property of entity
const verifyStringUrlSafe = async (index, entity, property, value, identifier) => {
	if (value === '') {
		await reject(index, entity, property, value, identifier, '')
	}
	if (!/^[a-z0-9._-]+$/g.test(value)) {
		await reject(index, entity, property, value, identifier, `has invalid field '${property}': must contain characters from the set [a-z0-9._-]`)
	}
}

// verify optional URL safe string property of entity
const verifyOptionalStringUrlSafe = async (index, entity, property, value, identifier) => {
	if (value !== '') {
		await verifyStringUrlSafe(index, entity, property, value, identifier)
	}
}

// verify boolean property of entity
const verifyBoolean = async (index, entity, property, value, identifier) => {
	if (!['true', 'false'].includes(value)) {
		await reject(index, entity, property, value, identifier, `has invalid boolean value '${value}'`)
	}
}

// verify optional boolean property of entity
const verifyOptionalBoolean = async (index, entity, property, value, identifier) => {
	if (value !== '') {
		await verifyBoolean(index, entity, property, value, identifier)
	}
}

// verify date property of entity
const verifyDate = async (index, entity, property, value, identifier) => {
	if (value === '') {
		await reject(index, entity, property, value, identifier, '')
	}
	let date = new Date(Number(value)*1000)
	if (!date instanceof Date) {
		await reject(index, entity, property, value, identifier, `has invalid date value '${value}'`)
	}
	if (isNaN(date)) {
		await reject(index, entity, property, value, identifier, `has invalid date value '${value}'`)
	}
	if (date.getFullYear() < 2005) {
		await reject(index, entity, property, value, identifier, 'has date older than 2005')
	}
}

// verify optional date property of entity
const verifyOptionalDate = async (index, entity, property, value, identifier) => {
	if (value !== '') {
		await verifyDate(index, entity, property, value, identifier)
	}
}

// verify URL property of entity
const verifyUrl = async (index, entity, property, value, identifier) => {
	if (value === '') {
		await reject(index, entity, property, value, identifier, '')
	}
	let url;
	try {
		url = new URL(value)
	} catch (e) {
		await reject(index, entity, property, value, identifier, 'is not a valid URL format')
	}

	if (url.protocol !== 'http:' && url.protocol !== 'https:') {
		await reject(index, entity, property, value, identifier, `has invalid URL protocol '${url.protocol}'`)
	}
}

// verify optional URL property of entity
const verifyOptionalUrl = async (index, entity, property, value, identifier) => {
	if (value !== '') {
		await verifyUrl(index, entity, property, value, identifier)
	}
}

// verify array property of entity
const verifyArray = async (type, required, index, entity, property, value, identifier) => {
	if (value.length === 0 && required === true) {
		await reject(index, entity, property, value, identifier, `array '${property}' is empty`)
	}
	for (let v of value) {
		switch (type) {
			case 'string':
			case 'stringUrlSafe':
			case 'date':
			case 'url':
				let verifyName = `${type.charAt(0).toUpperCase() + type.slice(1)}`
				if (required === true) {
					verifyName = `verify${verifyName}`
					await FUNCS[verifyName](index, entity, property, v, identifier)
				} else {
					verifyName = `verifyOptional${verifyName}`
					await FUNCS[verifyName](index, entity, property, v, identifier)
				}
				break
			default:
				throw new Error(`Cannot verify ${entity}.${property}: unsupported data type '${type}`)
		}
	}
}

// set up calling functions from variable
const FUNCS = {
	validateExperience,
	validateProject,
	validateBlog,
	verifyString,
	verifyOptionalString,
	verifyStringUrlSafe,
	verifyOptionalStringUrlSafe,
	verifyBoolean,
	verifyOptionalBoolean,
	verifyDate,
	verifyOptionalDate,
	verifyUrl,
	verifyOptionalUrl
}

// reject validation
const reject = async (index, entity, property, value, identifier, msg) => {
	if (msg === '') {
		throw new Error(`${entity.charAt(0).toUpperCase() + entity.slice(1)}${identifier === '' ? ` at index ${index}` : ` '${identifier}'`} missing or empty value(s) found for property '${property}'`)
	} else {
		throw new Error(`${entity.charAt(0).toUpperCase() + entity.slice(1)}${identifier === '' ? ` at index ${index}` : ` '${identifier}'`} ${msg}`)
	}
}

// parse an entity from a markdown file
const parse = async (entity) => {
	if (!Object.keys(SUPPORTED_ENTITIES).includes(entity)) {
		throw new Error(`Unsupported entity: '${entity}'`)
	}

	const data = await readFilePromise(SUPPORTED_ENTITIES[entity].content)
	let instances = []
	let newInstance = new entities[SUPPORTED_ENTITIES[entity].object]({})

	for (let line of data.toString().split('\n')) {
		if (line !== '') {
			let elements = line.split(':')
			let key = elements.shift()
			let value = elements.join(':')
			if (value[0] === ' ') {
				value = value.slice(1)
			}
			if(SUPPORTED_ENTITIES[entity].arrayProperties.includes(key)) {
				if (!Array.isArray(newInstance[key])) {
					throw new Error(`${entity}.${key} should be an array`)
				}
				newInstance[key].push(value)
			} else {
				if (Array.isArray(newInstance[key])) {
					throw new Error(`${entity}.${key} should not be an array`)
				}
				newInstance[key] = value
			}
		} else {
			instances.push(newInstance)
			newInstance = new entities[SUPPORTED_ENTITIES[entity].object]({})
		}
	}

	await validate(entity, instances)
	return instances
}

module.exports = {
	parse: parse
}