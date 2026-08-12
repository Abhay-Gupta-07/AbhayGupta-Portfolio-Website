import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const framesDir = path.join(__dirname, '../public/assets/frames');

if (!fs.existsSync(framesDir)) {
  fs.mkdirSync(framesDir, { recursive: true });
}

console.log('Generating 192 frame asset structure in public/assets/frames/...');

// Generate 192 SVG/JPG frame placeholder files with glowing dark sci-fi graphics
for (let i = 1; i <= 192; i++) {
  const frameNum = String(i).padStart(3, '0');
  const filePath = path.join(framesDir, `frame_${frameNum}.jpg`);
  
  // Create high-tech SVG representation converted to frame file
  const hue = Math.floor((i / 192) * 40); // Shift towards deep crimson
  const scale = (1 + (i / 192) * 0.5).toFixed(2);
  const opacity = (0.2 + Math.sin((i / 192) * Math.PI) * 0.6).toFixed(2);

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
    <defs>
      <radialGradient id="bg" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="#1f070a"/>
        <stop offset="60%" stop-color="#0e0405"/>
        <stop offset="100%" stop-color="#0a0404"/>
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="15" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <rect width="1280" height="720" fill="url(#bg)"/>
    <g filter="url(#glow)">
      <circle cx="640" cy="360" r="${180 * parseFloat(scale)}" fill="none" stroke="#ff1e2d" stroke-width="2" stroke-dasharray="15 10" opacity="${opacity}"/>
      <circle cx="640" cy="360" r="${100 * parseFloat(scale)}" fill="none" stroke="#ff4d5a" stroke-width="1.5" opacity="${opacity}"/>
      <text x="640" y="365" fill="#ffffff" font-family="sans-serif" font-size="28" font-weight="bold" text-anchor="middle" letter-spacing="4" opacity="${opacity}">ABHAY_GUPTA // FRAME ${frameNum}</text>
    </g>
  </svg>`;

  fs.writeFileSync(filePath, svgContent);
}

console.log('Successfully generated 192 image frames in public/assets/frames/!');
