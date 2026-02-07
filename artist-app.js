import MusicNFT_ABI from "./MusicNFT_ABI.js";
// ===================================
// ARTIST DASHBOARD - WEB3 FUNCTIONALITY
// ===================================

let provider;
let signer;
let userAddress;
let uploadedSongs = [];
let currentSongData = null;

// ===================================
// WALLET CONNECTION
// ===================================

const connectWalletBtn = document.getElementById('connectWalletBtn');
const connectWalletText = document.getElementById('connectWalletText');
const walletInfo = document.getElementById('walletInfo');
const walletAddress = document.getElementById('walletAddress');
const userBalance = document.getElementById('userBalance');

connectWalletBtn.addEventListener('click', connectWallet);

async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
        showError('MetaMask is not installed. Please install MetaMask to continue.');
        return;
    }

    try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = accounts[0];

        // Initialize ethers provider
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        // Initialize MusicNFT contract
        const MUSIC_NFT_CONTRACT_ADDRESS =
            "0x57098a7312Da879B88579F8031642b58b8B0f3C4";

        window.musicNFTContract = new ethers.Contract(
            MUSIC_NFT_CONTRACT_ADDRESS,
            MusicNFT_ABI,
            signer
        );

        console.log("MusicNFT contract ready:", window.musicNFTContract);

        // Get balance
        const balance = await provider.getBalance(userAddress);
        const balanceInEth = ethers.utils.formatEther(balance);

        // Update UI
        walletAddress.textContent = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
        userBalance.textContent = parseFloat(balanceInEth).toFixed(4);
        walletInfo.classList.remove('hidden');
        connectWalletText.textContent = 'Connected';
        connectWalletBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

        // Enable upload button
        document.getElementById('uploadSongBtn').disabled = false;
        document.querySelector('.action-hint').textContent = 'Fill in all fields to upload';

        showSuccess('Wallet Connected!', `Connected to ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`);

        // Listen for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', () => window.location.reload());

    } catch (error) {
        console.error('Error connecting wallet:', error);
        showError('Failed to connect wallet. Please try again.');
    }
}

function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        // User disconnected wallet
        walletInfo.classList.add('hidden');
        connectWalletText.textContent = 'Connect Wallet';
        connectWalletBtn.style.background = '';
        document.getElementById('uploadSongBtn').disabled = true;
        userAddress = null;
    } else {
        // User switched accounts
        window.location.reload();
    }
}

// ===================================
// UPLOAD SONG FUNCTIONALITY
// ===================================

const uploadSongBtn = document.getElementById('uploadSongBtn');
const ipfsHashInput = document.getElementById('ipfsHash');
const songTitleInput = document.getElementById('songTitle');
const artistNameInput = document.getElementById('artistName');
const songPriceInput = document.getElementById('songPrice');

uploadSongBtn.addEventListener('click', uploadSong);

// Enable/disable upload button based on input
[ipfsHashInput, songTitleInput, artistNameInput, songPriceInput].forEach(input => {
    input.addEventListener('input', () => {
        const allFilled = ipfsHashInput.value && songTitleInput.value &&
            artistNameInput.value && songPriceInput.value;
        uploadSongBtn.disabled = !allFilled || !userAddress;
    });
});

async function uploadSong() {
    const ipfsHash = ipfsHashInput.value.trim();
    const title = songTitleInput.value.trim();
    const artist = artistNameInput.value.trim();
    const price = songPriceInput.value.trim();

    // Validation
    if (!ipfsHash || !title || !artist || !price) {
        showError('Please fill in all fields');
        return;
    }

    if (!ipfsHash.startsWith('Qm') && !ipfsHash.startsWith('bafy')) {
        showError('Invalid IPFS hash format. Should start with "Qm" or "bafy"');
        return;
    }

    if (isNaN(price) || parseFloat(price) <= 0) {
        showError('Please enter a valid price in ETH');
        return;
    }

    try {
        // Simulate IPFS upload (in production, this would interact with IPFS)
        uploadSongBtn.disabled = true;
        uploadSongBtn.innerHTML = `
            <svg class="spinner" width="20" height="20" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" opacity="0.3"/>
                <path d="M12 2a10 10 0 0110 10" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>
            </svg>
            <span>Uploading...</span>
        `;

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Create song object
        const song = {
            id: Date.now(),
            ipfsHash: ipfsHash,
            title: title,
            artist: artist,
            price: price,
            uploadedBy: userAddress,
            uploadedAt: new Date().toISOString(),
            minted: false
        };

        // Store song data
        uploadedSongs.push(song);
        currentSongData = song;
        localStorage.setItem('uploadedSongs', JSON.stringify(uploadedSongs));

        // Update mint section
        document.getElementById('mintSongName').textContent = title;
        document.getElementById('mintIpfsHash').textContent = `${ipfsHash.slice(0, 10)}...${ipfsHash.slice(-8)}`;
        document.getElementById('mintPrice').textContent = `${price} ETH`;
        document.getElementById('mintSongBtn').disabled = false;
        document.querySelectorAll('.action-hint')[1].textContent = 'Ready to mint NFT';

        // Clear inputs
        ipfsHashInput.value = '';
        songTitleInput.value = '';
        artistNameInput.value = '';
        songPriceInput.value = '';

        // Reset button
        uploadSongBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span>Upload to IPFS</span>
        `;
        uploadSongBtn.disabled = true;

        // Update songs grid
        renderUploadedSongs();

        showSuccess('Song Uploaded!', `"${title}" has been uploaded to IPFS successfully`);

    } catch (error) {
        console.error('Error uploading song:', error);
        showError('Failed to upload song. Please try again.');
        uploadSongBtn.disabled = false;
        uploadSongBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span>Upload to IPFS</span>
        `;
    }
}

