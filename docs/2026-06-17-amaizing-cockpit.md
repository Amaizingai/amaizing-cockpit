# Amaizing Cockpit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Byg en mobil-first PWA til Søren og Rooba der gør det muligt at optage stemmetanker, auto-transskribere dem og gemme dem i et fælles idé-board.

**Architecture:** Ren HTML/CSS/JS uden framework eller build-trin. Web Speech API håndterer live transskription direkte i browseren. Data gemmes i localStorage med en `synced`-flag klar til fremtidig Make/SharePoint-integration.

**Tech Stack:** HTML5, CSS3, Vanilla JS (ES6 modules), Web Speech API, MediaRecorder API, localStorage, PWA (manifest + service worker)

---

## Filstruktur

```
_INTERNE PRODUKTER/COCKPIT/
  ├── index.html          ← app-shell, navigation, skærm-routing
  ├── manifest.json       ← PWA-manifest (ikon, navn, farver)
  ├── sw.js               ← service worker (offline-support)
  ├── styles.css          ← global styling, Amaizing farvepalette
  ├── capture.js          ← Web Speech API + optagelseslogik
  ├── store.js            ← localStorage CRUD + datamodel
  ├── ai.js               ← auto-kategorisering af transskription
  ├── ideas.js            ← idé-board rendering + filtrering
  └── icons/
      ├── icon-192.png    ← PWA ikon (192x192)
      └── icon-512.png    ← PWA ikon (512x512)
```

---

## Task 1: Projektmappe og HTML-shell

**Files:**
- Create: `_INTERNE PRODUKTER/COCKPIT/index.html`
- Create: `_INTERNE PRODUKTER/COCKPIT/styles.css`

- [ ] **Trin 1: Opret mappestruktur**

```bash
mkdir -p "_INTERNE PRODUKTER/COCKPIT/icons"
```

- [ ] **Trin 2: Opret index.html**

```html
<!DOCTYPE html>
<html lang="da">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <meta name="theme-color" content="#06040a">
  <title>Amaizing Cockpit</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="manifest" href="manifest.json">
</head>
<body>
  <div id="app">
    <!-- Header -->
    <header class="app-header">
      <span class="logo">AMAIZING</span>
      <button class="author-btn" id="authorBtn">Søren ▾</button>
    </header>

    <!-- Skærme -->
    <main id="screen-capture" class="screen active">
      <p class="screen-greeting" id="greeting"></p>
      <h1 class="screen-title">Hvad tænker du?</h1>

      <div class="capture-area">
        <button class="record-btn" id="recordBtn" aria-label="Optag tanke">
          <span class="record-icon">🎤</span>
        </button>
        <p class="record-hint" id="recordHint">Tryk for at optage</p>
        <div class="record-timer hidden" id="recordTimer">0:00</div>
        <div class="waveform hidden" id="waveform">
          <span></span><span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span><span></span>
        </div>
      </div>

      <div class="category-chips">
        <button class="chip active" data-category="idea">💡 Idé</button>
        <button class="chip" data-category="lead">🎯 Lead</button>
        <button class="chip" data-category="task">✅ Opgave</button>
        <button class="chip" data-category="note">📝 Note</button>
      </div>

      <div class="transcript-preview hidden" id="transcriptPreview">
        <p class="transcript-text" id="transcriptText"></p>
        <div class="transcript-actions">
          <button class="btn-save" id="saveBtn">Gem</button>
          <button class="btn-discard" id="discardBtn">Slet</button>
        </div>
      </div>

      <div class="last-capture hidden" id="lastCapture"></div>
    </main>

    <main id="screen-ideas" class="screen">
      <div class="ideas-header">
        <h1 class="screen-title">Idé-board</h1>
        <button class="btn-new-idea" id="newIdeaBtn">+ Ny note</button>
      </div>

      <div class="filter-tabs" id="filterTabs">
        <button class="filter-tab active" data-filter="all">Alle</button>
        <button class="filter-tab" data-filter="idea">💡 Idéer</button>
        <button class="filter-tab" data-filter="lead">🎯 Leads</button>
        <button class="filter-tab" data-filter="task">✅ Opgaver</button>
        <button class="filter-tab" data-filter="note">📝 Noter</button>
      </div>

      <div class="ideas-list" id="ideasList"></div>
    </main>

    <main id="screen-log" class="screen">
      <h1 class="screen-title">Log</h1>
      <div class="log-list" id="logList"></div>
    </main>

    <main id="screen-settings" class="screen">
      <h1 class="screen-title">Indstillinger</h1>
      <div class="settings-section">
        <label class="settings-label">Hvem er du?</label>
        <div class="author-options">
          <button class="author-option active" data-author="Søren">Søren</button>
          <button class="author-option" data-author="Rooba">Rooba</button>
        </div>
      </div>
    </main>
  </div>

  <!-- Bundnavigation -->
  <nav class="bottom-nav">
    <button class="nav-btn active" data-screen="capture">🏠<span>Optag</span></button>
    <button class="nav-btn" data-screen="ideas">💡<span>Idéer</span></button>
    <button class="nav-btn" data-screen="log">📋<span>Log</span></button>
    <button class="nav-btn" data-screen="settings">⚙️<span>Mere</span></button>
  </nav>

  <!-- Toast notifikation -->
  <div class="toast hidden" id="toast"></div>

  <script type="module" src="capture.js"></script>
  <script type="module" src="ideas.js"></script>
  <script type="module" src="nav.js"></script>
</body>
</html>
```

