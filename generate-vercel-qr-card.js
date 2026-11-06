const fs = require('fs');
const path = require('path');
const QRCode = require('./frontend/node_modules/qrcode');
const sharp = require('./frontend/node_modules/sharp');

const TARGET_URL = 'https://maa-diamond.vercel.app';
const ARTIFACT_DIR = 'C:/Users/DELL/.gemini/antigravity/brain/35cac826-a18a-47fb-a6b1-332873d2f70f';

async function generate() {
  console.log(`Generating QR code and Card for: ${TARGET_URL}`);

  // 1. Generate standalone high-res QR Code (SVG & PNG)
  const standaloneQrSvg = await QRCode.toString(TARGET_URL, {
    type: 'svg',
    margin: 2,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#0f172a',
      light: '#ffffff',
    },
  });

  fs.writeFileSync('frontend/public/maa-diamond-website-qr.svg', standaloneQrSvg);
  if (fs.existsSync(ARTIFACT_DIR)) {
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'maa-diamond-website-qr.svg'), standaloneQrSvg);
  }

  await QRCode.toFile('frontend/public/maa-diamond-website-qr.png', TARGET_URL, {
    width: 1024,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#0f172a',
      light: '#ffffff',
    },
  });

  if (fs.existsSync(ARTIFACT_DIR)) {
    fs.copyFileSync(
      'frontend/public/maa-diamond-website-qr.png',
      path.join(ARTIFACT_DIR, 'maa-diamond-website-qr.png')
    );
  }
  console.log('✓ Standalone QR code saved (SVG & PNG 1024x1024)');

  // 2. Generate QR SVG path specifically for the Card
  const cardQrSvg = await QRCode.toString(TARGET_URL, {
    type: 'svg',
    margin: 1,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#0f172a',
      light: '#ffffff',
    },
  });

  const qrInner = cardQrSvg
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>/, '')
    .trim();

  // 3. CR80 Landscape PVC Visiting Card (1012 x 638 px @ 300 DPI standard)
  const horizontalCardSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1012" height="638" viewBox="0 0 1012 638">
  <defs>
    <filter id="cardShadow" x="-3%" y="-4%" width="106%" height="108%">
      <feDropShadow dx="0" dy="8" stdDeviation="14" flood-color="#000000" flood-opacity="0.08"/>
    </filter>
  </defs>

  <!-- PVC Card Base (Clean Luxury White with Rounded Corners R=38) -->
  <rect x="8" y="8" width="996" height="622" rx="38" ry="38" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2.5" filter="url(#cardShadow)"/>

  <!-- Outer Double Luxury Inset Border (Matching user's Screenshot) -->
  <rect x="22" y="22" width="968" height="594" rx="28" ry="28" fill="none" stroke="#F1F5F9" stroke-width="2"/>

  <!-- ======================================================== -->
  <!-- LEFT HALF: DIAMOND EMBLEM & BRAND DETAILS -->
  <!-- ======================================================== -->
  <g transform="translate(253, 0)">
    
    <!-- Geometric Diamond Facet Emblem (Centered at X=253) -->
    <g transform="translate(-80, 145)">
      <!-- Outer Brilliant Contour -->
      <polygon points="30,15 130,15 155,56 80,145 5,56" fill="none" stroke="#0F172A" stroke-width="4.5" stroke-linejoin="round"/>
      
      <!-- Girdle Horizontal Separation Line -->
      <line x1="5" y1="56" x2="155" y2="56" stroke="#0F172A" stroke-width="3.5"/>
      
      <!-- Crown Central Table Triangle (Solid Black) -->
      <polygon points="55,15 105,15 80,56" fill="#0F172A" stroke="#0F172A" stroke-width="2.5"/>
      
      <!-- Crown Side Star Facet Lines -->
      <line x1="30" y1="15" x2="80" y2="56" stroke="#0F172A" stroke-width="2.5"/>
      <line x1="130" y1="15" x2="80" y2="56" stroke="#0F172A" stroke-width="2.5"/>
      
      <!-- Center Vertical Pavilion Spine Line -->
      <line x1="80" y1="56" x2="80" y2="145" stroke="#0F172A" stroke-width="3"/>
      
      <!-- Pavilion Lower Left Facet (Solid Black) -->
      <polygon points="5,56 46,56 80,145" fill="#0F172A" stroke="#0F172A" stroke-width="2"/>
      
      <!-- Pavilion Lower Right Facet (Solid Black) -->
      <polygon points="155,56 114,56 80,145" fill="#0F172A" stroke="#0F172A" stroke-width="2"/>
    </g>

    <!-- Brand Typography (Matching user's Screenshot) -->
    <text x="0" y="360" font-family="'Cinzel', 'Playfair Display', Calibri, 'Segoe UI', Arial, sans-serif" font-size="34" font-weight="900" fill="#0F172A" text-anchor="middle" letter-spacing="4">MAA DIAMOND</text>
    <text x="0" y="400" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="14.5" font-weight="800" fill="#2563EB" text-anchor="middle" letter-spacing="3">SURAT DIAMOND BOURSE</text>
    <text x="0" y="432" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="12.5" font-weight="600" fill="#64748B" text-anchor="middle" letter-spacing="1">Haresh Patel &amp; Ketan Patel</text>
    <text x="0" y="458" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="12" font-weight="700" fill="#0F172A" text-anchor="middle" letter-spacing="0.5">+91 98250 88991</text>
  </g>

  <!-- ======================================================== -->
  <!-- CENTER VERTICAL DIVIDER LINE (Exact Replica of Screenshot) -->
  <!-- ======================================================== -->
  <line x1="506" y1="140" x2="506" y2="500" stroke="#334155" stroke-width="2.5" stroke-linecap="round"/>

  <!-- ======================================================== -->
  <!-- RIGHT HALF: CRISP LIVE SCANNABLE VERCEL WEBSITE QR CODE -->
  <!-- ======================================================== -->
  <g transform="translate(629, 175)">
    <!-- QR Card Container Pad -->
    <rect x="-14" y="-14" width="288" height="288" rx="18" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
    
    <!-- Rendered QR Vector (Points to https://maa-diamond.vercel.app) -->
    <g transform="scale(0.8125)">
      ${qrInner}
    </g>
  </g>

  <!-- Action Callout & Website Footer -->
  <text x="759" y="495" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="12" font-weight="900" fill="#0F172A" text-anchor="middle" letter-spacing="2">SCAN TO OPEN WEBSITE</text>
  <text x="759" y="520" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="11" font-weight="600" fill="#64748B" text-anchor="middle">Tower-D, Office 602, SDB, Surat</text>
  <text x="759" y="542" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="11.5" font-weight="800" fill="#2563EB" text-anchor="middle" letter-spacing="1">maa-diamond.vercel.app</text>

</svg>`;

  // 4. Save SVG Card files
  fs.writeFileSync('frontend/public/maa-diamond-card-horizontal.svg', horizontalCardSvg);
  fs.writeFileSync('frontend/public/maa-diamond-card.svg', horizontalCardSvg);
  if (fs.existsSync(ARTIFACT_DIR)) {
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'maa-diamond-card-horizontal.svg'), horizontalCardSvg);
  }
  console.log('✓ Horizontal SVG card saved');

  // 5. Convert SVG to High-Resolution 300 DPI PNG using Sharp
  const pngBuffer = await sharp(Buffer.from(horizontalCardSvg), { density: 300 })
    .png()
    .toBuffer();

  fs.writeFileSync('frontend/public/maa-diamond-card-horizontal.png', pngBuffer);
  fs.writeFileSync('frontend/public/maa-diamond-card-preview.png', pngBuffer);
  if (fs.existsSync(ARTIFACT_DIR)) {
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'maa-diamond-card-horizontal.png'), pngBuffer);
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'maa-diamond-card-preview.png'), pngBuffer);
  }
  console.log('✓ High-resolution PNG card saved (300 DPI print-ready)');
}

generate().catch(console.error);
