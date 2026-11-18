// --- 1. Gentle Music Box Synthesizer (Web Audio API) ---
let audioCtx = null;
let isPlaying = false;
let melodyTimer = null;
let noteIndex = 0;

// Melodi lembut pentatonik / lullaby
const lullabyNotes = [
  523.25, 659.25, 783.99, 659.25, // C5 E5 G5 E5
  587.33, 698.46, 880.00, 698.46, // D5 F5 A5 F5
  493.88, 587.33, 783.99, 587.33, // B4 D5 G5 D5
  523.25, 659.25, 783.99, 1046.50 // C5 E5 G5 C6
];

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playBellNote(freq) {
  if (!audioCtx || !isPlaying) return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.06, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 1.45);
}

function playPopSound() {
  initAudio();
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(620, now + 0.08);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 0.1);
}

function toggleMusic(forcePlay = null) {
  initAudio();
  isPlaying = forcePlay !== null ? forcePlay : !isPlaying;

  const btn = document.getElementById('musicBtn');
  const label = document.getElementById('musicLabel');

  if (isPlaying) {
    btn.classList.add('playing');
    label.textContent = 'Musik: Nyala';
    if (!melodyTimer) {
      playBellNote(lullabyNotes[noteIndex % lullabyNotes.length]);
      noteIndex++;
      melodyTimer = setInterval(() => {
        playBellNote(lullabyNotes[noteIndex % lullabyNotes.length]);
        noteIndex++;
      }, 680);
    }
  } else {
    btn.classList.remove('playing');
    label.textContent = 'Musik: Mati';
    clearInterval(melodyTimer);
    melodyTimer = null;
  }
}

document.getElementById('musicBtn').addEventListener('click', () => toggleMusic());

document.getElementById('startBtn').addEventListener('click', () => {
  toggleMusic(true);
  spawnParticles(window.innerWidth / 2, window.innerHeight / 2, ['🤍', '🌸', '✨'], 12);
  document.getElementById('releaseSection').scrollIntoView({ behavior: 'smooth' });
});

// --- 2. Bubble Wrap ---
const bubbleGrid = document.getElementById('bubbleGrid');
const popCounter = document.getElementById('popCounter');
let poppedCount = 0;

function buildBubbles() {
  bubbleGrid.innerHTML = '';
  for (let i = 0; i < 24; i++) {
    const btn = document.createElement('button');
    btn.className = 'bubble';
    btn.setAttribute('aria-label', 'Gelembung');
    btn.addEventListener('click', function () {
      if (!this.classList.contains('popped')) {
        this.classList.add('popped');
        poppedCount++;
        popCounter.textContent = `${poppedCount} gelembung meletus`;
        playPopSound();
      }
    });
    bubbleGrid.appendChild(btn);
  }
}

buildBubbles();

document.getElementById('resetBubbles').addEventListener('click', () => {
  buildBubbles();
});

// --- 3. Vent Box (Terbangkan Keluhan) ---
const ventInput = document.getElementById('ventInput');
const releaseTextBtn = document.getElementById('releaseTextBtn');
const ventFeedback = document.getElementById('ventFeedback');

releaseTextBtn.addEventListener('click', () => {
  if (!ventInput.value.trim()) {
    ventInput.focus();
    return;
  }
  const rect = ventInput.getBoundingClientRect();
  spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, ['🌸', '🍃', '✨', '🦋'], 18);

  ventInput.classList.add('vanishing');
  setTimeout(() => {
    ventInput.value = '';
    ventInput.classList.remove('vanishing');
    ventFeedback.classList.add('show');
    setTimeout(() => ventFeedback.classList.remove('show'), 3500);
  }, 500);
});

