@echo off
title WhatsApp Bulk Messenger
echo.
echo ============================================================
echo    WELCOME TO WHATSAPP BULK MESSENGER
echo ============================================================
echo.
echo This tool will help you send WhatsApp messages to multiple contacts.
echo.
echo You need to prepare 3 files:
echo 1. A CSV file with phone numbers (first column)
echo 2. A text file with your message
echo 3. An image file (optional)
echo.
echo Press any key to continue...
pause >nul
echo.
echo Please enter the paths to your files:
echo.
set /p csvfile="CSV file path (e.g., contacts.csv): "
set /p textfile="Text file path (e.g., message.txt): "
set /p imagefile="Image file path (e.g., image.jpg): "
echo.
echo Starting WhatsApp Bulk Messenger...
echo.
node app.js "%csvfile%" "%textfile%" "%imagefile%"
echo.
echo Press any key to exit...
pause >nul
