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

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

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
    <div class="idea-card" data-category="${esc(item.category)}" data-id="${esc(item.id)}">
      <button class="idea-delete" data-id="${esc(item.id)}" aria-label="Slet">✕</button>
      <div class="idea-card-meta">
        <span class="idea-category-chip">${CATEGORY_LABELS[item.category] || esc(item.category)}</span>
        <span class="idea-date">${formatDate(item.created)}</span>
      </div>
      <p class="idea-text">${esc(item.text)}</p>
      <span class="idea-author ${esc(item.author) === 'Søren' ? 'idea-author-soren' : 'idea-author-rooba'}">${esc(item.author)}</span>
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
