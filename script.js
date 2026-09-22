const cards = [
  { title: "Dein Lächeln", emoji: "😊", text: "Dein Lächeln schafft es jedes Mal, meinen Tag ein kleines bisschen besser zu machen." },
  { title: "Deine Augen", emoji: "✨", text: "Ich könnte wahrscheinlich ewig in deine Augen schauen und würde trotzdem jedes Mal etwas neues darin finden." },
  { title: "Dein Lachen", emoji: "😂", text: "Ich liebe es, mit dir über Leute zu lachen die Bäume umarmen oder wenn da ein Rapper ein Musik Video dreht." },
  { title: "Deine Art", emoji: "❤️", text: "Es ist nicht nur eine Sache an dir. Es ist die Art, wie du einfach du selbst bist." },
  { title: "Bei dir", emoji: "🫶", text: "Bei dir kann ich einfach ich selbst sein und genau das bedeutet mir mehr als du vielleicht denkst." },
  { title: "Kleine Momente", emoji: "🌸", text: "Manchmal sind es gar nicht die großen Dinge, die mir im Kopf bleiben sondern diese kleinen Momente mit dir." },
  { title: "Deine Verrücktheit", emoji: "🤭", text: "Und ja… manchmal bist du auch ein bisschen verrückt. Aber genau das ist es warum ich dich auch so sehr mag." },
  { title: "Unsere Erinnerungen", emoji: "📸", text: "Wenn ich an unsere gemeinsame Zeit denke, gibt es so viele Momente bei denen ich sofort wieder lächeln muss." },
  { title: "Was du mir bedeutest", emoji: "💗", text: "Du bist für mich längst mehr als nur irgendein Mensch. Du bist meine Ehefrau und ich will dich nicht verlieren." },
  { title: "Für diesen einen Moment", emoji: "🌙", text: "", special: true },
  { title: "Deine Ausdauer", emoji: "🌷", text: "Ich bewundere, wie du es schaffst, trotz all der Hindernisse dein Leben so zu leben." },
  { title: "Deine Stimme", emoji: "🎶", text: "Jeder hat eine Stimme aber deine ist besonders schön." },
  { title: "Deine Nähe", emoji: "🫂", text: "Manchmal muss gar nichts gesagt werden. Es reicht schon, dass du da bist." },
  { title: "Deine Aufmerksamkeit", emoji: "🥰", text: "Ich habe niemanden, der mir so aufmerksam zuhört wie du. Du bist auch die Einzige, mit der ich auch gerne rede." },
  { title: "Unsere Zukunft", emoji: "🌅", text: "Ich weiß nicht, was noch alles auf uns zukommt. Aber ich freue mich auf jeden einzelnen Moment, den wir zusammen erleben werden." },
  { title: "Danke", emoji: "💐", text: "Danke, dass du so bist, wie du bist. Danke für all die schönen Momente und dafür, dass es dich gibt." },
  { title: "Du bist einzigartig", emoji: "✨", text: "Es gibt viele Menschen auf dieser Welt. Aber niemand ist so toll wie du." },
  { title: "Fast am Ende", emoji: "🥹", text: "Wenn du bis hierhin gewischt hast, hast du hoffentlich schon gemerkt, dass diese Karten eigentlich niemals ausreichen könnten." }
];

const intro = document.getElementById('intro');
const cardsScreen = document.getElementById('cards');
const finale = document.getElementById('finale');
const gift = document.getElementById('gift');
const cardTrack = document.getElementById('cardTrack');
const viewport = document.getElementById('cardViewport');
const counterCurrent = document.getElementById('counterCurrent');
const progressBar = document.getElementById('progressBar');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const swipeHint = document.getElementById('swipeHint');
const specialOverlay = document.getElementById('specialOverlay');
const specialContinue = document.getElementById('specialContinue');
const replayBtn = document.getElementById('replayBtn');

let current = 0;
let isAnimating = false;
let startX = 0;
let startY = 0;
let dragX = 0;
let dragging = false;
let specialShown = false;
let specialLocked = false;