- [ ] **Trin 3: Verificer HTML åbner i browser uden fejl**

Åbn `index.html` direkte i Chrome eller Edge. Der må ikke være konsolefejl.

- [ ] **Trin 4: Commit**

```bash
git add "_INTERNE PRODUKTER/COCKPIT/index.html"
git commit -m "feat: cockpit HTML-shell med skærme og bundnavigation"
```

---

## Task 2: Styling — Amaizing farvepalette

**Files:**
- Create: `_INTERNE PRODUKTER/COCKPIT/styles.css`

- [ ] **Trin 1: Opret styles.css**

```css
/* ── Reset & base ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:          #06040a;
  --panel:       #130c1b;
  --panel2:      #1a1024;
  --copper:      #d89a74;
  --copper-light:#f1c5a7;
  --white:       #f5f1f7;
  --muted:       #c9bfce;
  --purple:      #7b3bb5;
  --danger:      #e05555;
  --success:     #5ab85a;
  --radius:      10px;
  --nav-height:  64px;
}

html, body {
  height: 100%;
  background: var(--bg);
  color: var(--white);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* ── App shell ── */
#app {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - var(--nav-height));
  padding-bottom: var(--nav-height);
}

/* ── Header ── */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px 8px;
}

.logo {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--copper);
}

.author-btn {
  background: none;
  border: none;
  color: var(--muted);
  font-size: 13px;
  cursor: pointer;
  padding: 4px 8px;
}

/* ── Screens ── */
.screen { display: none; padding: 16px 20px; flex: 1; }
.screen.active { display: block; }

.screen-greeting { color: var(--muted); font-size: 13px; margin-bottom: 4px; }
.screen-title { font-size: 22px; font-weight: 600; margin-bottom: 28px; }

/* ── Capture ── */
.capture-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 28px;
}

.record-btn {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 3px solid var(--copper);
  background: var(--panel);
  font-size: 40px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 0 0 rgba(216,154,116,0);
  margin-bottom: 14px;
}

.record-btn.recording {
  border-color: var(--danger);
  background: #2a0a0a;
  box-shadow: 0 0 28px rgba(224,85,85,0.4);
}

.record-hint {
  color: var(--copper);
  font-size: 14px;
  font-weight: 600;
}

.record-timer {
  color: var(--muted);
  font-size: 12px;
  margin-top: 8px;
}

.waveform {
  display: flex;
  align-items: center;
  gap: 3px;
  height: 32px;
  margin-top: 12px;
}

.waveform span {
  width: 3px;
  background: var(--danger);
  border-radius: 2px;
  animation: wave 0.8s ease-in-out infinite alternate;
}

.waveform span:nth-child(1) { height: 8px;  animation-delay: 0.0s; }
.waveform span:nth-child(2) { height: 20px; animation-delay: 0.1s; }
.waveform span:nth-child(3) { height: 14px; animation-delay: 0.2s; }
.waveform span:nth-child(4) { height: 28px; animation-delay: 0.3s; }
.waveform span:nth-child(5) { height: 18px; animation-delay: 0.4s; }
.waveform span:nth-child(6) { height: 24px; animation-delay: 0.3s; }
.waveform span:nth-child(7) { height: 10px; animation-delay: 0.2s; }
.waveform span:nth-child(8) { height: 22px; animation-delay: 0.1s; }
.waveform span:nth-child(9) { height: 16px; animation-delay: 0.0s; }

@keyframes wave {
  from { transform: scaleY(0.5); }
  to   { transform: scaleY(1.0); }
}

/* ── Kategori-chips ── */
.category-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 24px;
}

.chip {
  background: var(--panel2);
  border: 1px solid var(--panel2);
  border-radius: 20px;
  padding: 6px 14px;
  color: var(--muted);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}

.chip.active {
  border-color: var(--copper);
  color: var(--copper);
}

/* ── Transskription preview ── */
.transcript-preview {
  background: var(--panel);
  border-radius: var(--radius);
  padding: 16px;
  margin-bottom: 16px;
}

.transcript-text {
  color: var(--white);
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 16px;
}

.transcript-actions {
  display: flex;
  gap: 10px;
}

.btn-save {
  flex: 1;
  background: var(--copper);
  color: var(--bg);
  border: none;
  border-radius: 8px;
  padding: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.btn-discard {
  background: var(--panel2);
  color: var(--muted);
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
}

/* ── Seneste optagelse ── */
.last-capture {
  background: var(--panel);
  border-left: 3px solid var(--purple);
  border-radius: 0 var(--radius) var(--radius) 0;
  padding: 12px;
}

/* ── Idé-board ── */
.ideas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.btn-new-idea {
  background: var(--copper);
  color: var(--bg);
  border: none;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.filter-tabs {
  display: flex;
  gap: 12px;
  border-bottom: 1px solid var(--panel);
  padding-bottom: 12px;
  margin-bottom: 16px;
  overflow-x: auto;
  scrollbar-width: none;
}

.filter-tab {
  background: none;
  border: none;
  color: var(--muted);
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
}

.filter-tab.active {
  color: var(--copper);
  border-bottom-color: var(--copper);
}

/* ── Idé-kort ── */
.idea-card {
  background: var(--panel);
  border-radius: var(--radius);
  padding: 14px;
  margin-bottom: 10px;
  border-left: 3px solid var(--muted);
  position: relative;
}

.idea-card[data-category="idea"]  { border-left-color: var(--copper); }
.idea-card[data-category="lead"]  { border-left-color: var(--purple); }
.idea-card[data-category="task"]  { border-left-color: var(--success); }
.idea-card[data-category="note"]  { border-left-color: var(--muted); }

.idea-card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.idea-category-chip {
  font-size: 11px;
  background: var(--panel2);
  border-radius: 4px;
  padding: 3px 8px;
  color: var(--muted);
}

.idea-date {
  font-size: 10px;
  color: var(--muted);
}

.idea-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--white);
  line-height: 1.5;
  margin-bottom: 8px;
}

.idea-author {
  font-size: 11px;
  color: var(--muted);
}

.idea-delete {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  color: var(--muted);
  font-size: 16px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s;
}

.idea-card:hover .idea-delete { opacity: 1; }

/* ── Bundnavigation ── */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  background: var(--bg);
  border-top: 1px solid var(--panel);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 100;
}

.nav-btn {
  background: none;
  border: none;
  color: var(--muted);
  font-size: 11px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  cursor: pointer;
  padding: 8px 20px;
  transition: color 0.15s;
}

.nav-btn.active { color: var(--copper); }
.nav-btn span { font-size: 10px; }

/* ── Indstillinger ── */
.settings-section { margin-bottom: 24px; }
.settings-label { color: var(--muted); font-size: 12px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px; display: block; }

.author-options { display: flex; gap: 10px; }

.author-option {
  flex: 1;
  background: var(--panel2);
  border: 1px solid var(--panel2);
  border-radius: 8px;
  padding: 12px;
  color: var(--muted);
  font-size: 14px;
  cursor: pointer;
  text-align: center;
  transition: all 0.15s;
}

.author-option.active {
  border-color: var(--copper);
  color: var(--copper);
}

/* ── Toast ── */
.toast {
  position: fixed;
  bottom: calc(var(--nav-height) + 16px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--panel);
  color: var(--white);
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 13px;
  z-index: 200;
  border: 1px solid var(--copper);
  white-space: nowrap;
  transition: opacity 0.3s;
}

/* ── Utilities ── */
.hidden { display: none !important; }

/* ── Desktop ── */
@media (min-width: 600px) {
  #app { max-width: 480px; margin: 0 auto; }
  .bottom-nav { max-width: 480px; left: 50%; transform: translateX(-50%); }
}
```

