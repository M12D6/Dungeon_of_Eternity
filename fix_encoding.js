const fs = require('fs');
const path = 'index.html';
const buffer = fs.readFileSync(path);
// If it's double-encoded, it's currently UTF-8 bytes that represent Latin-1 characters
// We want to treat those characters as raw bytes and interpret THEM as UTF-8.
const text = buffer.toString('utf8');
const fixed = Buffer.from(text, 'binary'); 
fs.writeFileSync(path, fixed);
console.log('Encoding fix attempted via Node.js');
