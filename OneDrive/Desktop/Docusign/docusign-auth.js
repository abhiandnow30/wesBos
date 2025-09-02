const jwt = require('jsonwebtoken');
const axios = require('axios');
const config = require('./config');

class DocuSignAuth {
    constructor() {
        this.config = config.getConfig();
        this.accessToken = null;
        this.accountId = null;
        this.baseUri = null;
    }

    /**
     * Generate JWT token for DocuSign authentication
     */
    generateJWT() {
        const now = Math.floor(Date.now() / 1000);
        const payload = {
            iss: this.config.integrationKey,
            sub: this.config.userId,
            aud: 'account-d.docusign.com',
            iat: now,
            exp: now + 3600, // 1 hour expiration
            scope: 'signature impersonation'
        };

        try {
            return jwt.sign(payload, this.config.privateKey, { algorithm: 'RS256' });
        } catch (error) {
            throw new Error(`Failed to generate JWT: ${error.message}`);
        }
    }

    /**
     * Exchange JWT for OAuth access token
     */
    async getAccessToken() {
        try {
            const jwtToken = this.generateJWT();
            
            const response = await axios.post(`${this.config.authServer}/oauth/token`, {
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: jwtToken
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            this.accessToken = response.data.access_token;
            console.log('✅ Successfully obtained access token');
            return this.accessToken;

        } catch (error) {
            console.log('Debug - Error response:', error.response?.data);
            const errorCode = error.response?.data?.error;
            const errorDescription = error.response?.data?.error_description;
            
            if (errorCode === 'consent_required' || errorCode === 'user_not_found' || errorDescription === 'user_not_found') {
                const consentUrl = `${this.config.authServer}/oauth/auth?response_type=code&scope=signature%20impersonation&client_id=${this.config.integrationKey}&redirect_uri=https://www.docusign.com/api`;
                throw new Error(`Consent required. Please visit this URL to grant consent: ${consentUrl}`);
            }
            
            throw new Error(`Failed to get access token: ${errorDescription || errorCode || error.message}`);
        }
    }

    /**
     * Get user info including accountId and base_uri
     */
    async getUserInfo() {
        if (!this.accessToken) {
            await this.getAccessToken();
        }

        try {
            const response = await axios.get(`${this.config.authServer}/oauth/userinfo`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });

            const userInfo = response.data;
            this.accountId = userInfo.accounts[0].account_id;
            this.baseUri = userInfo.accounts[0].base_uri;

            console.log(`✅ User info retrieved - Account ID: ${this.accountId}`);
            console.log(`✅ Base URI: ${this.baseUri}`);

            return {
                accountId: this.accountId,
                baseUri: this.baseUri,
                accessToken: this.accessToken
            };

        } catch (error) {
            throw new Error(`Failed to get user info: ${error.response?.data?.error_description || error.message}`);
        }
    }

    /**
     * Get authentication headers for API calls
     */
    getAuthHeaders() {
        if (!this.accessToken) {
            throw new Error('Access token not available. Please authenticate first.');
        }

        return {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
        };
    }

    /**
     * Get the complete API base URL
     */
    getApiBaseUrl() {
        if (!this.baseUri || !this.accountId) {
            throw new Error('Base URI or Account ID not available. Please authenticate first.');
        }

        return `${this.baseUri}/restapi/v2.1/accounts/${this.accountId}`;
    }
}

module.exports = DocuSignAuth;
