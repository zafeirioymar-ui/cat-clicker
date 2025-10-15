// ===== SIMPLE & RELIABLE YOUTUBE MUSIC =====
const musicBtn = document.getElementById('musicBtn');
const box = document.getElementById('yt-player');
const VIDEO_ID = 'aVbMGLiyB4Q';   // το νέο τραγούδι
let iframe = null;
let isPlaying = false;
let isMuted = true;

function setIframe(mute, autoplay=true){
  const params = new URLSearchParams({
    autoplay: autoplay ? 1 : 0,
    mute: mute ? 1 : 0,
    loop: 1,
    playlist: VIDEO_ID,
    controls: 0,
    modestbranding: 1,
    playsinline: 1
  });
  const src = `https://www.youtube.com/embed/${VIDEO_ID}?${params.toString()}`;
  if (!iframe){
    iframe = document.createElement('iframe');
    iframe.allow = 'autoplay; encrypted-media';
    iframe.title = 'background music';
    box.appendChild(iframe);
  }
  iframe.src = src;
  isMuted = !!mute;
  isPlaying = true;
  updateBtn();
}

function updateBtn(){
  musicBtn.textContent = isMuted ? '🔇 Music' : '🔊 Music';
  musicBtn.setAttribute('aria-pressed', isMuted ? 'false' : 'true');
}

// 1ο πάτημα: ξεκινά μουσική με ήχο (επιτρέπεται γιατί είναι user gesture)
// επόμενα πατήματα: toggle mute/unmute (μικρό reload του iframe)
musicBtn.addEventListener('click', () => {
  if (!isPlaying){
    setIframe(false, true);   // ξεκίνα με ήχο
  } else {
    setIframe(!isMuted, true); // εναλλαγή mute/unmute
  }
});


const playground = document.getElementById('playground');
const scoreEl = document.getElementById('score');
const spawnBtn = document.getElementById('spawnBtn');

let score = 0;

// Τα emoji γατών
const cats = ['🐈‍⬛', '🐈‍⬛', '🐈‍⬛'];

function rand(min, max) { return Math.random() * (max - min) + min; }
function choice(arr) { return arr[Math.floor(rand(0, arr.length))]; }

function spawnCat() {
  const cat = document.createElement('div');
  cat.className = 'cat';
  cat.textContent = choice(cats);

  const size = 64; // μέγεθος περίπου σε px
  cat.style.left = rand(0, playground.clientWidth - size) + 'px';
  cat.style.top = rand(0, playground.clientHeight - size) + 'px';

  // Προαιρετικό badge (+1)
  const badge = document.createElement('div');
  badge.className = 'badge';
  badge.textContent = '+1';
  cat.appendChild(badge);

  // ✅ Όταν κάνεις κλικ:
  cat.addEventListener('click', () => {
    score++;
    scoreEl.textContent = `Score: ${score}`;

    // εμφάνισε το +1 για λίγο
    badge.style.opacity = '1';
    badge.style.top = '-28px';

    // μετά από λίγο εξαφανίζουμε και το badge
    setTimeout(() => {
      badge.style.opacity = '0';
      badge.style.top = '-16px';
    }, 200);

    // ❗ εξαφανίζουμε το ίδιο το γατάκι αμέσως
    setTimeout(() => {
      cat.remove(); // το σβήνει από το DOM
    }, 200);
  });

  playground.appendChild(cat);
  wiggle(cat);
}

function wiggle(el) {
  function move() {
    const size = 64;
    const maxX = playground.clientWidth - size;
    const maxY = playground.clientHeight - size;
    const x = rand(0, maxX);
    const y = rand(0, maxY);
    const duration = rand(2000, 4000);

    // Αν το element έχει αφαιρεθεί (δηλαδή το έκανες κλικ), σταμάτα
    if (!document.body.contains(el)) return;

    el.animate(
      [{ transform: `translate(${x - el.offsetLeft}px, ${y - el.offsetTop}px)` }],
      { duration, fill: 'forwards', easing: 'ease-in-out' }
    ).onfinish = () => {
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      setTimeout(move, rand(300, 800));
    };
  }
  move();
}

// αρχικά 5 γάτες
for (let i = 0; i < 5; i++) spawnCat();

// κουμπί "Νέα γάτα"
spawnBtn.addEventListener('click', spawnCat);
