import fs from 'fs';
import path from 'path';

const frontSrc = 'C:\\Users\\abhis\\.gemini\\antigravity\\brain\\cfd0b3d9-7c33-4f54-8d4c-cd328a422de0\\ahcs_card_nophoto_front_1791875305698.jpg';
const backSrc = 'C:\\Users\\abhis\\.gemini\\antigravity\\brain\\cfd0b3d9-7c33-4f54-8d4c-cd328a422de0\\ahcs_card_nophoto_back_1791875343252.jpg';

// Copy to project root for instant access
fs.copyFileSync(frontSrc, 'AHCS_Card_Front.jpg');
fs.copyFileSync(backSrc, 'AHCS_Card_Back.jpg');

// Copy to public/downloads
const pubDownloads = path.join('public', 'downloads');
if (!fs.existsSync(pubDownloads)) fs.mkdirSync(pubDownloads, { recursive: true });
fs.copyFileSync(frontSrc, path.join(pubDownloads, 'AHCS_Card_Front.jpg'));
fs.copyFileSync(backSrc, path.join(pubDownloads, 'AHCS_Card_Back.jpg'));

// Also create a standalone print_card.html that opens directly in Chrome/Edge
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AHCS Smart Health Card - Print Preview (CR80 Standard)</title>
  <style>
    @page {
      size: A4;
      margin: 15mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #f1f5f9;
      color: #0f172a;
      margin: 0;
      padding: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .no-print-bar {
      background: #0f172a;
      color: #fff;
      padding: 16px 24px;
      border-radius: 12px;
      margin-bottom: 24px;
      display: flex;
      gap: 16px;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .print-btn {
      background: #2563eb;
      color: white;
      border: none;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
    }
    .print-btn:hover {
      background: #1d4ed8;
    }
    .sheet {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      display: flex;
      flex-direction: column;
      gap: 30px;
      align-items: center;
    }
    .card-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .card-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
    }
    /* EXACT CR80 PHYSICAL DIMENSIONS: 85.60mm x 53.98mm */
    .card-box {
      width: 85.60mm;
      height: 53.98mm;
      border-radius: 3.18mm;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      border: 1px solid #cbd5e1;
    }
    .card-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .no-print-bar {
        display: none;
      }
      .sheet {
        box-shadow: none;
        padding: 0;
      }
      .card-box {
        box-shadow: none;
        border: 0.5pt dashed #94a3b8;
      }
    }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <div>
      <strong>AHCS Smart Health Card (Front & Back)</strong>
      <div style="font-size: 12px; color: #94a3b8; margin-top: 2px;">Standard CR80 Size: 85.60 mm x 53.98 mm (Exact 1:1 Scale)</div>
    </div>
    <button class="print-btn" onclick="window.print()">🖨️ Print Now (Ctrl + P)</button>
  </div>

  <div class="sheet">
    <div class="card-container">
      <div class="card-title">Front Side (Aage Ka Hissa)</div>
      <div class="card-box">
        <img src="AHCS_Card_Front.jpg" alt="AHCS Card Front">
      </div>
    </div>

    <div class="card-container">
      <div class="card-title">Back Side (Peeche Ka Hissa)</div>
      <div class="card-box">
        <img src="AHCS_Card_Back.jpg" alt="AHCS Card Back">
      </div>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync('print_card.html', htmlContent, 'utf8');
fs.writeFileSync(path.join(pubDownloads, 'print_card.html'), htmlContent, 'utf8');

console.log('✅ Prepared AHCS_Card_Front.jpg, AHCS_Card_Back.jpg, and print_card.html');
