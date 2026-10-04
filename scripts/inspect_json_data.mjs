import fs from 'fs';

try {
  const raw = fs.readFileSync('data/ahcs_production.json', 'utf8');
  const data = JSON.parse(raw);
  console.log('JSON Data Collections:');
  for (const [key, val] of Object.entries(data)) {
    if (Array.isArray(val)) {
      console.log(`- ${key}: ${val.length} records`);
    }
  }
} catch (e) {
  console.log('No data/ahcs_production.json or parse error:', e.message);
}
