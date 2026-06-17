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
    document.getElementById('authorBtn').textContent = btn.dataset.author + ' ▾';
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
