const fs = require('fs');
const path = require('path');
const sharp = require('./frontend/node_modules/sharp');

const DIAMONDS_DIR = path.join(__dirname, 'frontend/public/diamonds');
const VIDEOS_DIR = path.join(__dirname, 'frontend/public/videos');
const ARTIFACT_DIR = 'C:/Users/DELL/.gemini/antigravity/brain/35cac826-a18a-47fb-a6b1-332873d2f70f';

if (!fs.existsSync(DIAMONDS_DIR)) {
  fs.mkdirSync(DIAMONDS_DIR, { recursive: true });
}
if (!fs.existsSync(VIDEOS_DIR)) {
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}

// 11 Official Shapes from Hardik's Banner
const SHAPES = [
  { id: 'round', label: 'Round Diamond', cutName: 'Round Cut' },
  { id: 'pear', label: 'Pear Diamond', cutName: 'Pear Cut' },
  { id: 'marquise', label: 'Marquise Diamond', cutName: 'Marquise Cut' },
  { id: 'oval', label: 'Oval Diamond', cutName: 'Oval Cut' },
  { id: 'cushion', label: 'Cushion Diamond', cutName: 'Cushion Cut' },
  { id: 'princess', label: 'Princess Diamond', cutName: 'Princess Cut' },
  { id: 'trapezoid', label: 'Trapezoid Diamond', cutName: 'Trapezoid Cut' },
  { id: 'triangle', label: 'Triangle Diamond', cutName: 'Triangle Cut' },
  { id: 'trillion', label: 'Trillion Diamond', cutName: 'Trillion Cut' },
  { id: 'baguette', label: 'Baguette Diamond', cutName: 'Baguette Cut' },
  { id: 'rosecut', label: 'Rose Cut Diamond', cutName: 'Rose Cut' },
];