- [ ] **Trin 2: Verificer styling i browser**

Åbn `index.html` — baggrund skal være `#06040a`, logo kobberfarvet, bundnavigation synlig.

- [ ] **Trin 3: Commit**

```bash
git add "_INTERNE PRODUKTER/COCKPIT/styles.css"
git commit -m "feat: cockpit styling med Amaizing farvepalette og responsivt layout"
```

---

## Task 3: Datamodel og localStorage (store.js)

**Files:**
- Create: `_INTERNE PRODUKTER/COCKPIT/store.js`

- [ ] **Trin 1: Opret store.js**

```js
// store.js — localStorage CRUD for Amaizing Cockpit
const STORAGE_KEY = 'amaizing_items';
const AUTHOR_KEY  = 'amaizing_author';

export function getAuthor() {
  return localStorage.getItem(AUTHOR_KEY) || 'Søren';
}

export function setAuthor(name) {
  localStorage.setItem(AUTHOR_KEY, name);
}

export function getAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function save(item) {
  const items = getAll();
  const newItem = {
    id:       crypto.randomUUID(),
    text:     item.text.trim(),
    category: item.category || 'note',
    author:   item.author   || getAuthor(),
    created:  new Date().toISOString(),
    synced:   false,
  };
  items.unshift(newItem);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  return newItem;
}

export function remove(id) {
  const items = getAll().filter(i => i.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getByCategory(category) {
  const items = getAll();
  if (category === 'all') return items;
  return items.filter(i => i.category === category);
}
```

