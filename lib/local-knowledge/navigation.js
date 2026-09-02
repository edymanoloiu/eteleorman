import publication from '../../src/data/publication.js';

/**
 * Navigație publică principală — limba română, meniu scurt.
 */
export function getMainNavigation() {
	const city = publication.city;
	return [
		{ label: 'Ultimele știri', path: `/categorie/${publication.categorySlug}/` },
		{ label: 'Ghidul orașului', path: '/ghidul-orasului/' },
		{ label: 'Evenimente', path: '/evenimente/' },
		{ label: 'Trafic și transport', path: '/trafic-si-transport/' },
		{ label: 'Instituții și servicii', path: '/institutii/' },
		{ label: 'Locuri', path: '/locuri/' },
		{ label: `Despre ${city}`, path: '/despre/' },
	];
}

export function getFooterEditorialLinks() {
	return [
		{ label: 'Despre noi', path: '/despre/' },
		{ label: 'Politica editorială', path: '/politica-editoriala/' },
		{ label: 'Politica de corecturi', path: '/politica-corecturi/' },
		{ label: 'Politica privind inteligența artificială', path: '/politica-ai/' },
		{ label: 'Politica de atribuire și surse', path: '/politica-surse/' },
		{ label: 'Proprietatea publicației', path: '/proprietate/' },
		{ label: 'Finanțarea publicației', path: '/finantare/' },
		{ label: 'Raportează o eroare', path: '/politica-corecturi/#raporteaza' },
		{ label: 'Căutare', path: '/cauta/' },
	];
}

export const TOPIC_HUBS = [
	{ slug: 'stiri-locale', title: 'Știri locale', path: null }, // folosește categoria locală
	{ slug: 'administratie-locala', title: 'Administrație locală', path: '/administratie-locala/' },
	{ slug: 'trafic-si-transport', title: 'Trafic și transport', path: '/trafic-si-transport/' },
	{ slug: 'educatie', title: 'Educație', path: '/educatie/' },
	{ slug: 'sanatate', title: 'Sănătate', path: '/sanatate/' },
	{ slug: 'economie-locala', title: 'Economie locală', path: '/economie-locala/' },
	{ slug: 'cultura', title: 'Cultură', path: '/cultura/' },
	{ slug: 'evenimente', title: 'Evenimente', path: '/evenimente/' },
	{ slug: 'mediu', title: 'Mediu', path: '/mediu/' },
	{ slug: 'siguranta-publica', title: 'Siguranță publică', path: '/siguranta-publica/' },
	{ slug: 'sport-local', title: 'Sport local', path: '/sport-local/' },
	{ slug: 'utilitati', title: 'Utilități', path: '/utilitati/' },
	{ slug: 'turism', title: 'Turism', path: '/turism/' },
	{ slug: 'urgente', title: 'Urgențe', path: '/urgente/' },
];

export default getMainNavigation;
