const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Replace any occurrence of characters followed by two double quotes at the end of a string
// e.g. "a"" becomes "a"
content = content.replace(/([^"])""/g, '$1"');

// Replace any double quotes that are alone (lost their content)
// e.g. , "", becomes , "?",
content = content.replace(/,\s*""\s*,/g, ', "?", ');

fs.writeFileSync('index.html', content);
console.log('Aggressive syntax fix completed.');
