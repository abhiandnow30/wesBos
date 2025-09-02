# Quick Start Guide - DocuSign JWT Integration

## 🚀 Get Started in 5 Minutes

### 1. Setup Your Credentials

Copy the environment template and add your DocuSign credentials:

```bash
cp env.example .env
```

Edit `.env` with your actual credentials:

```env
INTEGRATION_KEY=your_integration_key_here
USER_ID=your_user_id_guid_here
PRIVATE_KEY_PATH=./private_key.pem
AUTH_SERVER=https://account-d.docusign.com
```

### 2. Add Your Private Key

**Option A: Private Key File**
- Save your RSA private key as `private_key.pem` in the project root

**Option B: Environment Variable**
- Add your private key to `.env`:
```env
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
```

### 3. Test Authentication

```bash
node index.js --test-auth
```

If you see "Consent required", visit the provided URL to grant consent.

### 4. Send Your First Document

```bash
node index.js
```

This will send a sample document for signature and display the envelope ID.

## 📋 What You Need

- **Integration Key**: From your DocuSign developer account
- **User ID**: Your API User ID (GUID)
- **Private Key**: Your RSA private key for JWT signing
- **Document**: PDF file to send for signature

## 🔧 Customization

### Send Your Own Document

Edit `index.js` and change these lines:

```javascript
const documentPath = './your-document.pdf';
const recipientName = 'Your Recipient Name';
const recipientEmail = 'recipient@example.com';
```

### Use the API Programmatically

```javascript
const DocuSignAuth = require('./docusign-auth');
const DocuSignAPI = require('./docusign-api');

async function sendDocument() {
    const auth = new DocuSignAuth();
    await auth.getUserInfo();
    
    const api = new DocuSignAPI(auth);
    const result = await api.createEnvelope(
        './document.pdf',
        'Recipient Name',
        'recipient@email.com'
    );
    
    console.log('Envelope ID:', result.envelopeId);
}
```

## 🎯 Expected Output

When successful, you'll see:

```
🚀 Starting DocuSign JWT Integration...

📋 Step 1: Initializing authentication...
🔐 Step 2: Authenticating with DocuSign...
✅ Successfully obtained access token
✅ User info retrieved - Account ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
✅ Base URI: https://demo.docusign.net
🔧 Step 3: Initializing API client...
📄 Step 4: Creating envelope...
✅ Envelope created successfully!
📄 Envelope ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
📧 Sent to: recipient@email.com

🎉 Workflow completed successfully!
==================================================
📄 Envelope ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
📧 Recipient: Recipient Name (recipient@email.com)
📋 Status: sent
==================================================
```

## 🆘 Troubleshooting

### "Consent required" Error
1. Visit the provided consent URL
2. Log in with your DocuSign account
3. Grant consent to your integration
4. Run the script again

### "Private key not found" Error
- Ensure your private key file exists at the specified path
- Or set the `PRIVATE_KEY` environment variable correctly

### "Invalid integration key" Error
- Verify your integration key is correct
- Ensure you're using the sandbox integration key for testing

## 📚 Next Steps

- Read the full `README.md` for detailed documentation
- Check `example.js` for advanced usage examples
- Explore the DocuSign API documentation for more features

## 🔗 Useful Links

- [DocuSign Developer Center](https://developers.docusign.com/)
- [JWT Grant Documentation](https://developers.docusign.com/platform/auth/jwt/)
- [Envelope API Reference](https://developers.docusign.com/esign-rest-api/reference/Envelopes/)
