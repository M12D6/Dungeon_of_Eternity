const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const scriptMatch = content.match(/<script type="text\/babel" data-presets="react">([\s\S]*?)<\/script>/);
if (scriptMatch) {
  const script = scriptMatch[1];
  fs.writeFileSync('scratch/extracted_script.js', script);
  console.log('Script extracted to scratch/extracted_script.js');
} else {
  console.error('No babel script found');
}
