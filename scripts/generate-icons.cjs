const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

// Create public folder if not exists
const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Create clean SVG icon for desktop/web
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#090d16" />
      <stop offset="50%" stop-color="#111827" />
      <stop offset="100%" stop-color="#1e1b4b" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="160" y1="140" x2="352" y2="140" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#FDE047" />
    </linearGradient>
    <linearGradient id="railGrad" x1="0" y1="120" x2="0" y2="400" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#A5B4FC" />
      <stop offset="100%" stop-color="#6366F1" />
    </linearGradient>
  </defs>

  <!-- Base background tile -->
  <rect width="512" height="512" rx="128" fill="url(#bgGrad)" />
  <rect x="16" y="16" width="480" height="480" rx="112" stroke="#4F46E5" stroke-opacity="0.3" stroke-width="8" />

  <!-- Rails -->
  <line x1="168" y1="120" x2="168" y2="400" stroke="url(#railGrad)" stroke-width="28" stroke-linecap="round" />
  <line x1="344" y1="120" x2="344" y2="400" stroke="url(#railGrad)" stroke-width="28" stroke-linecap="round" />

  <!-- Bottom Rung -->
  <rect x="154" y="328" width="204" height="38" rx="19" fill="#6366F1" />
  <!-- Middle Rung -->
  <rect x="154" y="236" width="204" height="38" rx="19" fill="#06B6D4" />
  <!-- Top Gold Rung -->
  <rect x="154" y="144" width="204" height="38" rx="19" fill="url(#goldGrad)" />

  <!-- Summit Star -->
  <polygon points="256,64 269,96 304,104 278,126 286,160 256,140 226,160 234,126 208,104 243,96" fill="#FBBF24" />
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf-8');
console.log('Created icon.svg');

// Helper to draw anti-aliased geometric primitives on a PNG
function renderAppIcon(width, height, isMaskable = false) {
  const png = new PNG({ width, height });

  // Scale factors
  const scale = width / 512;
  const contentScale = isMaskable ? 0.72 : 0.92;
  const cx = width / 2;
  const cy = height / 2;

  function toScreen(x, y) {
    const nx = (x - 256) * contentScale * scale + cx;
    const ny = (y - 256) * contentScale * scale + cy;
    return { x: nx, y: ny };
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;

      // Background color: deep night sky gradient
      const t = (x + y) / (width + height);
      let bgR = Math.round(9 * (1 - t) + 30 * t);
      let bgG = Math.round(13 * (1 - t) + 27 * t);
      let bgB = Math.round(22 * (1 - t) + 75 * t);
      let bgA = 255;

      // If not maskable, round corners with smooth antialiasing
      if (!isMaskable) {
        const cornerR = 96 * scale;
        const dx = Math.max(0, Math.max(cornerR - x, x - (width - cornerR)));
        const dy = Math.max(0, Math.max(cornerR - y, y - (height - cornerR)));
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > cornerR) {
          bgA = Math.max(0, Math.min(255, Math.round((cornerR + 1 - dist) * 255)));
        }
      }

      let r = bgR, g = bgG, b = bgB, a = bgA;

      // Check inner elements
      // Transform (x,y) to 512x512 virtual space
      const vx = (x - cx) / (contentScale * scale) + 256;
      const vy = (y - cy) / (contentScale * scale) + 256;

      // Rails: left rail x in [154, 182], y in [120, 400]
      // right rail x in [330, 358], y in [120, 400]
      const inRailL = Math.abs(vx - 168) <= 14 && vy >= 120 && vy <= 400;
      const inRailR = Math.abs(vx - 344) <= 14 && vy >= 120 && vy <= 400;

      // Bottom rung: x in [154, 358], y in [328, 366], rx 19
      const inRung1 = vx >= 154 && vx <= 358 && vy >= 328 && vy <= 366;
      // Mid rung: x in [154, 358], y in [236, 274], rx 19
      const inRung2 = vx >= 154 && vx <= 358 && vy >= 236 && vy <= 274;
      // Top rung: x in [154, 358], y in [144, 182], rx 19
      const inRung3 = vx >= 154 && vx <= 358 && vy >= 144 && vy <= 182;

      // Star distance from center (256, 112)
      const sdx = vx - 256;
      const sdy = vy - 112;
      const sDist = Math.sqrt(sdx * sdx + sdy * sdy);
      const inStarCore = sDist <= 28 && (Math.abs(sdx) <= 10 || Math.abs(sdy) <= 10 || (Math.abs(sdx) + Math.abs(sdy) <= 28));

      if (inStarCore) {
        // Gold star
        r = 251; g = 191; b = 36;
      } else if (inRung3) {
        // Top Gold Rung with subtle gradient
        const gt = (vx - 154) / 204;
        r = Math.round(245 * (1 - gt) + 253 * gt);
        g = Math.round(158 * (1 - gt) + 224 * gt);
        b = Math.round(11 * (1 - gt) + 71 * gt);
      } else if (inRung2) {
        // Cyan rung
        r = 6; g = 182; b = 212;
      } else if (inRung1) {
        // Indigo rung
        r = 99; g = 102; b = 241;
      } else if (inRailL || inRailR) {
        // Indigo rail gradient
        const rt = (vy - 120) / 280;
        r = Math.round(165 * (1 - rt) + 99 * rt);
        g = Math.round(180 * (1 - rt) + 102 * rt);
        b = Math.round(252 * (1 - rt) + 241 * rt);
      }

      png.data[idx] = r;
      png.data[idx + 1] = g;
      png.data[idx + 2] = b;
      png.data[idx + 3] = a;
    }
  }

  return png;
}

// Generate all required icons
const targets = [
  { name: 'pwa-192x192.png', size: 192, maskable: false },
  { name: 'pwa-512x512.png', size: 512, maskable: false },
  { name: 'pwa-maskable-512x512.png', size: 512, maskable: true },
  { name: 'apple-touch-icon.png', size: 180, maskable: false },
  { name: 'favicon.ico', size: 48, maskable: false },
];

targets.forEach(({ name, size, maskable }) => {
  const png = renderAppIcon(size, size, maskable);
  const outPath = path.join(publicDir, name);
  const buffer = PNG.sync.write(png);
  fs.writeFileSync(outPath, buffer);
  console.log(`Generated ${name} (${size}x${size}, maskable=${maskable})`);
});
