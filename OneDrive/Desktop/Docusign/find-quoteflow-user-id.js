const axios = require('axios');

// This script will help you find the User ID for your Quoteflow integration
async function findQuoteflowUserId() {
    console.log('🔍 Finding User ID for Quoteflow Integration...');
    console.log('\n📋 Your Quoteflow Integration Details:');
    console.log('  - App Name: Quoteflow');
    console.log('  - Integration Key: 81c782d7-b9d5-4890-a174-5932b9717174 ✅');
    console.log('  - Current User ID: 226a5a44-25a2-4f50-97b7-0c12411541fc ❌ (incorrect)');
    
    console.log('\n🎯 Steps to find the correct User ID:');
    console.log('1. Go to: https://developers.docusign.com/');
    console.log('2. Log in with your DocuSign account');
    console.log('3. Navigate to your "Quoteflow" integration');
    console.log('4. Look for one of these sections:');
    console.log('   - "Authentication" section');
    console.log('   - "JWT Grant" section');
    console.log('   - "User ID" or "API User ID" field');
    console.log('   - "Impersonation" settings');
    
    console.log('\n💡 Alternative locations to check:');
    console.log('1. In the integration settings, look for:');
    console.log('   - "User ID" field');
    console.log('   - "API User ID" field');
    console.log('   - "Impersonation User ID" field');
    console.log('2. Check the "Keys and Secrets" section');
    console.log('3. Look in the "Authentication" tab');
    
    console.log('\n🔧 Once you find the User ID:');
    console.log('1. It should be a GUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    console.log('2. Update your .env file:');
    console.log('   USER_ID=your_correct_user_id_here');
    console.log('3. Or update the userId variable in your scripts');
    console.log('4. Test the authentication again');
    
    console.log('\n⚠️  Important Notes:');
    console.log('- The User ID must be for the same DocuSign account you used to grant consent');
    console.log('- Make sure you granted consent with the same account that owns this integration');
    console.log('- The User ID is different from the Integration Key');
    
    console.log('\n🚀 After updating the User ID, test with:');
    console.log('node debug-auth.js');
}

// Run the helper
if (require.main === module) {
    findQuoteflowUserId();
}

module.exports = { findQuoteflowUserId };
