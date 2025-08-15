const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  console.log('Request received:', req.url);
  
  // Serve test.html for root path
  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile('test.html', (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(3000, () => {
  console.log('Test server running at http://localhost:3000/');
});