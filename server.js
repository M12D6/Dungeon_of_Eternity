const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = 8000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm',
  '.jsx': 'text/jsx'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;
  
  // Default to index.html
  if (pathname === '/') {
    pathname = '/index.html';
  }
  
  const filePath = path.join(__dirname, pathname);
  const ext = path.parse(filePath).ext;
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1><p>The requested file was not found.</p>');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 Internal Server Error</h1><p>Something went wrong.</p>');
      }
    } else {
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      });
      res.end(data);
    }
  });
});

server.listen(port, () => {
  console.log(`🎮 Dungeon of Eternity Server running on:`);
  console.log(`📍 Local:   http://localhost:${port}`);
  console.log(`🌐 Network: http://127.0.0.1:${port}`);
  console.log(`\n📂 Serving files from: ${__dirname}`);
  console.log(`\n🎯 Press Ctrl+C to stop the server`);
  console.log(`\n🚀 Opening browser in 3 seconds...`);
  
  // Auto-open browser
  setTimeout(() => {
    const { exec } = require('child_process');
    const url = `http://localhost:${port}`;
    
    switch (process.platform) {
      case 'darwin':
        exec(`open ${url}`);
        break;
      case 'win32':
        exec(`start ${url}`);
        break;
      default:
        exec(`xdg-open ${url}`);
    }
  }, 3000);
});

process.on('SIGINT', () => {
  console.log('\n👋 Server shutting down gracefully...');
  process.exit(0);
});
