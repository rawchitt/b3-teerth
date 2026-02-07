// ===================================
// STATE MANAGEMENT
// ===================================
const AppState = {
    wallet: {
        connected: false,
        address: null,
        balance: 0
    },
    currentSong: null,
    isPlaying: false,
    songs: [],
    viewMode: 'grid',
    listeningHistory: [],  // Track all played songs
    favorites: [],  // Track favorite songs
    playlists: [],  // User's playlists
    selectedSongForPlaylist: null,  // Selected song to add to playlist
    autoPay: true,  // Auto-pay enabled by default
    transactionPassword: '1234',  // Default password
    pendingSong: null  // Song waiting for password confirmation
};

// ===================================
// DEMO SONGS DATA
// ===================================
const DEMO_SONGS = [
    {
        id: 1,
        title: "Neon Dreams",
        artist: "CryptoBeats",
        price: 0.001,
        playCount: 1247,
        coverColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        audioUrl: null, // Will use demo audio
        artistWallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
    },
    {
        id: 2,
        title: "Blockchain Rhythm",
        artist: "Web3 Collective",
        price: 0.0015,
        playCount: 892,
        coverColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        audioUrl: null,
        artistWallet: "0x8ba1f109551bD432803012645Ac136ddd64DBA72"
    },
    {
        id: 3,
        title: "Decentralized Harmony",
        artist: "NFT Sounds",
        price: 0.002,
        playCount: 2341,
        coverColor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        audioUrl: null,
        artistWallet: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed"
    },
    {
        id: 4,
        title: "Smart Contract Symphony",
        artist: "DAO Musicians",
        price: 0.0012,
        playCount: 1567,
        coverColor: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        audioUrl: null,
        artistWallet: "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359"
    },
    {
        id: 5,
        title: "Ethereum Echoes",
        artist: "Chain Melody",
        price: 0.0018,
        playCount: 3421,
        coverColor: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
        audioUrl: null,
        artistWallet: "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"
    }
];

// ===================================
// WALLET INTEGRATION
// ===================================
class WalletManager {
    constructor() {
        this.provider = null;
        this.signer = null;
    }

    async connect() {
        // Check if MetaMask is installed
        if (typeof window.ethereum === 'undefined') {
            showError('MetaMask is not installed. Please install MetaMask to continue.');
            return false;
        }

        try {
            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            const address = accounts[0];

            // Get balance
            const balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [address, 'latest']
            });

            // Convert balance from Wei to ETH
            const balanceInEth = parseInt(balance, 16) / 1e18;

            // Update state
            AppState.wallet.connected = true;
            AppState.wallet.address = address;
            AppState.wallet.balance = balanceInEth;

            this.updateWalletUI();

