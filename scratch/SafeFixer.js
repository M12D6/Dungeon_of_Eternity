const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
let lines = content.split('\n');

console.log('Processing lines...');
let count = 0;
const fixedLines = lines.map((line, i) => {
  let original = line;
  
  // Safe line-by-line ternary fix
  line = line.replace(/\$\{\s*([^?]+)\s*\?\s*((?:`[^`]*`|'[^']*'|"[^"]*"|[^:}])+)\s*:\s*["` ]+\}/g, (match, cond, val) => {
    count++;
    return `\${${cond.trim()} ? ${val.trim()} : ""}`;
  });

  // Fix the className/style rogue }
  if (line.includes('className={')) {
    line = line.replace(/: " \}/g, ': ""}');
  }
  
  // Fix rogue ` }, patterns
  line = line.replace(/`\s*\}\s*,\s*RARITY/g, '`, RARITY');
  line = line.replace(/`\s*\}\s*,\s*#/g, '`, "#');
  
  // Fix double quotes
  line = line.replace(/""\);/g, '");');
  line = line.replace(/relative""/g, 'relative"');

  return line;
});

console.log(`Fixed ${count} ternary patterns.`);
fs.writeFileSync('index.html', fixedLines.join('\n'));
console.log('SafeFixer complete.');
