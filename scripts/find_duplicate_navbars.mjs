import fs from 'fs';
import path from 'path';

function checkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.next') {
      checkDir(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx'))) {
      if (entry.name === 'layout.tsx') continue; // Root layout is expected to have Navbar/Footer
      const content = fs.readFileSync(fullPath, 'utf8');
      const hasNavbar = content.includes('<Navbar');
      const hasFooter = content.includes('<Footer');
      if (hasNavbar || hasFooter) {
        console.log(`FOUND in ${fullPath}: Navbar=${hasNavbar}, Footer=${hasFooter}`);
      }
    }
  }
}

checkDir('app');
