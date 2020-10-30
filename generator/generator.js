const fs = require('fs')

// TODO
// generate home page
const generateHome = async () => {

}

// TODO
// generate about page
const generateAbout = async () => {

}

// TODO
// generate blog and blog posts pages
const generateBlog = async () => {

}

// TODO
// generate project index and individual project pages
const generateProjects = async () => {

}

// TODO
// generate app index and individual app pages
const generateApps = async () => {
	return
}

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
	// await fs.promises.access('../src/apps_index.html')
}

const main = async () => {
	try {
		await generateHome()
		await generateAbout()
		await generateBlog()
		await generateProjects()
		await generateApps()
		// await validateBuild()
	} catch (e) {
		console.error(e)
		process.exit(1)
	}
}

main()