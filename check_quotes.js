const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
  let quotes = 0;
  for (let char of line) {
    if (char === '"') quotes++;
  }
  // Ignore lines that are legitimately part of a template literal or multi-line string
  // but in this file, most strings are single-line.
  if (quotes % 2 !== 0) {
    console.log('Unclosed quote at line ' + (i + 1) + ': ' + line);
  }
});
