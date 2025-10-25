const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const port = 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'temp/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Create temp directory if it doesn't exist
if (!fs.existsSync('temp')) {
    fs.mkdirSync('temp');
}

// Serve static files
app.use(express.static('.'));

// API endpoint to send WhatsApp messages
app.post('/send-messages', upload.fields([
    { name: 'csvFile', maxCount: 1 },
    { name: 'imageFile', maxCount: 1 }
]), (req, res) => {
    try {
        const { messageText } = req.body;
        const csvFile = req.files.csvFile[0];
        const imageFile = req.files.imageFile ? req.files.imageFile[0] : null;

        if (!csvFile || !messageText) {
            return res.status(400).json({ error: 'CSV file and message text are required' });
        }

        // Create temporary message file
        const messageFilePath = path.join('temp', 'message.txt');
        fs.writeFileSync(messageFilePath, messageText);

        // Prepare image file path
        const imageFilePath = imageFile ? path.join('temp', imageFile.filename) : 'temp/placeholder.txt';
        if (!imageFile) {
            fs.writeFileSync(imageFilePath, 'No image provided');
        }

        // Run the WhatsApp sender
        const child = spawn('node', ['app.js', csvFile.path, messageFilePath, imageFilePath], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        let output = '';
        let errorOutput = '';

        child.stdout.on('data', (data) => {
            output += data.toString();
        });

        child.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        child.on('close', (code) => {
            // Clean up temporary files
            try {
                fs.unlinkSync(csvFile.path);
                fs.unlinkSync(messageFilePath);
                if (imageFile) {
                    fs.unlinkSync(imageFilePath);
                } else {
                    fs.unlinkSync(imageFilePath);
                }
            } catch (err) {
                console.log('Error cleaning up files:', err);
            }

            if (code === 0) {
                res.json({ 
                    success: true, 
                    output: output,
                    message: 'Messages sent successfully!' 
                });
            } else {
                res.json({ 
                    success: false, 
                    error: errorOutput || output,
                    message: 'Failed to send messages' 
                });
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`🚀 WhatsApp GUI Server running at http://localhost:${port}`);
    console.log(`📱 Open http://localhost:${port}/gui.html in your browser`);
});

// Handle server shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down server...');
    process.exit(0);
});
