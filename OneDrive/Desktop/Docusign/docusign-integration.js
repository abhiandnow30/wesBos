const jwt = require('jsonwebtoken');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * DocuSign API Integration Class
 * Handles JWT authentication, envelope creation, and status tracking
 */
class DocuSignIntegration {
    constructor(config = {}) {
        // Configuration with defaults for sandbox environment
        this.config = {
            integrationKey: config.integrationKey || '81c782d7-b9d5-4890-a174-5932b9717174',
            userId: config.userId || '194a2f9c-4cda-41a0-a0ad-196d03a5c8e4',
            accountId: config.accountId || null, // Will be retrieved from user info
            privateKey: config.privateKey || `-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----`,
            environment: config.environment || 'sandbox', // 'sandbox' or 'production'
            authServer: config.authServer || null, // Will be set based on environment
            baseUri: config.baseUri || null, // Will be retrieved from user info
            accessToken: null,
            tokenExpiry: null
        };

        // Set environment-specific URLs
        this.setEnvironment(this.config.environment);
    }

    /**
     * Set environment (sandbox or production)
     * @param {string} environment - 'sandbox' or 'production'
     */
    setEnvironment(environment) {
        this.config.environment = environment;
        
        if (environment === 'production') {
            this.config.authServer = 'https://account.docusign.com';
            this.config.audience = 'account.docusign.com';
        } else {
            this.config.authServer = 'https://account-d.docusign.com';
            this.config.audience = 'account-d.docusign.com';
        }
    }

    /**
     * Generate JWT token for authentication
     * @returns {string} JWT token
     */
    generateJWT() {
        try {
            const now = Math.floor(Date.now() / 1000);
            const payload = {
                iss: this.config.integrationKey,
                sub: this.config.userId,
                aud: this.config.authServer,
                iat: now,
                exp: now + 3600, // 1 hour expiry
                scope: 'signature impersonation'
            };

            return jwt.sign(payload, this.config.privateKey, { algorithm: 'RS256' });
        } catch (error) {
            throw new Error(`Failed to generate JWT: ${error.message}`);
        }
    }

