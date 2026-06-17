// ai.js — regel-baseret auto-kategorisering af transskription
const RULES = [
  {
    category: 'lead',
    keywords: ['kunde', 'møde', 'kontakt', 'ring', 'følg op', 'followup',
               'firma', 'virksomhed', 'interesseret', 'tilbud', 'pris',
               'præsentation', 'demo', 'aftale', 'salgsmøde'],
  },
  {
    category: 'task',
    keywords: ['husk', 'gør', 'lav', 'fix', 'ret', 'opdater', 'send',
               'book', 'skriv', 'tjek', 'undersøg', 'færdiggør', 'skal'],
  },
  {
    category: 'idea',
    keywords: ['idé', 'ide', 'hvad hvis', 'tænk', 'forestil', 'kunne vi',
               'ny funktion', 'nyt produkt', 'mulighed', 'potential',
               'prøv', 'eksperiment', 'koncept'],
  },
];

/**
 * Foreslår én kategori baseret på tekst-indhold.
 * @param {string} text
 * @returns {'idea'|'lead'|'task'|'note'}
 */
export function suggestCategory(text) {
  const lower = text.toLowerCase();
  const scores = { lead: 0, task: 0, idea: 0 };

  for (const rule of RULES) {
    for (const keyword of rule.keywords) {
      if (lower.includes(keyword)) {
        scores[rule.category]++;
      }
    }
  }

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best[1] > 0 ? best[0] : 'note';
}
