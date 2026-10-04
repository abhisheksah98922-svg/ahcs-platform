import fs from 'fs';
import path from 'path';

function findPageFiles(dir, base = '') {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(base, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findPageFiles(fullPath, relPath));
    } else if (entry.name === 'page.tsx' || entry.name === 'page.jsx' || entry.name === 'route.ts' || entry.name === 'route.js') {
      results.push(relPath.replace(/\\/g, '/'));
    }
  }
  return results;
}

const routes = findPageFiles('app');
console.log('Total routes found:', routes.length);
console.log(JSON.stringify(routes, null, 2));