- [ ] **Trin 2: Verificer i browser-konsol**

Åbn `index.html`, åbn konsol (F12) og kør:

```js
import('./store.js').then(s => {
  s.save({ text: 'Test tanke', category: 'idea' });
  console.log(s.getAll()); // skal vise ét element
});
```

Forventet output: array med ét objekt med `id`, `text`, `category`, `author`, `created`, `synced: false`.

- [ ] **Trin 3: Commit**

```bash
git add "_INTERNE PRODUKTER/COCKPIT/store.js"
git commit -m "feat: localStorage datamodel med CRUD og author-tracking"
```

---

## Task 4: Auto-kategorisering (ai.js)

**Files:**
- Create: `_INTERNE PRODUKTER/COCKPIT/ai.js`

- [ ] **Trin 1: Opret ai.js**

```js
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
```

- [ ] **Trin 2: Test i konsol**

```js
import('./ai.js').then(ai => {
  console.log(ai.suggestCategory('Vi skal følge op på Nexus møde om tilbud'));  // → 'lead'
  console.log(ai.suggestCategory('Husk at sende fakturaen til Hansen'));        // → 'task'
  console.log(ai.suggestCategory('Hvad hvis vi lavede en ny pakke til SMVer')); // → 'idea'
  console.log(ai.suggestCategory('Generel bemærkning'));                         // → 'note'
});
```

- [ ] **Trin 3: Commit**

```bash
git add "_INTERNE PRODUKTER/COCKPIT/ai.js"
git commit -m "feat: regel-baseret auto-kategorisering af transskription"
```

---

## Task 5: Voice capture (capture.js)

**Files:**
- Create: `_INTERNE PRODUKTER/COCKPIT/capture.js`

- [ ] **Trin 1: Opret capture.js**

