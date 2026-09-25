import fs from 'fs';
import path from 'path';

const APP_DIR = path.join(process.cwd(), 'app');
const COMPONENTS_DIR = path.join(process.cwd(), 'components');

function getFiles(dir, exts = ['.tsx', '.ts', '.jsx', '.js']) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(getFiles(filePath, exts));
    } else if (exts.includes(path.extname(file))) {
      results.push(filePath);
    }
  }
  return results;
}

const allSourceFiles = [...getFiles(APP_DIR), ...getFiles(COMPONENTS_DIR)];

const hrefRegex = /href=["'](\/[^"'#?]*)["']/g;
const linksFound = new Set();
const fileLinkMap = {};

for (const file of allSourceFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    const link = match[1];
    if (link.startsWith('/_next') || link.startsWith('/api')) continue;
    linksFound.add(link);
    if (!fileLinkMap[link]) fileLinkMap[link] = [];
    fileLinkMap[link].push(path.relative(process.cwd(), file));
  }
}

console.log('--- ALL UNIQUE INTERNAL LINKS FOUND ---');
const sortedLinks = Array.from(linksFound).sort();
const deadLinks = [];

for (const link of sortedLinks) {
  // Check if page exists in app/
  // Link: "/" -> app/page.tsx
  // Link: "/apply" -> app/apply/page.tsx
  // Link: "/e/..." -> dynamic route app/e/[token]/page.tsx
  let exists = false;
  if (link === '/') {
    exists = fs.existsSync(path.join(APP_DIR, 'page.tsx')) || fs.existsSync(path.join(APP_DIR, 'page.js'));
  } else {
    const cleanLink = link.replace(/^\//, '');
    const directPath = path.join(APP_DIR, cleanLink, 'page.tsx');
    const directPathJs = path.join(APP_DIR, cleanLink, 'page.js');
    if (fs.existsSync(directPath) || fs.existsSync(directPathJs)) {
      exists = true;
    } else {
      // Check dynamic routes
      const segments = cleanLink.split('/');
      let curr = APP_DIR;
      let matched = true;
      for (const seg of segments) {
        if (fs.existsSync(path.join(curr, seg))) {
          curr = path.join(curr, seg);
        } else {
          // Look for [param] directory
          const subdirs = fs.existsSync(curr) ? fs.readdirSync(curr) : [];
          const dynDir = subdirs.find(d => d.startsWith('[') && d.endsWith(']'));
          if (dynDir) {
            curr = path.join(curr, dynDir);
          } else {
            matched = false;
            break;
          }
        }
      }
      if (matched && (fs.existsSync(path.join(curr, 'page.tsx')) || fs.existsSync(path.join(curr, 'page.js')))) {
        exists = true;
      }
    }
  }

  if (exists) {
    console.log(`✅ [200 OK] ${link}`);
  } else {
    console.log(`❌ [404 NOT FOUND] ${link} (Used in: ${fileLinkMap[link].join(', ')})`);
    deadLinks.push({ link, sources: fileLinkMap[link] });
  }
}

console.log('\n--- AUDIT SUMMARY ---');
console.log(`Total Unique Links: ${sortedLinks.length}`);
console.log(`Working Routes: ${sortedLinks.length - deadLinks.length}`);
console.log(`Dead Links (404): ${deadLinks.length}`);
if (deadLinks.length > 0) {
  console.log('\nDEAD LINKS TO FIX:');
  console.log(JSON.stringify(deadLinks, null, 2));
}
