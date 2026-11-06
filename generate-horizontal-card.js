const fs = require('fs');
const QRCode = require('./frontend/node_modules/qrcode');

async function main() {
  const targetUrl = 'https://maa-diamond.vercel.app';

  // Generate QR as raw SVG
  const qrSvg = await QRCode.toString(targetUrl, {
    type: 'svg',
    margin: 1,
    color: {
      dark: '#0f172a',
      light: '#ffffff'
    }
  });

  const qrInner = qrSvg
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>/, '')
    .trim();

  // CR80 Standard Landscape dimensions: 1012 x 638 px (85.6mm x 54mm @ 300 DPI)
  // Perfectly matching Screenshot 2!
  const horizontalSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1012" height="638" viewBox="0 0 1012 638">
  <defs>
    <filter id="cardShadow" x="-3%" y="-4%" width="106%" height="108%">
      <feDropShadow dx="0" dy="8" stdDeviation="14" flood-color="#000000" flood-opacity="0.08"/>
    </filter>
  </defs>

  <!-- PVC Card Base (Clean Luxury White with Rounded Corners R=38) -->
  <rect x="8" y="8" width="996" height="622" rx="38" ry="38" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2.5" filter="url(#cardShadow)"/>

  <!-- LEFT HALF: DIAMOND EMBLEM & BRAND NAME (Modeled on Screenshot 2) -->
  <g transform="translate(253, 0)">
    
    <!-- Geometric Diamond Emblem (Centered at X=253) -->
    <g transform="translate(-80, 155)">
      <!-- Outer Outline -->
      <polygon points="30,15 130,15 155,56 80,140 5,56" fill="none" stroke="#0F172A" stroke-width="4.5" stroke-linejoin="round"/>
      
      <!-- Girdle Horizontal Line -->
      <line x1="5" y1="56" x2="155" y2="56" stroke="#0F172A" stroke-width="3.5"/>
      
      <!-- Crown Central Downward Triangle (Filled) -->
      <polygon points="55,15 105,15 80,56" fill="#0F172A" stroke="#0F172A" stroke-width="2.5"/>
      
      <!-- Crown Side Lines -->
      <line x1="30" y1="15" x2="80" y2="56" stroke="#0F172A" stroke-width="2.5"/>
      <line x1="130" y1="15" x2="80" y2="56" stroke="#0F172A" stroke-width="2.5"/>
      
      <!-- Center Vertical Spine Line -->
      <line x1="80" y1="56" x2="80" y2="140" stroke="#0F172A" stroke-width="3"/>
      
      <!-- Pavilion Lower Left Facet (Filled) -->
      <polygon points="5,56 46,56 80,140" fill="#0F172A" stroke="#0F172A" stroke-width="2"/>
      
      <!-- Pavilion Lower Right Facet (Filled) -->
      <polygon points="155,56 114,56 80,140" fill="#0F172A" stroke="#0F172A" stroke-width="2"/>
    </g>

    <!-- Company Name (Centered horizontally below emblem) -->
    <text x="0" y="365" font-family="'Cinzel', 'Playfair Display', 'Times New Roman', Georgia, serif" font-size="34" font-weight="900" fill="#0F172A" text-anchor="middle" letter-spacing="5">MAA DIAMOND</text>
    <text x="0" y="405" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="14" font-weight="800" fill="#D97706" text-anchor="middle" letter-spacing="3.5">SURAT DIAMOND BOURSE</text>
    <text x="0" y="435" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="12" font-weight="600" fill="#64748B" text-anchor="middle" letter-spacing="1">Haresh Patel &amp; Ketan Patel</text>
  </g>

  <!-- CENTER VERTICAL DIVIDING LINE (Exact Replica of Screenshot 2) -->
  <line x1="506" y1="145" x2="506" y2="493" stroke="#334155" stroke-width="2.5" stroke-linecap="round"/>

  <!-- RIGHT HALF: CRISP CENTERED SCANNABLE QR CODE (Centered at X=759, Y=319) -->
  <g transform="translate(629, 189)">
    <!-- QR Background Pad -->
    <rect x="-14" y="-14" width="288" height="288" rx="16" fill="#FFFFFF" stroke="#F1F5F9" stroke-width="1.5"/>
    
    <!-- Rendered QR Vector (260x260) -->
    <g transform="scale(0.8125)">
      ${qrInner}
    </g>
  </g>

  <!-- Scan Prompt & Address (Clean Subtle Footer) -->
  <text x="759" y="505" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="11" font-weight="800" fill="#0F172A" text-anchor="middle" letter-spacing="2">SCAN FOR DIGITAL VCARD</text>
  <text x="759" y="530" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="10.5" font-weight="600" fill="#64748B" text-anchor="middle">Tower-D, Office 602, SDB, Surat</text>
  <text x="759" y="550" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="10" font-weight="700" fill="#D97706" text-anchor="middle" letter-spacing="1">www.maadiamond.com</text>

</svg>`;

  fs.writeFileSync('frontend/public/maa-diamond-card-horizontal.svg', horizontalSvg);
  fs.writeFileSync('frontend/public/maa-diamond-card.svg', horizontalSvg);
  fs.writeFileSync('C:/Users/DELL/.gemini/antigravity/brain/35cac826-a18a-47fb-a6b1-332873d2f70f/maa-diamond-card-horizontal.svg', horizontalSvg);
  console.log('Successfully generated horizontal SVG card');
}

main().catch(console.error);