    /**
     * Authenticate with DocuSign using JWT
     * @returns {Promise<string>} Access token
     */
    async authenticate() {
        try {
            console.log('🔐 Authenticating with DocuSign...');
            
            const jwtToken = this.generateJWT();
            
            const response = await axios.post(`${this.config.authServer}/oauth/token`, {
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: jwtToken
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            this.config.accessToken = response.data.access_token;
            this.config.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
            
            console.log('✅ Authentication successful!');
            return this.config.accessToken;
        } catch (error) {
            throw new Error(`Authentication failed: ${error.response?.data?.error_description || error.message}`);
        }
    }

    /**
     * Get user information and account details
     * @returns {Promise<Object>} User info with account details
     */
    async getUserInfo() {
        try {
            if (!this.config.accessToken) {
                await this.authenticate();
            }

            console.log('👤 Getting user information...');
            
            const response = await axios.get(`${this.config.authServer}/oauth/userinfo`, {
                headers: {
                    'Authorization': `Bearer ${this.config.accessToken}`
                }
            });

            const account = response.data.accounts[0];
            this.config.accountId = account.account_id;
            this.config.baseUri = account.base_uri;
            
            console.log(`✅ User info retrieved! Account ID: ${this.config.accountId}`);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to get user info: ${error.response?.data?.error_description || error.message}`);
        }
    }

    /**
     * Ensure we have a valid access token
     * @returns {Promise<string>} Valid access token
     */
    async ensureValidToken() {
        // Check if token is expired or will expire soon (within 5 minutes)
        if (!this.config.accessToken || !this.config.tokenExpiry || 
            Date.now() > (this.config.tokenExpiry - 300000)) {
            await this.authenticate();
        }
        return this.config.accessToken;
    }

    /**
     * Send document for signature
     * @param {Object} options - Envelope options
     * @param {string} options.documentPath - Path to PDF document
     * @param {string} options.documentName - Name of the document
     * @param {Array} options.recipients - Array of recipient objects
     * @param {string} options.emailSubject - Email subject
     * @param {string} options.emailBlurb - Email message
     * @param {Array} options.tabs - Signing tabs configuration
     * @returns {Promise<Object>} Envelope creation response
     */
    async sendDocument(options) {
        try {
            await this.ensureValidToken();
            
            if (!this.config.accountId || !this.config.baseUri) {
                await this.getUserInfo();
            }

            console.log('📄 Sending document for signature...');

            // Read and encode document
            const documentBuffer = fs.readFileSync(options.documentPath);
            const documentBase64 = documentBuffer.toString('base64');

            // Prepare envelope definition
            const envelopeDefinition = {
                emailSubject: options.emailSubject || 'Please sign this document',
                emailBlurb: options.emailBlurb || 'Please review and sign the attached document.',
                documents: [{
                    documentBase64: documentBase64,
                    name: options.documentName || 'Document',
                    fileExtension: path.extname(options.documentPath).substring(1) || 'pdf',
                    documentId: '1'
                }],
                recipients: {
                    signers: options.recipients.map((recipient, index) => ({
                        email: recipient.email,
                        name: recipient.name,
                        recipientId: String(index + 1),
                        routingOrder: String(index + 1),
                        tabs: recipient.tabs || {}
                    }))
                },
                status: 'sent'
            };

            // Send envelope
            const response = await axios.post(
                `${this.config.baseUri}/restapi/v2.1/accounts/${this.config.accountId}/envelopes`,
                envelopeDefinition,
                {
                    headers: {
                        'Authorization': `Bearer ${this.config.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log(`✅ Envelope created successfully! ID: ${response.data.envelopeId}`);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to send document: ${error.response?.data?.errorCode || error.message}`);
        }
    }

    /**
     * Get envelope status
     * @param {string} envelopeId - Envelope ID
     * @returns {Promise<Object>} Envelope status
     */
    async getEnvelopeStatus(envelopeId) {
        try {
            await this.ensureValidToken();
            
            if (!this.config.accountId || !this.config.baseUri) {
                await this.getUserInfo();
            }

            console.log(`🔍 Checking envelope status: ${envelopeId}`);

            const response = await axios.get(
                `${this.config.baseUri}/restapi/v2.1/accounts/${this.config.accountId}/envelopes/${envelopeId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.config.accessToken}`
                    }
                }
            );

            console.log(`✅ Envelope status: ${response.data.status}`);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to get envelope status: ${error.response?.data?.errorCode || error.message}`);
        }
    }

    /**
     * Get envelope recipients status
     * @param {string} envelopeId - Envelope ID
     * @returns {Promise<Object>} Recipients status
     */
    async getRecipientsStatus(envelopeId) {
        try {
            await this.ensureValidToken();
            
            if (!this.config.accountId || !this.config.baseUri) {
                await this.getUserInfo();
            }

            console.log(`👥 Getting recipients status for envelope: ${envelopeId}`);

            const response = await axios.get(
                `${this.config.baseUri}/restapi/v2.1/accounts/${this.config.accountId}/envelopes/${envelopeId}/recipients`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.config.accessToken}`
                    }
                }
            );

            console.log(`✅ Recipients status retrieved`);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to get recipients status: ${error.response?.data?.errorCode || error.message}`);
        }
    }

    /**
     * Download envelope document
     * @param {string} envelopeId - Envelope ID
     * @param {string} documentId - Document ID (usually '1')
     * @param {string} outputPath - Path to save the document
     * @returns {Promise<string>} Path to downloaded document
     */
    async downloadDocument(envelopeId, documentId = '1', outputPath = null) {
        try {
            await this.ensureValidToken();
            
            if (!this.config.accountId || !this.config.baseUri) {
                await this.getUserInfo();
            }

            console.log(`📥 Downloading document ${documentId} from envelope: ${envelopeId}`);

            const response = await axios.get(
                `${this.config.baseUri}/restapi/v2.1/accounts/${this.config.accountId}/envelopes/${envelopeId}/documents/${documentId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.config.accessToken}`
                    },
                    responseType: 'arraybuffer'
                }
            );

            const filePath = outputPath || `envelope-${envelopeId}-document-${documentId}.pdf`;
            fs.writeFileSync(filePath, response.data);
            
            console.log(`✅ Document downloaded to: ${filePath}`);
            return filePath;
        } catch (error) {
            throw new Error(`Failed to download document: ${error.response?.data?.errorCode || error.message}`);
        }
    }

    /**
     * Create signing URL for embedded signing
     * @param {string} envelopeId - Envelope ID
     * @param {Object} recipientViewRequest - Recipient view request
     * @returns {Promise<string>} Signing URL
     */
    async createSigningUrl(envelopeId, recipientViewRequest) {
        try {
            await this.ensureValidToken();
            
            if (!this.config.accountId || !this.config.baseUri) {
                await this.getUserInfo();
            }

            console.log(`🔗 Creating signing URL for envelope: ${envelopeId}`);

            const response = await axios.post(
                `${this.config.baseUri}/restapi/v2.1/accounts/${this.config.accountId}/envelopes/${envelopeId}/views/recipient`,
                recipientViewRequest,
                {
                    headers: {
                        'Authorization': `Bearer ${this.config.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log(`✅ Signing URL created`);
            return response.data.url;
        } catch (error) {
            throw new Error(`Failed to create signing URL: ${error.response?.data?.errorCode || error.message}`);
        }
    }
}

module.exports = DocuSignIntegration;
