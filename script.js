const modalButtons = document.querySelectorAll('.btn[data-modal]');
const overlay = document.getElementById('overlay');
const modals = document.querySelectorAll('.modal');
const closeButtons = document.querySelectorAll('.modal-close');
const linkedinBtn = document.getElementById('linkedinBtn');
const letters = document.querySelectorAll('#glow-text span');
const delay = 150
const repeatDelay = 10000
const initialDelay = 2000
const clickSound = new Audio('assets/soundeffect/bass1.wav');
clickSound.volume = 0.5;
const allButtons = document.querySelectorAll('.btn, .download-btn, .icon-btn, .link-icon');
const closeSound = new Audio('assets/soundeffect/button1.mp3');
closeSound.volume = 0.5;
const cvSwitch = document.getElementById('cvSwitch');
const cvLabel = document.getElementById('cvLabel');
const resumeIframe = document.getElementById('resumeIframe');
const aboutSwitch = document.getElementById('aboutSwitch');
const aboutLabel = document.getElementById('aboutLabel');
const aboutText = document.getElementById('aboutText');
const contactSwitch = document.getElementById('contactSwitch');
const contactLabel = document.getElementById('contactLabel');
const contactTextEl = document.getElementById('contactText');
const mobileWarning = document.getElementById('mobileWarning');
const closeMobileWarning = document.getElementById('closeMobileWarning');
const contactTitle = document.getElementById('contact-title');
const contactNote = document.getElementById('contact-note');
const emailText = document.getElementById('contactEmailText');
const copyEmailBtn = document.getElementById('copyEmailBtn');
const mailtoBtn = document.getElementById('contactMailtoBtn');

const playlistModal = document.getElementById('playlistModal');
const playlistTitle = document.getElementById('playlistTitle');
const playlistHint = document.getElementById('playlistHint');
const mobileScrollHint = document.getElementById('mobileScrollHint');
const mobileWarningText = document.getElementById('mobileWarningText');

const playlistSwitch = document.getElementById('playlistSwitch');
const playlistLabel = document.getElementById('playlistLabel');

const shopBtn = document.getElementById('shopBtn');


const aboutIT_HTML = `<p class="about-glow-text">In questa pagina puoi trovare la maggior parte dei miei social e altre cose, ho creato questo sito per divertimento.</p>`;
const aboutEN_HTML = `<p class="about-glow-text">In this page you can find most of my socials and other stuff too, made this site for fun.</p>`;

aboutText.innerHTML = aboutEN_HTML;
aboutLabel.textContent = 'EN';
aboutSwitch.checked = false;

let modalQueue = [];
let modalAnimating = false;
let currentIndex = 0;

if (closeMobileWarning && mobileWarning) {
  closeMobileWarning.addEventListener('click', () => {
    closeSound.currentTime = 0;
    closeSound.play();
    mobileWarning.classList.add('fade-out');
    setTimeout(() => {
      mobileWarning.style.display = 'none';
    }, 400);
  });
}

closeButtons.forEach(btn => {
  btn.addEventListener('click', e => {
    const modal = btn.closest('.modal');
    closeSound.currentTime = 0;
    closeSound.play();
    closeModal(modal);
  });
});

overlay.addEventListener('click', () => {
  modals.forEach(m => {
    if (m.style.display === 'flex') {
      closeSound.currentTime = 0;
      closeSound.play();
      closeModal(m);
    }
  });
});

modals.forEach(modal => {
  modal.addEventListener('click', e => {
    if (e.target === modal) {
      closeSound.currentTime = 0;
      closeSound.play();
      closeModal(modal);
    }
  });
});

allButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    clickSound.currentTime = 0;
    clickSound.play();
  });
});

function glowSequence() {
  letters.forEach(letter => letter.classList.remove('glow'));
  letters.forEach((letter, index) => {
    setTimeout(() => {
      letter.classList.add('glow');
      if (index > 0) letters[index - 1].classList.remove('glow');
      if (index === letters.length - 1) {
        setTimeout(() => {
          letter.classList.remove('glow');
        }, delay);
      }
    }, index * delay);
  });
}
setTimeout(glowSequence, initialDelay);
setInterval(glowSequence, repeatDelay);

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  

  overlay.style.display = 'block';
  overlay.setAttribute('aria-hidden', 'false');
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    const focusable = modal.querySelector('button, a, input, textarea');
    if (focusable) focusable.focus();
  }, 50);
}

function closeModal(modal) {
  if (!modal || modal.classList.contains('closing')) return;

  
  modal.classList.add('closing');
  modal.addEventListener('animationend', function handler() {
    modal.classList.remove('closing');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    const anyOpen = Array.from(modals).some(m => m.style.display === 'flex');
    if (!anyOpen) {
      overlay.classList.remove('closing');
      overlay.style.display = 'none';
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }
    modal.removeEventListener('animationend', handler);
    if (modalAnimating) {
      modalAnimating = false;
      processModalQueue();
    }
  });
}

function processModalQueue() {
  if (modalAnimating || modalQueue.length === 0) return;
  const nextModalId = modalQueue.shift();
  const currentOpen = Array.from(modals).find(m => m.style.display === 'flex');
  if (currentOpen) {
    modalAnimating = true;
    closeModal(currentOpen);
    currentOpen.addEventListener('animationend', function handler() {
      currentOpen.removeEventListener('animationend', handler);
      openModal(nextModalId);
      modalAnimating = false;
      processModalQueue();
    });
  } else {
    modalAnimating = true;
    openModal(nextModalId);
    modalAnimating = false;
    processModalQueue();
  }
}

modalButtons.forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const id = btn.getAttribute('data-modal');
    modalQueue.push(id);
    processModalQueue();
  });
});

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    modals.forEach(m => {
      if (m.style.display === 'flex') closeModal(m);
    });
  }
});