            // Listen for account changes
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                    this.disconnect();
                } else {
                    this.connect();
                }
            });

            // Listen for chain changes
            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });

            return true;
        } catch (error) {
            console.error('Error connecting wallet:', error);
            showError('Failed to connect wallet. Please try again.');
            return false;
        }
    }

    disconnect() {
        AppState.wallet.connected = false;
        AppState.wallet.address = null;
        AppState.wallet.balance = 0;
        this.updateWalletUI();
    }

    updateWalletUI() {
        const connectBtn = document.getElementById('connectWalletBtn');
        const connectText = document.getElementById('connectWalletText');
        const walletInfo = document.getElementById('walletInfo');
        const walletAddress = document.getElementById('walletAddress');
        const userBalance = document.getElementById('userBalance');

        if (AppState.wallet.connected) {
            connectText.textContent = 'Disconnect';
            walletInfo.classList.remove('hidden');

            // Format address
            const addr = AppState.wallet.address;
            walletAddress.textContent = `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

            // Format balance
            userBalance.textContent = AppState.wallet.balance.toFixed(4);
        } else {
            connectText.textContent = 'Connect Wallet';
            walletInfo.classList.add('hidden');
        }
    }

    async sendPayment(songId, amount) {
        if (!AppState.wallet.connected) {
            showError('Please connect your wallet first.');
            return false;
        }

        const song = DEMO_SONGS.find(s => s.id === songId);
        if (!song) return false;

        // Check if user has enough balance
        if (AppState.wallet.balance < amount) {
            showError('Insufficient balance. Please add funds to your wallet.');
            return false;
        }

        try {
            // Show transaction modal
            showTransactionModal(song.title, amount);

            // Simulate blockchain transaction (in production, this would be a real transaction)
            // const tx = await this.signer.sendTransaction({
            //     to: song.artistWallet,
            //     value: ethers.utils.parseEther(amount.toString())
            // });
            // await tx.wait();

            // For demo purposes, simulate a delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Update balance (mock)
            AppState.wallet.balance -= amount;
            this.updateWalletUI();

            // Hide transaction modal and show success
            hideTransactionModal();
            showSuccessModal();

            return true;
        } catch (error) {
            console.error('Transaction error:', error);
            hideTransactionModal();
            showError('Transaction failed. Please try again.');
            return false;
        }
    }
}

const walletManager = new WalletManager();

// ===================================
// AUDIO PLAYER
// ===================================
class AudioPlayer {
    constructor() {
        this.audio = document.getElementById('audioElement');
        this.currentSongId = null;
        this.isPlaying = false;

        this.setupEventListeners();
    }

    setupEventListeners() {
        const playPauseBtn = document.getElementById('playPauseBtn');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const progressSlider = document.getElementById('progressSlider');
        const volumeControl = document.getElementById('volumeControl');

        playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        prevBtn.addEventListener('click', () => this.playPrevious());
        nextBtn.addEventListener('click', () => this.playNext());

        progressSlider.addEventListener('input', (e) => {
            const time = (e.target.value / 100) * this.audio.duration;
            this.audio.currentTime = time;
        });

        volumeControl.addEventListener('input', (e) => {
            this.audio.volume = e.target.value / 100;
        });

        // Audio element events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.playNext());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
    }

    async playSong(songId) {
        const song = DEMO_SONGS.find(s => s.id === songId);
        if (!song) return;

        // Process payment first
        const paymentSuccess = await walletManager.sendPayment(songId, song.price);
        if (!paymentSuccess) return;

        // Add to listening history
        addToHistory(song);

        // Load and play song
        this.currentSongId = songId;
        AppState.currentSong = song;

        // Update player UI
        this.updatePlayerUI(song);

        // Show player
        const player = document.getElementById('audioPlayer');
        player.classList.remove('hidden');

        // For demo, use a silent audio or generate a tone
        // In production, this would load the actual IPFS audio file
        this.generateDemoAudio();

        this.audio.play();
        this.isPlaying = true;
        this.updatePlayPauseButton();
    }

    generateDemoAudio() {
        // Generate a simple audio context for demo
        // In production, you would load: this.audio.src = song.audioUrl;

        // For now, create a silent audio data URL
        const silence = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
        this.audio.src = silence;

        // Set a demo duration
        this.audio.addEventListener('loadedmetadata', () => {
            // Simulate a 3-minute song
            Object.defineProperty(this.audio, 'duration', {
                value: 180,
                writable: false
            });
        }, { once: true });
    }

    updatePlayerUI(song) {
        document.getElementById('playerTitle').textContent = song.title;
        document.getElementById('playerArtist').textContent = song.artist;

        // Create a colored cover
        const playerCover = document.getElementById('playerCover');
        playerCover.style.background = song.coverColor;
        playerCover.alt = song.title;
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
        } else {
            this.audio.play();
            this.isPlaying = true;
        }
        this.updatePlayPauseButton();
    }

    updatePlayPauseButton() {
        const playIcon = document.getElementById('playIcon');
        const pauseIcon = document.getElementById('pauseIcon');

        if (this.isPlaying) {
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
        } else {
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        }
    }

    playNext() {
        if (!this.currentSongId) return;

        const currentIndex = DEMO_SONGS.findIndex(s => s.id === this.currentSongId);
        const nextIndex = (currentIndex + 1) % DEMO_SONGS.length;
        this.playSong(DEMO_SONGS[nextIndex].id);
    }

    playPrevious() {
        if (!this.currentSongId) return;

        const currentIndex = DEMO_SONGS.findIndex(s => s.id === this.currentSongId);
        const prevIndex = (currentIndex - 1 + DEMO_SONGS.length) % DEMO_SONGS.length;
        this.playSong(DEMO_SONGS[prevIndex].id);
    }

    updateProgress() {
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('progressSlider').value = progress;

        document.getElementById('currentTime').textContent = this.formatTime(this.audio.currentTime);
    }

    updateDuration() {
        document.getElementById('duration').textContent = this.formatTime(this.audio.duration);
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';

        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

const audioPlayer = new AudioPlayer();

// ===================================
// UI RENDERING
// ===================================
function renderSongs() {
    const grid = document.getElementById('songsGrid');
    grid.innerHTML = '';

    DEMO_SONGS.forEach((song, index) => {
        const card = createSongCard(song, index);
        grid.appendChild(card);
    });
}

function createSongCard(song, index) {
    const card = document.createElement('div');
    card.className = 'song-card';
    card.style.animationDelay = `${index * 0.1}s`;

    card.innerHTML = `
        <div class="song-cover-wrapper">
            <div class="song-cover" style="background: ${song.coverColor}"></div>
            <button class="favorite-btn ${isFavorite(song.id) ? 'active' : ''}" onclick="toggleFavorite(event, ${song.id})">
                <svg viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <div class="play-overlay">
                <button class="play-btn" onclick="handlePlayClick(${song.id})">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                    </svg>
                </button>
            </div>
        </div>
        <div class="song-info">
            <div class="song-title">${song.title}</div>
            <div class="song-artist">${song.artist}</div>
            <div class="song-footer">
                <div class="song-price">
                    <span class="price-value">${song.price}</span>
                    <span class="price-currency">ETH</span>
                </div>
                <div class="play-count">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                    </svg>
                    ${formatNumber(song.playCount)}
                </div>
            </div>
        </div>
    `;

    return card;
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// ===================================
// EVENT HANDLERS
// ===================================
async function handlePlayClick(songId) {
    if (!AppState.wallet.connected) {
        showError('Please connect your wallet to play songs.');
        return;
    }

    const song = DEMO_SONGS.find(s => s.id === songId);
    if (!song) return;

    // Check if Auto-Pay is enabled
    if (AppState.autoPay) {
        // Auto-pay enabled - proceed directly
        await audioPlayer.playSong(songId);
    } else {
        // Auto-pay disabled - show password confirmation
        AppState.pendingSong = song;
        showPasswordModal(song);
    }
}

function handleConnectWallet() {
    if (AppState.wallet.connected) {
        walletManager.disconnect();
    } else {
        walletManager.connect();
    }
}

function handleViewToggle(view) {
    AppState.viewMode = view;

    const grid = document.getElementById('songsGrid');
    const buttons = document.querySelectorAll('.view-btn');

    buttons.forEach(btn => {
        if (btn.dataset.view === view) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update grid layout (you can add list view styling if needed)
    if (view === 'list') {
        grid.style.gridTemplateColumns = '1fr';
    } else {
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
    }
}

// ===================================
// MODAL FUNCTIONS
// ===================================
function showTransactionModal(songName, amount) {
    const modal = document.getElementById('transactionModal');
    document.getElementById('txSongName').textContent = songName;
    document.getElementById('txAmount').textContent = `${amount} ETH`;
    modal.classList.remove('hidden');
}

function hideTransactionModal() {
    const modal = document.getElementById('transactionModal');
    modal.classList.add('hidden');
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('hidden');

    // Auto-close after 2 seconds
    setTimeout(() => {
        closeSuccessModal();
    }, 2000);
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('hidden');
}

function showError(message) {
    const modal = document.getElementById('errorModal');
    document.getElementById('errorMessage').textContent = message;
    modal.classList.remove('hidden');
}

function closeErrorModal() {
    const modal = document.getElementById('errorModal');
    modal.classList.add('hidden');
}

// ===================================
// LISTENING HISTORY
// ===================================
function addToHistory(song) {
    const historyItem = {
        songId: song.id,
        title: song.title,
        artist: song.artist,
        price: song.price,
        coverColor: song.coverColor,
        timestamp: new Date().toISOString(),
        playedAt: new Date().toLocaleString()
    };

    // Add to beginning of array (most recent first)
    AppState.listeningHistory.unshift(historyItem);

    // Save to localStorage
    localStorage.setItem('soundchain_history', JSON.stringify(AppState.listeningHistory));
}

function showHistoryModal() {
    const modal = document.getElementById('historyModal');
    modal.classList.remove('hidden');

    // Update summary
    updateHistorySummary();

    // Render history list
    renderHistoryList();
}

function closeHistoryModal() {
    const modal = document.getElementById('historyModal');
    modal.classList.add('hidden');
}

function updateHistorySummary() {
    const totalPlays = AppState.listeningHistory.length;
    const totalSpent = AppState.listeningHistory.reduce((sum, item) => sum + item.price, 0);

    document.getElementById('totalPlays').textContent = totalPlays;
    document.getElementById('totalSpent').textContent = totalSpent.toFixed(4);
}

function renderHistoryList() {
    const historyList = document.getElementById('historyList');

    if (AppState.listeningHistory.length === 0) {
        historyList.innerHTML = `
            <div class="empty-history">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 8V12L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <p>No listening history yet</p>
                <span>Start playing songs to see your history here</span>
            </div>
        `;
        return;
    }

    historyList.innerHTML = AppState.listeningHistory.map(item => `
        <div class="history-item">
            <div class="history-item-cover" style="background: ${item.coverColor}"></div>
            <div class="history-item-info">
                <div class="history-item-title">${item.title}</div>
                <div class="history-item-artist">${item.artist}</div>
            </div>
            <div class="history-item-meta">
                <div class="history-item-price">${item.price} ETH</div>
                <div class="history-item-time">${getRelativeTime(item.timestamp)}</div>
            </div>
        </div>
    `).join('');
}

function getRelativeTime(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return past.toLocaleDateString();
}

function clearHistory() {
    if (AppState.listeningHistory.length === 0) return;

    if (confirm('Are you sure you want to clear your listening history?')) {
        AppState.listeningHistory = [];
        localStorage.removeItem('soundchain_history');
        updateHistorySummary();
        renderHistoryList();
    }
}

function loadHistoryFromStorage() {
    const saved = localStorage.getItem('soundchain_history');
    if (saved) {
        try {
            AppState.listeningHistory = JSON.parse(saved);
        } catch (e) {
            console.error('Failed to load history:', e);
            AppState.listeningHistory = [];
        }
    }
}

// ===================================
// FAVORITES
// ===================================
function toggleFavorite(event, songId) {
    event.stopPropagation(); // Prevent card click

    const song = DEMO_SONGS.find(s => s.id === songId);
    if (!song) return;

    const index = AppState.favorites.findIndex(f => f.id === songId);

    if (index > -1) {
        // Remove from favorites
        AppState.favorites.splice(index, 1);
    } else {
        // Add to favorites
        AppState.favorites.push(song);
    }

    // Save to localStorage
    localStorage.setItem('soundchain_favorites', JSON.stringify(AppState.favorites));

    // Update UI
    renderSongs(); // Re-render to update heart button
}

function isFavorite(songId) {
    return AppState.favorites.some(f => f.id === songId);
}

function showFavoritesModal() {
    const modal = document.getElementById('favoritesModal');
    modal.classList.remove('hidden');

    // Update summary
    updateFavoritesSummary();

    // Render favorites list
    renderFavoritesList();
}

function closeFavoritesModal() {
    const modal = document.getElementById('favoritesModal');
    modal.classList.add('hidden');
}

function updateFavoritesSummary() {
    const totalFavorites = AppState.favorites.length;
    document.getElementById('totalFavorites').textContent = totalFavorites;
}

function renderFavoritesList() {
    const favoritesList = document.getElementById('favoritesList');

    if (AppState.favorites.length === 0) {
        favoritesList.innerHTML = `
            <div class="empty-history">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p>No favorite songs yet</p>
                <span>Click the heart icon on songs to add them to your favorites</span>
            </div>
        `;
        return;
    }

    favoritesList.innerHTML = AppState.favorites.map(song => `
        <div class="favorite-card" onclick="handlePlayClick(${song.id})">
            <div class="favorite-card-cover" style="background: ${song.coverColor}"></div>
            <div class="favorite-card-info">
                <div class="favorite-card-title">${song.title}</div>
                <div class="favorite-card-artist">${song.artist}</div>
            </div>
            <div class="favorite-card-footer">
                <div class="favorite-card-price">${song.price} ETH</div>
                <button class="favorite-remove-btn" onclick="removeFavorite(event, ${song.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

function removeFavorite(event, songId) {
    event.stopPropagation(); // Prevent card click

    const index = AppState.favorites.findIndex(f => f.id === songId);
    if (index > -1) {
        AppState.favorites.splice(index, 1);
        localStorage.setItem('soundchain_favorites', JSON.stringify(AppState.favorites));
        updateFavoritesSummary();
        renderFavoritesList();
        renderSongs(); // Update heart buttons on main grid
    }
}

function clearAllFavorites() {
    if (AppState.favorites.length === 0) return;

    if (confirm('Are you sure you want to remove all favorite songs?')) {
        AppState.favorites = [];
        localStorage.removeItem('soundchain_favorites');
        updateFavoritesSummary();
        renderFavoritesList();
        renderSongs(); // Update heart buttons on main grid
    }
}

function loadFavoritesFromStorage() {
    const saved = localStorage.getItem('soundchain_favorites');
    if (saved) {
        try {
            AppState.favorites = JSON.parse(saved);
        } catch (e) {
            console.error('Failed to load favorites:', e);
            AppState.favorites = [];
        }
    }
}

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Load saved history
    loadHistoryFromStorage();

    // Load saved favorites
    loadFavoritesFromStorage();

    // Load saved playlists
    loadPlaylistsFromStorage();

    // Load Auto-Pay setting
    loadAutoPaySetting();

    // Render songs
    renderSongs();

    // Setup event listeners
    document.getElementById('connectWalletBtn').addEventListener('click', handleConnectWallet);

    document.getElementById('historyBtn').addEventListener('click', (e) => {
        e.preventDefault();
        showHistoryModal();
    });

    document.getElementById('favoritesBtn').addEventListener('click', (e) => {
        e.preventDefault();
        showFavoritesModal();
    });

    document.getElementById('libraryBtn').addEventListener('click', (e) => {
        e.preventDefault();
        showLibraryModal();
    });

    // Auto-Pay button listener
    document.getElementById('autoPayBtn').addEventListener('click', toggleAutoPay);

    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => handleViewToggle(btn.dataset.view));
    });

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.add('hidden');
        });
    });

    console.log('🎵 Cassette initialized');
    console.log('📦 Demo songs loaded:', DEMO_SONGS.length);
    console.log('📜 History items loaded:', AppState.listeningHistory.length);
    console.log('❤️ Favorites loaded:', AppState.favorites.length);
});

