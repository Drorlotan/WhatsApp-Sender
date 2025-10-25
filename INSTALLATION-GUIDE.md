# 📱 WhatsApp Bulk Messenger - Easy Installation Guide

## 🚀 For Non-Programmers (Easiest Method)

### **What You Need:**
1. **Windows computer** (Windows 10 or 11)
2. **Internet connection** (for one-time setup)
3. **Your phone** (to scan QR code)

### **Step 1: Download and Install Node.js**
1. Go to: https://nodejs.org/
2. Click the **green "LTS" button** (recommended version)
3. Download and run the installer
4. **Keep clicking "Next"** until installation is complete
5. **Restart your computer** when prompted

### **Step 2: Download the WhatsApp Sender**
1. Download the WhatsApp-Sender folder from GitHub
2. Extract it to your Desktop or Documents folder

### **Step 3: Install the Application**
1. **Double-click** the `install.bat` file
2. Wait for installation to complete (may take 2-3 minutes)
3. You'll see "Installation completed successfully!"

### **Step 4: Prepare Your Files**
Create these 3 files in the same folder:

#### **📄 contacts.csv** (Phone Numbers)
```
+1234567890,John Doe,Company
+9876543210,Jane Smith,Company
+5555555555,Bob Johnson,Company
```

#### **📝 message.txt** (Your Message)
```
Hello! This is a test message.
We hope you're doing well!
Best regards,
Your Team
```

#### **🖼️ image.jpg** (Your Image)
- Any JPG or PNG image file

### **Step 5: Run the Application**
1. **Double-click** `run-whatsapp-sender.bat`
2. Follow the on-screen instructions
3. **Scan the QR code** with your WhatsApp when prompted
4. Wait for messages to be sent!

## 🎯 **Alternative: One-Click Executable (Coming Soon)**

For even easier distribution, we can create a single .exe file that includes everything.

## ❓ **Troubleshooting**

### **"Node.js not found" Error:**
- Make sure you installed Node.js from nodejs.org
- Restart your computer after installation

### **"File not found" Error:**
- Make sure all files (CSV, text, image) are in the same folder
- Check file names are correct

### **QR Code Issues:**
- Make sure your phone has WhatsApp installed
- Use the same WhatsApp account you want to send from

## 📞 **Need Help?**
- Check the README.md file for detailed instructions
- Make sure all files are in the same folder
- Try the example files first to test

## ✅ **What You'll See When It Works:**
```
============================================================
🚀 WELCOME TO WHATSAPP BULK MESSENGER 🚀
============================================================
📱 Send bulk WhatsApp messages with text and images
🔒 Secure • Fast • Reliable
============================================================

📋 Configuration:
📄 CSV file: contacts.csv
📝 Text file: message.txt
🖼️  Image file: image.jpg
💬 Message preview: Hello! This is a test message...

🚀 Initializing WhatsApp client...
🔐 WhatsApp authenticated successfully
✅ WhatsApp client is ready!
📋 Found 3 phone numbers in CSV
📤 Starting to send messages to 3 numbers...
...
✅ Sent successfully to +1234567890
✅ Sent successfully to +9876543210
✅ Sent successfully to +5555555555

==================================================
📊 FINAL REPORT
==================================================
📋 Total numbers processed: 3
✅ Successfully sent: 3
❌ Failed to send: 0
==================================================
```

**That's it! You're ready to send bulk WhatsApp messages! 🎉**
