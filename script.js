// --- 1. Musik Kotak Musik Lembut (Web Audio API) ---
let audioCtx = null;
let isPlaying = false;
let melodyTimer = null;
let noteIndex = 0;

const lullabyNotes = [
  523.25, 659.25, 783.99, 659.25,
  587.33, 698.46, 880.00, 698.46,
  493.88, 587.33, 783.99, 587.33,
  523.25, 659.25, 783.99, 1046.50
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
  gain.gain.exponentialRampToValueAtTime(0.065, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.45);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 1.5);
}

function playPopSound() {
  initAudio();
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(340, now);
  osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);

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
      }, 650);
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
  spawnParticles(window.innerWidth / 2, window.innerHeight / 2, ['🤍', '🌸', '✨', '💖'], 15);
  document.getElementById('moodSection').scrollIntoView({ behavior: 'smooth' });
});

// --- 2. Termometer Kesel Ayang ---
const moodSlider = document.getElementById('moodSlider');
const moodEmoji = document.getElementById('moodEmoji');
const moodStatus = document.getElementById('moodStatus');

moodSlider.addEventListener('input', () => {
  const val = Number(moodSlider.value);
  moodEmoji.style.transform = 'scale(1.18)';
  setTimeout(() => (moodEmoji.style.transform = 'scale(1)'), 150);

  if (val >= 85) {
    moodEmoji.textContent = '🌋';
    moodStatus.textContent = `Level ${val}%: Mode Naga Menyembur Api! (Harap jajanin segera)`;
  } else if (val >= 60) {
    moodEmoji.textContent = '😤';
    moodStatus.textContent = `Level ${val}%: Kesel banget pengen nyakar tembok`;
  } else if (val >= 35) {
    moodEmoji.textContent = '🥺';
    moodStatus.textContent = `Level ${val}%: Udah mulai reda dikit, tinggal butuh dipeluk`;
  } else {
    moodEmoji.textContent = '🥰';
    moodStatus.textContent = `Level ${val}%: Yeay! Udah mulai senyum manis lagi 🤍`;
  }
});

// --- 3. Bubble Wrap ---
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
        popCounter.textContent = `${poppedCount} rasa sebel meletus`;
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

// --- // --- 4. Vent Box (Terkirim ke Email Kamu + Efek Terbang) ---
const ventInput = document.getElementById('ventInput');
const releaseTextBtn = document.getElementById('releaseTextBtn');
const ventFeedback = document.getElementById('ventFeedback');

releaseTextBtn.addEventListener('click', () => {
  const pesan = ventInput.value.trim();
  if (!pesan) {
    ventInput.focus();
    return;
  }

  // Kirim teks ke email kamu secara background
  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      access_key: '86593aef-50de-47b1-8c4c-b3d540b93765',
      subject: '💌 Curhatan dari Ayang',
      message: pesan
    })
  }).catch(() => {});

  // Animasi terbang tetap jalan seperti biasa
  const rect = ventInput.getBoundingClientRect();
  spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, ['🚀', '🌸', '🍃', '✨'], 20);

  ventInput.classList.add('vanishing');
  setTimeout(() => {
    ventInput.value = '';
    ventInput.classList.remove('vanishing');
    ventFeedback.classList.add('show');
    setTimeout(() => ventFeedback.classList.remove('show'), 3500);
  }, 500);
});

