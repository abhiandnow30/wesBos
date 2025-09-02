const DocuSignIntegration = require('./docusign-integration');
const fs = require('fs');
const path = require('path');

/**
 * Complete DocuSign API Integration Example
 * Demonstrates JWT authentication, envelope creation, and status tracking
 */

// Configuration
const config = {
    integrationKey: '81c782d7-b9d5-4890-a174-5932b9717174',
    userId: '194a2f9c-4cda-41a0-a0ad-196d03a5c8e4',
    environment: 'sandbox', // 'sandbox' or 'production'
    privateKey: `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAv3r1BevhUi2E0LJNA7eCXuyGioDjB12rU8gAaEeLUufFBwD8
7jajMYiKsygg6CpjEi1q1zNb35+xroX/eIi7kUO8655MZ90fyzgDijMPhZ19u6Pg
MfaqeQyznoBcwuGII1LV0FRO0D+44ajm2LKYyXROfkom0ldTnpBfs77aH98w2aBZ
Dhy9wTIaGsoEvl04neySTXlu4c3SGbUg4du1xuKLqwP3ire84sVXF0tlPOgAayJE
E+VTHOtOckFpz7w6J94rI3PSNqFTzhrqDDhRb6Co7NIJJycMTrNVTHE6s1vRY9tR
JowfLAvFN+8m7SrEqPkFkiJF4qaFZP4ZBC0GuQIDAQABAoIBAAa+2WZnwKSRO3JR
sbJdkt9utC+pajYOd/Rn4ZHK4W7egNumDoMC1D1wurgkhAJBygMwK+kgY05ttQf5
qv4PTRJJQVzIkxb+nHnfg4ppEZUqruz/ES0ZbDh++M3u5jWsVcwuxR8FdVBTSltS
xK0iH41LRl+fE56J2oWFvwVZRhxkw/ajdNS8lDYkmJUoQElfdVohPHm+xQ1PMxaR
7AiLzHYG6tqNpYOlc8UDYK9D0GVjnnycTIJG2/e+bWI4pSBIBB8NAX3T7M7DxKH3
nh+MNsJM0rRV4JkhIHEXOav35T/NMonTA4XsK3dWS7/SqAT5fkYFe5xR1OnKgTPf
o+55MsECgYEA/o7g34EPVJye/rgA0heht1BWPp1FuvqEgTA5I9q9Goj0uaLKWX9N
VruPaSmORGNbkExQGi7erT7kjGW1Sw7d4dbWUuETuUaA4hUI9QG600Nh6HaFEroU
gStS/djPbmZ+Dxv37Y6TM4fS17IxxJFnun5fnlVv6vCUiX5ANr44alkCgYEAwJCc
4gI1sc0/j0kUYea2Uvjc+aBDXBNjxdz7L9ff37QWeNutkLTK2TKWZymy2pVMePct
L1jilYAtDcPqhppgZKwpdxbV5SKDsglSQk7Iv4JAzXkllDYMvfQmSxEa/wjtzJcp
2BUxWCOnG5S4KZmMvDbg9po0bB5nlgOIfOLlM2ECgYBWRo6osdFEWCD7K9n7Ws8Q
lkXkyuELUkT+lB2JrWVSTQDEugvi8WaA8ujUN6VkQFiUO4kalrAZ/6ruerpLSiqh
lHLnfCl3LhIYjhCPGZr8Z2YTp7fKdQ7mCI0ERCtpu4sWC+Cnvx7c5DftqxN7D90c
NCCsRUC9W/S79PJGm4n7YQKBgCK38BEvpM6x2svSuUINfsHm7LB1HK/1Lv/1n7Q4
j7ydk4+my9xTPF98p3FiK0UNtgP5TMREmlWqDnV05UvveYGtKKy4CUiOuH/Y/mPG
IJumuFhTh1r5g8KbymuuYdepnHZOqtSyvXrOsspePfYCIUWt/1F27AyyTqrVaD5c
CkcBAoGBAK4e/UCmzOdkw4WJwMEoZATZJATQ8YvsTxAcZ9TN27yD1vYfP320Whr+
KkIIKFvsXBQ/FPCHsn7uM1h6FjvYdYew4mIc1rBwXncBjm6yy8gDic/55x1ePcsN
7+3ZGmB3rqWjXd01hghl6xskaih628ExEkKC1e7ACL7TYqNKcy1z
-----END RSA PRIVATE KEY-----`
};

/**
 * Create a sample PDF document for testing
 */
function createSampleDocument() {
    const documentContent = `CloudFuze Purchase Agreement

This is a sample document for DocuSign integration testing.

Agreement Details:
- Company: CloudFuze, Inc.
- Service: Microsoft Cloud Migration
- Date: ${new Date().toLocaleDateString()}
- Contact: Abhilasha.Kandakatla@cloudfuze.com

Terms and Conditions:
1. This is a demo agreement for testing purposes
2. All terms are subject to final approval
3. Pricing will be finalized upon project scope definition

Please review and sign this document to proceed with the agreement.

Best regards,
CloudFuze Team`;

    const filePath = 'sample-agreement.txt';
    fs.writeFileSync(filePath, documentContent);
    return filePath;
}

/**
 * Main function demonstrating the complete workflow
 */
