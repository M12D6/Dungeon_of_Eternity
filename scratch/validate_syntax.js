const fs = require('fs');
const content = fs.readFileSync('scratch/extracted_script.js', 'utf8');

function validate(code) {
  let stack = [];
  let inString = null;
  let escaped = false;
  let line = 1;
  let col = 1;

  for (let i = 0; i < code.length; i++) {
    let char = code[i];
    if (char === '\n') {
      line++;
      col = 1;
    } else {
      col++;
    }

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (inString) {
      if (char === inString) {
        inString = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      inString = char;
      continue;
    }

    if (char === '{' || char === '(' || char === '[') {
      stack.push({ char, line, col });
    } else if (char === '}' || char === ')' || char === ']') {
      if (stack.length === 0) {
        console.error(`Unexpected closing ${char} at line ${line}, col ${col}`);
        return;
      }
      let last = stack.pop();
      if ((char === '}' && last.char !== '{') ||
          (char === ')' && last.char !== '(') ||
          (char === ']' && last.char !== '[')) {
        console.error(`Mismatched ${char} at line ${line}, col ${col} (expected ${last.char === '{' ? '}' : last.char === '(' ? ')' : ']'})`);
        return;
      }
    }
  }

  if (inString) {
    console.error(`Unclosed string ${inString}`);
  } else if (stack.length > 0) {
    let last = stack.pop();
    console.error(`Unclosed ${last.char} from line ${last.line}, col ${last.col}`);
  } else {
    console.log('Syntax looks okay (braces/strings balanced)');
  }
}

validate(content);
