const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

console.log('Original length:', content.length);

// 1. Remove control characters that break things
content = content.replace(/[\x1c-\x1f]/g, ' ');

// 2. Fix the console.error typo: "Global Error:"", "Render failed:"", etc.
content = content.replace(/console\.error\("(.*?)"",/g, 'console.error("$1",');

// 3. Fix the specific line 4275 mess (and similar)
// Pattern: addMsg(`... ${... ? `...` : " }`, "#4ade80"");
content = content.replace(/\$\{decayMult < 1 \? `\(Decay: \$\{Math\.floor\(decayMult\*100\)\}\%\)` : " \}\`, "#4ade80""\);/g, 
                          '${decayMult < 1 ? `(Decay: ${Math.floor(decayMult*100)}%)` : ""}`, "#4ade80");');

// 4. Fix any icon:"x"" patterns
content = content.replace(/icon\s*:\s*"([^"]*)""/g, 'icon:"$1"');

// 5. Fix common corrupted placeholders like "x " " or similar
content = content.replace(/"x\s+""/g, '"x "');

// 6. Fix any trailing ""); at the end of a line
content = content.replace(/"\s*"\s*\)\s*;\s*$/gm, '");');

// 7. Check for unbalanced template literals
// (This is harder, but let's try a common one)
content = content.replace(/`([^`]*?)"\s*\}\s*`,/g, '`$1` },');

fs.writeFileSync('index.html', content);
console.log('Fixed length:', content.length);
console.log('MegaFixer complete.');
