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

// build the output file tree of the files that were generated
const generateFileTree = async () => {
	let tree = '.\n├── index.html\n├── style.css'
	tree += await buildTreeString('font', false)
	tree += await buildTreeString('ico', false)
	tree += await buildTreeString('src', true)
	console.log(tree)
}

// build a visual file tree based on a directory
const buildTreeString = async (dir, final) => {
	const parentChar = final ? '   ' : '|  '
	let tree = final ? `\n└── ${dir}` : `\n├── ${dir}/`
	let files = await readdirPromise(dir)
	while (files.length > 0) {
		if (files.length === 1) {
			tree += `\n${parentChar} └── ${files[0]}`
			files.shift()
		} else {
			tree += `\n${parentChar} ├── ${files[0]}`
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
		await validateBuild()
		await generateFileTree()
	} catch (e) {
		console.log(e)
		console.log(e.stack)
		process.exit(1)
	}
}

main()