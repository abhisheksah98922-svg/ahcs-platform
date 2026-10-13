import fs from 'fs';
import path from 'path';

const cardsDir = path.join('public', 'cards');
if (!fs.existsSync(cardsDir)) {
  fs.mkdirSync(cardsDir, { recursive: true });
}

// Copy Navy cards
if (fs.existsSync('AHCS_Card_Front_Navy.jpg')) {
  fs.copyFileSync('AHCS_Card_Front_Navy.jpg', path.join(cardsDir, 'navy-front.jpg'));
}
if (fs.existsSync('AHCS_Card_Back_Navy.jpg')) {
  fs.copyFileSync('AHCS_Card_Back_Navy.jpg', path.join(cardsDir, 'navy-back.jpg'));
}

// Copy Emerald cards
if (fs.existsSync('AHCS_Card_Front_Emerald.jpg')) {
  fs.copyFileSync('AHCS_Card_Front_Emerald.jpg', path.join(cardsDir, 'emerald-front.jpg'));
}
if (fs.existsSync('AHCS_Card_Back_Emerald.jpg')) {
  fs.copyFileSync('AHCS_Card_Back_Emerald.jpg', path.join(cardsDir, 'emerald-back.jpg'));
}

console.log('✅ Prepared public/cards/ with all card theme images:', fs.readdirSync(cardsDir));
