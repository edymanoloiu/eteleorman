const DIACRITICS_MAP = {
	ă: 'a', â: 'a', î: 'i', ș: 's', ț: 't',
	Ă: 'a', Â: 'a', Î: 'i', Ș: 's', Ţ: 't', Ț: 't',
	ş: 's', Ş: 's', // cedilla variants
};

/**
 * Slug public: litere mici, fără diacritice, cratime, descriptiv.
 */
export function slugifyRo(text) {
	if (!text) return '';
	return String(text)
		.split('')
		.map((ch) => DIACRITICS_MAP[ch] ?? ch)
		.join('')
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function normalizeDiacritics(text) {
	if (!text) return '';
	return String(text)
		.split('')
		.map((ch) => DIACRITICS_MAP[ch] ?? ch)
		.join('')
		.toLowerCase();
}

export default slugifyRo;
