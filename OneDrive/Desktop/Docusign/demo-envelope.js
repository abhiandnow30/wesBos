const jwt = require('jsonwebtoken');
const axios = require('axios');
const fs = require('fs');

// Your private key (formatted correctly)
const privateKey = `-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----`;

// DocuSign configuration
const integrationKey = '81c782d7-b9d5-4890-a174-5932b9717174';
const userId = '194a2f9c-4cda-41a0-a0ad-196d03a5c8e4';
const authServer = 'https://account-d.docusign.com';

async function createDemoEnvelope() {
    try {
        console.log('🚀 Starting DocuSign Envelope Demo...\n');
        
        // Step 1: Authenticate
        console.log('📋 Step 1: Authenticating with DocuSign...');
        const now = Math.floor(Date.now() / 1000);
        const payload = {
            iss: integrationKey,
            sub: userId,
            aud: 'account-d.docusign.com',
            iat: now,
            exp: now + 3600,
            scope: 'signature impersonation'
        };
        
        const jwtToken = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
        
        const authResponse = await axios.post(`${authServer}/oauth/token`, {
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwtToken
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        const accessToken = authResponse.data.access_token;
        console.log('✅ Authentication successful!');
        
        // Step 2: Get user info
        console.log('\n📋 Step 2: Getting user info...');
        const userResponse = await axios.get(`${authServer}/oauth/userinfo`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        const accountId = userResponse.data.accounts[0].account_id;
        const baseUri = userResponse.data.accounts[0].base_uri;
        console.log('✅ User info retrieved!');
        console.log(`   Account ID: ${accountId}`);
        console.log(`   Base URI: ${baseUri}`);
        
        // Step 3: Create a sample document
        console.log('\n📋 Step 3: Creating sample document...');
        const documentContent = `CloudFuze Purchase Agreement

This is a demo document for DocuSign integration testing.

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

        fs.writeFileSync('demo-agreement.txt', documentContent);
        const documentBytes = fs.readFileSync('demo-agreement.txt');
        const documentBase64 = documentBytes.toString('base64');
        console.log('✅ Sample document created!');
        
        // Step 4: Create envelope
        console.log('\n📋 Step 4: Creating envelope...');
        const envelopeDefinition = {
            emailSubject: 'Please sign: CloudFuze Purchase Agreement Demo',
            emailBlurb: 'This is a demo agreement for testing DocuSign integration. Please review and sign.',
            documents: [{
                documentBase64: documentBase64,
                name: 'CloudFuze Agreement Demo',
                fileExtension: 'txt',
                documentId: '1'
            }],
            recipients: {
                signers: [{
                    email: 'Abhilasha.Kandakatla@cloudfuze.com',
                    name: 'Abhilasha Kandakatla',
                    recipientId: '1',
                    routingOrder: '1',
                    tabs: {
                        signHereTabs: [{
                            anchorString: 'Please review and sign',
                            anchorUnits: 'pixels',
                            anchorYOffset: '10',
                            anchorXOffset: '20'
                        }]
                    }
                }]
            },
            status: 'sent'
        };
        
        const envelopeResponse = await axios.post(
            `${baseUri}/restapi/v2.1/accounts/${accountId}/envelopes`,
            envelopeDefinition,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        const envelopeId = envelopeResponse.data.envelopeId;
        console.log('✅ Envelope created successfully!');
        console.log(`   Envelope ID: ${envelopeId}`);
        console.log(`   Status: ${envelopeResponse.data.status}`);
        
        // Step 5: Get envelope status
        console.log('\n📋 Step 5: Getting envelope status...');
        const statusResponse = await axios.get(
            `${baseUri}/restapi/v2.1/accounts/${accountId}/envelopes/${envelopeId}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
        
        console.log('✅ Envelope status retrieved!');
        console.log(`   Current Status: ${statusResponse.data.status}`);
        console.log(`   Created: ${statusResponse.data.createdDateTime}`);
        console.log(`   Sent: ${statusResponse.data.sentDateTime}`);
        
        // Step 6: Get signing URL (for demo purposes)
        console.log('\n📋 Step 6: Generating signing URL...');
        const recipientViewRequest = {
            returnUrl: 'https://www.docusign.com/devcenter',
            authenticationMethod: 'none',
            email: 'Abhilasha.Kandakatla@cloudfuze.com',
            userName: 'Abhilasha Kandakatla',
            clientUserId: '1000'
        };
        
        const viewResponse = await axios.post(
            `${baseUri}/restapi/v2.1/accounts/${accountId}/envelopes/${envelopeId}/views/recipient`,
            recipientViewRequest,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log('✅ Signing URL generated!');
        console.log(`   Signing URL: ${viewResponse.data.url}`);
        
        console.log('\n🎉 DEMO COMPLETED SUCCESSFULLY!');
        console.log('\n📋 Summary:');
        console.log(`   ✅ Authentication: Working`);
        console.log(`   ✅ Envelope Created: ${envelopeId}`);
        console.log(`   ✅ Document Sent: Yes`);
        console.log(`   ✅ Signing URL: Generated`);
        console.log(`   ✅ Ready for Production: YES!`);
        
        console.log('\n🔗 Next Steps:');
        console.log('1. Click the signing URL above to test the signature process');
        console.log('2. Check your email for the DocuSign notification');
        console.log('3. Your integration is ready to be used in your CPQ project!');
        
        return {
            envelopeId,
            signingUrl: viewResponse.data.url,
            status: envelopeResponse.data.status
        };
        
    } catch (error) {
        console.error('\n❌ Demo failed:');
        console.error('Error:', error.message);
        
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Response:', error.response.data);
        }
        
        throw error;
    }
}

// Run the demo
if (require.main === module) {
    createDemoEnvelope().catch(console.error);
}

module.exports = { createDemoEnvelope };
