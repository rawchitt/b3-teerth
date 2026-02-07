# 🚀 SoundChain - Server Launcher Guide

## Quick Start Scripts

You now have **4 launcher scripts** to manage your SoundChain server:

---

## 📁 Available Scripts

### 1. **SERVER_MANAGER.bat** ⭐ (RECOMMENDED)
**Interactive menu with all options**

**Features:**
- ✅ Start server
- ✅ Restart server (stops all + starts fresh)
- ✅ Stop all servers
- ✅ Check server status
- ✅ Open in browser
- ✅ Clean exit with option to stop servers

**How to use:**
1. Double-click `SERVER_MANAGER.bat`
2. Choose option from menu (1-6)
3. Follow on-screen instructions

**Best for:** Full control and monitoring

---

### 2. **RESTART_SOUNDCHAIN.bat** 🔄
**One-click clean restart**

**What it does:**
1. Stops ALL running Python servers
2. Waits 2 seconds for ports to release
3. Starts fresh server on port 8000
4. Opens browser automatically

**How to use:**
- Double-click `RESTART_SOUNDCHAIN.bat`
- Server starts automatically
- Press Ctrl+C to stop

**Best for:** Quick restart when server is stuck

---

### 3. **START_SOUNDCHAIN.bat** ▶️
**Simple start (original launcher)**

**What it does:**
1. Checks for Python
2. Starts server on port 8000
3. Opens browser

**How to use:**
- Double-click `START_SOUNDCHAIN.bat`
- Server starts if port is free
- Press Ctrl+C to stop

**Best for:** First-time launch or when no server is running

---

### 4. **STOP_ALL_SERVERS.bat** ⏹️
**Emergency stop button**

**What it does:**
1. Kills all Python processes
2. Kills all Node.js processes
3. Kills all http-server/serve processes

**How to use:**
- Double-click `STOP_ALL_SERVERS.bat`
- All servers stop immediately

**Best for:** When you need to stop everything quickly

---

## 🎯 Which Script to Use?

### Scenario 1: First Time Running
**Use:** `START_SOUNDCHAIN.bat` or `SERVER_MANAGER.bat` (option 1)

### Scenario 2: Server is Already Running
**Use:** `RESTART_SOUNDCHAIN.bat` or `SERVER_MANAGER.bat` (option 2)

### Scenario 3: Port 8000 is Busy
**Use:** `RESTART_SOUNDCHAIN.bat` (stops all + starts fresh)

### Scenario 4: Multiple Servers Running
**Use:** `STOP_ALL_SERVERS.bat` then `START_SOUNDCHAIN.bat`

### Scenario 5: Want Full Control
**Use:** `SERVER_MANAGER.bat` (interactive menu)

### Scenario 6: Need to Check Status
**Use:** `SERVER_MANAGER.bat` (option 4)

---

## 🔧 Troubleshooting

### Problem: "Port 8000 already in use"
**Solution:**
1. Run `RESTART_SOUNDCHAIN.bat` (auto-stops all servers)
2. Or run `STOP_ALL_SERVERS.bat` then `START_SOUNDCHAIN.bat`

### Problem: "Python not found"
**Solution:**
1. Install Python from [python.org](https://python.org)
2. Make sure "Add to PATH" is checked during installation
3. Restart your computer
4. Try again

### Problem: Server won't stop
**Solution:**
1. Run `STOP_ALL_SERVERS.bat`
2. Or use `SERVER_MANAGER.bat` → Option 3
3. Or manually: Open Task Manager → End all `python.exe` processes

### Problem: Browser doesn't open
**Solution:**
1. Manually navigate to: `http://localhost:8000`
2. Or use `SERVER_MANAGER.bat` → Option 5

### Problem: Page shows "404 Not Found"
**Solution:**
1. Make sure you're in the correct directory
2. Check that `index.html` exists in the folder
3. Restart server with `RESTART_SOUNDCHAIN.bat`

---

## 📊 Server Status Codes

When using `SERVER_MANAGER.bat` → Option 4:

**✓ Python server is RUNNING**
- Server is active on port 8000
- Website should be accessible

**✗ Python server is NOT running**
- No server is running
- Use option 1 or 2 to start

**✓ Port 8000 is IN USE**
- Something is using port 8000
- Might be your server or another app
- Use option 2 to restart cleanly

**✗ Port 8000 is FREE**
- Port is available
- Safe to start server

---

## ⚡ Quick Commands

### Start Server
```
Double-click: START_SOUNDCHAIN.bat
```

### Restart Server
```
Double-click: RESTART_SOUNDCHAIN.bat
```

### Stop Server
```
Press Ctrl+C in server window
Or double-click: STOP_ALL_SERVERS.bat
```

### Check Status
```
Double-click: SERVER_MANAGER.bat → Option 4
```

### Open Browser
```
Navigate to: http://localhost:8000
Or use: SERVER_MANAGER.bat → Option 5
```

---

## 🎨 SERVER_MANAGER.bat Menu

```
========================================
  🎵 SoundChain - Server Manager 🎵
========================================

  1. Start Server (Quick Launch)
  2. Restart Server (Stop All + Start Fresh)
  3. Stop All Servers
  4. Check Server Status
  5. Open in Browser
  6. Exit

========================================
```

---

## 💡 Pro Tips

1. **Use SERVER_MANAGER.bat for demos**
   - Professional menu interface
   - Easy to show status
   - Clean exit option

2. **Use RESTART_SOUNDCHAIN.bat during development**
   - Quick restart when making changes
   - Automatically stops old servers
   - No manual cleanup needed

3. **Bookmark http://localhost:8000**
   - Quick access without opening browser
   - Refresh to see changes

4. **Keep one launcher open**
   - Easy to stop server (Ctrl+C)
   - See server logs
   - Monitor requests

---

## 🚨 Emergency Procedures

### If Everything is Stuck:
1. Run `STOP_ALL_SERVERS.bat`
2. Wait 5 seconds
3. Run `RESTART_SOUNDCHAIN.bat`

### If Port Won't Release:
1. Open Task Manager (Ctrl+Shift+Esc)
2. Find all `python.exe` processes
3. End them manually
4. Run `START_SOUNDCHAIN.bat`

### If Python Errors:
1. Close all Python windows
2. Restart computer
3. Run `SERVER_MANAGER.bat`

---

## 📝 Summary

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `SERVER_MANAGER.bat` | Full control | Anytime (recommended) |
| `RESTART_SOUNDCHAIN.bat` | Clean restart | Server stuck or port busy |
| `START_SOUNDCHAIN.bat` | Simple start | First launch |
| `STOP_ALL_SERVERS.bat` | Emergency stop | Need to stop everything |

---

## ✅ Recommended Workflow

**For Development:**
1. Use `RESTART_SOUNDCHAIN.bat` to start
2. Make changes to code
3. Refresh browser to see changes
4. Press Ctrl+C to stop when done

**For Demo/Presentation:**
1. Use `SERVER_MANAGER.bat`
2. Choose option 2 (Restart) for clean start
3. Choose option 5 to open browser
4. Choose option 6 to exit cleanly

**For Testing:**
1. Use `SERVER_MANAGER.bat`
2. Check status (option 4) before starting
3. Start server (option 1)
4. Test features
5. Stop servers (option 3) when done

---

**All scripts are ready to use! Just double-click and go! 🚀**
