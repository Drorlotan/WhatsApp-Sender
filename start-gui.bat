@echo off
title WhatsApp Bulk Messenger - GUI Server
echo.
echo ============================================================
echo    WHATSAPP BULK MESSENGER - GUI SERVER
echo ============================================================
echo.
echo Starting the GUI server...
echo.
echo The GUI will open in your browser automatically.
echo If it doesn't open, go to: http://localhost:3000/gui.html
echo.
echo Press Ctrl+C to stop the server when you're done.
echo.
node gui-server.js
echo.
echo Server stopped. Press any key to exit...
pause >nul
