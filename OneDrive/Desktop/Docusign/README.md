# DocuSign JWT Integration

A complete Node.js workflow for DocuSign API integration using JWT (JSON Web Token) authentication. This project demonstrates how to authenticate with DocuSign using JWT and send documents for signature.

## Features

- ✅ JWT token generation and OAuth 2.0 authentication
- ✅ Automatic consent URL handling
- ✅ Document encoding and envelope creation
- ✅ Signature placement using anchor text
- ✅ Comprehensive error handling
- ✅ Environment-based configuration

## Prerequisites

1. **DocuSign Developer Account**: You need a DocuSign developer account with:
   - Integration Key (Client ID)
   - API User ID (GUID)
   - RSA Keypair (Public Key + Private Key)

2. **Node.js**: Version 14 or higher

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and configure your credentials:

```bash
cp env.example .env
```

Edit `.env` file with your DocuSign credentials:

```env
# DocuSign Integration Credentials
INTEGRATION_KEY=your_integration_key_here
USER_ID=your_user_id_guid_here
PRIVATE_KEY_PATH=./private_key.pem
AUTH_SERVER=https://account-d.docusign.com

# Optional: Direct private key (alternative to PRIVATE_KEY_PATH)
# PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
```

### 3. Private Key Setup

You have two options for providing your private key:

**Option A: Private Key File**
- Save your RSA private key as `private_key.pem` in the project root
- Set `PRIVATE_KEY_PATH=./private_key.pem` in your `.env` file

**Option B: Environment Variable**
- Set your private key directly in the `PRIVATE_KEY` environment variable
- Make sure to include the full key including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`

### 4. Grant Consent (First Time Only)

If this is your first time using the integration, you'll need to grant consent:

1. Run the application: `npm start`
2. If you see a "Consent required" error, visit the provided URL
3. Log in with your DocuSign account
4. Grant consent to your integration
5. Run the application again

## Usage

### Basic Usage

```bash
# Run the complete workflow
npm start

# Or run directly with Node
node index.js
```

### Test Authentication Only

```bash
# Test authentication without sending documents
node index.js --test-auth
```

### Custom Document

To send your own document, modify the `index.js` file:

```javascript
const documentPath = './your-document.pdf';
const recipientName = 'Recipient Name';
const recipientEmail = 'recipient@example.com';
```

## Workflow Steps

The application follows this workflow:

1. **Initialize Authentication**: Load configuration and validate credentials
2. **Generate JWT**: Create JWT token signed with your RSA private key
3. **Exchange for OAuth Token**: Use JWT to get OAuth 2.0 access token
4. **Get User Info**: Retrieve accountId and base_uri from `/oauth/userinfo`
5. **Create Envelope**: Send document for signature with signature tab placement
6. **Display Results**: Show envelope ID and status

## API Endpoints Used

- `POST /oauth/token` - Exchange JWT for access token
- `GET /oauth/userinfo` - Get user account information
- `POST /restapi/v2.1/accounts/{accountId}/envelopes` - Create and send envelope
- `GET /restapi/v2.1/accounts/{accountId}/envelopes/{envelopeId}` - Get envelope status

## File Structure

```
├── index.js              # Main application entry point
├── config.js             # Configuration and environment loading
├── docusign-auth.js      # JWT authentication and OAuth handling
├── docusign-api.js       # DocuSign API operations
├── package.json          # Dependencies and scripts
├── env.example           # Environment variables template
├── README.md             # This file
└── private_key.pem       # Your RSA private key (not included in repo)
```

## Error Handling

The application handles common errors:

- **Consent Required**: Provides consent URL for first-time setup
- **Invalid Credentials**: Validates configuration before making API calls
- **Network Errors**: Comprehensive error messages for debugging
- **File Not Found**: Creates placeholder document if sample doesn't exist

## Security Notes

- Never commit your private key or `.env` file to version control
- Use environment variables for sensitive configuration
- The private key is loaded securely and not logged
- All API calls use HTTPS

## Troubleshooting

### Common Issues

1. **"Consent required" error**
   - Visit the provided consent URL
   - Log in with your DocuSign account
   - Grant consent to your integration

2. **"Private key not found" error**
   - Ensure your private key file exists at the specified path
   - Or set the `PRIVATE_KEY` environment variable

3. **"Invalid integration key" error**
   - Verify your integration key is correct
   - Ensure you're using the sandbox integration key for testing

4. **"User ID not found" error**
   - Verify your API User ID (GUID) is correct
   - Ensure the user has proper permissions

### Debug Mode

To see more detailed error information, you can modify the axios calls to include debug logging:

```javascript
// Add to any axios call for debugging
.then(response => {
    console.log('Response:', response.data);
    return response;
})
.catch(error => {
    console.log('Error response:', error.response?.data);
    throw error;
});
```

## License

MIT License - feel free to use this code for your own projects.

## Support

For DocuSign API support, visit the [DocuSign Developer Center](https://developers.docusign.com/).