// ===================================
// BLOCKCHAIN INTEGRATION HELPERS
// (Ready for backend integration)
// ===================================

// Contract addresses (to be filled when contracts are deployed)
const CONTRACT_ADDRESSES = {
    musicNFT: null,
    streamPayment: null
};

// Contract ABIs (to be filled with actual ABIs)
const CONTRACT_ABIS = {
    musicNFT: [],
    streamPayment: []
};

// Future integration functions
async function initializeContracts() {
    // This will be implemented when integrating with actual smart contracts
    // Example:
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner();
    // const musicNFTContract = new ethers.Contract(CONTRACT_ADDRESSES.musicNFT, CONTRACT_ABIS.musicNFT, signer);
    // const streamPaymentContract = new ethers.Contract(CONTRACT_ADDRESSES.streamPayment, CONTRACT_ABIS.streamPayment, signer);
}

async function fetchSongsFromBlockchain() {
    // This will fetch songs from the MusicNFT contract
    // Example:
    // const totalSongs = await musicNFTContract.totalSupply();
    // for (let i = 0; i < totalSongs; i++) {
    //     const song = await musicNFTContract.getSong(i);
    //     // Process and add to songs array
    // }
}

async function playSongOnChain(tokenId, price) {
    // This will call the StreamPayment contract
    // Example:
    // const tx = await streamPaymentContract.playSong(tokenId, {
    //     value: ethers.utils.parseEther(price.toString())
    // });
    // await tx.wait();
}

