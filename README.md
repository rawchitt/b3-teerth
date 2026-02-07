# 🎵 SoundChain - Decentralized Music Streaming Platform

> **"Music Streaming Reimagined on the Blockchain"**

A Web3-powered music streaming platform where every play is an on-chain transaction. Artists own their music as NFTs and receive instant, transparent payments with zero intermediaries.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Web3](https://img.shields.io/badge/Web3-Enabled-purple.svg)

---

## 🌟 Features

### ✅ Implemented (MCP - Minimum Complete Product)

- **🎨 Premium UI/UX**
  - Glassmorphism design with animated gradients
  - Smooth micro-animations and transitions
  - Fully responsive layout (mobile, tablet, desktop)
  - Dark mode optimized

- **👛 Wallet Integration**
  - MetaMask connect/disconnect
  - Real-time balance display
  - Wallet address formatting
  - Account change detection

- **🎵 Music Player**
  - Play/pause controls
  - Previous/next track navigation
  - Progress bar with seek functionality
  - Volume control
  - Now playing display

- **💰 Payment Flow**
  - Pay-per-play model
  - Transaction confirmation modals
  - Balance validation
  - Success/error feedback
  - Instant payment processing (demo)

- **📊 Song Marketplace**
  - Grid/list view toggle
  - Song cards with cover art
  - Price display in ETH
  - Play count statistics
  - Hover effects and animations

### 🔮 Ready for Backend Integration

The frontend is architected to seamlessly integrate with smart contracts:

- Contract address configuration
- ABI integration points
- Blockchain transaction functions
- IPFS content loading
- Event listening for on-chain updates

---

## 🚀 Quick Start

### Prerequisites

- Modern web browser (Chrome, Firefox, Edge, Safari)
- MetaMask browser extension (for wallet functionality)
- Local development server (optional)

### Installation

1. **Clone or download the project**
   ```bash
   cd "X:\B3 HACKATHON Antigravity"
   ```

2. **Open the application**
   
   **Option A: Direct File Access**
   - Simply open `index.html` in your browser
   
   **Option B: Local Server (Recommended)**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   
   # Using PHP
   php -S localhost:8000
   ```
   
   Then navigate to `http://localhost:8000`

3. **Connect Your Wallet**
   - Click "Connect Wallet" button
   - Approve MetaMask connection
   - Your balance will display automatically

4. **Start Listening**
   - Browse the song collection
   - Click play on any song
   - Confirm the transaction
   - Enjoy your music!

---

## 📁 Project Structure

```
SoundChain/
├── index.html          # Main HTML structure
├── styles.css          # Complete design system & styles
├── app.js             # Application logic & wallet integration
└── README.md          # This file
```

### File Descriptions

**`index.html`**
- Semantic HTML5 structure
- SEO optimized with meta tags
- Accessibility features (ARIA labels, semantic elements)
- Modal components for transactions
- Audio player interface

**`styles.css`**
- CSS custom properties (design tokens)
- Glassmorphism effects
- Animated gradient backgrounds
- Responsive grid layouts
- Micro-animations and transitions
- Mobile-first responsive design

**`app.js`**
- Wallet connection management
- Audio player controls
- State management
- Payment processing (demo)
- UI rendering and updates
- Blockchain integration helpers (ready for backend)

---

## 🎨 Design System

### Color Palette

```css
Primary Gradient:   #667eea → #764ba2
Secondary Gradient: #f093fb → #f5576c
Success Gradient:   #4facfe → #00f2fe
Background:         #0a0a0f (Dark)
```

### Typography

- **Primary Font**: Inter (body text)
- **Display Font**: Outfit (headings)
- **Monospace**: Courier New (addresses, balances)

### Key Design Principles

1. **Glassmorphism**: Frosted glass effect with backdrop blur
2. **Gradient Orbs**: Animated floating gradients in background
3. **Micro-animations**: Smooth transitions on all interactions
4. **Premium Feel**: High-quality visual design that wows users

---

## 🔗 Blockchain Integration Guide

### Current State (Demo Mode)

The application currently runs in **demo mode** with:
- Mock wallet connections
- Simulated transactions (2-second delay)
- Demo song data
- Local state management

### Integration Steps

When you're ready to connect to smart contracts:

1. **Deploy Smart Contracts**
   - Deploy `MusicNFT.sol` to testnet
   - Deploy `StreamPayment.sol` to testnet
   - Note the contract addresses

2. **Update Contract Configuration**
   ```javascript
   // In app.js
   const CONTRACT_ADDRESSES = {
       musicNFT: "0x...",        // Your deployed MusicNFT address
       streamPayment: "0x..."    // Your deployed StreamPayment address
   };
   ```

3. **Add Contract ABIs**
   ```javascript
   const CONTRACT_ABIS = {
       musicNFT: [...],          // MusicNFT ABI array
       streamPayment: [...]      // StreamPayment ABI array
   };
   ```

4. **Install ethers.js**
   ```html
   <!-- Add to index.html before app.js -->
   <script src="https://cdn.ethers.io/lib/ethers-5.7.2.umd.min.js"></script>
   ```

5. **Uncomment Integration Functions**
   - `initializeContracts()`
   - `fetchSongsFromBlockchain()`
   - `playSongOnChain()`

6. **Update Payment Flow**
   ```javascript
   // Replace mock transaction in sendPayment()
   const tx = await streamPaymentContract.playSong(tokenId, {
       value: ethers.utils.parseEther(amount.toString())
   });
   await tx.wait();
   ```

### Smart Contract Requirements

**MusicNFT.sol** should provide:
- `totalSupply()` - Get total number of songs
- `getSong(tokenId)` - Get song metadata
- `tokenURI(tokenId)` - Get IPFS metadata URI

**StreamPayment.sol** should provide:
- `playSong(tokenId)` payable - Process payment and emit event
- `getSongPrice(tokenId)` - Get price per play
- Event: `SongPlayed(tokenId, listener, amount)`

---

## 🎯 MCP Checklist

- ✅ Wallet connects successfully
- ✅ At least 3 songs visible on UI
- ✅ Clicking Play triggers a transaction flow
- ✅ Payment confirmation modal displays
- ✅ Song starts playing after payment
- ✅ Balance updates correctly
- ✅ App works after page refresh
- ✅ Responsive design (mobile/desktop)
- ✅ Premium visual design
- ✅ Error handling (insufficient balance, rejected transactions)

---

## 📱 Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: 480px - 767px
- **Small Mobile**: Below 480px

---

## 🎵 Demo Songs

The application includes 5 demo songs:

1. **Neon Dreams** by CryptoBeats (0.001 ETH)
2. **Blockchain Rhythm** by Web3 Collective (0.0015 ETH)
3. **Decentralized Harmony** by NFT Sounds (0.002 ETH)
4. **Smart Contract Symphony** by DAO Musicians (0.0012 ETH)
5. **Ethereum Echoes** by Chain Melody (0.0018 ETH)

---

## 🔧 Customization

### Adding New Songs

```javascript
// In app.js, add to DEMO_SONGS array
{
    id: 6,
    title: "Your Song Title",
    artist: "Artist Name",
    price: 0.001,
    playCount: 0,
    coverColor: "linear-gradient(135deg, #color1 0%, #color2 100%)",
    audioUrl: "ipfs://...",
    artistWallet: "0x..."
}
```

### Changing Colors

```css
/* In styles.css, update CSS variables */
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    /* ... other colors */
}
```

### Modifying Layout

The grid layout is controlled by:
```css
.songs-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}
```

---

## 🐛 Troubleshooting

### MetaMask Not Detected

**Problem**: "MetaMask is not installed" error

**Solution**: 
1. Install MetaMask extension from [metamask.io](https://metamask.io)
2. Refresh the page
3. Click "Connect Wallet"

### Transaction Fails

**Problem**: Payment transaction fails

**Solution**:
1. Check wallet balance (must be > song price)
2. Ensure MetaMask is unlocked
3. Try switching networks and back
4. Refresh page and reconnect wallet

### Songs Not Loading

**Problem**: Song grid is empty

**Solution**:
1. Check browser console for errors
2. Ensure JavaScript is enabled
3. Try hard refresh (Ctrl+Shift+R)

### Audio Not Playing

**Problem**: Song doesn't play after payment

**Solution**:
1. Check browser audio permissions
2. Ensure volume is not muted
3. In demo mode, audio is silent (placeholder)
4. With backend integration, ensure IPFS URLs are valid

---

## 🚀 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd "X:\B3 HACKATHON Antigravity"
   vercel
   ```

3. **Follow prompts**
   - Link to existing project or create new
   - Confirm settings
   - Deploy!

### Deploy to Netlify

1. **Drag & Drop**
   - Go to [netlify.com](https://netlify.com)
   - Drag the project folder to deploy

2. **Or use CLI**
   ```bash
   npm i -g netlify-cli
   netlify deploy
   ```

### Deploy to GitHub Pages

1. **Create repository**
2. **Push code**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
3. **Enable GitHub Pages** in repository settings

---

## 🎯 Future Enhancements

### Phase 2 Features (Post-MCP)

- [ ] Artist upload dashboard
- [ ] Playlist creation
- [ ] User profiles
- [ ] Social features (likes, shares)
- [ ] Search and filtering
- [ ] Genre categorization
- [ ] Royalty split functionality
- [ ] DAO governance integration
- [ ] Subscription models
- [ ] Gas optimization
- [ ] Layer 2 integration
- [ ] Mobile app (React Native)

---

## 📄 License

MIT License - feel free to use this project for your hackathon or personal projects!

---

## 🤝 Contributing

This is a hackathon MCP project. Feel free to fork and extend!

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the integration guide
3. Check browser console for errors

---

## 🎉 Acknowledgments

- **Design Inspiration**: Modern Web3 platforms
- **Fonts**: Google Fonts (Inter, Outfit)
- **Icons**: Custom SVG icons
- **Blockchain**: Ethereum ecosystem

---

**Built with ❤️ for the decentralized music revolution**

*"Every play is an on-chain transaction. Artists own their songs as NFTs and get paid instantly, transparently, with zero intermediaries."*
