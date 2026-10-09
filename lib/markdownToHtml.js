import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'
import {
	stripLeadingHtmlH1IfMatchesTitle,
	stripLeadingMarkdownH1IfMatchesTitle,
} from './stripDuplicateTitleHeading.js'

export default async function markdownToHtml(markdown, { title } = {}) {
	let source = stripLeadingMarkdownH1IfMatchesTitle(markdown || '', title)
	const result = await remark().use(remarkGfm).use(html).process(source)
	let output = result.toString()
	output = stripLeadingHtmlH1IfMatchesTitle(output, title)
	return output
}