```js
// capture.js — Web Speech API optagelseslogik
import { save, getAuthor } from './store.js';
import { suggestCategory } from './ai.js';

const recordBtn      = document.getElementById('recordBtn');
const recordHint     = document.getElementById('recordHint');
const recordTimer    = document.getElementById('recordTimer');
const waveform       = document.getElementById('waveform');
const transcriptPreview = document.getElementById('transcriptPreview');
const transcriptText = document.getElementById('transcriptText');
const saveBtn        = document.getElementById('saveBtn');
const discardBtn     = document.getElementById('discardBtn');
const lastCapture    = document.getElementById('lastCapture');
const chips          = document.querySelectorAll('.chip');
const greeting       = document.getElementById('greeting');

// Vis dato-hilsen
const now = new Date();
greeting.textContent = now.toLocaleDateString('da-DK', {
  weekday: 'long', day: 'numeric', month: 'long'
});

let recognition  = null;
let isRecording  = false;
let timerInterval = null;
let seconds      = 0;
let currentText  = '';
let selectedCategory = 'idea';

// Kategori-valg
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    selectedCategory = chip.dataset.category;
  });
});

function setCategory(cat) {
  selectedCategory = cat;
  chips.forEach(c => {
    c.classList.toggle('active', c.dataset.category === cat);
  });
}

function startTimer() {
  seconds = 0;
  recordTimer.textContent = '0:00';
  recordTimer.classList.remove('hidden');
  timerInterval = setInterval(() => {
    seconds++;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    recordTimer.textContent = `${m}:${s.toString().padStart(2, '0')}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  recordTimer.classList.add('hidden');
}

function showRecording() {
  recordBtn.classList.add('recording');
  recordBtn.querySelector('.record-icon').textContent = '⏹';
  recordHint.textContent = 'Tryk for at stoppe';
  waveform.classList.remove('hidden');
  startTimer();
}

function showIdle() {
  recordBtn.classList.remove('recording');
  recordBtn.querySelector('.record-icon').textContent = '🎤';
  recordHint.textContent = 'Tryk for at optage';
  waveform.classList.add('hidden');
  stopTimer();
}

function showTranscript(text) {
  transcriptText.textContent = text;
  transcriptPreview.classList.remove('hidden');
  const suggested = suggestCategory(text);
  setCategory(suggested);
}

function hideTranscript() {
  transcriptPreview.classList.add('hidden');
  currentText = '';
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2000);
}

function renderLastCapture(item) {
  const categoryLabels = { idea: '💡 Idé', lead: '🎯 Lead', task: '✅ Opgave', note: '📝 Note' };
  const time = new Date(item.created).toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });
  lastCapture.innerHTML = `
    <div class="last-capture-meta" style="color:var(--muted);font-size:10px;margin-bottom:6px;">
      SENESTE · ${time} · ${item.author}
    </div>
    <div style="color:var(--white);font-size:13px;line-height:1.5;">"${item.text}"</div>
    <div style="margin-top:8px;">
      <span class="idea-category-chip">${categoryLabels[item.category] || item.category}</span>
    </div>
  `;
  lastCapture.classList.remove('hidden');
}

// Web Speech API
function initRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return null;

  const r = new SpeechRecognition();
  r.lang = 'da-DK';
  r.continuous = true;
  r.interimResults = true;

  r.onresult = (event) => {
    let interim = '';
    let final = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const t = event.results[i][0].transcript;
      if (event.results[i].isFinal) final += t;
      else interim += t;
    }
    currentText = (currentText + final).trim();
    transcriptText.textContent = currentText || interim;
  };

  r.onerror = (e) => {
    console.error('Speech error:', e.error);
    if (e.error !== 'no-speech') showToast('Mikrofon-fejl: ' + e.error);
    stopRecording();
  };

  return r;
}

function startRecording() {
  recognition = initRecognition();
  if (!recognition) {
    showToast('Din browser understøtter ikke tale-til-tekst');
    return;
  }
  currentText = '';
  isRecording = true;
  showRecording();
  transcriptPreview.classList.add('hidden');
  recognition.start();
}

function stopRecording() {
  if (!isRecording) return;
  isRecording = false;
  showIdle();
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
  if (currentText.trim()) {
    showTranscript(currentText.trim());
  }
}

recordBtn.addEventListener('click', () => {
  if (isRecording) stopRecording();
  else startRecording();
});

saveBtn.addEventListener('click', () => {
  if (!currentText.trim()) return;
  const item = save({ text: currentText, category: selectedCategory, author: getAuthor() });
  hideTranscript();
  renderLastCapture(item);
  showToast('Gemt ✓');
  // Opdater idé-board hvis det er synligt
  document.dispatchEvent(new CustomEvent('item-saved'));
});

