const fs = require('fs')
const core = require('./core.js')

// TODO
// verify content markdown files are as expected
const verifyContentFileStructure = async () => {
	await fs.promises.access('../content/about/index.md')
	await fs.promises.access('../content/blog/index.md')
	await fs.promises.access('../content/projects/index.md')
	await fs.promises.access('../content/apps/index.md')
}

// TODO
// validate if generation was successful
const validateBuild = async () => {
	await fs.promises.access('../index.html')
	await fs.promises.access('../style.css')
	await fs.promises.access('../src/about.html')
	await fs.promises.access('../src/blog_index.html')
	await fs.promises.access('../src/project_index.html')
	// TODO: uncomment when apps are implemented
	// await fs.promises.access('../src/app_index.html')
}

const main = async () => {
	try {
		await verifyContentFileStructure()
		await core.generate('home')
		await core.generate('about')
		await core.generate('blog')
		await core.generate('projects')
		await core.generate('apps')
		// await validateBuild()
	} catch (e) {
		console.error(e)
		process.exit(1)
	}
}

main()