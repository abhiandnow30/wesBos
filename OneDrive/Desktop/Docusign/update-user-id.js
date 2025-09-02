const fs = require('fs');

// Script to update User ID in .env file
function updateUserId(newUserId) {
    try {
        console.log('🔧 Updating User ID in .env file...');
        
        // Read current .env file
        const envPath = '.env';
        let envContent = '';
        
        if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf8');
        }
        
        // Update USER_ID line
        const lines = envContent.split('\n');
        let updated = false;
        
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('USER_ID=')) {
                lines[i] = `USER_ID=${newUserId}`;
                updated = true;
                break;
            }
        }
        
        if (!updated) {
            // Add USER_ID if it doesn't exist
            lines.push(`USER_ID=${newUserId}`);
        }
        
        // Write back to .env file
        fs.writeFileSync(envPath, lines.join('\n'));
        
        console.log('✅ User ID updated successfully!');
        console.log(`📝 New User ID: ${newUserId}`);
        console.log('\n🚀 You can now test the authentication:');
        console.log('node debug-auth.js');
        
    } catch (error) {
        console.error('❌ Error updating User ID:', error.message);
    }
}

// If run directly, show usage
if (require.main === module) {
    const newUserId = process.argv[2];
    
    if (!newUserId) {
        console.log('🔧 Usage: node update-user-id.js <new_user_id>');
        console.log('Example: node update-user-id.js 12345678-1234-1234-1234-123456789012');
        console.log('\n💡 Make sure to replace <new_user_id> with the actual User ID you found in DocuSign');
    } else {
        updateUserId(newUserId);
    }
}

module.exports = { updateUserId };
