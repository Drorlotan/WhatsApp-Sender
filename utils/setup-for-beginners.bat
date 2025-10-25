@echo off
title WhatsApp Bulk Messenger - Easy Setup
color 0A
echo.
echo ============================================================
echo    WHATSAPP BULK MESSENGER - EASY SETUP
echo ============================================================
echo.
echo This will set up everything you need to send bulk WhatsApp messages.
echo.
echo Step 1: Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ Node.js is not installed!
    echo.
    echo Please follow these steps:
    echo 1. Go to: https://nodejs.org/
    echo 2. Click the green "LTS" button
    echo 3. Download and install Node.js
    echo 4. Restart your computer
    echo 5. Run this setup again
    echo.
    echo Press any key to open the Node.js website...
    pause >nul
    start https://nodejs.org/
    exit /b 1
) else (
    echo ✅ Node.js is installed!
    node --version
)

echo.
echo Step 2: Installing WhatsApp Sender dependencies...
echo This may take a few minutes...
npm install

if %errorlevel% neq 0 (
    echo.
    echo ❌ Installation failed!
    echo Please check your internet connection and try again.
    pause
    exit /b 1
) else (
    echo ✅ Dependencies installed successfully!
)

echo.
echo Step 3: Creating example files...
echo +1234567890,John Doe,Company > example-contacts.csv
echo +9876543210,Jane Smith,Company >> example-contacts.csv
echo +5555555555,Bob Johnson,Company >> example-contacts.csv

echo Hello! This is a test message. > example-message.txt
echo We hope you're doing well! >> example-message.txt
echo Best regards, >> example-message.txt
echo Your Team >> example-message.txt

echo This is a placeholder for an image file. > sample-image.txt

echo ✅ Example files created!

echo.
echo ============================================================
echo    SETUP COMPLETED SUCCESSFULLY! 🎉
echo ============================================================
echo.
echo What's next:
echo 1. Edit example-contacts.csv with your phone numbers
echo 2. Edit example-message.txt with your message
echo 3. Add your image file (rename to your-image.jpg)
echo 4. Double-click run-whatsapp-sender.bat to start!
echo.
echo Or run: node app.js example-contacts.csv example-message.txt your-image.jpg
echo.
echo Press any key to exit...
pause >nul