const muteToggle = document.getElementById("muteToggle");
let isMuted = localStorage.getItem("muted") === "true" ? true : false;
muteToggle.checked = !isMuted; 

function updateMuteState() {
    const audioElements = document.querySelectorAll("audio");

    audioElements.forEach(a => a.muted = isMuted);
    clickSound.muted = isMuted;
    closeSound.muted = isMuted;

    localStorage.setItem("muted", isMuted);
}

muteToggle.addEventListener("change", () => {
    isMuted = !muteToggle.checked;
    updateMuteState();
});

updateMuteState();

const langToggle = document.getElementById("langToggle");
const langLabel = document.querySelector(".lang-text");
const homeButtons = document.querySelectorAll(".buttons .btn");

let currentLang = localStorage.getItem("lang") || "EN";
localStorage.setItem("lang", currentLang); 

const translations = {
    EN: [
      "About Me", 
      "My Playlists", 
      "My Shop", 
      "⚠️ This website is optimized for desktop. Mobile layout may be scuffed.",
      "*click to open*"
    ], 
    IT: [
      "Chi Sono", 
      "Le Mie Playlists", 
      "Il Mio Shop", 
      "⚠️ Questo sito è ottimizzato per desktop. Il layout mobile potrebbe essere imperfetto.",
      "*clicca per aprire*"
    ]
};

function translateAndFade(element, newContent, isHtml = false, duration = 350) {
    if (!element) return;
    
    element.classList.remove('fade-in');
    element.classList.add('fade-out');

    setTimeout(() => {
        if (isHtml) {
            element.innerHTML = newContent;
        } else {
            element.textContent = newContent;
        }
        
        element.classList.remove('fade-out');
        element.classList.add('fade-in'); 
        
    }, duration);
}


function applyLanguage(lang) {
    const aboutBtn = homeButtons[0];
    const youtubeBtn = document.getElementById('youtubeBtn');
    const shopBtn = document.getElementById('shopBtn');
    
    const aboutBtnText = translations[lang][0];
    const playlistText = translations[lang][1];
    const shopText = translations[lang][2];
    const mobileWarningTextContent = translations[lang][3];
    const playlistHintText = translations[lang][4];
    
    // 1. About button
    if (aboutBtn) {
        translateAndFade(aboutBtn, aboutBtnText, false, 350);
    }
    
    // 2. YouTube button
    if (youtubeBtn) {
        const newYoutubeHtml = `<img src="assets/img/youtube_icon.webp" alt="YouTube" class="btn-icon-img" /> ${playlistText}`;
        translateAndFade(youtubeBtn, newYoutubeHtml, true, 350);
    }
    
    // 3. Shop button
    if (shopBtn) {
        const newShopHtml = `<img src="assets/img/shop.webp" alt="Shop Icon" class="btn-icon-img shop-icon" /> ${shopText}`;
        translateAndFade(shopBtn, newShopHtml, true, 350);
    }
    
    // 4. Playlist Modal Title 
    if (playlistTitle) {
        translateAndFade(playlistTitle, playlistText, false, 350);
    }

    // 5. Playlist Hint
    if (playlistHint) {
        translateAndFade(playlistHint, playlistHintText, false, 350);
    }
    
    // 6. Mobile Warning translation
    if (mobileWarningText) {
        translateAndFade(mobileWarningText, mobileWarningTextContent, false, 350);
    }
    
    // Language labels (langLabel)
    langLabel.style.opacity = 0;
    setTimeout(() => {
        langLabel.textContent = lang;
        langLabel.style.opacity = 1;
    }, 200);
}


function setLanguage(lang) {
  if (!lang) return;
  currentLang = lang;
  localStorage.setItem("lang", lang);

  langToggle.checked = (lang === 'IT');
  aboutSwitch.checked = (lang === 'IT');
  if (playlistSwitch) playlistSwitch.checked = (lang === 'IT');

  applyLanguage(lang);

// About Modal text (aboutText) translation
if (aboutText) {
    
    aboutText.classList.remove('fade-in');
    aboutText.classList.add('fade-out');
    
    aboutLabel.style.opacity = 0;

    setTimeout(() => {
      aboutText.innerHTML = (lang === 'IT' ? aboutIT_HTML : aboutEN_HTML);
      
      if (aboutLabel) {
          aboutLabel.textContent = lang;
          aboutLabel.style.opacity = 1;
      }
      aboutText.classList.remove('fade-out');
      aboutText.classList.add('fade-in');
    }, 350);
}

if (playlistLabel) {
    playlistLabel.style.opacity = 0;
    setTimeout(() => {
      playlistLabel.textContent = lang;
      playlistLabel.style.opacity = 1;
    }, 350);
}
}

langToggle.addEventListener("change", () => {
  setLanguage(langToggle.checked ? "IT" : "EN");
});

aboutSwitch.addEventListener("change", () => {
  setLanguage(aboutSwitch.checked ? "IT" : "EN");
});

if (playlistSwitch) {
  playlistSwitch.addEventListener("change", () => {
    setLanguage(playlistSwitch.checked ? "IT" : "EN");
  });
}

setLanguage(currentLang);

const preloader = document.getElementById("preloader");
const bgVideo = document.getElementById("bgVideo");

function hidePreloader() {
    if (!preloader) return;

    preloader.style.opacity = '1';
    preloader.style.transition = 'opacity 0.6s ease';

    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 600);
    }, 300);
}

if (bgVideo) {
    if (bgVideo.readyState >= 4) { 
        hidePreloader();
    } else {
        bgVideo.addEventListener('canplaythrough', hidePreloader);
    }
} else {
    window.addEventListener("load", hidePreloader);
}