function renderCards() {
  cardTrack.innerHTML = cards.map((card, index) => {
    const safeTitle = card.title.replace(/"/g, '&quot;');
    if (card.special) {
      return `<article class="card" data-index="${index}" aria-label="Karte ${index + 1}: ${safeTitle}">
        <div class="card-inner">
          <div class="card-number">${String(index + 1).padStart(2,'0')}</div>
          <div class="card-emoji">${card.emoji}</div>
          <h2>${safeTitle}</h2>
          <p>Hier wartet eine kleine Überraschung auf dich. ❤️</p>
        </div>
      </article>`;
    }
    return `<article class="card" data-index="${index}" aria-label="Karte ${index + 1}: ${safeTitle}">
      <div class="card-inner">
        <div class="card-number">${String(index + 1).padStart(2,'0')}</div>
        <div class="card-emoji">${card.emoji}</div>
        <h2>${safeTitle}</h2>
        <p>„${card.text}“</p>
      </div>
    </article>`;
  }).join('');
}

function updateCard(animate = true) {
  cardTrack.style.transition = animate ? 'transform .55s cubic-bezier(.22,.75,.18,1)' : 'none';
  cardTrack.style.transform = `translate3d(${-current * 100}%, 0, 0)`;
  counterCurrent.textContent = current + 1;
  progressBar.style.width = `${((current + 1) / cards.length) * 100}%`;
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === cards.length - 1;

  if (current > 0) swipeHint.classList.add('hidden');
  else swipeHint.classList.remove('hidden');

  if (current === 9 && !specialShown) {
    showSpecial();
  }
}

function showSpecial() {
  specialShown = true;
  specialLocked = true;
  specialOverlay.classList.add('show');
  specialOverlay.setAttribute('aria-hidden', 'false');
  setTimeout(() => specialContinue.focus({ preventScroll: true }), 4500);
}

function hideSpecial() {
  specialLocked = false;
  specialOverlay.classList.remove('show');
  specialOverlay.setAttribute('aria-hidden', 'true');
  current = 10; // direkt weiter zu Karte 11
  updateCard(true);
}

function goTo(index, fromUser = true) {
  if (isAnimating || specialLocked) return;
  const clamped = Math.max(0, Math.min(index, cards.length - 1));
  if (clamped === current) return;
  isAnimating = true;
  current = clamped;
  updateCard(true);
  setTimeout(() => {
    isAnimating = false;
  }, 560);
}

function next() {
  if (specialLocked) return;
  if (current < cards.length - 1) {
    goTo(current + 1);
  } else {
    showFinale();
  }
}

function prev() {
  if (specialLocked) return;
  if (current > 0) goTo(current - 1);
}

function openGift() {
  if (gift.classList.contains('opened')) return;
  gift.classList.add('opened');
  burstConfetti(90);
  setTimeout(() => {
    intro.classList.remove('active');
    cardsScreen.classList.add('active');
    updateCard(false);
  }, 850);
}

function showFinale() {
  cardsScreen.classList.remove('active');
  finale.classList.add('active');
  burstConfetti(150);
  burstFinalParticles(52);
}

function replay() {
  finale.classList.remove('active');
  cardsScreen.classList.add('active');
  specialShown = false;
  specialLocked = false;
  current = 0;
  updateCard(false);
}

function burstConfetti(count) {
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    piece.style.setProperty('--x', `${(Math.random() - 0.5) * innerWidth * 1.2}px`);
    piece.style.setProperty('--y', `${Math.random() * innerHeight * 1.1}px`);
    piece.style.setProperty('--r', `${(Math.random() - 0.5) * 1400}deg`);
    piece.style.setProperty('--dur', `${1.2 + Math.random() * 1.8}s`);
    piece.style.left = `${50 + (Math.random() - 0.5) * 10}%`;
    piece.style.top = `${38 + (Math.random() - 0.5) * 8}%`;
    piece.style.borderRadius = Math.random() > 0.5 ? '2px' : '50%';
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3200);
  }
}

function burstFinalParticles(count) {
  const wrap = document.getElementById('finalParticles');
  wrap.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.left = `${Math.random() * 100}%`;
    p.style.setProperty('--drift', `${(Math.random() - .5) * 180}px`);
    p.style.setProperty('--dur', `${4 + Math.random() * 6}s`);
    p.style.animationDelay = `${Math.random() * 5}s`;
    p.style.width = `${5 + Math.random() * 8}px`;
    p.style.height = p.style.width;
    wrap.appendChild(p);
  }
}

// Touch / pointer swipe
viewport.addEventListener('pointerdown', (e) => {
  if (specialLocked || isAnimating) return;
  dragging = true;
  startX = e.clientX;
  startY = e.clientY;
  dragX = 0;
  cardTrack.style.transition = 'none';
  viewport.setPointerCapture?.(e.pointerId);
});

viewport.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  dragX = e.clientX - startX;
  const dragY = e.clientY - startY;
  if (Math.abs(dragY) > Math.abs(dragX) && Math.abs(dragY) > 18) return;
  const resistance = (current === 0 && dragX > 0) || (current === cards.length - 1 && dragX < 0) ? 0.2 : 1;
  cardTrack.style.transform = `translate3d(calc(${-current * 100}% + ${dragX * resistance}px), 0, 0)`;
});

viewport.addEventListener('pointerup', () => {
  if (!dragging) return;
  dragging = false;
  cardTrack.style.transition = 'transform .55s cubic-bezier(.22,.75,.18,1)';
  if (Math.abs(dragX) > 55) {
    dragX < 0 ? next() : prev();
  } else {
    updateCard(true);
  }
});
viewport.addEventListener('pointercancel', () => {
  dragging = false;
  updateCard(true);
});

prevBtn.addEventListener('click', prev);
nextBtn.addEventListener('click', next);
gift.addEventListener('click', openGift);
specialContinue.addEventListener('click', hideSpecial);
replayBtn.addEventListener('click', replay);

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') prev();
  if (e.key === 'ArrowRight') next();
  if (e.key === 'Escape' && specialShown) hideSpecial();
});

renderCards();
updateCard(false);

