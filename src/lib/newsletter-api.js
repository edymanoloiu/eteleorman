/** Same API host as cautimasina-ai-v1 (lib/car-api.ts). */
export const NEWSLETTER_API_ENDPOINT =
	process.env.NEXT_PUBLIC_NEWSLETTER_API_ENDPOINT ||
	process.env.NEXT_PUBLIC_CAR_API_ENDPOINT ||
	'https://cm.softed.ro';

/**
 * POST https://cm.softed.ro/v1/newsletter/subscribe
 * Body: { email, website, source? }
 */
export async function subscribeNewsletter({ email, source = 'widget' }) {
	const website =
		typeof window !== 'undefined' && window.location?.hostname
			? window.location.hostname.replace(/^www\./, '')
			: (process.env.NEXT_PUBLIC_SITE_HOSTNAME || '').replace(/^www\./, '');

	const res = await fetch(`${NEWSLETTER_API_ENDPOINT}/v1/newsletter/subscribe`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, website, source }),
	});

	const data = await res.json().catch(() => ({}));

	if (!res.ok && !data.already_subscribed) {
		throw new Error(data.error || 'Nu am putut procesa abonarea.');
	}

	return data;
}
