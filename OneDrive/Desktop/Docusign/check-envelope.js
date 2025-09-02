const jwt = require('jsonwebtoken');
const axios = require('axios');

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
const envelopeId = 'd1b03d9e-6d23-4f42-924d-3dcd77635989';

async function checkEnvelopeStatus() {
    try {
        console.log('🔍 Checking envelope status...\n');
        
        // Step 1: Authenticate
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
        
        // Step 2: Get user info
        const userResponse = await axios.get(`${authServer}/oauth/userinfo`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        const accountId = userResponse.data.accounts[0].account_id;
        const baseUri = userResponse.data.accounts[0].base_uri;
        
        // Step 3: Check envelope status
        const statusResponse = await axios.get(
            `${baseUri}/restapi/v2.1/accounts/${accountId}/envelopes/${envelopeId}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
        
        console.log('📋 Envelope Status:');
        console.log(`   Envelope ID: ${statusResponse.data.envelopeId}`);
        console.log(`   Status: ${statusResponse.data.status}`);
        console.log(`   Created: ${statusResponse.data.createdDateTime}`);
        console.log(`   Sent: ${statusResponse.data.sentDateTime}`);
        console.log(`   Delivered: ${statusResponse.data.deliveredDateTime || 'Not delivered yet'}`);
        console.log(`   Signed: ${statusResponse.data.completedDateTime || 'Not signed yet'}`);
        
        // Step 4: Get recipient status
        const recipientsResponse = await axios.get(
            `${baseUri}/restapi/v2.1/accounts/${accountId}/envelopes/${envelopeId}/recipients`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
        
        console.log('\n👥 Recipients:');
        recipientsResponse.data.signers.forEach(signer => {
            console.log(`   Email: ${signer.email}`);
            console.log(`   Name: ${signer.name}`);
            console.log(`   Status: ${signer.status}`);
            console.log(`   Signed: ${signer.signedDateTime || 'Not signed yet'}`);
            console.log('');
        });
        
        // Step 5: Check if document can be downloaded
        console.log('📄 Document Status:');
        try {
            const documentResponse = await axios.get(
                `${baseUri}/restapi/v2.1/accounts/${accountId}/envelopes/${envelopeId}/documents/1`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                    responseType: 'arraybuffer'
                }
            );
            console.log(`   Document available: Yes (${documentResponse.data.length} bytes)`);
        } catch (docError) {
            console.log(`   Document available: No (${docError.response?.status || 'Unknown error'})`);
        }
        
    } catch (e) {
        console.error('❌ Error:', e.response?.data || e.message);
    }
}

checkEnvelopeStatus();
