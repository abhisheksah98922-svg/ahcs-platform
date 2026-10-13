import fs from 'fs';

const cr80 = 'public/downloads/ahcs_smart_card_cr80.pdf';
const a4 = 'public/downloads/ahcs_smart_card_a4_sheet.pdf';

console.log('CR80 PDF exists:', fs.existsSync(cr80), 'Size:', fs.statSync(cr80).size, 'bytes');
console.log('A4 Sheet PDF exists:', fs.existsSync(a4), 'Size:', fs.statSync(a4).size, 'bytes');
