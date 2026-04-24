const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// 1. Fix broken ternaries inside template literals or anywhere
// Pattern: ${condition ? value : " } or ${condition ? value : ` }
// Also handles variations with different spacing and quotes.
content = content.replace(/\$\{\s*([^?]+)\s*\?\s*((?:`[^`]*`|'[^']*'|"[^"]*"|[^:}])+)\s*:\s*["` ]+\}/g, (match, cond, val) => {
  console.log('Fixing ternary:', match.trim());
  return `\${${cond.trim()} ? ${val.trim()} : ""}`;
});

// 2. Fix rogue closing backticks and braces at the end of addMsg or similar
// Matches: ` }, something
content = content.replace(/`\s*\}\s*,\s*/g, '`, ');

// 3. Fix double double-quotes in className or style
content = content.replace(/className=\{([^}]+)\s*\?\s*"([^"]+)"\s*:\s*"[^"]*"\s*\}\s*\}/g, 'className={$1 ? "$2" : ""}');
content = content.replace(/: ""\}/g, ': ""}');
content = content.replace(/relative""/g, 'relative"');

// 4. Fix specific rogue quotes/braces at the end of common lines
content = content.replace(/#4ade80""\);/g, '#4ade80");');
content = content.replace(/#e2e8f0""\);/g, '#e2e8f0");');

// 5. Clean up any remaining " } or ` } that are clearly errors
content = content.replace(/:\s*["` ]+\}\s*\`/g, ': "" }`');

fs.writeFileSync('index.html', content);
console.log('AdvancedFixer v2 complete.');
