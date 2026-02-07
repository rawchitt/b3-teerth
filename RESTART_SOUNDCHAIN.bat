@echo off
echo ========================================
echo   SoundChain - Clean Restart
echo ========================================
echo.

echo [1/3] Stopping all Python HTTP servers...
echo.

REM Kill all Python HTTP server processes
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *http.server*" >nul 2>&1
taskkill /F /IM python.exe /FI "MEMUSAGE gt 1000" >nul 2>&1

REM More aggressive approach - kill all python processes running http.server
for /f "tokens=2" %%a in ('tasklist /FI "IMAGENAME eq python.exe" /NH') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo    ✓ All servers stopped
echo.

REM Wait a moment for ports to be released
timeout /t 2 /nobreak >nul

echo [2/3] Starting fresh server on port 8000...
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo    ✗ Python not found!
    echo.
    echo    Please install Python from python.org
    echo.
    pause
    exit /b 1
)

echo    ✓ Python detected
echo.

echo [3/3] Launching SoundChain...
echo.
echo    Server URL: http://localhost:8000
echo    Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

REM Open browser
start http://localhost:8000

REM Start server in current directory
python -m http.server 8000
