# 🔗 Backend Integration Guide

This document provides step-by-step instructions for integrating the SoundChain frontend with your blockchain smart contracts.

---

## 📋 Prerequisites

Before integrating, ensure you have:

- ✅ Deployed `MusicNFT.sol` contract
- ✅ Deployed `StreamPayment.sol` contract
- ✅ Contract addresses from deployment
- ✅ Contract ABIs (JSON files)
- ✅ IPFS gateway setup (Pinata, Web3.Storage, or Infura)
- ✅ Testnet ETH in your wallet (Sepolia, Mumbai, etc.)

---

## 🚀 Step 1: Install Dependencies

### Option A: CDN (Recommended for Quick Start)

Add to `index.html` before the closing `</body>` tag:

```html
<!-- Add before app.js -->
<script src="https://cdn.ethers.io/lib/ethers-5.7.2.umd.min.js"></script>
<script src="app.js"></script>
```

### Option B: NPM (For Production)

```bash
npm init -y
npm install ethers
```

Then use a bundler like Webpack or Vite.

---

## 🔧 Step 2: Configure Contract Addresses

In `app.js`, update the contract addresses:

```javascript
// Line ~450 in app.js
const CONTRACT_ADDRESSES = {
    musicNFT: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",      // Replace with your MusicNFT address
    streamPayment: "0x8ba1f109551bD432803012645Ac136ddd64DBA72"  // Replace with your StreamPayment address
};
```

**Where to find these:**
- After deploying contracts with Hardhat/Truffle
- Check your deployment logs
- Or find on block explorer (Etherscan, etc.)

---

## 📝 Step 3: Add Contract ABIs

### Extract ABIs from Compiled Contracts

After compiling your Solidity contracts:

```bash
# Hardhat
cat artifacts/contracts/MusicNFT.sol/MusicNFT.json | jq .abi > MusicNFT-abi.json
cat artifacts/contracts/StreamPayment.sol/StreamPayment.json | jq .abi > StreamPayment-abi.json
```

### Add to app.js

```javascript
// Line ~455 in app.js
const CONTRACT_ABIS = {
    musicNFT: [
        {
            "inputs": [],
            "name": "totalSupply",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
            "name": "getSong",
            "outputs": [
                {"internalType": "string", "name": "title", "type": "string"},
                {"internalType": "string", "name": "artist", "type": "string"},
                {"internalType": "string", "name": "audioHash", "type": "string"},
                {"internalType": "string", "name": "coverHash", "type": "string"}
            ],
            "stateMutability": "view",
            "type": "function"
        }
        // ... rest of ABI
    ],
    streamPayment: [
        {
            "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
            "name": "playSong",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
            "name": "getSongPrice",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {"indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"},
                {"indexed": true, "internalType": "address", "name": "listener", "type": "address"},
                {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
            ],
            "name": "SongPlayed",
            "type": "event"
        }
        // ... rest of ABI
    ]
};
```

---

## 🎵 Step 4: Initialize Contracts

Uncomment and implement the `initializeContracts()` function:

```javascript
// Add this to WalletManager class
async initializeContracts() {
    if (!window.ethereum) return;
    
    try {
        // Create provider and signer
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        this.signer = this.provider.getSigner();
        
        // Initialize contracts
        this.musicNFTContract = new ethers.Contract(
            CONTRACT_ADDRESSES.musicNFT,
            CONTRACT_ABIS.musicNFT,
            this.signer
        );
        
        this.streamPaymentContract = new ethers.Contract(
            CONTRACT_ADDRESSES.streamPayment,
            CONTRACT_ABIS.streamPayment,
            this.signer
        );
        
        console.log('✅ Contracts initialized');
        return true;
    } catch (error) {
        console.error('Contract initialization error:', error);
        return false;
    }
}
```

Call this after wallet connection:

```javascript
// In WalletManager.connect() method, after successful connection
await this.initializeContracts();
```

---

## 📚 Step 5: Fetch Songs from Blockchain

Replace the `DEMO_SONGS` array with real blockchain data:

