/** Compare headings without diacritics, punctuation, or extra whitespace. */
export function normalizeHeadingText(value = '') {
	return String(value)
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9\s]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function headingsMatch(a, b) {
	if (!a || !b) return false;
	return a === b || a.startsWith(b) || b.startsWith(a);
}

/** Remove the first markdown H1 when it duplicates the article title from frontmatter. */
export function stripLeadingMarkdownH1IfMatchesTitle(markdown, title) {
	if (!title || !markdown) return markdown;

	const titleNorm = normalizeHeadingText(title);
	const lines = markdown.split('\n');
	const h1Index = lines.findIndex((line) => /^#\s+/.test(line));
	if (h1Index === -1) return markdown;

	const h1Norm = normalizeHeadingText(lines[h1Index].replace(/^#\s+/, ''));
	if (!headingsMatch(h1Norm, titleNorm)) return markdown;

	lines.splice(h1Index, 1);
	if (lines[h1Index]?.trim() === '') {
		lines.splice(h1Index, 1);
	}
	return lines.join('\n');
}

/** Remove the first HTML H1 when it duplicates the article title from frontmatter. */
export function stripLeadingHtmlH1IfMatchesTitle(html, title) {
	if (!title || !html) return html;

	const titleNorm = normalizeHeadingText(title);
	const match = html.match(/^\s*<h1\b[^>]*>([\s\S]*?)<\/h1>\s*/i);
	if (!match) return html;

	const innerNorm = normalizeHeadingText(match[1].replace(/<[^>]+>/g, ' '));
	if (!headingsMatch(innerNorm, titleNorm)) return html;

	return html.slice(match[0].length);
}
