@echo off
echo Installing WhatsApp Bulk Messenger...
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found: 
node --version

echo.
echo Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ✅ Installation completed successfully!
echo.
echo To run the application:
echo   node app.js example-contacts.csv example-message.txt your-image.jpg
echo.
echo Note: You'll need to scan a QR code with your WhatsApp on first run.
echo.
pause