```javascript
async function fetchSongsFromBlockchain() {
    try {
        const totalSupply = await walletManager.musicNFTContract.totalSupply();
        const songs = [];
        
        for (let i = 0; i < totalSupply; i++) {
            const tokenId = i;
            
            // Get song metadata from contract
            const songData = await walletManager.musicNFTContract.getSong(tokenId);
            const price = await walletManager.streamPaymentContract.getSongPrice(tokenId);
            
            // Get play count (if your contract tracks this)
            const playCount = await walletManager.streamPaymentContract.getPlayCount(tokenId);
            
            songs.push({
                id: tokenId,
                title: songData.title,
                artist: songData.artist,
                price: ethers.utils.formatEther(price),
                playCount: playCount.toNumber(),
                audioHash: songData.audioHash,
                coverHash: songData.coverHash,
                audioUrl: `https://ipfs.io/ipfs/${songData.audioHash}`,
                coverUrl: `https://ipfs.io/ipfs/${songData.coverHash}`
            });
        }
        
        AppState.songs = songs;
        renderSongs();
        
        console.log(`✅ Loaded ${songs.length} songs from blockchain`);
    } catch (error) {
        console.error('Error fetching songs:', error);
        showError('Failed to load songs from blockchain');
    }
}
```

Call this after contract initialization:

```javascript
// In DOMContentLoaded event
if (AppState.wallet.connected) {
    await fetchSongsFromBlockchain();
} else {
    renderSongs(); // Use demo data
}
```

---

## 💰 Step 6: Implement Real Payments

Update the `sendPayment` method in `WalletManager`:

```javascript
async sendPayment(songId, amount) {
    if (!AppState.wallet.connected) {
        showError('Please connect your wallet first.');
        return false;
    }

    const song = AppState.songs.find(s => s.id === songId);
    if (!song) return false;

    // Check balance
    if (AppState.wallet.balance < amount) {
        showError('Insufficient balance. Please add funds to your wallet.');
        return false;
    }

    try {
        showTransactionModal(song.title, amount);

        // Convert ETH to Wei
        const priceInWei = ethers.utils.parseEther(amount.toString());

        // Call smart contract
        const tx = await this.streamPaymentContract.playSong(songId, {
            value: priceInWei,
            gasLimit: 100000 // Adjust based on your contract
        });

        console.log('Transaction sent:', tx.hash);

        // Wait for confirmation
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt);

        // Update balance
        const newBalance = await this.provider.getBalance(AppState.wallet.address);
        AppState.wallet.balance = parseFloat(ethers.utils.formatEther(newBalance));
        this.updateWalletUI();

        hideTransactionModal();
        showSuccessModal();

        return true;
    } catch (error) {
        console.error('Transaction error:', error);
        hideTransactionModal();
        
        // Handle specific errors
        if (error.code === 4001) {
            showError('Transaction rejected by user');
        } else if (error.code === -32603) {
            showError('Insufficient funds for gas');
        } else {
            showError('Transaction failed. Please try again.');
        }
        
        return false;
    }
}
```

---

## 🎧 Step 7: Load Audio from IPFS

Update the `AudioPlayer.playSong()` method:

```javascript
async playSong(songId) {
    const song = AppState.songs.find(s => s.id === songId);
    if (!song) return;

    // Process payment first
    const paymentSuccess = await walletManager.sendPayment(songId, song.price);
    if (!paymentSuccess) return;

    this.currentSongId = songId;
    AppState.currentSong = song;

    // Update player UI
    this.updatePlayerUI(song);
    
    // Show player
    const player = document.getElementById('audioPlayer');
    player.classList.remove('hidden');

    // Load audio from IPFS
    if (song.audioUrl) {
        this.audio.src = song.audioUrl;
        
        // Handle IPFS loading errors
        this.audio.addEventListener('error', () => {
            console.error('Failed to load audio from IPFS');
            showError('Failed to load audio. Please try again.');
        }, { once: true });
    }
    
    this.audio.play();
    this.isPlaying = true;
    this.updatePlayPauseButton();
}
```

Update `updatePlayerUI` to use real cover images:

```javascript
updatePlayerUI(song) {
    document.getElementById('playerTitle').textContent = song.title;
    document.getElementById('playerArtist').textContent = song.artist;
    
    const playerCover = document.getElementById('playerCover');
    
    if (song.coverUrl) {
        // Use IPFS cover image
        playerCover.src = song.coverUrl;
        playerCover.style.background = 'none';
    } else {
        // Fallback to gradient
        playerCover.style.background = song.coverColor || 'var(--primary-gradient)';
    }
    
    playerCover.alt = song.title;
}
```

---

## 🖼️ Step 8: Update Song Card Rendering

Modify `createSongCard` to use IPFS images:

```javascript
function createSongCard(song, index) {
    const card = document.createElement('div');
    card.className = 'song-card';
    card.style.animationDelay = `${index * 0.1}s`;

    // Determine cover display
    const coverStyle = song.coverUrl 
        ? `background-image: url('${song.coverUrl}'); background-size: cover;`
        : `background: ${song.coverColor || 'var(--primary-gradient)'}`;

    card.innerHTML = `
        <div class="song-cover-wrapper">
            <div class="song-cover" style="${coverStyle}"></div>
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
```

---

## 🔔 Step 9: Listen to Blockchain Events

Add event listeners for on-chain updates:

```javascript
function setupEventListeners() {
    if (!walletManager.streamPaymentContract) return;
    
    // Listen for SongPlayed events
    walletManager.streamPaymentContract.on('SongPlayed', (tokenId, listener, amount, event) => {
        console.log('Song played event:', {
            tokenId: tokenId.toNumber(),
            listener,
            amount: ethers.utils.formatEther(amount)
        });
        
        // Update play count in UI
        const song = AppState.songs.find(s => s.id === tokenId.toNumber());
        if (song) {
            song.playCount++;
            renderSongs(); // Re-render to show updated count
        }
    });
}

// Call after contract initialization
setupEventListeners();
```

---

## 🌐 Step 10: Configure Network

Add network detection and switching:

```javascript
const SUPPORTED_NETWORKS = {
    11155111: 'Sepolia Testnet',
    80001: 'Polygon Mumbai',
    5: 'Goerli Testnet'
};

async function checkNetwork() {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const networkId = parseInt(chainId, 16);
    
    if (!SUPPORTED_NETWORKS[networkId]) {
        showError(`Please switch to a supported network: ${Object.values(SUPPORTED_NETWORKS).join(', ')}`);
        return false;
    }
    
    console.log(`✅ Connected to ${SUPPORTED_NETWORKS[networkId]}`);
    return true;
}

// Call in wallet connect
async connect() {
    // ... existing code ...
    
    const networkOk = await checkNetwork();
    if (!networkOk) return false;
    
    // ... rest of connection logic ...
}
```

---

## ✅ Step 11: Testing Checklist

Before going live, test:

- [ ] Wallet connects to correct network
- [ ] Songs load from blockchain
- [ ] Song metadata displays correctly
- [ ] IPFS images load
- [ ] Payment transaction sends
- [ ] Transaction confirmation works
- [ ] Balance updates after payment
- [ ] Audio plays from IPFS
- [ ] Events are captured
- [ ] Error handling works
- [ ] Mobile responsiveness maintained

---

## 🐛 Common Integration Issues

### Issue: "Cannot read property 'getSong' of undefined"

**Cause**: Contracts not initialized

**Fix**: Ensure `initializeContracts()` is called and awaited before fetching songs

### Issue: "Transaction reverted"

**Cause**: Insufficient gas or contract error

**Fix**: 
- Increase gas limit
- Check contract has correct permissions
- Verify payment amount matches contract price

### Issue: IPFS images not loading

**Cause**: IPFS gateway timeout or incorrect hash

**Fix**:
- Use multiple IPFS gateways as fallback
- Verify IPFS hashes are correct
- Consider using Pinata or Infura IPFS

```javascript
const IPFS_GATEWAYS = [
    'https://ipfs.io/ipfs/',
    'https://gateway.pinata.cloud/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/'
];

function getIPFSUrl(hash, gatewayIndex = 0) {
    return `${IPFS_GATEWAYS[gatewayIndex]}${hash}`;
}
```

### Issue: "User rejected transaction"

**Cause**: User clicked reject in MetaMask

**Fix**: This is expected behavior - ensure error message is user-friendly

---

## 📊 Performance Optimization

### Batch Contract Calls

```javascript
// Instead of multiple individual calls
const promises = [];
for (let i = 0; i < totalSupply; i++) {
    promises.push(musicNFTContract.getSong(i));
}
const songs = await Promise.all(promises);
```

### Cache IPFS Content

```javascript
const ipfsCache = new Map();

async function loadIPFSContent(hash) {
    if (ipfsCache.has(hash)) {
        return ipfsCache.get(hash);
    }
    
    const content = await fetch(`https://ipfs.io/ipfs/${hash}`);
    ipfsCache.set(hash, content);
    return content;
}
```

---

## 🚀 Deployment Considerations

1. **Environment Variables**: Store contract addresses in environment variables
2. **Network Detection**: Auto-detect and switch networks
3. **Error Boundaries**: Implement comprehensive error handling
4. **Loading States**: Show loading indicators during blockchain calls
5. **Gas Estimation**: Estimate gas before transactions
6. **Transaction History**: Store transaction hashes for user reference

---

## 📞 Need Help?

Common resources:
- [Ethers.js Documentation](https://docs.ethers.io/)
- [MetaMask Documentation](https://docs.metamask.io/)
- [IPFS Documentation](https://docs.ipfs.io/)
- [Hardhat Documentation](https://hardhat.org/docs)

---

**Ready to go live? Follow these steps carefully and test thoroughly on testnet before mainnet deployment!** 🎉
