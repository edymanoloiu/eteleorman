const assert = require('assert');
const { slugify, parseArgs, hasRequiredData, scoreArticle } = require('../scripts/generate-local-evergreen');

assert.strictEqual(slugify('Primăria București: servicii și taxe'), 'primaria-bucuresti-servicii-si-taxe');

assert.deepStrictEqual(parseArgs(['--city=București', '--template=spitale-bucuresti', '--limit=2', '--dry-run']), {
	limit: 2,
	dryRun: true,
	report: false,
	update: false,
	city: 'bucuresti',
	template: 'spitale-bucuresti'
});

assert.strictEqual(
	hasRequiredData({ health: { hospitals: [{ name: 'Spital' }] } }, { required_city_data: ['health.hospitals'] }),
	true
);

assert.ok(scoreArticle({ editorial_risk: 'medium', content_type: 'evergreen_dynamic' }, [{ name: 'S1' }, { name: 'S2' }], '## Răspuns rapid\n\n## Ce trebuie verificat') >= 75);

console.log('generate-local-evergreen tests passed');
