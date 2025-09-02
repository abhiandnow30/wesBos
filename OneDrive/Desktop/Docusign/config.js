const fs = require('fs');
const path = require('path');
require('dotenv').config();

class Config {
    constructor() {
        this.integrationKey = process.env.INTEGRATION_KEY || '81c782d7-b9d5-4890-a174-5932b9717174';
        this.userId = process.env.USER_ID || '194a2f9c-4cda-41a0-a0ad-196d03a5c8e4';
        this.authServer = process.env.AUTH_SERVER || 'https://account-d.docusign.com';
        this.privateKey = this.loadPrivateKey();
        
        this.validateConfig();
    }

    loadPrivateKey() {
        console.log('🔍 Loading private key...');
        console.log('PRIVATE_KEY exists:', !!process.env.PRIVATE_KEY);
        console.log('PRIVATE_KEY_PATH exists:', !!process.env.PRIVATE_KEY_PATH);
        
        // First try to load from environment variable
        if (process.env.PRIVATE_KEY) {
            console.log('✅ Found PRIVATE_KEY in environment');
            let key = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');
            // Ensure proper line breaks for RSA key
            key = key.replace(/`n/g, '\n');
            console.log('🔑 Key format check - starts with:', key.substring(0, 30));
            console.log('🔑 Key format check - ends with:', key.substring(key.length - 30));
            return key;
        }

        // Then try to load from file
        const privateKeyPath = process.env.PRIVATE_KEY_PATH;
        if (privateKeyPath) {
            try {
                const fullPath = path.resolve(privateKeyPath);
                console.log('📁 Loading from file:', fullPath);
                return fs.readFileSync(fullPath, 'utf8');
            } catch (error) {
                throw new Error(`Failed to load private key from ${privateKeyPath}: ${error.message}`);
            }
        }

        console.log('❌ No private key found in environment or file');
        throw new Error('Private key not found. Please set either PRIVATE_KEY environment variable or PRIVATE_KEY_PATH');
    }

    validateConfig() {
        const requiredFields = ['integrationKey', 'userId', 'privateKey'];
        const missingFields = requiredFields.filter(field => !this[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required configuration: ${missingFields.join(', ')}`);
        }
    }

    getConfig() {
        return {
            integrationKey: this.integrationKey,
            userId: this.userId,
            authServer: this.authServer,
            privateKey: this.privateKey
        };
    }
}

module.exports = new Config();
