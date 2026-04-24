const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
let open = 0;
let lines = content.split('\n');
lines.forEach((line, i) => {
  for (let char of line) {
    if (char === '{') open++;
    if (char === '}') open--;
  }
  if (open < 0) {
    console.log('Negative balance at line ' + (i + 1));
    open = 0;
  }
});
console.log('Final balance: ' + open);
