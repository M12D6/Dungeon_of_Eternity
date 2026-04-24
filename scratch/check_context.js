const fs = require('fs');
const buf = fs.readFileSync('index.html');
const checkIndices = [169, 461, 2000]; // and some more
for (let idx of [169, 461]) {
  const start = Math.max(0, idx - 20);
  const end = Math.min(buf.length, idx + 20);
  const slice = buf.slice(start, end);
  console.log(`Context at ${idx}: [${slice.toString('ascii').replace(/[\x00-\x1f]/g, '?')}]`);
  console.log(`Hex: ${slice.toString('hex')}`);
}