// --- 5. Surat Rahasia ---
const letters = {
  marah: {
    title: 'Saat Kamu Lagi Marah & Pengen Meledak 🔥',
    body: 'Wajar banget kalau kamu marah sekarang. Kamu nggak harus pura-pura sabar atau langsung senyum.\n\nLuapin aja dulu—mau diem dulu boleh, mau ngomel panjang lebar juga aku siap dengerin. Yang penting jangan dipendem sendirian sampai bikin dada kamu sesek ya, Cantik.'
  },
  sedih: {
    title: 'Saat Kamu Lagi Sedih & Capek Banget 🌧️',
    body: 'Kalau hari ini rasanya berat banget dan air mata kamu pengen jatuh, nangis aja nggak apa-apa. Nangis bukan berarti kamu lemah, itu tandanya kamu udah bertahan terlalu kuat.\n\nSini istirahat sebentar. Dunia boleh berisik, tapi di sini kamu selalu aman dan disayang.'
  },
  keselAku: {
    title: 'Saat Kamu Lagi Kesel Sama Aku 🥺',
    body: 'Maaf ya kalau sikap atau omongan aku bikin hati kamu nggak enak hari ini. Nggak ada sedikit pun niat aku buat nyakitin orang yang paling aku sayang.\n\nKalau kamu udah siap ngobrol, kasih tahu aku ya. Aku mau belajar jadi lebih baik buat kamu, bukan menang debat.'
  },
  kangen: {
    title: 'Saat Kamu Cuma Butuh Dipeluk 🤍',
    body: 'Nggak perlu jelasin apa-apa kalau kamu lagi kehabisan energi buat cerita.\n\nAnggap halaman ini tangan aku yang lagi menggenggam tangan kamu erat-erat. Aku di sini, nggak ke mana-mana, nungguin kamu sampai hati kamu hangat lagi.'
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

// --- 6. Voucher Suap ---
document.querySelectorAll('.coupon').forEach(coupon => {
  coupon.addEventListener('click', () => {
    coupon.classList.toggle('claimed');
    const badge = coupon.querySelector('.coupon-badge');
    badge.textContent = coupon.classList.contains('claimed') ? 'DIAMBIL ✓' : 'Ambil';
  });
});

document.getElementById('copyCouponsBtn').addEventListener('click', () => {
  const claimed = Array.from(document.querySelectorAll('.coupon.claimed'))
    .map(el => `• ${el.getAttribute('data-title')}`);

  const status = document.getElementById('copyStatus');
  if (claimed.length === 0) {
    status.style.color = '#e6496f';
    status.textContent = 'Pilih minimal satu voucher dulu di atas ya 🤍';
    return;
  }

  const textToCopy = `Sayang, aku klaim voucher anti-ngambek ini ya:\n${claimed.join('\n')}`;
  navigator.clipboard.writeText(textToCopy).then(() => {
    status.style.color = '#2f855a';
    status.textContent = 'Tersalin! Tinggal tempel (paste) di chat aku ya 💌';
  }).catch(() => {
    status.textContent = 'Screenshot aja voucher pilihanmu lalu kirim ke aku 💌';
  });
});

// --- 7. Tombol Lucu "Masih Marah" yang Lari + Tombol Peluk ---
const runawayBtn = document.getElementById('runawayBtn');
const runawayTexts = [
  'Eits, nggak kena 😜',
  'Jangan marah terus dong 🥺',
  'Tombol ini lagi rusak 🏃‍♂️💨',
  'Pencet yang pink aja ya 🤍',
  'Aku beliin jajan deh, janji! 🧋'
];
let dodgeCount = 0;

function dodgeButton() {
  const moveX = (Math.random() - 0.5) * 180;
  const moveY = (Math.random() - 0.5) * 90;
  runawayBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
  runawayBtn.textContent = runawayTexts[dodgeCount % runawayTexts.length];
  dodgeCount++;
}

runawayBtn.addEventListener('mouseenter', dodgeButton);
runawayBtn.addEventListener('click', (e) => {
  e.preventDefault();
  dodgeButton();
});

let hugCount = 0;
const hugMessages = [
  'Yeay! Peluk virtual terkirim... makasih udah mau baikan, Sayang 🤍🫂',
  'Satu pelukan hangat lagi biar senyum manis kamu balik 100% ✨💖',
  'Kamu itu rumah paling nyaman buat aku. Love you so much! 🌷'
];

document.getElementById('forgiveBtn').addEventListener('click', (e) => {
  const rect = e.target.getBoundingClientRect();
  spawnParticles(rect.left + rect.width / 2, rect.top, ['🤍', '🫂', '💖', '🌷', '✨', '🥰'], 26);
  document.getElementById('hugMessage').textContent = hugMessages[hugCount % hugMessages.length];
  runawayBtn.style.display = 'none';
  hugCount++;
});

// --- Helper: Partikel Terbang ---
function spawnParticles(x, y, symbols, count) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'particle';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    const offsetX = (Math.random() - 0.5) * 200;
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