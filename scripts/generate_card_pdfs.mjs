import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb } from 'pdf-lib';

async function generatePDFs() {
  const frontImgPath = 'C:\\Users\\abhis\\.gemini\\antigravity\\brain\\cfd0b3d9-7c33-4f54-8d4c-cd328a422de0\\ahcs_card_nophoto_front_1791875305698.jpg';
  const backImgPath = 'C:\\Users\\abhis\\.gemini\\antigravity\\brain\\cfd0b3d9-7c33-4f54-8d4c-cd328a422de0\\ahcs_card_nophoto_back_1791875343252.jpg';

  if (!fs.existsSync(frontImgPath) || !fs.existsSync(backImgPath)) {
    throw new Error('Image files not found!');
  }

  const frontBytes = fs.readFileSync(frontImgPath);
  const backBytes = fs.readFileSync(backImgPath);

  // ==========================================
  // 1. CR80 EXACT PVC CARD SIZE PDF (2 Pages)
  // Dimensions: 85.60 mm x 53.98 mm
  // In PDF Points (72 points/inch, 25.4 mm/inch):
  // Width: (85.60 / 25.4) * 72 = 242.65 pt
  // Height: (53.98 / 25.4) * 72 = 153.01 pt
  // ==========================================
  const cr80Width = (85.60 / 25.4) * 72;
  const cr80Height = (53.98 / 25.4) * 72;

  const cr80Doc = await PDFDocument.create();
  const frontJpg = await cr80Doc.embedJpg(frontBytes);
  const backJpg = await cr80Doc.embedJpg(backBytes);

  // Page 1: Front
  const page1 = cr80Doc.addPage([cr80Width, cr80Height]);
  page1.drawImage(frontJpg, {
    x: 0,
    y: 0,
    width: cr80Width,
    height: cr80Height,
  });

  // Page 2: Back
  const page2 = cr80Doc.addPage([cr80Width, cr80Height]);
  page2.drawImage(backJpg, {
    x: 0,
    y: 0,
    width: cr80Width,
    height: cr80Height,
  });

  const cr80PdfBytes = await cr80Doc.save();

  // ==========================================
  // 2. A4 PRINT-READY SHEET WITH CROP MARKS & GUIDELINES
  // Standard A4: 595.28 pt x 841.89 pt (210 mm x 297 mm)
  // Contains both Front & Back at exact 1:1 physical scale
  // ==========================================
  const a4Width = 595.28;
  const a4Height = 841.89;

  const a4Doc = await PDFDocument.create();
  const a4FrontJpg = await a4Doc.embedJpg(frontBytes);
  const a4BackJpg = await a4Doc.embedJpg(backBytes);

  const a4Page = a4Doc.addPage([a4Width, a4Height]);

  // Center horizontally
  const cardX = (a4Width - cr80Width) / 2;
  const topCardY = a4Height - 260;
  const bottomCardY = topCardY - cr80Height - 80;

  // Title & Headers
  // Draw Background Header Box
  a4Page.drawRectangle({
    x: 40,
    y: a4Height - 90,
    width: a4Width - 80,
    height: 50,
    color: rgb(0.06, 0.12, 0.25),
  });

  // Front Card Outline / Crop box
  a4Page.drawRectangle({
    x: cardX - 1,
    y: topCardY - 1,
    width: cr80Width + 2,
    height: cr80Height + 2,
    borderColor: rgb(0.7, 0.75, 0.8),
    borderWidth: 1,
  });

  // Draw Front Card
  a4Page.drawImage(a4FrontJpg, {
    x: cardX,
    y: topCardY,
    width: cr80Width,
    height: cr80Height,
  });

  // Back Card Outline / Crop box
  a4Page.drawRectangle({
    x: cardX - 1,
    y: bottomCardY - 1,
    width: cr80Width + 2,
    height: cr80Height + 2,
    borderColor: rgb(0.7, 0.75, 0.8),
    borderWidth: 1,
  });

  // Draw Back Card
  a4Page.drawImage(a4BackJpg, {
    x: cardX,
    y: bottomCardY,
    width: cr80Width,
    height: cr80Height,
  });

  const a4PdfBytes = await a4Doc.save();

  // Save locations
  const outDirArtifact = 'C:\\Users\\abhis\\.gemini\\antigravity\\brain\\cfd0b3d9-7c33-4f54-8d4c-cd328a422de0';
  const outDirPublic = path.join(process.cwd(), 'public', 'downloads');
  if (!fs.existsSync(outDirPublic)) {
    fs.mkdirSync(outDirPublic, { recursive: true });
  }

  // Write CR80 PDF
  fs.writeFileSync(path.join(outDirArtifact, 'ahcs_smart_card_cr80.pdf'), cr80PdfBytes);
  fs.writeFileSync(path.join(outDirPublic, 'ahcs_smart_card_cr80.pdf'), cr80PdfBytes);

  // Write A4 Sheet PDF
  fs.writeFileSync(path.join(outDirArtifact, 'ahcs_smart_card_a4_sheet.pdf'), a4PdfBytes);
  fs.writeFileSync(path.join(outDirPublic, 'ahcs_smart_card_a4_sheet.pdf'), a4PdfBytes);

  console.log('✅ Generated ahcs_smart_card_cr80.pdf (CR80 standard size)');
  console.log('✅ Generated ahcs_smart_card_a4_sheet.pdf (A4 printable sheet at 100% scale)');
}

generatePDFs().catch(console.error);
