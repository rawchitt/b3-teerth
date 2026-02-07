@echo off
echo ========================================
echo   SoundChain - Decentralized Music
echo   Starting Local Development Server...
echo ========================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [*] Starting Python HTTP server on port 8000...
    echo [*] Opening browser at http://localhost:8000
    echo.
    echo Press Ctrl+C to stop the server
    echo ========================================
    echo.
    
    REM Open browser
    start http://localhost:8000
    
    REM Start server
    python -m http.server 8000
) else (
    echo [!] Python not found. Opening index.html directly...
    echo.
    echo NOTE: For best experience, install Python and run this script again.
    echo Or use another local server like Node.js 'npx serve'
    echo.
    pause
    start index.html
)
