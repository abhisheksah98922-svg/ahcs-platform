import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

async function applyProperCards() {
  const frontSrc = 'C:\\Users\\abhis\\.gemini\\antigravity\\brain\\cfd0b3d9-7c33-4f54-8d4c-cd328a422de0\\ahcs_card_front_proper_1791898350280.jpg';
  const backSrc = 'C:\\Users\\abhis\\.gemini\\antigravity\\brain\\cfd0b3d9-7c33-4f54-8d4c-cd328a422de0\\ahcs_card_back_proper_1791898379062.jpg';

  // 1. Copy to root directory with friendly names
  fs.copyFileSync(frontSrc, 'AHCS_Card_Front_Official.jpg');
  fs.copyFileSync(backSrc, 'AHCS_Card_Back_Official.jpg');
  fs.copyFileSync(frontSrc, 'AHCS_Card_Front.jpg');
  fs.copyFileSync(backSrc, 'AHCS_Card_Back.jpg');

  // 2. Copy to public/downloads
  const pubDir = path.join('public', 'downloads');
  if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });
  fs.copyFileSync(frontSrc, path.join(pubDir, 'AHCS_Card_Front_Official.jpg'));
  fs.copyFileSync(backSrc, path.join(pubDir, 'AHCS_Card_Back_Official.jpg'));
  fs.copyFileSync(frontSrc, path.join(pubDir, 'AHCS_Card_Front.jpg'));
  fs.copyFileSync(backSrc, path.join(pubDir, 'AHCS_Card_Back.jpg'));

  // 3. Regenerate CR80 and A4 PDFs
  const frontBytes = fs.readFileSync(frontSrc);
  const backBytes = fs.readFileSync(backSrc);

  const cr80Width = (85.60 / 25.4) * 72;
  const cr80Height = (53.98 / 25.4) * 72;

  // CR80 Document (2 Pages, exact card dimensions)
  const cr80Doc = await PDFDocument.create();
  const cr80Front = await cr80Doc.embedJpg(frontBytes);
  const cr80Back = await cr80Doc.embedJpg(backBytes);

  const p1 = cr80Doc.addPage([cr80Width, cr80Height]);
  p1.drawImage(cr80Front, { x: 0, y: 0, width: cr80Width, height: cr80Height });

  const p2 = cr80Doc.addPage([cr80Width, cr80Height]);
  p2.drawImage(cr80Back, { x: 0, y: 0, width: cr80Width, height: cr80Height });

  const cr80PdfBytes = await cr80Doc.save();
  fs.writeFileSync('public/downloads/ahcs_smart_card_cr80.pdf', cr80PdfBytes);
  fs.writeFileSync('C:\\Users\\abhis\\.gemini\\antigravity\\brain\\cfd0b3d9-7c33-4f54-8d4c-cd328a422de0\\ahcs_smart_card_cr80.pdf', cr80PdfBytes);

  // A4 Document (Both cards at exact 1:1 scale on standard sheet)
  const a4Width = 595.28;
  const a4Height = 841.89;
  const a4Doc = await PDFDocument.create();
  const a4Front = await a4Doc.embedJpg(frontBytes);
  const a4Back = await a4Doc.embedJpg(backBytes);

  const a4Page = a4Doc.addPage([a4Width, a4Height]);
  const cardX = (a4Width - cr80Width) / 2;
  const topY = a4Height - 240;
  const botY = topY - cr80Height - 60;

  a4Page.drawImage(a4Front, { x: cardX, y: topY, width: cr80Width, height: cr80Height });
  a4Page.drawImage(a4Back, { x: cardX, y: botY, width: cr80Width, height: cr80Height });

  const a4PdfBytes = await a4Doc.save();
  fs.writeFileSync('public/downloads/ahcs_smart_card_a4_sheet.pdf', a4PdfBytes);
  fs.writeFileSync('C:\\Users\\abhis\\.gemini\\antigravity\\brain\\cfd0b3d9-7c33-4f54-8d4c-cd328a422de0\\ahcs_smart_card_a4_sheet.pdf', a4PdfBytes);

  console.log('✅ Applied proper card graphics and regenerated PDFs!');
}

applyProperCards().catch(console.error);
