const fs = require('fs');
const buf = fs.readFileSync('index.html');
let line = 1;
let offset = 0;
while (line < 200 && offset < buf.length) {
  if (buf[offset] === 10) line++;
  offset++;
}
const endOffset = buf.indexOf(10, offset);
const lineBuf = buf.slice(offset, endOffset);
console.log('Line 200 Hex:', lineBuf.toString('hex'));
console.log('Line 200 Text:', lineBuf.toString('utf8').replace(/[\x00-\x1f]/g, '?'));