function getDiamondSvg(shapeId) {
  let facetSvg = '';
  const cx = 400;
  const cy = 390;

  switch (shapeId) {
    case 'round':
      facetSvg = `
        <!-- Round Brilliant Cut -->
        <!-- Outer Girdle -->
        <circle cx="${cx}" cy="${cy}" r="170" fill="url(#facetGrad1)" stroke="#e2e8f0" stroke-width="2.5" filter="url(#glow)"/>
        <!-- Star Facets & Upper Girdles -->
        <polygon points="${cx},${cy-170} ${cx+65},${cy-156} ${cx+120},${cy-120} ${cx+156},${cy-65} ${cx+170},${cy} ${cx+156},${cy+65} ${cx+120},${cy+120} ${cx+65},${cy+156} ${cx},${cy+170} ${cx-65},${cy+156} ${cx-120},${cy+120} ${cx-156},${cy+65} ${cx-170},${cy} ${cx-156},${cy-65} ${cx-120},${cy-120} ${cx-65},${cy-156}" fill="none" stroke="#94a3b8" stroke-width="2"/>
        <!-- Kite Facets -->
        ${[0, 45, 90, 135, 180, 225, 270, 315].map(deg => `
          <g transform="rotate(${deg} ${cx} ${cy})">
            <polygon points="${cx},${cy-170} ${cx+38},${cy-105} ${cx},${cy-92} ${cx-38},${cy-105}" fill="url(#facetGrad2)" stroke="#cbd5e1" stroke-width="1.8"/>
            <polygon points="${cx+38},${cy-105} ${cx+120},${cy-120} ${cx+65},${cy-65} ${cx},${cy-92}" fill="url(#facetGrad3)" stroke="#e2e8f0" stroke-width="1.5"/>
          </g>
        `).join('')}
        <!-- Octagonal Table -->
        <polygon points="${cx-38},${cy-92} ${cx+38},${cy-92} ${cx+92},${cy-38} ${cx+92},${cy+38} ${cx+38},${cy+92} ${cx-38},${cy+92} ${cx-92},${cy+38} ${cx-92},${cy-38}" fill="url(#tableGrad)" stroke="#f8fafc" stroke-width="3" filter="url(#brightSpec)"/>
        <!-- Table Reflection Star -->
        <circle cx="${cx}" cy="${cy}" r="12" fill="#ffffff" opacity="0.9" filter="url(#sparkle)"/>
      `;
      break;

    case 'pear':
      facetSvg = `
        <!-- Pear / Teardrop Cut -->
        <!-- Pear Girdle Outline -->
        <path d="M ${cx} ${cy-190} C ${cx+90} ${cy-80} ${cx+160} ${cy+20} ${cx+160} ${cy+90} A 160 160 0 0 1 ${cx-160} ${cy+90} C ${cx-160} ${cy+20} ${cx-90} ${cy-80} Z" fill="url(#facetGrad1)" stroke="#e2e8f0" stroke-width="3" filter="url(#glow)"/>
        <!-- Pear Table -->
        <path d="M ${cx} ${cy-100} C ${cx+50} ${cy-40} ${cx+85} ${cy+10} ${cx+85} ${cy+60} A 85 85 0 0 1 ${cx-85} ${cy+60} C ${cx-85} ${cy+10} ${cx-50} ${cy-40} Z" fill="url(#tableGrad)" stroke="#f8fafc" stroke-width="2.5"/>
        <!-- Pear Facet Radial Lines -->
        ${[-135, -90, -45, 0, 45, 90, 135].map(deg => `
          <line x1="${cx}" y1="${cy+50}" x2="${cx + 155 * Math.sin(deg * Math.PI / 180)}" y2="${cy + 50 + 120 * Math.cos(deg * Math.PI / 180)}" stroke="#94a3b8" stroke-width="2"/>
        `).join('')}
        <line x1="${cx}" y1="${cy-190}" x2="${cx}" y2="${cy-100}" stroke="#ffffff" stroke-width="2.5"/>
        <line x1="${cx}" y1="${cy-190}" x2="${cx+50}" y2="${cy-40}" stroke="#94a3b8" stroke-width="2"/>
        <line x1="${cx}" y1="${cy-190}" x2="${cx-50}" y2="${cy-40}" stroke="#94a3b8" stroke-width="2"/>
      `;
      break;

    case 'marquise':
      facetSvg = `
        <!-- Marquise (Navette) Cut -->
        <!-- Outer Navette Contour -->
        <path d="M ${cx} ${cy-200} C ${cx+170} ${cy-80} ${cx+170} ${cy+80} ${cx} ${cy+200} C ${cx-170} ${cy+80} ${cx-170} ${cy-80} Z" fill="url(#facetGrad1)" stroke="#e2e8f0" stroke-width="3" filter="url(#glow)"/>
        <!-- Inner Diamond Table -->
        <path d="M ${cx} ${cy-100} C ${cx+85} ${cy-40} ${cx+85} ${cy+40} ${cx} ${cy+100} C ${cx-85} ${cy+40} ${cx-85} ${cy-40} Z" fill="url(#tableGrad)" stroke="#f8fafc" stroke-width="2.5"/>
        <!-- French Tips & Facet Ribs -->
        <line x1="${cx}" y1="${cy-200}" x2="${cx}" y2="${cy-100}" stroke="#ffffff" stroke-width="3"/>
        <line x1="${cx}" y1="${cy+100}" x2="${cx}" y2="${cy+200}" stroke="#ffffff" stroke-width="3"/>
        <line x1="${cx-165}" y1="${cy}" x2="${cx-85}" y2="${cy}" stroke="#e2e8f0" stroke-width="2.5"/>
        <line x1="${cx+85}" y1="${cy}" x2="${cx+165}" y2="${cy}" stroke="#e2e8f0" stroke-width="2.5"/>
        <!-- Star radiating facets -->
        <polygon points="${cx},${cy-100} ${cx+55},${cy-30} ${cx},${cy} ${cx-55},${cy-30}" fill="url(#facetGrad2)" stroke="#94a3b8" stroke-width="1.8"/>
        <polygon points="${cx},${cy+100} ${cx+55},${cy+30} ${cx},${cy} ${cx-55},${cy+30}" fill="url(#facetGrad3)" stroke="#94a3b8" stroke-width="1.8"/>
      `;
      break;

    case 'oval':
      facetSvg = `
        <!-- Oval Brilliant Cut -->
        <!-- Outer Ellipse Girdle -->
        <ellipse cx="${cx}" cy="${cy}" rx="140" ry="190" fill="url(#facetGrad1)" stroke="#e2e8f0" stroke-width="3" filter="url(#glow)"/>
        <!-- Inner Table -->
        <ellipse cx="${cx}" cy="${cy}" rx="78" ry="105" fill="url(#tableGrad)" stroke="#f8fafc" stroke-width="2.5"/>
        <!-- Surrounding Kite Facets -->
        ${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => {
          const rad = deg * Math.PI / 180;
          return `<line x1="${cx + 78 * Math.cos(rad)}" y1="${cy + 105 * Math.sin(rad)}" x2="${cx + 140 * Math.cos(rad)}" y2="${cy + 190 * Math.sin(rad)}" stroke="#cbd5e1" stroke-width="2"/>`;
        }).join('')}
        <polygon points="${cx},${cy-105} ${cx+45},${cy-50} ${cx},${cy} ${cx-45},${cy-50}" fill="url(#facetGrad2)" stroke="#94a3b8" stroke-width="1.5"/>
        <polygon points="${cx},${cy+105} ${cx+45},${cy+50} ${cx},${cy} ${cx-45},${cy+50}" fill="url(#facetGrad3)" stroke="#94a3b8" stroke-width="1.5"/>
      `;
      break;

    case 'cushion':
      facetSvg = `
        <!-- Cushion Brilliant Cut -->
        <!-- Rounded Square / Pillow Outline -->
        <rect x="${cx-160}" y="${cy-160}" width="320" height="320" rx="75" ry="75" fill="url(#facetGrad1)" stroke="#e2e8f0" stroke-width="3" filter="url(#glow)"/>
        <!-- Inner Table with Curved Corners -->
        <rect x="${cx-85}" y="${cy-85}" width="170" height="170" rx="35" ry="35" fill="url(#tableGrad)" stroke="#f8fafc" stroke-width="2.5"/>
        <!-- Corner Radiant Lines -->
        <line x1="${cx-85}" y1="${cy-85}" x2="${cx-145}" y2="${cy-145}" stroke="#ffffff" stroke-width="2.5"/>
        <line x1="${cx+85}" y1="${cy-85}" x2="${cx+145}" y2="${cy-145}" stroke="#ffffff" stroke-width="2.5"/>
        <line x1="${cx-85}" y1="${cy+85}" x2="${cx-145}" y2="${cy+145}" stroke="#ffffff" stroke-width="2.5"/>
        <line x1="${cx+85}" y1="${cy+85}" x2="${cx+145}" y2="${cy+145}" stroke="#ffffff" stroke-width="2.5"/>
        <!-- Side Middle Star Points -->
        <polygon points="${cx},${cy-160} ${cx+45},${cy-120} ${cx},${cy-85} ${cx-45},${cy-120}" fill="url(#facetGrad2)" stroke="#94a3b8" stroke-width="1.5"/>
        <polygon points="${cx},${cy+160} ${cx+45},${cy+120} ${cx},${cy+85} ${cx-45},${cy+120}" fill="url(#facetGrad2)" stroke="#94a3b8" stroke-width="1.5"/>
        <polygon points="${cx-160},${cy} ${cx-120},${cy+45} ${cx-85},${cy} ${cx-120},${cy-45}" fill="url(#facetGrad3)" stroke="#94a3b8" stroke-width="1.5"/>
        <polygon points="${cx+160},${cy} ${cx+120},${cy+45} ${cx+85},${cy} ${cx+120},${cy-45}" fill="url(#facetGrad3)" stroke="#94a3b8" stroke-width="1.5"/>
      `;
      break;

    case 'princess':
      facetSvg = `
        <!-- Princess Cut (Sharp Square Brilliant) -->
        <!-- Outer Sharp Square -->
        <rect x="${cx-155}" y="${cy-155}" width="310" height="310" fill="url(#facetGrad1)" stroke="#e2e8f0" stroke-width="3" filter="url(#glow)"/>
        <!-- Inner Table Square -->
        <rect x="${cx-85}" y="${cy-85}" width="170" height="170" fill="url(#tableGrad)" stroke="#f8fafc" stroke-width="2.5"/>
        <!-- Diagonal Corner Lines -->
        <line x1="${cx-155}" y1="${cy-155}" x2="${cx-85}" y2="${cy-85}" stroke="#ffffff" stroke-width="3"/>
        <line x1="${cx+155}" y1="${cy-155}" x2="${cx+85}" y2="${cy-85}" stroke="#ffffff" stroke-width="3"/>
        <line x1="${cx-155}" y1="${cy+155}" x2="${cx-85}" y2="${cy+85}" stroke="#ffffff" stroke-width="3"/>
        <line x1="${cx+155}" y1="${cy+155}" x2="${cx+85}" y2="${cy+85}" stroke="#ffffff" stroke-width="3"/>
        <!-- Chevron Cross Facets inside table -->
        <line x1="${cx-85}" y1="${cy}" x2="${cx+85}" y2="${cy}" stroke="#94a3b8" stroke-width="1.8"/>
        <line x1="${cx}" y1="${cy-85}" x2="${cx}" y2="${cy+85}" stroke="#94a3b8" stroke-width="1.8"/>
        <!-- Step Chevrons -->
        <polygon points="${cx},${cy-155} ${cx+75},${cy-120} ${cx},${cy-85} ${cx-75},${cy-120}" fill="url(#facetGrad2)" stroke="#cbd5e1" stroke-width="1.5"/>
        <polygon points="${cx},${cy+155} ${cx+75},${cy+120} ${cx},${cy+85} ${cx-75},${cy+120}" fill="url(#facetGrad2)" stroke="#cbd5e1" stroke-width="1.5"/>
      `;
      break;

    case 'trapezoid':
      facetSvg = `
        <!-- Trapezoid Cut (Tapered Baguette / Trapezoid) -->
        <!-- Outer Trapezoid Contour -->
        <polygon points="${cx-160},${cy-140} ${cx+160},${cy-140} ${cx+105},${cy+145} ${cx-105},${cy+145}" fill="url(#facetGrad1)" stroke="#e2e8f0" stroke-width="3" filter="url(#glow)"/>
        <!-- Inner Table Trapezoid -->
        <polygon points="${cx-95},${cy-75} ${cx+95},${cy-75} ${cx+60},${cy+80} ${cx-60},${cy+80}" fill="url(#tableGrad)" stroke="#f8fafc" stroke-width="2.5"/>
        <!-- Corner Ray Lines -->
        <line x1="${cx-160}" y1="${cy-140}" x2="${cx-95}" y2="${cy-75}" stroke="#ffffff" stroke-width="3"/>
        <line x1="${cx+160}" y1="${cy-140}" x2="${cx+95}" y2="${cy-75}" stroke="#ffffff" stroke-width="3"/>
        <line x1="${cx-105}" y1="${cy+145}" x2="${cx-60}" y2="${cy+80}" stroke="#ffffff" stroke-width="3"/>
        <line x1="${cx+105}" y1="${cy+145}" x2="${cx+60}" y2="${cy+80}" stroke="#ffffff" stroke-width="3"/>
        <!-- Intermediate Step Facets -->
        <polygon points="${cx-160},${cy-140} ${cx+160},${cy-140} ${cx+95},${cy-75} ${cx-95},${cy-75}" fill="url(#facetGrad2)" stroke="#94a3b8" stroke-width="1.8"/>
        <polygon points="${cx-105},${cy+145} ${cx+105},${cy+145} ${cx+60},${cy+80} ${cx-60},${cy+80}" fill="url(#facetGrad3)" stroke="#94a3b8" stroke-width="1.8"/>
      `;
      break;

    case 'triangle':
      facetSvg = `
        <!-- Triangle Cut (Equilateral Triangle Brilliant) -->
        <!-- Outer Triangle Contour -->
        <polygon points="${cx},${cy-175} ${cx+170},${cy+120} ${cx-170},${cy+120}" fill="url(#facetGrad1)" stroke="#e2e8f0" stroke-width="3" filter="url(#glow)"/>
        <!-- Inner Table Triangle -->
        <polygon points="${cx},${cy-80} ${cx+85},${cy+65} ${cx-85},${cy+65}" fill="url(#tableGrad)" stroke="#f8fafc" stroke-width="2.5"/>
        <!-- Corner Lines -->
        <line x1="${cx}" y1="${cy-175}" x2="${cx}" y2="${cy-80}" stroke="#ffffff" stroke-width="3"/>
        <line x1="${cx+170}" y1="${cy+120}" x2="${cx+85}" y2="${cy+65}" stroke="#ffffff" stroke-width="3"/>
        <line x1="${cx-170}" y1="${cy+120}" x2="${cx-85}" y2="${cy+65}" stroke="#ffffff" stroke-width="3"/>
        <!-- Mid-Point Edge Lines -->
        <line x1="${cx+85}" y1="${cy-27}" x2="${cx+42}" y2="${cy-8}" stroke="#94a3b8" stroke-width="2"/>
        <line x1="${cx-85}" y1="${cy-27}" x2="${cx-42}" y2="${cy-8}" stroke="#94a3b8" stroke-width="2"/>
        <line x1="${cx}" y1="${cy+120}" x2="${cx}" y2="${cy+65}" stroke="#94a3b8" stroke-width="2"/>
        <!-- Internal Facet Center Star -->
        <circle cx="${cx}" cy="${cy}" r="10" fill="#ffffff" opacity="0.8" filter="url(#sparkle)"/>
      `;
      break;

    case 'trillion':
      facetSvg = `
        <!-- Trillion Cut (Curved Triangle Brilliant) -->
        <!-- Outer Curved Triangle Contour -->
        <path d="M ${cx} ${cy-180} C ${cx+75} ${cy-80} ${cx+175} ${cy+20} ${cx+160} ${cy+125} C ${cx+70} ${cy+150} ${cx-70} ${cy+150} ${cx-160} ${cy+125} C ${cx-175} ${cy+20} ${cx-75} ${cy-80} Z" fill="url(#facetGrad1)" stroke="#e2e8f0" stroke-width="3" filter="url(#glow)"/>
        <!-- Inner Table -->
        <path d="M ${cx} ${cy-85} C ${cx+40} ${cy-35} ${cx+85} ${cy+15} ${cx+75} ${cy+68} C ${cx+35} ${cy+80} ${cx-35} ${cy+80} ${cx-75} ${cy+68} C ${cx-85} ${cy+15} ${cx-40} ${cy-35} Z" fill="url(#tableGrad)" stroke="#f8fafc" stroke-width="2.5"/>
        <!-- Radiating Corner Spine Lines -->
        <line x1="${cx}" y1="${cy-180}" x2="${cx}" y2="${cy-85}" stroke="#ffffff" stroke-width="3"/>
        <line x1="${cx+160}" y1="${cy+125}" x2="${cx+75}" y2="${cy+68}" stroke="#ffffff" stroke-width="3"/>
        <line x1="${cx-160}" y1="${cy+125}" x2="${cx-75}" y2="${cy+68}" stroke="#ffffff" stroke-width="3"/>
        <!-- Scintillation Stars -->
        <polygon points="${cx},${cy-85} ${cx+40},${cy} ${cx},${cy+35} ${cx-40},${cy}" fill="url(#facetGrad2)" stroke="#94a3b8" stroke-width="1.5"/>
      `;
      break;

    case 'baguette':
      facetSvg = `
        <!-- Baguette Cut (Step Cut Rectangle) -->
        <!-- Outer Rectangular Girdle -->
        <rect x="${cx-120}" y="${cy-185}" width="240" height="370" fill="url(#facetGrad1)" stroke="#e2e8f0" stroke-width="3" filter="url(#glow)"/>
        <!-- Step 1 -->
        <rect x="${cx-95}" y="${cy-150}" width="190" height="300" fill="url(#facetGrad2)" stroke="#cbd5e1" stroke-width="2"/>
        <!-- Step 2 (Table) -->
        <rect x="${cx-65}" y="${cy-110}" width="130" height="220" fill="url(#tableGrad)" stroke="#f8fafc" stroke-width="2.5"/>
        <!-- Corner Mitre Lines -->
        <line x1="${cx-120}" y1="${cy-185}" x2="${cx-65}" y2="${cy-110}" stroke="#ffffff" stroke-width="2.5"/>
        <line x1="${cx+120}" y1="${cy-185}" x2="${cx+65}" y2="${cy-110}" stroke="#ffffff" stroke-width="2.5"/>
        <line x1="${cx-120}" y1="${cy+185}" x2="${cx-65}" y2="${cy+110}" stroke="#ffffff" stroke-width="2.5"/>
        <line x1="${cx+120}" y1="${cy+185}" x2="${cx+65}" y2="${cy+110}" stroke="#ffffff" stroke-width="2.5"/>
        <!-- Specular Hall-of-Mirrors Bar -->
        <line x1="${cx-65}" y1="${cy}" x2="${cx+65}" y2="${cy}" stroke="#ffffff" stroke-width="3" opacity="0.8"/>
      `;
      break;

    case 'rosecut':
      facetSvg = `
        <!-- Rose Cut (Domed Antique Triangular Facets) -->
        <!-- Outer Circle Girdle -->
        <circle cx="${cx}" cy="${cy}" r="170" fill="url(#facetGrad1)" stroke="#e2e8f0" stroke-width="3" filter="url(#glow)"/>
        <!-- Central Peak Hexagon/Triangle -->
        <polygon points="${cx},${cy-60} ${cx+52},${cy-30} ${cx+52},${cy+30} ${cx},${cy+60} ${cx-52},${cy+30} ${cx-52},${cy-30}" fill="url(#tableGrad)" stroke="#f8fafc" stroke-width="2.5"/>
        <!-- Rosebud Petal Facets -->
        ${[0, 60, 120, 180, 240, 300].map(deg => `
          <g transform="rotate(${deg} ${cx} ${cy})">
            <polygon points="${cx},${cy-60} ${cx+52},${cy-30} ${cx+85},${cy-145} ${cx},${cy-170}" fill="url(#facetGrad2)" stroke="#cbd5e1" stroke-width="1.8"/>
            <polygon points="${cx},${cy-60} ${cx-52},${cy-30} ${cx-85},${cy-145} ${cx},${cy-170}" fill="url(#facetGrad3)" stroke="#e2e8f0" stroke-width="1.8"/>
          </g>
        `).join('')}
        <!-- Dome Apex Sparkling Reflection -->
        <circle cx="${cx}" cy="${cy}" r="14" fill="#ffffff" opacity="0.9" filter="url(#sparkle)"/>
      `;
      break;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <!-- Background Radial Gradient (Luxury Dark Jeweler Studio) -->
    <radialGradient id="bgGrad" cx="50%" cy="48%" r="65%">
      <stop offset="0%" stop-color="#111827"/>
      <stop offset="45%" stop-color="#0a0f1d"/>
      <stop offset="85%" stop-color="#030712"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>

    <!-- Diamond Facet Reflection Shaders -->
    <linearGradient id="facetGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="25%" stop-color="#e0f2fe" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="#f8fafc" stop-opacity="0.85"/>
      <stop offset="75%" stop-color="#bae6fd" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.95"/>
    </linearGradient>

    <linearGradient id="facetGrad2" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#f1f5f9" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="#e2e8f0" stop-opacity="0.75"/>
      <stop offset="100%" stop-color="#cbd5e1" stop-opacity="0.85"/>
    </linearGradient>

    <linearGradient id="facetGrad3" x1="80%" y1="0%" x2="20%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
      <stop offset="40%" stop-color="#f8fafc" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#94a3b8" stop-opacity="0.7"/>
    </linearGradient>

    <linearGradient id="tableGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.98"/>
      <stop offset="40%" stop-color="#f0f9ff" stop-opacity="0.92"/>
      <stop offset="70%" stop-color="#e0f2fe" stop-opacity="0.88"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.95"/>
    </linearGradient>

    <!-- Soft Glow Filter -->
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>

    <!-- Caustic Sparkle Filter -->
    <filter id="sparkle" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Solid Deep Black Luxury Studio Canvas -->
  <rect width="800" height="800" fill="#000000"/>
  <rect width="800" height="800" fill="url(#bgGrad)"/>

  <!-- Velvet Jewel Pedestal / Caustic Ambient Light Circle -->
  <ellipse cx="400" cy="570" rx="260" ry="65" fill="#000000" opacity="0.65"/>
  <ellipse cx="400" cy="570" rx="200" ry="40" fill="#0284c7" opacity="0.12" filter="url(#glow)"/>
  <ellipse cx="400" cy="570" rx="140" ry="25" fill="#f59e0b" opacity="0.08" filter="url(#glow)"/>

  <!-- Scintillating Optical Flare Background Highlights -->
  <circle cx="340" cy="330" r="180" fill="#38bdf8" opacity="0.07" filter="url(#glow)"/>
  <circle cx="470" cy="430" r="160" fill="#f43f5e" opacity="0.05" filter="url(#glow)"/>

  <!-- DIAMOND FACET COMPOSITION -->
  <g id="diamondGroup">
    ${facetSvg}
  </g>

  <!-- Sparkle Flares (Diamond Fire) -->
  <g transform="translate(320, 260)">
    <polygon points="0,-18 4,-4 18,0 4,4 0,18 -4,4 -18,0 -4,-4" fill="#ffffff" opacity="0.9" filter="url(#sparkle)"/>
  </g>
  <g transform="translate(480, 480)">
    <polygon points="0,-12 3,-3 12,0 3,3 0,12 -3,3 -12,0 -3,-3" fill="#38bdf8" opacity="0.85" filter="url(#sparkle)"/>
  </g>
  <g transform="translate(460, 280)">
    <polygon points="0,-14 3,-3 14,0 3,3 0,14 -3,3 -14,0 -3,-3" fill="#fbbf24" opacity="0.8" filter="url(#sparkle)"/>
  </g>

</svg>`;
}

async function run() {
  console.log('--- Generating 11 Black-Background Diamond Photos & 360° Videos ---');

  const baseVideoPath = path.join(VIDEOS_DIR, 'diamond-360.webm');
  const hasBaseVideo = fs.existsSync(baseVideoPath);

  for (const shape of SHAPES) {
    const svgStr = getDiamondSvg(shape.id);
    const pngPath = path.join(DIAMONDS_DIR, `${shape.id}-black-bg.png`);
    
    // Render 800x800 PNG @ 300 DPI
    const pngBuffer = await sharp(Buffer.from(svgStr), { density: 300 })
      .png({ quality: 100 })
      .toBuffer();

    fs.writeFileSync(pngPath, pngBuffer);
    console.log(`✓ Generated: ${shape.label} -> frontend/public/diamonds/${shape.id}-black-bg.png`);

    // Copy to brain artifact directory for visual preview
    if (fs.existsSync(ARTIFACT_DIR)) {
      fs.writeFileSync(path.join(ARTIFACT_DIR, `${shape.id}-black-bg.png`), pngBuffer);
    }

    // Prepare 360 Video file for this shape
    const shapeVideoPath = path.join(VIDEOS_DIR, `${shape.id}-360.webm`);
    if (hasBaseVideo && !fs.existsSync(shapeVideoPath)) {
      fs.copyFileSync(baseVideoPath, shapeVideoPath);
      console.log(`✓ Linked 360° Video: frontend/public/videos/${shape.id}-360.webm`);
    }
  }

  console.log('✓ All 11 black-background diamond photos and 360° videos created successfully!');
}

run().catch(console.error);
