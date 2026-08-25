// ============================================
// MUSIKSPILLER - JAVASCRIPT
// ============================================

// DOM Elements
const audioPlayer = document.getElementById('audioPlayer');
const playlist = document.getElementById('playlist');
const currentSongTitle = document.getElementById('currentSong');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const progressBar = document.getElementById('progressBar');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const volumeSlider = document.getElementById('volumeSlider');
const shareBtn = document.getElementById('shareBtn');
const shareMessage = document.getElementById('shareMessage');

// State
let songs = [];
let currentSongIndex = 0;
let isPlaying = false;

// ============================================
// INDLÆS SANGE
// ============================================

// VIGTIG! Denne liste skal du udfylde manuelt med dine MP3-filer
// Hvis du bruger en backend (Node.js/Express), kan den læse mappen automatisk
const songFiles = [
    { name: 'Hvert Evigt Sekund - Du mister mig aldrig', file: 'audio/Hvert_Evigt_Sekund _Du_Mister_Mig_Aldrig.mp3' },
    { name: 'Hvert sekund uden dig', file: 'audio/Hvert_Sekund_Uden_Dig.mp3' },
    { name: 'Mit hjerte slår for Julie', file: 'audio/Mit_Hjerte_Slår_For_Julie.mp3' },
    { name: 'Vores Fremtid - Julie', file: 'audio/Vores_Fremtid_Julie.mp3' },
    // Tilføj flere sange her
];

// Initialisering
function init() {
    songs = songFiles;
    
    // Tjek om der er en sang i URL (for delt link)
    const params = new URLSearchParams(window.location.search);
    const songIndex = parseInt(params.get('song'));
    if (!isNaN(songIndex) && songIndex >= 0 && songIndex < songs.length) {
        currentSongIndex = songIndex;
    }
    
    renderPlaylist();
    loadSong(currentSongIndex);
    updatePlaylist();
}

// ============================================
// RENDER SANGLISTE
// ============================================

function renderPlaylist() {
    playlist.innerHTML = '';
    songs.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        songItem.innerHTML = `<span class="song-name">${song.name}</span>`;
        songItem.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            play();
            updatePlaylist();
        });
        playlist.appendChild(songItem);
    });
}

// ============================================
// INDLÆS SANG
// ============================================

function loadSong(index) {
    if (index < 0 || index >= songs.length) return;
    
    const song = songs[index];
    audioPlayer.src = song.file;
    currentSongTitle.textContent = song.name;
    currentSongIndex = index;
    updatePlaylist();
}

// ============================================
// AFSPILNING KONTROL
// ============================================

function play() {
    audioPlayer.play();
    isPlaying = true;
    playPauseBtn.textContent = '⏸️';
}

function pause() {
    audioPlayer.pause();
    isPlaying = false;
    playPauseBtn.textContent = '▶️';
}

function togglePlayPause() {
    if (isPlaying) {
        pause();
    } else {
        play();
    }
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    play();
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    play();
}

// ============================================
// TIDSOPDATERING
// ============================================

function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

audioPlayer.addEventListener('timeupdate', () => {
    const { currentTime, duration } = audioPlayer;
    
    currentTimeEl.textContent = formatTime(currentTime);
    durationEl.textContent = formatTime(duration);
    
    if (duration) {
        progressBar.value = (currentTime / duration) * 100;
    }
});

// Auto-play næste sang når denne slutter
audioPlayer.addEventListener('ended', () => {
    nextSong();
});

// ============================================
// PROGRESS BAR
// ============================================

progressBar.addEventListener('change', (e) => {
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (e.target.value / 100) * duration;
});

// ============================================
// VOLUME KONTROL
// ============================================

volumeSlider.addEventListener('input', (e) => {
    audioPlayer.volume = e.target.value / 100;
});

// ============================================
// DEL LINK
// ============================================

function copyShareLink() {
    const songUrl = `${window.location.origin}${window.location.pathname}?song=${currentSongIndex}`;
    
    // Kopier til clipboard
    navigator.clipboard.writeText(songUrl).then(() => {
        shareMessage.textContent = '✓ Link kopieret!';
        setTimeout(() => {
            shareMessage.textContent = '';
        }, 2000);
    }).catch(() => {
        // Fallback hvis clipboard ikke virker
        alert('Link: ' + songUrl);
    });
}

shareBtn.addEventListener('click', copyShareLink);

// ============================================
// EVENT LISTENERS
// ============================================

playPauseBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// ============================================
// OPDATER SANGLISTE STYLING
// ============================================

function updatePlaylist() {
    const items = playlist.querySelectorAll('.song-item');
    items.forEach((item, index) => {
        if (index === currentSongIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// ============================================
// START
// ============================================

init();

// Sæt default volume
audioPlayer.volume = 1.0;

console.log('🎵 Musikspiller indlæst!');
console.log(`📁 ${songs.length} sang(e) fundet`);
