@echo off
title WhatsApp Bulk Messenger - Example Run
color 0A
echo.
echo ============================================================
echo    WHATSAPP BULK MESSENGER - EXAMPLE RUN
echo ============================================================
echo.
echo This will run the WhatsApp Bulk Messenger using files:
echo - Contacts: contacts.csv
echo - Message: message.txt  
echo - Image: image.jpg (optional)
echo.
echo Press any key to start...
pause >nul
echo.
echo Starting WhatsApp Bulk Messenger with example files...
echo.
echo 📱 You will need to scan a QR code with your WhatsApp to authenticate
echo.
node app.js contacts.csv message.txt image.jpg
echo.
echo Press any key to exit...
pause >nul
