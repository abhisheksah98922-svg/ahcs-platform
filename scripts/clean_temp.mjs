import fs from 'fs';

const files = ['d.name))', '{', 'data/ahcs_production.json.1790948377557.tmp'];
for (const f of files) {
  if (fs.existsSync(f)) {
    fs.unlinkSync(f);
    console.log('Removed:', f);
  }
}
