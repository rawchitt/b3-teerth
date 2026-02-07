@echo off
title SoundChain - Server Manager
color 0B

:MENU
cls
echo ========================================
echo   🎵 SoundChain - Server Manager 🎵
echo ========================================
echo.
echo   1. Start Server (Quick Launch)
echo   2. Restart Server (Stop All + Start Fresh)
echo   3. Stop All Servers
echo   4. Check Server Status
echo   5. Open in Browser
echo   6. Exit
echo.
echo ========================================
echo.

set /p choice="Select option (1-6): "

if "%choice%"=="1" goto START
if "%choice%"=="2" goto RESTART
if "%choice%"=="3" goto STOP
if "%choice%"=="4" goto STATUS
if "%choice%"=="5" goto BROWSER
if "%choice%"=="6" goto EXIT

echo Invalid choice! Please try again.
timeout /t 2 >nul
goto MENU

:START
cls
echo ========================================
echo   Starting SoundChain Server...
echo ========================================
echo.
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ✗ Python not found!
    echo   Please install Python from python.org
    pause
    goto MENU
)
echo ✓ Python detected
echo ✓ Starting server on port 8000...
echo.
echo Server URL: http://localhost:8000
echo Press Ctrl+C to stop, then close this window
echo.
start http://localhost:8000
python -m http.server 8000
goto MENU

:RESTART
cls
echo ========================================
echo   Restarting SoundChain Server...
echo ========================================
echo.
echo [1/3] Stopping all servers...
taskkill /F /IM python.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1
echo    ✓ Servers stopped
echo.
timeout /t 2 /nobreak >nul
echo [2/3] Starting fresh server...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo    ✗ Python not found!
    pause
    goto MENU
)
echo    ✓ Server starting on port 8000
echo.
echo [3/3] Opening browser...
start http://localhost:8000
echo.
echo ✓ SoundChain is running!
echo   Press Ctrl+C to stop, then close this window
echo.
python -m http.server 8000
goto MENU

:STOP
cls
echo ========================================
echo   Stopping All Servers...
echo ========================================
echo.
taskkill /F /IM python.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM http-server.exe >nul 2>&1
taskkill /F /IM serve.exe >nul 2>&1
echo ✓ All servers stopped
echo.
pause
goto MENU

:STATUS
cls
echo ========================================
echo   Server Status Check
echo ========================================
echo.
echo Checking for running servers...
echo.

REM Check Python servers
tasklist /FI "IMAGENAME eq python.exe" 2>nul | find /I "python.exe" >nul
if %errorlevel%==0 (
    echo ✓ Python server is RUNNING
    tasklist /FI "IMAGENAME eq python.exe"
) else (
    echo ✗ Python server is NOT running
)
echo.

REM Check Node servers
tasklist /FI "IMAGENAME eq node.exe" 2>nul | find /I "node.exe" >nul
if %errorlevel%==0 (
    echo ✓ Node.js server is RUNNING
    tasklist /FI "IMAGENAME eq node.exe"
) else (
    echo ✗ Node.js server is NOT running
)
echo.

REM Check if port 8000 is in use
netstat -ano | findstr ":8000" >nul
if %errorlevel%==0 (
    echo ✓ Port 8000 is IN USE
    echo.
    echo Active connections on port 8000:
    netstat -ano | findstr ":8000"
) else (
    echo ✗ Port 8000 is FREE
)
echo.
pause
goto MENU

:BROWSER
cls
echo ========================================
echo   Opening Browser...
echo ========================================
echo.
echo Opening http://localhost:8000
start http://localhost:8000
echo.
echo ✓ Browser opened
echo.
timeout /t 2 >nul
goto MENU

:EXIT
cls
echo ========================================
echo   Exiting SoundChain Manager
echo ========================================
echo.
echo Do you want to stop all servers before exiting?
echo.
set /p stopservers="Stop servers? (Y/N): "

if /i "%stopservers%"=="Y" (
    echo.
    echo Stopping all servers...
    taskkill /F /IM python.exe >nul 2>&1
    taskkill /F /IM node.exe >nul 2>&1
    echo ✓ Servers stopped
    echo.
)

echo.
echo Thank you for using SoundChain! 🎵
echo.
timeout /t 2 >nul
exit