// ===================================
// YOUR LIBRARY FUNCTIONS
// ===================================

// Show Library Modal
function showLibraryModal() {
    const modal = document.getElementById('libraryModal');
    modal.classList.remove('hidden');
    switchLibraryTab('playlists');
    renderPlaylists();
}

// Close Library Modal
function closeLibraryModal() {
    const modal = document.getElementById('libraryModal');
    modal.classList.add('hidden');
    hideCreatePlaylistForm();
}

// Switch Library Tabs
function switchLibraryTab(tab) {
    const tabs = document.querySelectorAll('.library-tab');
    const playlistsView = document.getElementById('playlistsView');
    const addToPlaylistView = document.getElementById('addToPlaylistView');

    tabs.forEach(t => t.classList.remove('active'));

    if (tab === 'playlists') {
        tabs[0].classList.add('active');
        playlistsView.classList.remove('hidden');
        addToPlaylistView.classList.add('hidden');
        renderPlaylists();
    } else {
        tabs[1].classList.add('active');
        playlistsView.classList.add('hidden');
        addToPlaylistView.classList.remove('hidden');
        renderSongSelection();
    }
}

// Show Create Playlist Form
function showCreatePlaylistForm() {
    const form = document.getElementById('createPlaylistForm');
    form.classList.remove('hidden');
    document.getElementById('playlistNameInput').focus();
}