// --- 4. Open When Letters ---
const letters = {
  marah: {
    title: 'Saat Kamu Lagi Marah & Pengen Meledak',
    body: 'Valid banget kalau kamu marah sekarang. Kamu nggak harus pura-pura sabar atau langsung senyum.\n\nLuapin aja dulu—mau diem dulu boleh, mau cerita sambil ngomel-ngomel juga aku siap dengerin. Yang penting jangan dipendem sendirian sampai bikin dada kamu sesek ya.'
  },
  sedih: {
    title: 'Saat Kamu Lagi Sedih & Capek Banget',
    body: 'Kalau hari ini rasanya berat banget dan air mata kamu pengen jatuh, nangis aja nggak apa-apa. Nangis bukan berarti kamu lemah, itu tandanya kamu udah bertahan terlalu kuat.\n\nIstirahat sebentar ya. Dunia boleh berisik, tapi di sini kamu selalu aman.'
  },
  keselAku: {
    title: 'Saat Kamu Lagi Kesel Sama Aku',
    body: 'Maaf ya kalau sikap atau omongan aku bikin hati kamu nggak enak hari ini. Aku nggak pernah berniat nyakitin kamu.\n\nKalau kamu udah siap ngobrol, kasih tahu aku bagian mana yang bikin kamu kesel. Aku mau belajar jadi lebih baik buat kamu, bukan menang debat.'
  },
  butuhDitemani: {
    title: 'Saat Kamu Cuma Butuh Ditemani',
    body: 'Nggak perlu jelasin apa-apa kalau kamu lagi nggak punya energi buat cerita.\n\nAnggap halaman ini tangan aku yang lagi menggenggam tangan kamu. Aku di sini, nggak ke mana-mana, nungguin kamu sampai hati kamu pelan-pelan hangat lagi.'
  }
};

const letterModal = document.getElementById('letterModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

document.querySelectorAll('.envelope-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.getAttribute('data-letter');
    modalTitle.textContent = letters[key].title;
    modalBody.textContent = letters[key].body;
    letterModal.classList.add('open');
  });
});

document.getElementById('closeModalBtn').addEventListener('click', () => {
  letterModal.classList.remove('open');
});

letterModal.addEventListener('click', (e) => {
  if (e.target === letterModal) letterModal.classList.remove('open');
});

// --- 5. Coupons ---
const coupons = document.querySelectorAll('.coupon');
coupons.forEach(coupon => {
  coupon.addEventListener('click', () => {
    coupon.classList.toggle('claimed');
    const badge = coupon.querySelector('.coupon-badge');
    badge.textContent = coupon.classList.contains('claimed') ? 'DIKLAIM ✓' : 'Klaim';
  });
});

document.getElementById('copyCouponsBtn').addEventListener('click', () => {
  const claimed = Array.from(document.querySelectorAll('.coupon.claimed'))
    .map(el => `• ${el.getAttribute('data-title')}`);

  const status = document.getElementById('copyStatus');
  if (claimed.length === 0) {
    status.style.color = '#e06d78';
    status.textContent = 'Pilih minimal satu kupon dulu di atas ya 🤍';
    return;
  }

  const textToCopy = `Sayang, aku klaim kupon ini ya:\n${claimed.join('\n')}`;
  navigator.clipboard.writeText(textToCopy).then(() => {
    status.style.color = '#3a8a5c';
    status.textContent = 'Tersalin! Tinggal tempel (paste) di chat aku ya 💌';
  }).catch(() => {
    status.textContent = 'Kupon siap! Screenshot aja bagian ini kirim ke aku 💌';
  });
});

// --- 6. Virtual Hug Finale ---
let hugCount = 0;
const hugMessages = [
  'Peluk erat dari jauh... tarik napas, buang pelan-pelan 🤍',
  'Satu pelukan lagi buat ngusir semua rasa kesel hari ini 🫂',
  'Kamu berharga banget buat aku. Makasih udah bertahan hari ini ✨',
  'Kapan pun kamu butuh, pelukan ini selalu gratis & unlimited 🌷'
];

document.getElementById('hugBtn').addEventListener('click', (e) => {
  const rect = e.target.getBoundingClientRect();
  spawnParticles(rect.left + rect.width / 2, rect.top, ['🤍', '🫂', '💖', '🌷', '✨'], 22);
  document.getElementById('hugMessage').textContent = hugMessages[hugCount % hugMessages.length];
  hugCount++;
});

// --- Helper: Floating Particles ---
function spawnParticles(x, y, symbols, count) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'particle';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    const offsetX = (Math.random() - 0.5) * 180;
    const offsetY = (Math.random() - 0.5) * 60;
    el.style.left = `${x + offsetX}px`;
    el.style.top = `${y + offsetY}px`;
    el.style.animationDuration = `${1.8 + Math.random() * 1.2}s`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }
}

// --- Scroll Reveal ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('section.card').forEach(card => observer.observe(card));