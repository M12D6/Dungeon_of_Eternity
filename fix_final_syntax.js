const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Fix unclosed quotes in function calls and objects
// Common patterns:
// , ",  -> , "?",
content = content.replace(/,\s*"\s*,/g, ', "?", ');
// (", -> ("?",
content = content.replace(/\("\s*,/g, '("?", ');
// " }, -> "?", },
content = content.replace(/"\s*}/g, '"?" }');

// Fix the template literals seen in the logs
content = content.replace(/className={fx\.shake \? "doe-shake" : "}/g, 'className={fx.shake ? "doe-shake" : ""}');
content = content.replace(/className={fx\.monsterHitAnim \? "doe-monster-hit" : "}/g, 'className={fx.monsterHitAnim ? "doe-monster-hit" : ""}');

// Fix the ternary operators
content = content.replace(/: "}/g, ': ""}');
content = content.replace(/: "]/g, ': ""]');

fs.writeFileSync('index.html', content);
console.log('Final syntax repair attempted.');
