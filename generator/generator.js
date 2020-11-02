const fs = require('fs')
const util = require('util')

const core = require('./core.js')

const readdirPromise = util.promisify(fs.readdir)

// verify content markdown files are as expected
const verifyContentFileStructure = async () => {
	console.log('Verifying build content...')
	await fs.promises.access('content/about/index.md')
	await fs.promises.access('content/blog/index.md')
	await fs.promises.access('content/projects/index.md')
	await fs.promises.access('content/apps/index.md')
}

// TODO
// validate if generation was successful
const validateBuild = async () => {
	console.log('Validating built pages...')
	await fs.promises.access('index.html')
	await fs.promises.access('style.css')
	await fs.promises.access('src/about.html')
	await fs.promises.access('src/blog_index.html')
	await fs.promises.access('src/project_index.html')
	// TODO: uncomment when apps are implemented
	// await fs.promises.access('../src/app_index.html')
}

// TODO
// build the output file tree of the files that were generated
const generateFileTree = async () => {
	let tree = '.\n├── index.html\n├── style.css'
	tree += await buildTreeString('font')
	tree += await buildTreeString('ico')
	tree += await buildTreeString('src')
	console.log(tree)
}

const buildTreeString = async (dir) => {
	let tree = `\n├── ${dir}/`
	let files = await readdirPromise(dir)
	while (files.length > 0) {
		if (files.length === 1) {
			tree += `│   └── ${files[0]}`
			files.shift()
		} else {
			tree += `│   ├── ${files[0]}`
			files.shift()
		}
	}
	return tree
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
		// await generateFileTree()
	} catch (e) {
		console.log(e)
		console.log(e.stack)
		process.exit(1)
	}
}

main()