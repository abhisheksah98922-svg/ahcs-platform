import fs from 'fs';
import path from 'path';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Remove import lines for Navbar
  content = content.replace(/import\s*\{\s*Navbar\s*\}\s*from\s*['"][^'"]+['"];?\r?\n?/g, '');
  // Remove import lines for Footer
  content = content.replace(/import\s*\{\s*Footer\s*\}\s*from\s*['"][^'"]+['"];?\r?\n?/g, '');
  // Also handle combined: import { Navbar, Footer } from '...'
  content = content.replace(/import\s*\{\s*Navbar\s*,\s*Footer\s*\}\s*from\s*['"][^'"]+['"];?\r?\n?/g, '');
  content = content.replace(/import\s*\{\s*Footer\s*,\s*Navbar\s*\}\s*from\s*['"][^'"]+['"];?\r?\n?/g, '');

  // Remove <Navbar /> and <Footer /> JSX elements
  content = content.replace(/[ \t]*<Navbar\s*\/>\r?\n?/g, '');
  content = content.replace(/[ \t]*<Footer\s*\/>\r?\n?/g, '');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned: ${filePath}`);
  }
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.next') {
      walkDir(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx'))) {
      if (entry.name === 'layout.tsx') continue; // NEVER modify layout.tsx
      processFile(fullPath);
    }
  }
}

walkDir('app');
console.log('Finished removing redundant Navbars and Footers.');
