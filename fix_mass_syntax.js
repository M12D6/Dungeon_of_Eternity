const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Fix the corrupted icon strings that have extra quotes
// Pattern: icon followed by " then some garbage then " and potentially another "
content = content.replace(/icon:\s*"(?:[^"]*)"(?:")/g, 'icon:"?"');

// Fix cases where it's icon:"" (already broken)
content = content.replace(/icon:\s*""/g, 'icon:"?"');

// Fix specific patterns seen in the logs
content = content.replace(/icon:"x""/g, 'icon:"?"');
content = content.replace(/icon:"a""/g, 'icon:"?"');
content = content.replace(/icon:"xR""/g, 'icon:"?"');
content = content.replace(/icon:"x ""/g, 'icon:"?"');

// Fix the "S" Close buttons too
content = content.replace(/>S" Close<\/button>/g, '>Close</button>');
content = content.replace(/>S" Leave<\/button>/g, '>Leave</button>');

fs.writeFileSync('index.html', content);
console.log('Mass syntax fix completed.');
