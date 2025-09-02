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

async function debugAuth() {
    try {
        console.log('🔍 Debugging DocuSign Authentication...');
        console.log('📋 Configuration:');
        console.log('  - Integration Key:', integrationKey);
        console.log('  - User ID:', userId);
        console.log('  - Auth Server:', authServer);
        
        // Generate JWT
        const now = Math.floor(Date.now() / 1000);
        const payload = {
            iss: integrationKey,
            sub: userId,
            aud: 'account-d.docusign.com',
            iat: now,
            exp: now + 3600,
            scope: 'signature impersonation'
        };

        console.log('\n📋 JWT Payload:', JSON.stringify(payload, null, 2));
        
        const jwtToken = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
        console.log('✅ JWT generated successfully');
        console.log('🔑 JWT (first 100 chars):', jwtToken.substring(0, 100) + '...');
        
        // Try to exchange JWT for access token
        console.log('\n🔄 Exchanging JWT for access token...');
        
        const response = await axios.post(`${authServer}/oauth/token`, {
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwtToken
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        console.log('✅ Access token obtained successfully!');
        console.log('🔑 Access Token:', response.data.access_token.substring(0, 50) + '...');
        console.log('⏰ Expires In:', response.data.expires_in, 'seconds');
        
        // Get user info
        console.log('\n👤 Getting user info...');
        const userResponse = await axios.get(`${authServer}/oauth/userinfo`, {
            headers: {
                'Authorization': `Bearer ${response.data.access_token}`
            }
        });

        console.log('✅ User info retrieved:');
        console.log('  - Account ID:', userResponse.data.accounts[0].account_id);
        console.log('  - Base URI:', userResponse.data.accounts[0].base_uri);
        console.log('  - Name:', userResponse.data.name);
        console.log('  - Email:', userResponse.data.email);
        
        return {
            accessToken: response.data.access_token,
            accountId: userResponse.data.accounts[0].account_id,
            baseUri: userResponse.data.accounts[0].base_uri
        };
        
    } catch (error) {
        console.error('\n❌ Authentication failed:');
        console.error('Error:', error.message);
        
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Response:', error.response.data);
            
            if (error.response.data.error === 'invalid_grant' && error.response.data.error_description === 'user_not_found') {
                console.log('\n💡 Troubleshooting tips:');
                console.log('1. Verify the USER_ID is correct for your DocuSign account');
                console.log('2. Make sure you granted consent with the same account');
                console.log('3. Check if the integration key matches your DocuSign app');
                console.log('4. Try visiting the consent URL again');
            }
        }
        
        throw error;
    }
}

// Run the debug
if (require.main === module) {
    debugAuth().catch(console.error);
}

module.exports = { debugAuth };