discardBtn.addEventListener('click', hideTranscript);
```

- [ ] **Trin 2: Test optagelse i browser**

Åbn `index.html` i Chrome. Klik optageknap — browser beder om mikrofonadgang. Accepter. Sig noget. Klik igen for at stoppe. Transskription skal vises med auto-forslag til kategori.

- [ ] **Trin 3: Commit**

```bash
git add "_INTERNE PRODUKTER/COCKPIT/capture.js"
git commit -m "feat: voice capture med Web Speech API og auto-transskription"
```

---

## Task 6: Idé-board (ideas.js) og navigation (nav.js)

**Files:**
- Create: `_INTERNE PRODUKTER/COCKPIT/ideas.js`
- Create: `_INTERNE PRODUKTER/COCKPIT/nav.js`

- [ ] **Trin 1: Opret nav.js**

```js
// nav.js — bundnavigation og skærm-routing
const navBtns = document.querySelectorAll('.nav-btn');
const screens = document.querySelectorAll('.screen');

export function showScreen(name) {
  screens.forEach(s => s.classList.toggle('active', s.id === `screen-${name}`));
  navBtns.forEach(b => b.classList.toggle('active', b.dataset.screen === name));
}

navBtns.forEach(btn => {
  btn.addEventListener('click', () => showScreen(btn.dataset.screen));
});

// Indstillinger: forfatter-valg
document.querySelectorAll('.author-option').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.author-option').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    import('./store.js').then(s => s.setAuthor(btn.dataset.author));
    import('./capture.js'); // genindlæs ikke — autor hentes live fra store
  });
});

// Sæt initial forfatter UI
import('./store.js').then(s => {
  const author = s.getAuthor();
  document.querySelectorAll('.author-option').forEach(b => {
    b.classList.toggle('active', b.dataset.author === author);
  });
  document.getElementById('authorBtn').textContent = author + ' ▾';
  document.getElementById('authorBtn').addEventListener('click', () => showScreen('settings'));
});
```

- [ ] **Trin 2: Opret ideas.js**

```js
// ideas.js — idé-board rendering og filtrering
import { getByCategory, remove } from './store.js';

const ideasList  = document.getElementById('ideasList');
const filterTabs = document.querySelectorAll('.filter-tab');
const newIdeaBtn = document.getElementById('newIdeaBtn');

const CATEGORY_LABELS = {
  idea: '💡 Idé',
  lead: '🎯 Lead',
  task: '✅ Opgave',
  note: '📝 Note',
};

let activeFilter = 'all';

function formatDate(iso) {
  const d = new Date(iso);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  if (isToday) return 'i dag ' + d.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString('da-DK', { day: 'numeric', month: 'short' });
}

export function renderIdeas() {
  const items = getByCategory(activeFilter);
  if (items.length === 0) {
    ideasList.innerHTML = '<p style="color:var(--muted);text-align:center;padding:40px 0;font-size:14px;">Ingen poster endnu</p>';
    return;
  }
  ideasList.innerHTML = items.map(item => `
    <div class="idea-card" data-category="${item.category}" data-id="${item.id}">
      <button class="idea-delete" data-id="${item.id}" aria-label="Slet">✕</button>
      <div class="idea-card-meta">
        <span class="idea-category-chip">${CATEGORY_LABELS[item.category] || item.category}</span>
        <span class="idea-date">${formatDate(item.created)}</span>
      </div>
      <p class="idea-text">${item.text}</p>
      <span class="idea-author">${item.author}</span>
    </div>
  `).join('');

  // Slet-knapper
  ideasList.querySelectorAll('.idea-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      remove(btn.dataset.id);
      renderIdeas();
    });
  });

  // Opdater filter-tab tæller
  updateTabCounts();
}

function updateTabCounts() {
  const all = getByCategory('all');
  const counts = { all: all.length, idea: 0, lead: 0, task: 0, note: 0 };
  all.forEach(i => counts[i.category] = (counts[i.category] || 0) + 1);

  filterTabs.forEach(tab => {
    const f = tab.dataset.filter;
    const count = counts[f] || 0;
    const label = f === 'all' ? `Alle (${count})` :
                  f === 'idea' ? `💡 Idéer (${count})` :
                  f === 'lead' ? `🎯 Leads (${count})` :
                  f === 'task' ? `✅ Opgaver (${count})` :
                  `📝 Noter (${count})`;
    tab.textContent = label;
  });
}

