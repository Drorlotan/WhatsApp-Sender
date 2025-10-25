const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode-terminal');

class WhatsAppBulkMessenger {
    constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        });
        
        this.successfulSends = [];
        this.failedSends = [];
        this.totalProcessed = 0;
        
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.client.on('qr', (qr) => {
            console.log('📱 Scan the QR code below with your WhatsApp to authenticate:');
            qrcode.generate(qr, { small: true });
        });

        this.client.on('ready', () => {
            console.log('✅ WhatsApp client is ready!');
        });

        this.client.on('authenticated', () => {
            console.log('🔐 WhatsApp authenticated successfully');
        });

        this.client.on('auth_failure', (msg) => {
            console.error('❌ Authentication failed:', msg);
        });

        this.client.on('disconnected', (reason) => {
            console.log('📴 WhatsApp client disconnected:', reason);
        });
    }

    async initialize() {
        try {
            await this.client.initialize();
            console.log('🚀 Initializing WhatsApp client...');
        } catch (error) {
            console.error('❌ Failed to initialize WhatsApp client:', error);
            throw error;
        }
    }

    async parseCSV(csvFilePath) {
        return new Promise((resolve, reject) => {
            const phoneNumbers = [];
            
            if (!fs.existsSync(csvFilePath)) {
                reject(new Error(`CSV file not found: ${csvFilePath}`));
                return;
            }

            fs.createReadStream(csvFilePath)
                .pipe(csv({ headers: false }))
                .on('data', (row) => {
                    // Get the first column value (phone number)
                    const firstColumn = Object.values(row)[0];
                    if (firstColumn && firstColumn.trim()) {
                        phoneNumbers.push(this.cleanPhoneNumber(firstColumn.trim()));
                    }
                })
                .on('end', () => {
                    console.log(`📋 Found ${phoneNumbers.length} phone numbers in CSV`);
                    resolve(phoneNumbers);
                })
                .on('error', (error) => {
                    reject(error);
                });
        });
    }

    cleanPhoneNumber(phoneNumber) {
        // Remove all non-digit characters except +
        let cleaned = phoneNumber.replace(/[^\d+]/g, '');
        
        // If it doesn't start with +, add it (assuming US number)
        if (!cleaned.startsWith('+')) {
            if (cleaned.length === 10) {
                cleaned = '+1' + cleaned; // US number
            } else {
                cleaned = '+' + cleaned;
            }
        }
        
        return cleaned;
    }

    async isNumberOnWhatsApp(phoneNumber) {
        try {
            // Try different formats
            const formats = [
                phoneNumber,                    // +972556665238
                phoneNumber.replace('+', ''),   // 972556665238
                phoneNumber.replace('+', '') + '@c.us'  // 972556665238@c.us
            ];
            
            for (const format of formats) {
                try {
                    const numberId = await this.client.getNumberId(format);
                    if (numberId !== null) {
                        console.log(`✅ Number ${phoneNumber} is registered on WhatsApp (ID: ${numberId._serialized})`);
                        return true;
                    }
                } catch (formatError) {
                    // Try next format
                    continue;
                }
            }
            console.log(`❌ Number ${phoneNumber} is not registered on WhatsApp`);
            return false;
        } catch (error) {
            console.log(`⚠️  Could not check WhatsApp status for ${phoneNumber}: ${error.message}`);
            // If we can't check, assume it's valid and try to send
            return true;
        }
    }

    async sendMessage(phoneNumber, textContent, imagePath) {
        try {
            // Check if number is on WhatsApp
            const isOnWhatsApp = await this.isNumberOnWhatsApp(phoneNumber);
            if (!isOnWhatsApp) {
                throw new Error('Not registered on WhatsApp');
            }

            // Try different phone number formats for sending
            const formats = [
                phoneNumber,                    // +972556665238
                phoneNumber.replace('+', '') + '@c.us',  // 972556665238@c.us
                phoneNumber.replace('+', '')    // 972556665238
            ];

            let messageSent = false;
            let lastError = null;

            for (const format of formats) {
                try {
                    // Send text message and wait for response
                    const textMessage = await this.client.sendMessage(format, textContent);
                    console.log(`📤 Text message sent to ${format} (ID: ${textMessage.id._serialized})`);
                    
                    // Send image if provided
                    if (imagePath && fs.existsSync(imagePath)) {
                        const media = MessageMedia.fromFilePath(imagePath);
                        const imageMessage = await this.client.sendMessage(format, media);
                        console.log(`🖼️  Image sent to ${format} (ID: ${imageMessage.id._serialized})`);
                    }
                    
                    messageSent = true;
                    if (format !== phoneNumber) {
                        console.log(`✅ Message sent using format: ${format}`);
                    }
                    
                    // Add a small delay to ensure message is processed
                    await this.delay(1000);
                    console.log(`✅ Message delivery confirmed for ${format}`);
                    break;
                } catch (sendError) {
                    lastError = sendError;
                    console.log(`❌ Failed to send to ${format}: ${sendError.message}`);
                    // Only show format failure if it's not the last format we're trying
                    if (format !== formats[formats.length - 1]) {
                        console.log(`⚠️  Trying alternative format for ${phoneNumber}...`);
                    }
                    continue;
                }
            }

            if (messageSent) {
                return { success: true, message: 'Message sent successfully' };
            } else {
                throw lastError || new Error('Failed to send with any format');
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async sendBulkMessages(phoneNumbers, textContent, imagePath) {
        console.log(`📤 Starting to send messages to ${phoneNumbers.length} numbers...`);
        
        for (let i = 0; i < phoneNumbers.length; i++) {
            const phoneNumber = phoneNumbers[i];
            this.totalProcessed++;
            
            console.log(`📱 [${i + 1}/${phoneNumbers.length}] Processing: ${phoneNumber}`);
            
            const result = await this.sendMessage(phoneNumber, textContent, imagePath);
            
            if (result.success) {
                this.successfulSends.push(phoneNumber);
                console.log(`✅ Sent successfully to ${phoneNumber}`);
            } else {
                this.failedSends.push({ number: phoneNumber, reason: result.message });
                console.log(`❌ Failed to send to ${phoneNumber}: ${result.message}`);
            }
            
            // Rate limiting - wait 2-3 seconds between messages
            if (i < phoneNumbers.length - 1) {
                console.log('⏳ Waiting 2.5 seconds before next message...');
                await this.delay(2500);
            }
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    generateReport() {
        console.log('\n' + '='.repeat(50));
        console.log('📊 FINAL REPORT');
        console.log('='.repeat(50));
        console.log(`📋 Total numbers processed: ${this.totalProcessed}`);
        console.log(`✅ Successfully sent: ${this.successfulSends.length}`);
        console.log(`❌ Failed to send: ${this.failedSends.length}`);
        
        if (this.failedSends.length > 0) {
            console.log('\n❌ Failed numbers:');
            this.failedSends.forEach((failure, index) => {
                console.log(`   ${index + 1}. ${failure.number} - ${failure.reason}`);
            });
        }
        
        console.log('\n✅ Successfully sent to:');
        this.successfulSends.forEach((number, index) => {
            console.log(`   ${index + 1}. ${number}`);
        });
        
        console.log('='.repeat(50));
    }

    async destroy() {
        await this.client.destroy();
    }
}

// Main execution function
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length !== 3) {
        console.log('❌ Usage: node app.js <csv-file> <text-file> <image-file>');
        console.log('   Example: node app.js contacts.csv message.txt image.jpg');
        process.exit(1);
    }
    
    const [csvFile, textFile, imageFile] = args;
    
    // Validate files exist
    const files = { csv: csvFile, text: textFile, image: imageFile };
    for (const [type, filePath] of Object.entries(files)) {
        if (!fs.existsSync(filePath)) {
            console.error(`❌ ${type} file not found: ${filePath}`);
            process.exit(1);
        }
    }
    
    // Read text content
    const textContent = fs.readFileSync(textFile, 'utf8').trim();
    if (!textContent) {
        console.error('❌ Text file is empty');
        process.exit(1);
    }
    
    console.log('='.repeat(60));
    console.log('🚀 WELCOME TO WHATSAPP BULK MESSENGER 🚀');
    console.log('='.repeat(60));
    console.log('📱 Send bulk WhatsApp messages with text and images');
    console.log('🔒 Secure • Fast • Reliable');
    console.log('='.repeat(60));
    console.log();
    console.log('📋 Configuration:');
    console.log(`📄 CSV file: ${csvFile}`);
    console.log(`📝 Text file: ${textFile}`);
    console.log(`🖼️  Image file: ${imageFile}`);
    console.log(`💬 Message preview: ${textContent.substring(0, 100)}${textContent.length > 100 ? '...' : ''}`);
    console.log();
    
    const messenger = new WhatsAppBulkMessenger();
    
    try {
        // Initialize WhatsApp client
        await messenger.initialize();
        
        // Wait for client to be ready
        await new Promise((resolve) => {
            messenger.client.on('ready', resolve);
        });
        
        // Parse CSV and get phone numbers
        const phoneNumbers = await messenger.parseCSV(csvFile);
        
        if (phoneNumbers.length === 0) {
            console.log('❌ No valid phone numbers found in CSV file');
            process.exit(1);
        }
        
        // Send bulk messages
        await messenger.sendBulkMessages(phoneNumbers, textContent, imageFile);
        
        // Generate final report
        messenger.generateReport();
        
    } catch (error) {
        console.error('❌ Application error:', error.message);
        process.exit(1);
    } finally {
        await messenger.destroy();
        console.log('👋 Application finished');
    }
}

// Handle process termination
process.on('SIGINT', async () => {
    console.log('\n🛑 Application interrupted by user');
    process.exit(0);
});

// Run the application
if (require.main === module) {
    main().catch(console.error);
}

module.exports = WhatsAppBulkMessenger;
