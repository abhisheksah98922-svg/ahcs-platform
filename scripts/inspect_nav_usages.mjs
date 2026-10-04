import fs from 'fs';
import path from 'path';

function inspectUsages(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.next') {
      inspectUsages(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx'))) {
      if (entry.name === 'layout.tsx') continue;
      const content = fs.readFileSync(fullPath, 'utf8');
      const navMatches = content.match(/<Navbar[^>]*>/g);
      const footerMatches = content.match(/<Footer[^>]*>/g);
      if (navMatches || footerMatches) {
        console.log(`${fullPath}: Nav=${JSON.stringify(navMatches)}, Foot=${JSON.stringify(footerMatches)}`);
      }
    }
  }
}

inspectUsages('app');
