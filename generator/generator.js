const startTime = new Date().getTime()
const fs = require('fs')
const path = require('path')
const util = require('util')

const core = require('./core.js')

const readdirPromise = util.promisify(fs.readdir)
const rmdirPromise = util.promisify(fs.rmdir)
const statPromise = util.promisify(fs.stat)

// verify content markdown files are as expected
const verifyContentFileStructure = async () => {
	console.log('Verifying build content...')
	await fs.promises.access('content/experience.md')
	await fs.promises.access('content/blogs.md')
	await fs.promises.access('content/projects.md')
}

// validate if generation was successful
const validateBuild = async () => {
	console.log('Validating built pages...')
	await fs.promises.access('src/index.html')
	await fs.promises.access('src/vault.html')
	await fs.promises.access('src/about.html')
	await fs.promises.access('src/demo.html')
	await fs.promises.access('src/blog.html')
	await fs.promises.access('src/projects.html')
}

// build the output file tree of the files that were generated
const generateFileTree = async () => {
	let tree = '.\n'
	for (let dir of ['src']) {
		tree += await buildTree(dir, '', dir === 'src' ? true : false, '')
	}
	console.log(tree)
}

// recursive function for pretty printing file trees
const buildTree = async (dir, indent, isTail, result) => {
	let stats = await statPromise(dir)
	let files = []
	if (stats.isDirectory()) {
		files = await readdirPromise(dir)
	}

	let appendChar = ''
	if (stats.isDirectory() && dir[dir.length] !== '/') {
		appendChar = '/'
	}
	result += indent + (isTail === true ? '└── ' : '├── ') + path.basename(dir) + appendChar + '\n'
	for (let index = 0; index < files.length - 1; index++) {
		result = await buildTree(path.join(dir, files[index]), indent + (isTail === true ? '    ' : '|   '), false, result)
	}
	if (files.length > 0) {
		result = await buildTree(path.join(dir, files[files.length - 1]), indent + (isTail === true ? '    ' : '|   '), true, result)
	}
	return result
}

// show usage statement
const usage = async () => {
	console.log('forge - build pages for willcarh.art')
	console.log('')
	console.log('Usage:')
	console.log('forge [-h] [-b] [-d] [-s] [-v]')
	console.log('  -h, --help      Show this menu and exit')
	console.log('  -b, --browser   Open the newly built website in a new browser window')
	console.log('  -d, --develop   Hardlink hrefs to .html files instead of URL paths (required for local builds)')
	console.log('  -s, --silent    Silence build output')
	console.log('  -v, --verbose   Show generated files as a result of forge')
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
	if (args.includes('-v') || args.includes('--verbose')) {
		parsedArgs.verbose = true
	} else {
		parsedArgs.verbose = false
	}
	return parsedArgs
}

// run generator
const main = async () => {
	try {
		const args = await parseArgs(process.argv.slice(2))
		if (args.develop !== true) {
			await verifyContentFileStructure()
		}

		// refresh redirects
		await core.refreshRedirects()

		// clear out source directory
		await rmdirPromise('src/', { recursive: true })

		// asset order is essential, due to how linking occurs:
		//  - scripts must be built first and styles must be first
		//  - vault must be built before projects
		const assets = ['scripts', 'style', 'home', 'vault', 'demo', 'about', 'blog', 'projects', 'etc', '404']
		for (let asset of assets) {
			await core.generate(asset, args.develop)
		}
		if (args.develop !== true) {
			await validateBuild()
		}
		if (args.verbose === true) {
			await generateFileTree()
		}
		const endTime = new Date().getTime()
		console.log(`✨  Done in ${(endTime - startTime) / 1000} seconds`)
	} catch (e) {
		console.error(e.stack)
		process.exit(1)
	}
}

main()