// Hide Create Playlist Form
function hideCreatePlaylistForm() {
    const form = document.getElementById('createPlaylistForm');
    form.classList.add('hidden');
    document.getElementById('playlistNameInput').value = '';
}

// Create Playlist
function createPlaylist() {
    const input = document.getElementById('playlistNameInput');
    const name = input.value.trim();

    if (!name) {
        alert('Please enter a playlist name');
        return;
    }

    const playlist = {
        id: Date.now(),
        name: name,
        songs: [],
        createdAt: new Date().toISOString()
    };

    AppState.playlists.push(playlist);
    savePlaylistsToStorage();
    hideCreatePlaylistForm();
    renderPlaylists();
}

// Delete Playlist
function deletePlaylist(playlistId) {
    if (confirm('Are you sure you want to delete this playlist?')) {
        AppState.playlists = AppState.playlists.filter(p => p.id !== playlistId);
        savePlaylistsToStorage();
        renderPlaylists();
    }
}

// View Playlist Songs
function viewPlaylist(playlistId) {
    const playlist = AppState.playlists.find(p => p.id === playlistId);
    if (!playlist) return;

    const modal = document.getElementById('libraryModal');
    const content = modal.querySelector('.modal-content');

    // Create playlist view
    content.innerHTML = `
        <div class="modal-header">
            <h2>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 0.75rem;">
                    <path d="M9 18V5l12-2v13M9 18c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm12-2c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z" stroke="currentColor" stroke-width="2"/>
                </svg>
                ${playlist.name}
            </h2>
            <button class="modal-close" onclick="closeLibraryModal(); setTimeout(showLibraryModal, 100)">←</button>
        </div>
        <div class="playlist-songs-container">
            <div class="playlist-info">
                <p>${playlist.songs.length} song${playlist.songs.length !== 1 ? 's' : ''}</p>
            </div>
            <div id="playlistSongsList" class="favorites-grid">
                ${playlist.songs.length === 0 ? `
                    <div class="empty-playlists">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18V5l12-2v13M9 18c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm12-2c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z" stroke="currentColor" stroke-width="2"/>
                        </svg>
                        <p>No songs in this playlist</p>
                        <span>Add songs from the "Add to Playlist" tab</span>
                    </div>
                ` : playlist.songs.map(song => `
                    <div class="favorite-card" onclick="handlePlayClick(${song.id})">
                        <div class="favorite-card-cover" style="background: ${song.coverColor}"></div>
                        <div class="favorite-card-info">
                            <div class="favorite-card-title">${song.title}</div>
                            <div class="favorite-card-artist">${song.artist}</div>
                        </div>
                        <div class="favorite-card-footer">
                            <div class="favorite-card-price">${song.price} ETH</div>
                            <button class="favorite-remove-btn" onclick="removeSongFromPlaylist(event, ${playlistId}, ${song.id})">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Render Playlists
function renderPlaylists() {
    const grid = document.getElementById('playlistsGrid');

    if (AppState.playlists.length === 0) {
        grid.innerHTML = `
            <div class="empty-playlists" style="grid-column: 1 / -1;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <rect x="7" y="4" width="10" height="16" rx="1" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
                <p>No playlists yet</p>
                <span>Create your first playlist to organize your music</span>
            </div>
        `;
        return;
    }

    grid.innerHTML = AppState.playlists.map(playlist => `
        <div class="playlist-card">
            <div class="playlist-card-icon">
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M9 18V5l12-2v13M9 18c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm12-2c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z" stroke="white" stroke-width="2"/>
                </svg>
            </div>
            <div class="playlist-card-name">${playlist.name}</div>
            <div class="playlist-card-count">${playlist.songs.length} song${playlist.songs.length !== 1 ? 's' : ''}</div>
            <div class="playlist-card-actions">
                <button class="btn-playlist-action" onclick="viewPlaylist(${playlist.id})">View</button>
                <button class="btn-playlist-action" onclick="deletePlaylist(${playlist.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Render Song Selection
function renderSongSelection() {
    const list = document.getElementById('songSelectionList');

    list.innerHTML = DEMO_SONGS.map(song => `
        <div class="song-item-compact ${AppState.selectedSongForPlaylist?.id === song.id ? 'selected' : ''}" 
             onclick="selectSongForPlaylist(${song.id})">
            <div class="song-item-info">
                <div class="song-item-cover" style="background: ${song.coverColor}"></div>
                <div class="song-item-details">
                    <h5>${song.title}</h5>
                    <p>${song.artist}</p>
                </div>
            </div>
            <div class="song-item-price">${song.price} ETH</div>
        </div>
    `).join('');
}

// Select Song for Playlist
function selectSongForPlaylist(songId) {
    const song = DEMO_SONGS.find(s => s.id === songId);
    AppState.selectedSongForPlaylist = song;
    renderSongSelection();
    renderPlaylistSelection();
    document.getElementById('playlistSelectionSection').classList.remove('hidden');
}

// Render Playlist Selection
function renderPlaylistSelection() {
    const list = document.getElementById('playlistSelectionList');

    if (AppState.playlists.length === 0) {
        list.innerHTML = `
            <div class="empty-playlists">
                <p>No playlists available</p>
                <span>Create a playlist first in the "Playlists" tab</span>
            </div>
        `;
        return;
    }

    list.innerHTML = AppState.playlists.map(playlist => `
        <div class="playlist-item-compact" onclick="addSongToPlaylist(${playlist.id})">
            <div class="playlist-item-info">
                <div class="playlist-item-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18V5l12-2v13M9 18c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm12-2c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z" stroke="white" stroke-width="2"/>
                    </svg>
                </div>
                <div class="playlist-item-details">
                    <h5>${playlist.name}</h5>
                    <p>${playlist.songs.length} song${playlist.songs.length !== 1 ? 's' : ''}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Add Song to Playlist
function addSongToPlaylist(playlistId) {
    if (!AppState.selectedSongForPlaylist) return;

    const playlist = AppState.playlists.find(p => p.id === playlistId);
    if (!playlist) return;

    // Check if song already in playlist
    if (playlist.songs.some(s => s.id === AppState.selectedSongForPlaylist.id)) {
        alert('This song is already in the playlist');
        return;
    }

    playlist.songs.push(AppState.selectedSongForPlaylist);
    savePlaylistsToStorage();

    alert(`Added "${AppState.selectedSongForPlaylist.title}" to "${playlist.name}"`);
    AppState.selectedSongForPlaylist = null;
    renderSongSelection();
    document.getElementById('playlistSelectionSection').classList.add('hidden');
}

// Remove Song from Playlist
function removeSongFromPlaylist(event, playlistId, songId) {
    event.stopPropagation();

    const playlist = AppState.playlists.find(p => p.id === playlistId);
    if (!playlist) return;

    playlist.songs = playlist.songs.filter(s => s.id !== songId);
    savePlaylistsToStorage();
    viewPlaylist(playlistId);
}

// Save Playlists to LocalStorage
function savePlaylistsToStorage() {
    localStorage.setItem('cassette_playlists', JSON.stringify(AppState.playlists));
}

// Load Playlists from LocalStorage
function loadPlaylistsFromStorage() {
    const saved = localStorage.getItem('cassette_playlists');
    if (saved) {
        try {
            AppState.playlists = JSON.parse(saved);
        } catch (e) {
            console.error('Failed to load playlists:', e);
            AppState.playlists = [];
        }
    }
}

// ===================================
// AUTO-PAY & PASSWORD FUNCTIONS
// ===================================

// Toggle Auto-Pay
function toggleAutoPay() {
    const toggle = document.getElementById('autoPayToggle');
    AppState.autoPay = toggle.checked;
    localStorage.setItem('cassette_autoPay', AppState.autoPay);

    console.log(`Auto-Pay ${AppState.autoPay ? 'enabled' : 'disabled'}`);
}

// Show Password Modal
function showPasswordModal(song) {
    const modal = document.getElementById('passwordModal');
    document.getElementById('passwordSongTitle').textContent = song.title;
    document.getElementById('passwordSongArtist').textContent = song.artist;
    document.getElementById('passwordSongPrice').textContent = `${song.price} ETH`;
    document.getElementById('transactionPassword').value = '';

    modal.classList.remove('hidden');

    // Focus password input
    setTimeout(() => {
        document.getElementById('transactionPassword').focus();
    }, 100);

    // Add enter key listener
    const passwordInput = document.getElementById('transactionPassword');
    passwordInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
            confirmPasswordAndPay();
        }
    };
}

// Close Password Modal
function closePasswordModal() {
    const modal = document.getElementById('passwordModal');
    modal.classList.add('hidden');
    AppState.pendingSong = null;
    document.getElementById('transactionPassword').value = '';
}

// Confirm Password and Pay
async function confirmPasswordAndPay() {
    const passwordInput = document.getElementById('transactionPassword');
    const enteredPassword = passwordInput.value;

    // Validate password
    if (enteredPassword !== AppState.transactionPassword) {
        // Show error
        passwordInput.style.borderColor = '#ff0080';
        passwordInput.value = '';
        passwordInput.placeholder = 'Incorrect password! Try again...';

        setTimeout(() => {
            passwordInput.style.borderColor = '';
            passwordInput.placeholder = 'Enter your password';
        }, 2000);

        return;
    }

    // Password correct - proceed with payment
    if (AppState.pendingSong) {
        closePasswordModal();
        await audioPlayer.playSong(AppState.pendingSong.id);
        AppState.pendingSong = null;
    }
}

// Load Auto-Pay Setting
function loadAutoPaySetting() {
    const saved = localStorage.getItem('cassette_autoPay');
    if (saved !== null) {
        AppState.autoPay = saved === 'true';
    }

    // Update button appearance
    const btn = document.getElementById('autoPayBtn');
    if (AppState.autoPay) {
        btn.classList.add('active');
        btn.querySelector('.auto-pay-text').textContent = 'Auto-Pay: ON';
    } else {
        btn.classList.remove('active');
        btn.querySelector('.auto-pay-text').textContent = 'Auto-Pay: OFF';
    }
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        WalletManager,
        AudioPlayer,
        AppState,
        DEMO_SONGS
    };
}
