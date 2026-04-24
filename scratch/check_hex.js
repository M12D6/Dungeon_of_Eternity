const fs = require('fs');
const buf = fs.readFileSync('index.html');
console.log('File length:', buf.length);
for (let i = 0; i < Math.min(buf.length, 2000); i++) {
  const b = buf[i];
  if (b < 32 || b > 126) {
    if (b === 10 || b === 13 || b === 9) continue;
    console.log(`Non-ASCII at index ${i}: 0x${b.toString(16)} ('${String.fromCharCode(b)}')`);
  }
}
