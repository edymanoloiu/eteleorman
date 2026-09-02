# Conținut evergreen (platformă locală de cunoaștere)

Directoarele de aici stochează tipuri de conținut distincte de fluxul de știri din `posts/`.

| Director | Tip | Rută publică |
|----------|-----|----------------|
| `guides/` | ghid | `/ghidul-orasului/{slug}/` |
| `places/` | loc | `/locuri/{slug}/` |
| `institutions/` | instituție | `/institutii/{slug}/` |
| `people/` | persoană | `/persoane/{slug}/` |
| `organizations/` | organizație | `/organizatii/{slug}/` |
| `events/` | eveniment | `/evenimente/{slug}/` |
| `services/` | serviciu public | `/servicii-publice/{slug}/` |
| `explainers/` | material explicativ | `/explicatii/{slug}/` |

**Reguli:**
- Doar `status: published` este public și indexabil.
- Exemplele cu prefix `exemplu-` rămân `draft`.
- Nu inventați adrese, programe, prețuri sau autori.
- Textele publice sunt în limba română, cu diacritice.
