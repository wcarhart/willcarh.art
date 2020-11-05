const startTime = new Date().getTime()
const fs = require('fs')
const util = require('util')

const core = require('./core.js')

const readdirPromise = util.promisify(fs.readdir)
const statPromise = util.promisify(fs.stat)

// verify content markdown files are as expected
const verifyContentFileStructure = async () => {
	console.log('Verifying build content...')
	await fs.promises.access('content/experience.md')
	await fs.promises.access('content/blogs.md')
	await fs.promises.access('content/projects.md')
	await fs.promises.access('content/apps.md')
}

// validate if generation was successful
const validateBuild = async () => {
	console.log('Validating built pages...')
	await fs.promises.access('index.html')
	await fs.promises.access('src/about.html')
	await fs.promises.access('src/blog_index.html')
	await fs.promises.access('src/project_index.html')
	// TODO: uncomment when apps are implemented
	// await fs.promises.access('../src/app_index.html')
}

// build the output file tree of the files that were generated
const generateFileTree = async () => {
	let tree = '.\n├── index.html'
	// TODO: fix this garbage
	tree += await buildTrees(['font', 'ico', 'css', 'src', 'src/js'])
	console.log(tree)
}

// build a set of file trees based on a list of source directories
const buildTrees = async (dirs) => {
	let tree = ''
	for (let [index, dir] of dirs.entries()) {
		if (index === dirs.length - 1) {
			tree += await buildTreeString(dir, true)
		} else {
			tree += await buildTreeString(dir, false)
		}
	}
	return tree
}

// build a visual file tree based on a directory
const buildTreeString = async (dir, final) => {
	try {
		await fs.promises.access(dir)
	} catch (e) {
		return ''
	}
	const parentChar = final ? '   ' : '|  '
	let tree = final ? `\n└── ${dir}` : `\n├── ${dir}`
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

// show usage statement
const usage = async () => {
	console.log('forge - build pages for willcarh.art')
	console.log('')
	console.log('Usage:')
	console.log('forge [-h] [-d]')
	console.log('  -h, --help      Show this menu and exit')
	console.log('  -d, --develop   Do not exit on validation errors')
}

// parse command line arguments
const parseArgs = async (args) => {
	let parsedArgs = {}
	if (args.includes('-h') || args.includes('--help')) {
		await usage()
		process.exit(0)
	}
	if (args.includes('-d') || args.includes('--develop')) {
		parsedArgs.develop = true
	} else {
		parsedArgs.develop = false
	}
	return parsedArgs
}

const main = async () => {
	try {
		const args = await parseArgs(process.argv.slice(2))
		if (args.develop !== true) {
			await verifyContentFileStructure()
		}

		// asset order is essential:
		//  - scripts must be build first
		//  - vault must be built before projects
		const assets = ['scripts', 'home', 'vault', 'about', 'blog', 'projects', 'apps']
		for (let asset of assets) {
			await core.generate(asset)
		}
		if (args.develop !== true) {
			await validateBuild()
		}
		await generateFileTree()
		const endTime = new Date().getTime()
		console.log(`✨  Done in ${(endTime - startTime) / 1000} seconds`)
	} catch (e) {
		console.log(e.stack)
		process.exit(1)
	}
}

main()