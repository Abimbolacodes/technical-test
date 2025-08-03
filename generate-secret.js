const crypto = require('crypto');

// Generate a random 32-byte secret and convert to base64
const secret = crypto.randomBytes(32).toString('base64');
console.log('Generated Secret Key:');
console.log(secret);
console.log('\nAdd this to your .env file as NEXTAUTH_SECRET="' + secret + '"');