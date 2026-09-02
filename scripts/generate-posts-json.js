// scripts/generate-posts-js.js

import fs from 'fs'
import path from 'path'

const postsDirectory = path.join(process.cwd(), 'posts')
const outputFilePath = path.join(process.cwd(), 'lib', 'postsRawContent.js')

async function generatePostsRawJS() {
	const files = fs.readdirSync(postsDirectory)
	const postsRawContent = {}

	files.forEach((filename) => {
		if (filename.endsWith('.md')) {
			const slug = filename.replace(/\.md$/, '')
			const fullPath = path.join(postsDirectory, filename)
			const fileContent = fs.readFileSync(fullPath, 'utf8')
			postsRawContent[slug] = fileContent
		}
	})

	// Convert object to valid JS module syntax
	const jsExport = `// Auto-generated file. Do not edit manually.
const postsRawContent = ${JSON.stringify(postsRawContent, null, 2)};

export default postsRawContent;
`

	fs.writeFileSync(outputFilePath, jsExport)

	console.log(`✅ Generated posts raw content JS at ${outputFilePath}`)
}

generatePostsRawJS().catch((err) => {
	console.error(err)
	process.exit(1)
})