// Filter-tabs
filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeFilter = tab.dataset.filter;
    renderIdeas();
  });
});

// Ny manuel note
newIdeaBtn.addEventListener('click', () => {
  const text = prompt('Skriv din note:');
  if (text && text.trim()) {
    import('./store.js').then(s => {
      s.save({ text: text.trim(), category: 'note', author: s.getAuthor() });
      renderIdeas();
    });
  }
});

// Genrender når en optagelse gemmes
document.addEventListener('item-saved', renderIdeas);

// Initial render
renderIdeas();
```

- [ ] **Trin 3: Test navigation og idé-board**

Åbn `index.html`. Optag og gem en tanke. Naviger til "Idéer" — kortet skal vises med korrekt kategori og dato. Tryk ✕ — kortet forsvinder.

- [ ] **Trin 4: Commit**

```bash
git add "_INTERNE PRODUKTER/COCKPIT/nav.js" "_INTERNE PRODUKTER/COCKPIT/ideas.js"
git commit -m "feat: idé-board med filtrering og bundnavigation"
```

---

## Task 7: PWA-manifest og offline-support

**Files:**
- Create: `_INTERNE PRODUKTER/COCKPIT/manifest.json`
- Create: `_INTERNE PRODUKTER/COCKPIT/sw.js`

- [ ] **Trin 1: Opret manifest.json**

```json
{
  "name": "Amaizing Cockpit",
  "short_name": "Cockpit",
  "description": "Intern capture-app for Amaizing",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#06040a",
  "theme_color": "#06040a",
  "icons": [
    { "src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

- [ ] **Trin 2: Opret sw.js (service worker)**

```js
// sw.js — cache app-filer til offline-brug
const CACHE = 'cockpit-v1';
const FILES = ['/', '/index.html', '/styles.css', '/capture.js',
               '/store.js', '/ai.js', '/ideas.js', '/nav.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
```

- [ ] **Trin 3: Registrer service worker i index.html**

Tilføj inden `</body>`:

```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
  }
</script>
```

- [ ] **Trin 4: Opret placeholder-ikoner**

Opret to simple PNG-filer (192×192 og 512×512) med Amaizing-farver og "A"-bogstav. Kan laves med et online PNG-generator-værktøj eller Canvas API. Gem som `icons/icon-192.png` og `icons/icon-512.png`.

- [ ] **Trin 5: Test PWA-installation**

Åbn `index.html` via en lokal HTTP-server (fx `npx serve .` i COCKPIT-mappen). I Chrome: klik adresselinje-ikonet "Installer app". App skal åbne i standalone-vindue.

- [ ] **Trin 6: Commit**

```bash
git add "_INTERNE PRODUKTER/COCKPIT/"
git commit -m "feat: PWA-manifest og service worker — kan installeres på hjemskærm"
```

---

## Task 8: Sluttest og .gitignore

**Files:**
- Modify: `.gitignore`

- [ ] **Trin 1: Tilføj .superpowers til .gitignore**

```bash
echo ".superpowers/" >> .gitignore
git add .gitignore
git commit -m "chore: ignorer .superpowers brainstorm-filer"
```

- [ ] **Trin 2: Fuld gennemtest**

Tjek alle disse scenarier:

| Scenarie | Forventet resultat |
|----------|--------------------|
| Tryk optag → sig noget → stop | Transskription vises med auto-kategori |
| Gem optagelse | Toast "Gemt ✓", kort vises i Idéer |
| Skift forfatter i Indstillinger | Nye optagelser gemmes med nyt navn |
| Naviger mellem alle 4 faner | Korrekt skærm vises, aktiv nav-knap kobberfar |
| Slet et idé-kort | Kortet forsvinder fra listen |
| Åbn på mobil-browser | Layout tilpasser sig, knapper er tommelfinger-store |
| Installér som PWA | App åbner i standalone uden adresselinje |

- [ ] **Trin 3: Afsluttende commit**

```bash
git add -A
git commit -m "feat: Amaizing Cockpit MVP klar — voice capture + idé-board"
```
