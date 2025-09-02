const axios = require('axios');

// This script will help you find your correct User ID
async function findUserId() {
    console.log('🔍 Finding your DocuSign User ID...');
    console.log('\n📋 Steps to find your User ID:');
    console.log('1. Go to: https://developers.docusign.com/');
    console.log('2. Log in with your DocuSign account');
    console.log('3. Go to your Integration (Integration Key: 81c782d7-b9d5-4890-a174-5932b9717174)');
    console.log('4. Look for "User ID" or "API User ID" - it should be a GUID');
    console.log('5. Copy that GUID and update your configuration');
    
    console.log('\n💡 Alternative method:');
    console.log('1. Go to: https://admin.docusign.com/');
    console.log('2. Log in with your DocuSign account');
    console.log('3. Go to Users section');
    console.log('4. Find your user and copy the User ID');
    
    console.log('\n🔧 Once you have the correct User ID:');
    console.log('1. Update the USER_ID in your .env file');
    console.log('2. Or update the userId variable in your scripts');
    console.log('3. Run the authentication test again');
    
    console.log('\n📝 Current configuration:');
    console.log('  - Integration Key: 81c782d7-b9d5-4890-a174-5932b9717174');
    console.log('  - Current User ID: 226a5a44-25a2-4f50-97b7-0c12411541fc (❌ This is incorrect)');
    console.log('  - Auth Server: https://account-d.docusign.com');
    
    console.log('\n🎯 The User ID should look like: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
}

// Run the helper
if (require.main === module) {
    findUserId();
}

module.exports = { findUserId };
