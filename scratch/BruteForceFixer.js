const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Fix the addMsg / addCombatMsg corruption specifically
// These lines often have: ${cond ? "val" `, or similar
content = content.replace(/\$\{([^?]+)\s*\?\s*("[^"]*")\s*`\s*,/g, '${$1 ? $2 : ""}`,');

// Fix the end of addMsg lines that have rogue braces
content = content.replace(/(`\s*)\}\s*,\s*RARITY/g, '$1, RARITY');

// Fix className corruption
content = content.replace(/className=\{\s*([^?]+)\s*\?\s*("[^"]*")\s*:\s*" \}\s*style/g, 'className={$1 ? $2 : ""} style');

// Fix style double quote corruption
content = content.replace(/relative""\s*\}\}\s*>/g, 'relative" }} >');

// Fix any other known double double quotes
content = content.replace(/""\s*,/g, '",');
content = content.replace(/""\s*\)/g, '")');

fs.writeFileSync('index.html', content);
console.log('BruteForceFixer complete.');
