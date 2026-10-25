import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname } from 'node:path';

const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };
export function makeServer(root) {
  return createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self'; style-src 'self'; script-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      return res.end();
    }
    const pathname = (req.url || '/').split('?')[0];
    const file = pathname === '/' ? 'index.html' : pathname.slice(1);
    if (!/^(index\.html|styles\.css|app\.js|catalog\.js|assets\/[a-z0-9-]+\.svg)$/.test(file)) {
      res.writeHead(404);
      return res.end('Page introuvable');
    }
    try {
      const data = await readFile(resolve(root, file));
      res.writeHead(200, { 'Content-Type': types[extname(file)], 'Cache-Control': 'no-cache', 'Content-Length': data.length });
      res.end(req.method === 'HEAD' ? undefined : data);
    } catch (error) {
      res.writeHead(error.code === 'ENOENT' ? 404 : 500);
      res.end(error.code === 'ENOENT' ? 'Page introuvable' : 'Erreur du serveur');
    }
  });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL(process.argv.includes('--source') ? './public/' : './dist/', import.meta.url));
  const port = Number(process.env.PORT || 3000);
  const server = makeServer(root);
  server.on('error', error => { console.error(error.message); process.exitCode = 1; });
  server.listen(port, process.env.HOST || '0.0.0.0', () => console.log(`Print démarré sur le port ${port}`));
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close());
}
