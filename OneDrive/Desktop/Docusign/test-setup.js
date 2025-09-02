const fs = require('fs');
const path = require('path');

console.log('🧪 Testing DocuSign Integration Setup...\n');

// Test 1: Check if dependencies are installed
console.log('📦 Test 1: Checking dependencies...');
try {
    require('axios');
    console.log('✅ axios - OK');
} catch (error) {
    console.log('❌ axios - Missing');
}

try {
    require('jsonwebtoken');
    console.log('✅ jsonwebtoken - OK');
} catch (error) {
    console.log('❌ jsonwebtoken - Missing');
}

try {
    require('dotenv');
    console.log('✅ dotenv - OK');
} catch (error) {
    console.log('❌ dotenv - Missing');
}

// Test 2: Check if configuration files exist
console.log('\n📁 Test 2: Checking configuration files...');
const files = [
    'config.js',
    'docusign-auth.js',
    'docusign-api.js',
    'index.js',
    'env.example'
];

files.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file} - Found`);
    } else {
        console.log(`❌ ${file} - Missing`);
    }
});

// Test 3: Check if .env file exists
console.log('\n🔐 Test 3: Checking environment configuration...');
if (fs.existsSync('.env')) {
    console.log('✅ .env file - Found');
    
    // Check if required variables are set
    require('dotenv').config();
    const requiredVars = ['INTEGRATION_KEY', 'USER_ID'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length === 0) {
        console.log('✅ Required environment variables - Set');
    } else {
        console.log(`⚠️  Missing environment variables: ${missingVars.join(', ')}`);
    }
    
    // Check private key configuration
    if (process.env.PRIVATE_KEY || process.env.PRIVATE_KEY_PATH) {
        console.log('✅ Private key configuration - Found');
    } else {
        console.log('❌ Private key configuration - Missing');
    }
} else {
    console.log('❌ .env file - Missing (copy from env.example)');
}

// Test 4: Try to load configuration module
console.log('\n⚙️  Test 4: Testing configuration module...');
try {
    const config = require('./config');
    console.log('✅ Configuration module - Loaded successfully');
} catch (error) {
    console.log(`❌ Configuration module - Failed to load: ${error.message}`);
}

console.log('\n🎯 Setup Test Complete!');
console.log('\n📋 Next Steps:');
console.log('1. Copy env.example to .env');
console.log('2. Add your DocuSign credentials to .env');
console.log('3. Add your private key file or set PRIVATE_KEY variable');
console.log('4. Run: node index.js --test-auth');
console.log('5. If consent is required, visit the provided URL');
console.log('6. Run: node index.js');
