@echo off
echo ========================================
echo   SoundChain - Stop All Servers
echo ========================================
echo.

echo Stopping all running servers...
echo.

REM Kill all Python processes
taskkill /F /IM python.exe >nul 2>&1

REM Kill Node.js servers if any
taskkill /F /IM node.exe >nul 2>&1

REM Kill any http-server or serve processes
taskkill /F /IM http-server.exe >nul 2>&1
taskkill /F /IM serve.exe >nul 2>&1

echo    ✓ All servers stopped
echo.
echo You can now run RESTART_SOUNDCHAIN.bat to start fresh
echo.
pause
