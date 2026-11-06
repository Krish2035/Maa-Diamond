const fs = require('fs');
const QRCode = require('./frontend/node_modules/qrcode');

async function main() {
  const targetUrl = 'http://localhost:3000/card';
  
  // 1. Generate QR Code as raw SVG
  const qrSvg = await QRCode.toString(targetUrl, {
    type: 'svg',
    margin: 1,
    color: {
      dark: '#0f172a',
      light: '#ffffff'
    }
  });

  // Extract inner SVG content (rects and paths)
  const qrInner = qrSvg
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>/, '')
    .trim();

  // 2. CR80 Portrait SVG Card (638 x 1012 px - 54mm x 85.6mm standard PVC visiting card)
  const portraitSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="638" height="1012" viewBox="0 0 638 1012">
  <defs>
    <filter id="cardShadow" x="-5%" y="-3%" width="110%" height="108%">
      <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#000000" flood-opacity="0.10"/>
    </filter>
  </defs>

  <!-- PVC Card Base (Clean White with Rounded Corners R=40) -->
  <rect x="8" y="8" width="622" height="996" rx="40" ry="40" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2.5" filter="url(#cardShadow)"/>

  <!-- TOP SECTION: BRAND & DIAMOND EMBLEM (Exact Replica of Screenshot 1 with Maa Diamond Branding) -->
  <g transform="translate(60, 60)">
    
    <!-- Left: Brand Name & Details -->
    <g transform="translate(0, 45)">
      <text x="0" y="40" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="40" font-weight="900" fill="#0F172A" letter-spacing="3">MAA DIAMOND</text>
      <text x="0" y="78" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="16" font-weight="700" fill="#D97706" letter-spacing="2">SURAT DIAMOND BOURSE</text>
      <text x="0" y="116" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="15" font-weight="600" fill="#64748B" letter-spacing="0.5">Haresh Patel &amp; Ketan Patel</text>
      <text x="0" y="148" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="13" font-weight="600" fill="#334155">+91 98250 88991  •  info@maadiamond.com</text>
    </g>

    <!-- Right: Geometric Diamond Emblem (Modeled on Screenshot 1) -->
    <g transform="translate(370, 40)">
      <!-- Outer Prism -->
      <polygon points="65,10 130,55 65,150 0,55" fill="none" stroke="#0F172A" stroke-width="4.5" stroke-linejoin="round"/>
      <!-- Internal Girdle Line -->
      <line x1="32" y1="55" x2="98" y2="55" stroke="#0F172A" stroke-width="3"/>
      <!-- Center Vertical Axis Line -->
      <line x1="65" y1="10" x2="65" y2="150" stroke="#0F172A" stroke-width="3"/>
      <!-- Facet Triangles -->
      <polygon points="65,10 32,55 65,150" fill="#0F172A" fill-opacity="0.12" stroke="#0F172A" stroke-width="2"/>
      <polygon points="65,10 98,55 65,150" fill="#D97706" fill-opacity="0.25" stroke="#0F172A" stroke-width="2"/>
      <polygon points="0,55 32,55 65,150" fill="#0F172A" fill-opacity="0.88" stroke="#0F172A" stroke-width="2"/>
      <polygon points="130,55 98,55 65,150" fill="#0F172A" fill-opacity="0.88" stroke="#0F172A" stroke-width="2"/>
    </g>
  </g>

  <!-- HORIZONTAL DIVIDING LINE (Matching Screenshot 1) -->
  <line x1="60" y1="320" x2="578" y2="320" stroke="#334155" stroke-width="2.5" stroke-linecap="round"/>

  <!-- BOTTOM SECTION: LARGE CRISP QR CODE (Centered) -->
  <g transform="translate(139, 390)">
    <!-- QR Background Box -->
    <rect x="-16" y="-16" width="392" height="392" rx="20" fill="#FFFFFF" stroke="#F1F5F9" stroke-width="2"/>
    
    <!-- Live Scannable Vector QR -->
    <g transform="scale(1.2)">
      ${qrInner}
    </g>
  </g>

  <!-- Bottom Details & Website Footer -->
  <text x="319" y="865" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="14" font-weight="800" fill="#0F172A" text-anchor="middle" letter-spacing="3">SCAN TO VIEW DIGITAL VCARD &amp; INVENTORY</text>
  <text x="319" y="905" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="12" font-weight="600" fill="#64748B" text-anchor="middle">Tower-D, Office 602, Surat Diamond Bourse, Khajod, Surat - 395007</text>
  <text x="319" y="935" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="13" font-weight="700" fill="#D97706" text-anchor="middle" letter-spacing="1.5">www.maadiamond.com</text>

</svg>`;

  fs.writeFileSync('frontend/public/maa-diamond-card-portrait.svg', portraitSvg);
  console.log('Saved frontend/public/maa-diamond-card-portrait.svg');

  // Also write to brain artifact directory so it is viewable
  fs.writeFileSync('C:/Users/DELL/.gemini/antigravity/brain/35cac826-a18a-47fb-a6b1-332873d2f70f/maa-diamond-card-portrait.svg', portraitSvg);
  console.log('Saved artifact maa-diamond-card-portrait.svg');
}

main().catch(console.error);

