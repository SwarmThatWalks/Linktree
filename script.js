const letters = document.querySelectorAll('#glow-text span');
const delay = 150;
const repeatDelay = 10000;
const initialDelay = 2000;
const clickSound = new Audio('assets/soundeffect/button3.wav');
clickSound.volume = 0.5;
const navItems = document.querySelectorAll('.nav-item');
const closeSound = new Audio('assets/soundeffect/button4.wav');
closeSound.volume = 0.5;

const mobileWarning = document.getElementById('mobileWarning');
const closeMobileWarning = document.getElementById('closeMobileWarning');
const warningText = document.getElementById('warning-text');

const aboutContent = document.getElementById('about-content');
const playlistTitle = document.getElementById('playlist-title');
const clickHint = document.getElementById('click-to-open');
const shopNavText = document.getElementById('shop-nav-text');

let currentActiveIndex = 0;

const navTranslations = {
    EN: ["About Me", "My Playlists", "My Shop"],
    IT: ["Chi Sono", "Le Mie Playlist", "Mio Negozio"]
};

const aboutTextData = {
    EN: `
    <div style="display:flex; align-items:center; justify-content:center; width:100%; flex-direction:column; text-align:center;">
        <img src="assets/img/foto.webp" class="profile-img">
        <div>
            <h3 style="margin:10px 0 5px 0; color:#fff; font-size:28px;">Francesco Presti</h3>
            <p style="margin:0; font-size:16px; color:#aaa;">Software & Web Development | Graphic Design</p>
        </div>
    </div>
    `,
    IT: `
    <div style="display:flex; align-items:center; justify-content:center; width:100%; flex-direction:column; text-align:center;">
        <img src="assets/img/foto.webp" class="profile-img">
        <div>
            <h3 style="margin:10px 0 5px 0; color:#fff; font-size:28px;">Francesco Presti</h3>
            <p style="margin:0; font-size:16px; color:#aaa;">Sviluppo Software & Web | Graphic Design</p>
        </div>
    </div>
    `
};

const headings = {
    EN: { playlist: "My Playlists", hint: "click to open", mobileHint: "tap to open" },
    IT: { playlist: "Le Mie Playlist", hint: "clicca per aprire", mobileHint: "tocca per aprire" }
};

const warningMsgs = {
    EN: "⚠️ Optimized for desktop. Mobile features a simplified layout.",
    IT: "⚠️ Questo sito è ottimizzato per desktop. Il layout mobile è una versione semplificata."
};

const bgVideo = document.getElementById('bgVideo');
let speedAnimFrame;

function burstVideo() {
    cancelAnimationFrame(speedAnimFrame);
    if(!bgVideo) return;
    bgVideo.play();
    
    let startTime = null;
    const peakSpeed = 12.0;
    const duration = 1200;

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easedProgress = 1 - Math.pow(1 - progress, 4);
        bgVideo.playbackRate = peakSpeed - (easedProgress * (peakSpeed - 1.0));

        if (progress < 1) {
            speedAnimFrame = requestAnimationFrame(animate);
        } else {
            bgVideo.playbackRate = 1.0;
        }
    }
    speedAnimFrame = requestAnimationFrame(animate);
}

function playSound(audio) {
    if (!audio.paused) {
        audio.pause();
    }
    audio.currentTime = 0;
    audio.play().catch(()=>{});
}

if (closeMobileWarning && mobileWarning) {
  closeMobileWarning.addEventListener('click', () => {
    playSound(closeSound);
    mobileWarning.classList.add('fade-out');
    setTimeout(() => {
      mobileWarning.style.display = 'none';
    }, 400);
  });
}

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

navItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
        if (item.classList.contains('active')) return;
        if (item.tagName === 'A') return;

        playSound(clickSound);
        if (window.innerWidth > 900) {
            burstVideo();
        }
        
        currentActiveIndex = index;

        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        
        const targetId = item.getAttribute('data-target');
        switchPanel(targetId);
    });
});

function switchPanel(panelId) {
    const panels = document.querySelectorAll('.content-panel');
    const targetPanel = document.getElementById(panelId);
    const isMobile = window.innerWidth <= 900;

    if (isMobile) {
        const currentPanel = document.querySelector('.content-panel.active');
        if (currentPanel) {
            currentPanel.style.opacity = '0';
            setTimeout(() => {
                panels.forEach(panel => {
                    panel.classList.remove('active');
                    panel.style.display = 'none';
                });
                targetPanel.style.display = 'flex';
                targetPanel.style.opacity = '0';
                void targetPanel.offsetWidth;
                targetPanel.classList.add('active');
                targetPanel.style.opacity = '1';
                updateHints();
            }, 300);
        } else {
            panels.forEach(panel => {
                panel.classList.remove('active');
                panel.style.display = 'none';
            });
            targetPanel.style.display = 'flex';
            targetPanel.classList.add('active');
            targetPanel.style.opacity = '1';
            updateHints();
        }
    } else {
        panels.forEach(panel => {
            panel.classList.remove('active');
        });
        targetPanel.classList.add('active');
        updateHints();
    }
}

function updateHints() {
    const isMobile = window.innerWidth <= 900;
    if (isMobile) {
        clickHint.textContent = headings[currentLang].mobileHint;
    } else {
        clickHint.textContent = headings[currentLang].hint;
    }
}

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
let currentLang = localStorage.getItem("lang") || "EN";

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("lang", lang);
    
    const elementsToFade = [
        ...navItems,
        playlistTitle,
        clickHint,
        aboutContent,
        langLabel,
        warningText,
        shopNavText
    ].filter(el => el !== null);

    elementsToFade.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(5px)';
        el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });

    setTimeout(() => {
        langLabel.textContent = lang;
        
        navItems.forEach((item, index) => {
            if(index < 2) {
                item.textContent = navTranslations[lang][index];
            } else {
                shopNavText.textContent = navTranslations[lang][index];
            }
        });

        playlistTitle.textContent = headings[lang].playlist;
        updateHints();
        aboutContent.innerHTML = aboutTextData[lang];

        if (warningText) {
            warningText.textContent = warningMsgs[lang];
        }

        elementsToFade.forEach(el => {
            el.style.opacity = '';
            el.style.transform = '';
            el.style.transition = '';
        });
    }, 300);
}

langToggle.checked = (currentLang === 'IT');
setLanguage(currentLang);

langToggle.addEventListener("change", () => {
  setLanguage(langToggle.checked ? "IT" : "EN");
});

const preloader = document.getElementById("preloader");

function hidePreloader() {
    if (!preloader) return;
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 800);
    }, 2500);
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

window.addEventListener('resize', updateHints);
