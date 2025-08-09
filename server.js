// Simple static file server for development
// Usage: node serve.js [port]

const http = require('http');
const fs = require('fs');
const path = require('path');

const port = parseInt(process.argv[2], 10) || 5173;
const root = __dirname;

const mimeTypes = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon'
};

function send(res, status, data, headers = {}) {
  res.writeHead(status, headers);
  res.end(data);
}

const server = http.createServer((req, res) => {
  try {
    let urlPath = decodeURI(req.url.split('?')[0]);
    if (urlPath === '/' || urlPath === '') urlPath = '/index.html';

    // Prevent path traversal
    const safeSuffix = path.normalize(urlPath).replace(/^\/+/, '');

    const candidates = [];

    // Direct path
    let directPath = path.join(root, safeSuffix);
    candidates.push(directPath);

    // If no extension, try .html at same level
    const hasExt = path.extname(directPath);
    if (!hasExt) {
      candidates.push(`${directPath}.html`);
    }

    // Try under html/ folder
    const htmlPath = path.join(root, 'html', safeSuffix);
    candidates.push(htmlPath);
    if (!hasExt) {
      candidates.push(`${htmlPath}.html`);
    }

    // If a candidate is a directory, try its index.html
    let filePath = candidates.find(p => fs.existsSync(p));
    if (filePath && fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      const idx = path.join(filePath, 'index.html');
      if (fs.existsSync(idx)) filePath = idx;
    }

    // Last-chance: pretty URL directory index under html/
    if (!filePath) {
      const asDirIndex = path.join(root, 'html', safeSuffix, 'index.html');
      if (fs.existsSync(asDirIndex)) filePath = asDirIndex;
    }

    if (!filePath || !fs.existsSync(filePath)) {
      // Try serving error.html as 404 if present
      const notFound = path.join(root, '404.html');
      const legacy = path.join(root, 'error.html');
      if (fs.existsSync(notFound)) {
        const data = fs.readFileSync(notFound);
        return send(res, 404, data, { 'Content-Type': 'text/html; charset=UTF-8' });
      } else if (fs.existsSync(legacy)) {
        const data = fs.readFileSync(legacy);
        return send(res, 404, data, { 'Content-Type': 'text/html; charset=UTF-8' });
      } else {
        return send(res, 404, 'Not Found');
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const mime = mimeTypes[ext] || 'application/octet-stream';
    const data = fs.readFileSync(filePath);
    send(res, 200, data, { 'Content-Type': mime });
  } catch (err) {
    console.error(err);
    send(res, 500, 'Internal Server Error');
  }
});

server.listen(port, () => {
  console.log(`Static server running at http://localhost:${port}`);
});
