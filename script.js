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
    { name: 'På den anden side broen', file: 'audio/På_den_anden_side_af_broen.mp3' },
    { name: 'Ingen bro er for lang', file: 'audio/Ingen_Bro_Er_For_Lang.mp3' },
    // Tilføj flere sange her
];

// Initialisering
function init() {
    songs = songFiles;
    
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
        const songItem = document.createElement('button');
        songItem.type = 'button';
        songItem.className = 'song-item';
        songItem.innerHTML = `<span class="song-number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span><span class="song-name">${song.name}</span>`;
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
    progressBar.value = 0;
    currentTimeEl.textContent = '00:00';
    durationEl.textContent = '00:00';
    document.getElementById('playerStatus').textContent = '';
    audioPlayer.src = song.file;
    currentSongTitle.textContent = song.name;
    currentSongIndex = index;
    updatePlaylist();
}

// ============================================
// AFSPILNING KONTROL
// ============================================

async function play() {
    try {
        await audioPlayer.play();
        document.getElementById('playerStatus').textContent = '';
    } catch (error) {
        if (error.name !== 'AbortError') {
            document.getElementById('playerStatus').textContent = 'Sangen kunne ikke afspilles. Prøv igen eller vælg en anden sang.';
        }
    }
}
function syncPlaybackState() {
    isPlaying = !audioPlayer.paused;
    playPauseBtn.textContent = isPlaying ? '⏸️' : '▶️';
    playPauseBtn.setAttribute('aria-label', isPlaying ? 'Pause' : 'Afspil');
    document.body.classList.toggle('is-playing', isPlaying);
}
audioPlayer.addEventListener('play', syncPlaybackState);
audioPlayer.addEventListener('pause', syncPlaybackState);
audioPlayer.addEventListener('error', () => {
    document.getElementById('playerStatus').textContent = 'Sangen kunne ikke indlæses. Prøv en anden sang.';
});
audioPlayer.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audioPlayer.duration);
});

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
    if (!Number.isFinite(seconds)) return '00:00';
    
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
    if (Number.isFinite(duration) && duration > 0) audioPlayer.currentTime = (e.target.value / 100) * duration;
});

// ============================================
// VOLUME KONTROL
// ============================================

volumeSlider.addEventListener('input', (e) => {
    audioPlayer.volume = e.target.value / 100;
});

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
            item.setAttribute('aria-current', 'true');
        } else {
            item.classList.remove('active');
            item.removeAttribute('aria-current');
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


