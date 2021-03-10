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
		arrayProperties: ['about', 'languages', 'technologies', 'related', 'tags']
	},
	blog: {
		content: 'content/blogs.md',
		object: 'Blog',
		arrayProperties: ['resources', 'tags']
	},
}

// TODO
// validation entrypoint
const validate = async (entity, instances) => {
	if (!Object.keys(SUPPORTED_ENTITIES).includes(entity)) {
		throw new Error(`Unsupported entity: '${entity}'`)
	}

	switch (entity) {
		case 'experience':
			for (let [index, instance] of instances.entries()) {
				await validateExperience(index, instance)
			}
			break
		case 'project':
			break
		case 'blog':
			break
	}
}

// validate an experience
const validateExperience = async (index, experience) => {
	await verifyString(index, 'experience', 'company', experience.company, '')	
	await verifyStringUrlSafe(index, 'experience', 'companyId', experience.companyId, experience.company)
	await verifyArray('string', true, index, 'experience', 'title', experience.title, experience.company)
	await verifyArray('date', true, index, 'experience', 'date', experience.date, experience.company)
	await verifyString(index, 'experience', 'displayDate', experience.displayDate, experience.company)
	await verifyArray('string', true, index, 'experience', 'detail', experience.detail, experience.company)
	await verifyArray('string', false, index, 'experience', 'languagesAndLibraries', experience.languagesAndLibraries, experience.company)
	await verifyArray('string', false, index, 'experience', 'tools', experience.tools, experience.company)
	await verifyArray('string', false, index, 'experience', 'platforms', experience.platforms, experience.company)
	await verifyArray('string', false, index, 'experience', 'infrastructure', experience.infrastructure, experience.company)
	await verifyUrl(index, 'experience', 'url', experience.url, experience.company)
	await verifyOptionalString(index, 'experience', 'blogPost', experience.blogPost, experience.company)
}

// TODO
// validate an project
const validateProject = async (project) => {
	
}

// TODO
// validate an blog
const validateBlog = async (blog) => {
	
}

// verify string property of entity
const verifyString = async (index, entity, property, value, identifier) => {
	if (value === '') {
		await reject(index, entity, property, value, identifier, '')
	}
}

const verifyOptionalString = async (index, entity, property, value, identifier) => {
	return
}

// verify URL safe string property of entity
const verifyStringUrlSafe = async (index, entity, property, value, identifier) => {
	if (value === '') {
		await reject(index, entity, property, value, identifier, '')
	}
	if (!/^[a-z0-9_-]+$/g.test(value)) {
		await reject(index, entity, property, value, identifier, `has invalid field '${property}': must contain characters from the set [a-z0-9_-]`)
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

// verify array property of entity
const verifyArray = async (type, required, index, entity, property, value, identifier) => {
	if (value.length === 0 && required === true) {
		await reject(index, entity, property, value, identifier, `array '${property}' is empty`)
	}
	for (let v of value) {
		switch (type) {
			case 'string':
				await verifyString(index, entity, property, v, identifier)
				break
			case 'stringUrlSafe':
				await verifyStringUrlSafe(index, entity, property, v, identifier)
				break
			case 'date':
				await verifyDate(index, entity, property, v, identifier)
				break
			case 'url':
				await verifyUrl(index, entity, property, v, identifier)
				break
			default:
				throw new Error(`Cannot verify ${entity}.${property}: unsupported data type '${type}`)
		}
	}
}

// reject validation
const reject = async (index, entity, property, value, identifier, msg) => {
	if (msg === '') {
		throw new Error(`${entity.charAt(0).toUpperCase() + entity.slice(1)}${identifier === '' ? ` at index ${index}` : ` '${identifier}'`} missing or empty field value(s) found for '${property}'`)
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