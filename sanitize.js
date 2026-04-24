const fs = require('fs');
const path = 'index.html';
const buffer = fs.readFileSync(path);
// Read as raw bytes and keep ONLY characters in the range 0-127
// This effectively strips all broken emojis and corrupted bytes.
const cleanBuffer = Buffer.from(buffer.filter(b => b < 128));
fs.writeFileSync(path, cleanBuffer);
console.log('File sanitized: All non-ASCII characters removed.');
