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

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

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
  saveBtn.classList.remove('hidden');
  discardBtn.classList.remove('hidden');
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
      SENESTE · ${time} · ${esc(item.author)}
    </div>
    <div style="color:var(--white);font-size:13px;line-height:1.5;">"${esc(item.text)}"</div>
    <div style="margin-top:8px;">
      <span class="idea-category-chip">${categoryLabels[esc(item.category)] || esc(item.category)}</span>
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
    // Vis tekst løbende under optagelse
    transcriptText.textContent = currentText || interim;
    transcriptPreview.classList.remove('hidden');
    saveBtn.classList.add('hidden');
    discardBtn.classList.add('hidden');
  };

  r.onerror = (e) => {
    console.error('Speech error:', e.error);
    if (e.error !== 'no-speech') showToast('Mikrofon-fejl: ' + e.error);
    stopRecording();
  };

  // iOS Safari stopper recognition automatisk — vis transcript alligevel
  r.onend = () => {
    if (isRecording) stopRecording();
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
