# Generator local evergreen

Generatorul creează loturi mici de articole Markdown pentru București, folosind baza locală din `data/cities/bucuresti.json`, șabloanele din `data/local-evergreen/templates.json` și registrul `data/generated-local-articles.json`.

Comenzi:

```bash
npm run generate:local-evergreen
npm run generate:local-evergreen -- --dry-run
npm run generate:local-evergreen -- --template=spitale-bucuresti
npm run generate:local-evergreen -- --limit=2
npm run generate:local-evergreen -- --report
npm run test:local-evergreen
```

Reguli editoriale:

- nu generează articole fără bază locală și surse;
- evită duplicatele prin sluguri existente și registru;
- marchează datele dinamice pentru reverificare;
- salvează raportul în `reports/local-evergreen-generation-YYYY-MM-DD.md`;
- marchează articolele sub 90/100 cu `reviewStatus: "needs-review"`.

Înainte de publicarea efectivă, redacția trebuie să verifice sursele oficiale pentru tarife, programe, telefoane, trasee, secții, locuri disponibile și termene.