// ===================================
// MINT SONG NFT FUNCTIONALITY
// ===================================

const mintSongBtn = document.getElementById('mintSongBtn');

mintSongBtn.addEventListener('click', mintSongNFT);

async function mintSongNFT() {
    if (!currentSongData) {
        showError('No song data available. Please upload a song first.');
        return;
    }

    if (currentSongData.minted) {
        showError('This song has already been minted as an NFT.');
        return;
    }

    try {
        mintSongBtn.disabled = true;
        mintSongBtn.innerHTML = `
            <svg class="spinner" width="20" height="20" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" opacity="0.3"/>
                <path d="M12 2a10 10 0 0110 10" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>
            </svg>
            <span>Minting NFT...</span>
        `;

        // Simulate blockchain transaction (in production, this would call smart contract)
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Simulate gas fee (in production, this would be actual transaction)
        const gasEstimate = '0.002'; // ETH
        console.log(`Estimated gas fee: ${gasEstimate} ETH`);

        // Mark song as minted
        currentSongData.minted = true;
        currentSongData.mintedAt = new Date().toISOString();
        currentSongData.tokenId = Math.floor(Math.random() * 10000);

        // Update storage
        const songIndex = uploadedSongs.findIndex(s => s.id === currentSongData.id);
        if (songIndex !== -1) {
            uploadedSongs[songIndex] = currentSongData;
            localStorage.setItem('uploadedSongs', JSON.stringify(uploadedSongs));
        }

        // Reset mint button
        mintSongBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Minted!</span>
        `;
        mintSongBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

        // Update songs grid
        renderUploadedSongs();

        showSuccess('NFT Minted!', `"${currentSongData.title}" has been minted as NFT #${currentSongData.tokenId}`);

        // Reset for next song
        setTimeout(() => {
            currentSongData = null;
            document.getElementById('mintSongName').textContent = '-';
            document.getElementById('mintIpfsHash').textContent = '-';
            document.getElementById('mintPrice').textContent = '-';
            mintSongBtn.disabled = true;
            mintSongBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span>Mint NFT</span>
            `;
            mintSongBtn.style.background = '';
            document.querySelectorAll('.action-hint')[1].textContent = 'Upload a song first to mint it as NFT';
        }, 3000);

    } catch (error) {
        console.error('Error minting NFT:', error);
        showError('Failed to mint NFT. Please try again.');
        mintSongBtn.disabled = false;
        mintSongBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span>Mint NFT</span>
        `;
    }
}

// ===================================
// RENDER UPLOADED SONGS
// ===================================

function renderUploadedSongs() {
    const grid = document.getElementById('uploadedSongsGrid');

    if (uploadedSongs.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18V5l12-2v13" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                    <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="2" />
                    <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="2" />
                </svg>
                <p>No songs uploaded yet</p>
                <span>Upload your first song to get started</span>
            </div>
        `;
        return;
    }

    grid.innerHTML = uploadedSongs.map(song => `
        <div class="uploaded-song-card">
            <div class="uploaded-song-cover">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18V5l12-2v13" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                    <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="2" />
                    <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="2" />
                </svg>
            </div>
            <div class="uploaded-song-info">
                <div class="uploaded-song-title">${song.title}</div>
                <div class="uploaded-song-artist">${song.artist}</div>
                <div class="uploaded-song-footer">
                    <div class="uploaded-song-price">${song.price} ETH</div>
                    <div class="uploaded-song-status">
                        <span class="status-badge ${song.minted ? 'minted' : ''}">
                            ${song.minted ? `NFT #${song.tokenId}` : 'Uploaded'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// ===================================
// MODAL FUNCTIONS
// ===================================

function showSuccess(title, message) {
    document.getElementById('successTitle').textContent = title;
    document.getElementById('successMessage').textContent = message;
    document.getElementById('successModal').classList.remove('hidden');
}

function closeSuccessModal() {
    document.getElementById('successModal').classList.add('hidden');
}

function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorModal').classList.remove('hidden');
}

function closeErrorModal() {
    document.getElementById('errorModal').classList.add('hidden');
}

// ===================================
// INITIALIZATION
// ===================================

// Load uploaded songs from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
    const stored = localStorage.getItem('uploadedSongs');
    if (stored) {
        uploadedSongs = JSON.parse(stored);
        renderUploadedSongs();
    }
});

// Add spinner animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .spinner {
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(style);
