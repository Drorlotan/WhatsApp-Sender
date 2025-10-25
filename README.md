# WhatsApp Bulk Messenger

A Node.js application that sends bulk WhatsApp messages with text and images to phone numbers from a CSV file.

## Features

- Send messages with both text and images
- Read phone numbers from CSV files (ignores additional columns)
- Check if numbers are registered on WhatsApp before sending
- Track success/failure rates with detailed reporting
- Rate limiting to avoid WhatsApp blocks
- Command-line interface for easy automation

## Installation

### Quick Install (Windows)
1. Make sure you have Node.js installed (version 14 or higher)
2. Download this project
3. Double-click `install.bat` to automatically install dependencies

### Manual Install
1. Make sure you have Node.js installed (version 14 or higher)
2. Clone or download this project
3. Open terminal/command prompt in the project directory
4. Install dependencies:
   ```bash
   npm install
   ```

### Node.js Installation
If you don't have Node.js installed:
- Download from [nodejs.org](https://nodejs.org/)
- Choose the LTS version
- Run the installer and follow the instructions

## Usage

```bash
node app.js <csv-file> <text-file> <image-file>
```

### Parameters

- `csv-file`: Path to CSV file containing phone numbers (first column)
- `text-file`: Path to text file containing the message content
- `image-file`: Path to image file (jpg, png, etc.)

### Example

```bash
node app.js contacts.csv message.txt image.jpg
```

### Test with Example Files

The project includes example files to help you test:
- `example-contacts.csv` - Sample phone numbers
- `example-message.txt` - Sample message text

To test (you'll need to add your own image file):
```bash
node app.js example-contacts.csv example-message.txt your-image.jpg
```

## CSV Format

Your CSV file should have phone numbers in the first column. Additional columns will be ignored.

Example:
```csv
+1234567890,John Doe,Company
+9876543210,Jane Smith,Company
+5555555555,Bob Johnson,Company
```

## Phone Number Format

- Use international format with country code (e.g., +1234567890)
- The application will clean phone numbers automatically
- Numbers without WhatsApp will be skipped

## First Run Setup

1. Run the application for the first time
2. A QR code will appear in the terminal
3. Open WhatsApp on your phone
4. Go to Settings > Linked Devices > Link a Device
5. Scan the QR code
6. Your session will be saved for future runs

## Output

The application will show:
- Progress indicators during sending
- Final summary with:
  - Total numbers processed
  - Successfully sent count
  - Failed count with reasons
  - List of failed numbers

## Troubleshooting

- **QR Code not appearing**: Make sure your terminal supports QR code display
- **Messages not sending**: Check your internet connection and WhatsApp status
- **Rate limiting**: The app includes delays between messages to avoid blocks
- **Session issues**: Delete the `.wwebjs_auth` folder and re-authenticate

## Security Notes

- Your WhatsApp session is stored locally
- Never share your session files
- The application only sends messages, it doesn't read incoming messages

## Future Enhancements

- GUI interface
- Message templates
- Scheduling
- Contact management
