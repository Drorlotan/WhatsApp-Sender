@echo off
chcp 65001 >nul
title WhatsApp Bulk Messenger - Easy Start
color 0A
echo.
echo ============================================================
echo    WHATSAPP BULK MESSENGER - EASY START
echo ============================================================
echo.

REM Check if Node.js is installed
echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ Node.js is not installed!
    echo.
    echo Please install Node.js first:
    echo 1. Go to: https://nodejs.org/
    echo 2. Download and install the LTS version
    echo 3. Restart your computer
    echo 4. Run this file again
    echo.
    echo Press any key to open Node.js website...
    pause >nul
    start https://nodejs.org/
    exit /b 1
) else (
    echo ✅ Node.js is installed!
    node --version
)

echo.
echo Checking if dependencies are installed...
if not exist "node_modules" (
    echo.
    echo 📦 Installing dependencies... This may take a few minutes...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies!
        echo Please check your internet connection and try again.
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed successfully!
) else (
    echo ✅ Dependencies are already installed!
)

echo.
echo ============================================================
echo    STARTING WHATSAPP BULK MESSENGER
echo ============================================================
echo.
echo Using files:
echo - Contacts: contacts.csv
echo - Message: message.txt
echo - Image: image.jpg
echo.
echo 📱 You will need to scan a QR code with your WhatsApp to authenticate
echo.
echo Press any key to start...
pause >nul
echo.
echo 🚀 Starting WhatsApp Bulk Messenger...
echo.
node utils\app.js contacts.csv message.txt image.jpg
echo.
echo Press any key to exit...
pause >nul