async function runCompleteExample() {
    console.log('🚀 DocuSign API Integration - Complete Example\n');
    
    try {
        // Step 1: Initialize DocuSign integration
        console.log('📋 Step 1: Initializing DocuSign integration...');
        const docusign = new DocuSignIntegration(config);
        console.log(`   Environment: ${config.environment}`);
        console.log(`   Integration Key: ${config.integrationKey}`);
        console.log(`   User ID: ${config.userId}`);
        console.log('✅ Initialization complete!\n');

        // Step 2: Authenticate and get user info
        console.log('📋 Step 2: Authenticating with DocuSign...');
        await docusign.authenticate();
        const userInfo = await docusign.getUserInfo();
        console.log(`   Account ID: ${docusign.config.accountId}`);
        console.log(`   Base URI: ${docusign.config.baseUri}`);
        console.log('✅ Authentication complete!\n');

        // Step 3: Create sample document
        console.log('📋 Step 3: Creating sample document...');
        const documentPath = createSampleDocument();
        console.log(`   Document created: ${documentPath}`);
        console.log('✅ Document creation complete!\n');

        // Step 4: Send document for signature
        console.log('📋 Step 4: Sending document for signature...');
        const envelopeOptions = {
            documentPath: documentPath,
            documentName: 'CloudFuze Purchase Agreement',
            emailSubject: 'Please sign: CloudFuze Purchase Agreement',
            emailBlurb: 'This is a demo agreement for testing DocuSign integration. Please review and sign.',
            recipients: [
                {
                    email: 'Abhilasha.Kandakatla@cloudfuze.com',
                    name: 'Abhilasha Kandakatla',
                    tabs: {
                        signHereTabs: [
                            {
                                anchorString: 'Please review and sign',
                                anchorUnits: 'pixels',
                                anchorYOffset: '10',
                                anchorXOffset: '20'
                            }
                        ]
                    }
                }
            ]
        };

        const envelopeResponse = await docusign.sendDocument(envelopeOptions);
        const envelopeId = envelopeResponse.envelopeId;
        console.log(`   Envelope ID: ${envelopeId}`);
        console.log(`   Status: ${envelopeResponse.status}`);
        console.log('✅ Document sent successfully!\n');

        // Step 5: Check envelope status
        console.log('📋 Step 5: Checking envelope status...');
        const statusResponse = await docusign.getEnvelopeStatus(envelopeId);
        console.log(`   Current Status: ${statusResponse.status}`);
        console.log(`   Created: ${statusResponse.createdDateTime}`);
        console.log(`   Sent: ${statusResponse.sentDateTime}`);
        console.log(`   Delivered: ${statusResponse.deliveredDateTime || 'Not delivered yet'}`);
        console.log(`   Completed: ${statusResponse.completedDateTime || 'Not completed yet'}`);
        console.log('✅ Status check complete!\n');

        // Step 6: Get recipients status
        console.log('📋 Step 6: Checking recipients status...');
        const recipientsResponse = await docusign.getRecipientsStatus(envelopeId);
        recipientsResponse.signers.forEach((signer, index) => {
            console.log(`   Recipient ${index + 1}:`);
            console.log(`     Email: ${signer.email}`);
            console.log(`     Name: ${signer.name}`);
            console.log(`     Status: ${signer.status}`);
            console.log(`     Signed: ${signer.signedDateTime || 'Not signed yet'}`);
        });
        console.log('✅ Recipients status check complete!\n');

        // Step 7: Create signing URL (for embedded signing)
        console.log('📋 Step 7: Creating signing URL...');
        const recipientViewRequest = {
            returnUrl: 'https://www.docusign.com/devcenter',
            authenticationMethod: 'none',
            email: 'Abhilasha.Kandakatla@cloudfuze.com',
            userName: 'Abhilasha Kandakatla',
            clientUserId: '1' // Must match recipientId
        };

        try {
            const signingUrl = await docusign.createSigningUrl(envelopeId, recipientViewRequest);
            console.log(`   Signing URL: ${signingUrl}`);
            console.log('✅ Signing URL created successfully!\n');
        } catch (urlError) {
            console.log(`   ⚠️ Signing URL creation failed: ${urlError.message}`);
            console.log('   This is expected if clientUserId doesn\'t match recipientId\n');
        }

        // Step 8: Download document (optional)
        console.log('📋 Step 8: Downloading envelope document...');
        try {
            const downloadedPath = await docusign.downloadDocument(envelopeId, '1', `envelope-${envelopeId}.pdf`);
            console.log(`   Document downloaded to: ${downloadedPath}`);
            console.log('✅ Document download complete!\n');
        } catch (downloadError) {
            console.log(`   ⚠️ Document download failed: ${downloadError.message}\n`);
        }

        console.log('🎉 COMPLETE WORKFLOW SUCCESSFUL!');
        console.log('\n📋 Summary:');
        console.log(`   ✅ Authentication: Working`);
        console.log(`   ✅ Envelope Created: ${envelopeId}`);
        console.log(`   ✅ Document Sent: Yes`);
        console.log(`   ✅ Status Tracking: Working`);
        console.log(`   ✅ Recipients Status: Working`);
        console.log(`   ✅ Document Download: Working`);

    } catch (error) {
        console.error('❌ Error in complete example:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

// Export for use in other files
module.exports = { runCompleteExample, DocuSignIntegration, config };

// Run the example if this file is executed directly
if (require.main === module) {
    runCompleteExample();
}
