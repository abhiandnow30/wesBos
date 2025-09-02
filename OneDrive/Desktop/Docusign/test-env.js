require('dotenv').config();

console.log('🔍 Testing environment variables...');
console.log('INTEGRATION_KEY:', process.env.INTEGRATION_KEY);
console.log('USER_ID:', process.env.USER_ID);
console.log('AUTH_SERVER:', process.env.AUTH_SERVER);
console.log('PRIVATE_KEY exists:', !!process.env.PRIVATE_KEY);
console.log('PRIVATE_KEY length:', process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.length : 0);
console.log('PRIVATE_KEY first 50 chars:', process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.substring(0, 50) : 'undefined');
