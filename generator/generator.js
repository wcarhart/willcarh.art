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
	await fs.promises.access('src/about.html')
	await fs.promises.access('src/blog_index.html')
	await fs.promises.access('src/project_index.html')
	// TODO: uncomment when apps are implemented
	// await fs.promises.access('../src/app_index.html')
}

// build the output file tree of the files that were generated
const generateFileTree = async () => {
	let tree = '.\n├── index.html'
	tree += await buildTrees(['font', 'ico', 'css', 'src'])
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

const usage = async () => {
	console.log('forge - build pages for willcarh.art')
	console.log('')
	console.log('Usage:')
	console.log('forge [-h] [-d]')
	console.log('  -h, --help      Show this menu and exit')
	console.log('  -d, --develop   Do not exit on validation errors')
}

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
		await core.generate('home')
		await core.generate('about')
		await core.generate('blog')
		await core.generate('projects')
		await core.generate('apps')
		if (args.develop !== true) {
			await validateBuild()
		}
		await generateFileTree()
	} catch (e) {
		console.log(e.stack)
		process.exit(1)
	}
}

main()