import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

async function updateFlatCards() {
  const flatFrontSrc = 'C:\\Users\\abhis\\.gemini\\antigravity\\brain\\cfd0b3d9-7c33-4f54-8d4c-cd328a422de0\\ahcs_card_front_flat_1791896858297.jpg';
  const flatBackSrc = 'C:\\Users\\abhis\\.gemini\\antigravity\\brain\\cfd0b3d9-7c33-4f54-8d4c-cd328a422de0\\ahcs_card_back_flat_1791896882926.jpg';

  // 1. Copy directly to project root as easy-to-access image files
  fs.copyFileSync(flatFrontSrc, 'AHCS_Card_Front_Only.jpg');
  fs.copyFileSync(flatBackSrc, 'AHCS_Card_Back_Only.jpg');
  fs.copyFileSync(flatFrontSrc, 'AHCS_Card_Front.jpg');
  fs.copyFileSync(flatBackSrc, 'AHCS_Card_Back.jpg');

  // 2. Copy to public/downloads
  const pubDir = path.join('public', 'downloads');
  if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });
  fs.copyFileSync(flatFrontSrc, path.join(pubDir, 'AHCS_Card_Front_Only.jpg'));
  fs.copyFileSync(flatBackSrc, path.join(pubDir, 'AHCS_Card_Back_Only.jpg'));
  fs.copyFileSync(flatFrontSrc, path.join(pubDir, 'AHCS_Card_Front.jpg'));
  fs.copyFileSync(flatBackSrc, path.join(pubDir, 'AHCS_Card_Back.jpg'));

  // 3. Regenerate pure CR80 PDF using the flat images
  const frontBytes = fs.readFileSync(flatFrontSrc);
  const backBytes = fs.readFileSync(flatBackSrc);

  const cr80Width = (85.60 / 25.4) * 72;
  const cr80Height = (53.98 / 25.4) * 72;

  const pdfDoc = await PDFDocument.create();
  const frontJpg = await pdfDoc.embedJpg(frontBytes);
  const backJpg = await pdfDoc.embedJpg(backBytes);

  // Page 1: Front Only
  const page1 = pdfDoc.addPage([cr80Width, cr80Height]);
  page1.drawImage(frontJpg, { x: 0, y: 0, width: cr80Width, height: cr80Height });

  // Page 2: Back Only
  const page2 = pdfDoc.addPage([cr80Width, cr80Height]);
  page2.drawImage(backJpg, { x: 0, y: 0, width: cr80Width, height: cr80Height });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('public/downloads/ahcs_smart_card_cr80.pdf', pdfBytes);
  fs.writeFileSync('C:\\Users\\abhis\\.gemini\\antigravity\\brain\\cfd0b3d9-7c33-4f54-8d4c-cd328a422de0\\ahcs_smart_card_cr80.pdf', pdfBytes);

  console.log('✅ Updated flat card files and regenerated PDF');
}

updateFlatCards().catch(console.error);
