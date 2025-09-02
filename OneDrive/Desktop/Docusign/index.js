const DocuSignAuth = require('./docusign-auth');
const DocuSignAPI = require('./docusign-api');
const path = require('path');

/**
 * Main DocuSign Integration Workflow
 */
async function main() {
    try {
        console.log('🚀 Starting DocuSign JWT Integration...\n');

        // Step 1: Initialize authentication
        console.log('📋 Step 1: Initializing authentication...');
        const auth = new DocuSignAuth();

        // Step 2: Get user info (includes JWT generation and OAuth token exchange)
        console.log('🔐 Step 2: Authenticating with DocuSign...');
        const userInfo = await auth.getUserInfo();

        // Step 3: Initialize API client
        console.log('🔧 Step 3: Initializing API client...');
        const api = new DocuSignAPI(auth);

        // Step 4: Create and send envelope
        console.log('📄 Step 4: Creating envelope...');
        
        // Example document path - you can modify this
        const documentPath = './sample-document.pdf';
        const recipientName = 'John Doe';
        const recipientEmail = 'john.doe@example.com';

        // Check if sample document exists, if not create a placeholder
        if (!require('fs').existsSync(documentPath)) {
            console.log('⚠️  Sample document not found. Creating a placeholder...');
            createSampleDocument();
        }

        const envelopeResult = await api.createEnvelope(documentPath, recipientName, recipientEmail);

        // Step 5: Display results
        console.log('\n🎉 Workflow completed successfully!');
        console.log('='.repeat(50));
        console.log(`📄 Envelope ID: ${envelopeResult.envelopeId}`);
        console.log(`📧 Recipient: ${recipientName} (${recipientEmail})`);
        console.log(`📋 Status: ${envelopeResult.status}`);
        console.log('='.repeat(50));

        // Optional: Get envelope status
        console.log('\n📊 Getting envelope status...');
        const status = await api.getEnvelopeStatus(envelopeResult.envelopeId);
        console.log(`📈 Current Status: ${status.status}`);
        console.log(`📅 Created: ${new Date(status.created).toLocaleString()}`);

    } catch (error) {
        console.error('\n❌ Error occurred:');
        console.error(error.message);
        
        if (error.message.includes('Consent required')) {
            console.log('\n💡 To resolve consent issues:');
            console.log('1. Visit the consent URL provided above');
            console.log('2. Log in with your DocuSign account');
            console.log('3. Grant consent to your integration');
            console.log('4. Run this script again');
        }
        
        process.exit(1);
    }
}

/**
 * Create a sample PDF document for testing
 */
function createSampleDocument() {
    const fs = require('fs');
    
    // Create a simple text file as a placeholder
    const sampleContent = `Sample Document for DocuSign Testing

This is a sample document that will be sent for signature.

Please sign below:
/signHere/

Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

Thank you for using DocuSign!`;

    fs.writeFileSync('./sample-document.txt', sampleContent);
    console.log('✅ Created sample-document.txt as placeholder');
    
    // Update the document path for the rest of the workflow
    global.sampleDocumentPath = './sample-document.txt';
}

/**
 * Utility function to test authentication only
 */
async function testAuth() {
    try {
        console.log('🧪 Testing authentication only...');
        const auth = new DocuSignAuth();
        const userInfo = await auth.getUserInfo();
        
        console.log('✅ Authentication successful!');
        console.log(`Account ID: ${userInfo.accountId}`);
        console.log(`Base URI: ${userInfo.baseUri}`);
        
    } catch (error) {
        console.error('❌ Authentication failed:', error.message);
        process.exit(1);
    }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--test-auth')) {
    testAuth();
} else {
    main();
}

module.exports = { main, testAuth };
