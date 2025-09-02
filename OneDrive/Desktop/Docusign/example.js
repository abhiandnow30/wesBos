const DocuSignAuth = require('./docusign-auth');
const DocuSignAPI = require('./docusign-api');

/**
 * Example: Send a custom document for signature
 */
async function sendCustomDocument() {
    try {
        console.log('📋 Example: Sending custom document for signature\n');

        // Initialize authentication
        const auth = new DocuSignAuth();
        await auth.getUserInfo();

        // Initialize API
        const api = new DocuSignAPI(auth);

        // Custom parameters
        const customParams = {
            documentPath: './your-document.pdf',  // Change this to your document path
            recipientName: 'Jane Smith',
            recipientEmail: 'jane.smith@example.com',
            emailSubject: 'Please sign the contract',
            emailBlurb: 'This is an important contract that requires your signature.'
        };

        console.log('📄 Sending document with custom parameters:');
        console.log(`   Document: ${customParams.documentPath}`);
        console.log(`   Recipient: ${customParams.recipientName} (${customParams.recipientEmail})`);
        console.log(`   Subject: ${customParams.emailSubject}\n`);

        // Create envelope with custom parameters
        const result = await api.createEnvelope(
            customParams.documentPath,
            customParams.recipientName,
            customParams.recipientEmail
        );

        console.log('✅ Custom document sent successfully!');
        console.log(`📄 Envelope ID: ${result.envelopeId}`);

        return result;

    } catch (error) {
        console.error('❌ Error sending custom document:', error.message);
        throw error;
    }
}

/**
 * Example: Send to multiple recipients
 */
async function sendToMultipleRecipients() {
    try {
        console.log('📋 Example: Sending to multiple recipients\n');

        const auth = new DocuSignAuth();
        await auth.getUserInfo();
        const api = new DocuSignAPI(auth);

        // This would require modifying the API to support multiple recipients
        // For now, we'll send separate envelopes
        const recipients = [
            { name: 'John Doe', email: 'john.doe@example.com' },
            { name: 'Jane Smith', email: 'jane.smith@example.com' },
            { name: 'Bob Johnson', email: 'bob.johnson@example.com' }
        ];

        const documentPath = './contract.pdf';

        for (const recipient of recipients) {
            console.log(`📧 Sending to ${recipient.name} (${recipient.email})...`);
            
            const result = await api.createEnvelope(
                documentPath,
                recipient.name,
                recipient.email
            );

            console.log(`✅ Sent to ${recipient.name} - Envelope ID: ${result.envelopeId}`);
        }

    } catch (error) {
        console.error('❌ Error sending to multiple recipients:', error.message);
        throw error;
    }
}

/**
 * Example: Check envelope status
 */
async function checkEnvelopeStatus(envelopeId) {
    try {
        console.log(`📋 Example: Checking envelope status for ${envelopeId}\n`);

        const auth = new DocuSignAuth();
        await auth.getUserInfo();
        const api = new DocuSignAPI(auth);

        const status = await api.getEnvelopeStatus(envelopeId);
        
        console.log('📊 Envelope Status:');
        console.log(`   Envelope ID: ${status.envelopeId}`);
        console.log(`   Status: ${status.status}`);
        console.log(`   Created: ${new Date(status.created).toLocaleString()}`);
        console.log(`   Last Modified: ${new Date(status.lastModified).toLocaleString()}`);

        return status;

    } catch (error) {
        console.error('❌ Error checking envelope status:', error.message);
        throw error;
    }
}

// Export functions for use in other scripts
module.exports = {
    sendCustomDocument,
    sendToMultipleRecipients,
    checkEnvelopeStatus
};

// Run example if this file is executed directly
if (require.main === module) {
    console.log('🚀 DocuSign Integration Examples\n');
    
    // Uncomment the example you want to run:
    
    // sendCustomDocument();
    // sendToMultipleRecipients();
    // checkEnvelopeStatus('your-envelope-id-here');
    
    console.log('💡 Uncomment an example function above to run it!');
}
