/**
 * Official FIFA World Cup 2026 Match Ball - "TRIONDA"
 * Authentic 4-panel aerodynamic wave design honoring the three host nations:
 * - Canada: Vibrant Crimson Red & Maple Leaf iconography
 * - Mexico: Emerald Green & Aztec Eagle iconography
 * - USA: Royal Navy Blue & Celestial Stars iconography
 * - Championship Metallic Gold ribbons & FIFA World Cup Trophy
 * - Official Adidas 3-bars logo, "TRIONDA" wordmark, FIFA Quality Pro seal,
 *   and Connected Ball Technology 500Hz sensor telemetry.
 */

import * as THREE from 'three';

export type WorldCupBallEdition = 'trionda_official' | 'trionda_final';

export interface BallTextureSet {
  diffuseMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
}

// Cache textures so we don't recreate them needlessly
const textureCache = new Map<WorldCupBallEdition, BallTextureSet>();

/**
 * Creates the high-resolution authentic 2026 World Cup ball texture set
 */
export function getWorldCup2026BallTextures(edition: WorldCupBallEdition = 'trionda_official'): BallTextureSet {
  const cached = textureCache.get(edition);
  if (cached) return cached;

  const diffuseCanvas = document.createElement('canvas');
  diffuseCanvas.width = 2048;
  diffuseCanvas.height = 1024;
  const ctx = diffuseCanvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 1024;
  bumpCanvas.height = 512;
  const bCtx = bumpCanvas.getContext('2d')!;

  if (edition === 'trionda_official') {
    renderTriondaOfficial(ctx, 2048, 1024);
    renderBumpAndDimples(bCtx, 1024, 512, false);
  } else {
    renderTriondaFinal(ctx, 2048, 1024);
    renderBumpAndDimples(bCtx, 1024, 512, true);
  }

  const diffuseMap = new THREE.CanvasTexture(diffuseCanvas);
  diffuseMap.wrapS = THREE.RepeatWrapping;
  diffuseMap.wrapT = THREE.ClampToEdgeWrapping;
  diffuseMap.anisotropy = 16;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.ClampToEdgeWrapping;
  bumpMap.anisotropy = 16;

  const roughnessMap = bumpMap.clone();
  roughnessMap.needsUpdate = true;

  const result: BallTextureSet = { diffuseMap, bumpMap, roughnessMap };
  textureCache.set(edition, result);
  return result;
}

// ---------------------------------------------------------------------------
// 1. Drawing Helper Functions (Maple Leaf, Eagle, Star, Logos, Waves)
// ---------------------------------------------------------------------------

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerR: number, innerR: number, fillColor: string, strokeColor?: string) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerR);

  for (let i = 0; i < spikes; i++) {
    let x = cx + Math.cos(rot) * outerR;
    let y = cy + Math.sin(rot) * outerR;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerR;
    y = cy + Math.sin(rot) * innerR;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerR);
  ctx.closePath();

  ctx.fillStyle = fillColor;
  ctx.fill();
  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = outerR * 0.12;
    ctx.stroke();
  }
  ctx.restore();
}

function drawMapleLeaf(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number, color: string) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.fillStyle = color;
  ctx.beginPath();

  // Stylized modern geometric Canadian Maple Leaf
  ctx.moveTo(0, -28);
  ctx.lineTo(5, -18);
  ctx.lineTo(14, -20);
  ctx.lineTo(10, -12);
  ctx.lineTo(24, -8);
  ctx.lineTo(16, 2);
  ctx.lineTo(20, 10);
  ctx.lineTo(10, 8);
  ctx.lineTo(14, 18);
  ctx.lineTo(4, 14);
  ctx.lineTo(2, 28); // stem right
  ctx.lineTo(-2, 28); // stem left
  ctx.lineTo(-4, 14);
  ctx.lineTo(-14, 18);
  ctx.lineTo(-10, 8);
  ctx.lineTo(-20, 10);
  ctx.lineTo(-16, 2);
  ctx.lineTo(-24, -8);
  ctx.lineTo(-10, -12);
  ctx.lineTo(-14, -20);
  ctx.lineTo(-5, -18);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawAztecEagle(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number, color: string) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.fillStyle = color;

  ctx.beginPath();
  // Stylized dynamic eagle silhouette with spread wings
  ctx.moveTo(0, -22); // eagle head / beak
  ctx.lineTo(6, -18);
  ctx.lineTo(14, -24); // wing top right
  ctx.lineTo(26, -14);
  ctx.lineTo(34, -2);
  ctx.lineTo(22, 6);
  ctx.lineTo(14, 16); // tail right
  ctx.lineTo(0, 24); // tail bottom
  ctx.lineTo(-14, 16);
  ctx.lineTo(-22, 6);
  ctx.lineTo(-34, -2);
  ctx.lineTo(-26, -14);
  ctx.lineTo(-14, -24); // wing top left
  ctx.lineTo(-6, -18);
  ctx.closePath();
  ctx.fill();

  // Eagle head eye detail
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(2, -18, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawAdidasLogo(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number, color: string) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.fillStyle = color;

  // The 3 iconic diagonal sloping performance bars
  const angle = -0.6; // ~35 deg tilt
  ctx.rotate(angle);

  // Bar 1 (Shortest)
  ctx.fillRect(-22, 10, 8, 16);
  // Bar 2 (Medium)
  ctx.fillRect(-10, 0, 8, 26);
  // Bar 3 (Tallest)
  ctx.fillRect(2, -10, 8, 36);

  ctx.rotate(-angle);

  // 'adidas' wordmark
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.letterSpacing = '1px';
  ctx.fillText('adidas', 0, 22);
  ctx.restore();
}

function drawFIFA2026Logo(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number, isGoldEdition: boolean) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Background subtle glow disc
  const glow = ctx.createRadialGradient(0, 0, 5, 0, 0, 48);
  glow.addColorStop(0, isGoldEdition ? 'rgba(234, 179, 8, 0.4)' : 'rgba(255, 255, 255, 0.8)');
  glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, 48, 0, Math.PI * 2);
  ctx.fill();

  // Official bold stacked "26"
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '900 44px "Chakra Petch", "Arial Black", sans-serif';

  // Number 26 in solid bold
  ctx.fillStyle = isGoldEdition ? '#fef08a' : '#0f172a';
  ctx.fillText('26', 0, -8);

  // Golden World Cup Trophy in center of 26
  ctx.fillStyle = '#f59e0b';
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 1.5;

  // Trophy base and globe
  ctx.beginPath();
  // Globe at top
  ctx.arc(0, -14, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Trophy winged body
  ctx.beginPath();
  ctx.moveTo(-5, -7);
  ctx.quadraticCurveTo(-8, 3, -4, 9);
  ctx.lineTo(4, 9);
  ctx.quadraticCurveTo(8, 3, 5, -7);
  ctx.closePath();
  ctx.fillStyle = '#fbbf24';
  ctx.fill();
  ctx.stroke();

  // Trophy pedestal base
  ctx.fillStyle = '#065f46'; // Malachite bands
  ctx.fillRect(-6, 9, 12, 3);
  ctx.fillStyle = '#d97706';
  ctx.fillRect(-7, 12, 14, 4);

  // FIFA WORLD CUP 2026 header text
  ctx.font = 'bold 9px sans-serif';
  ctx.fillStyle = isGoldEdition ? '#fbbf24' : '#1e293b';
  ctx.letterSpacing = '1px';
  ctx.fillText('FIFA WORLD CUP', 0, 22);

  ctx.font = 'bold 7px sans-serif';
  ctx.fillStyle = isGoldEdition ? '#f97316' : '#64748b';
  ctx.letterSpacing = '1.5px';
  ctx.fillText('CANADA • MEXICO • USA', 0, 31);

  ctx.restore();
}

function drawConnectedBallBadge(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number, isGoldEdition: boolean) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Circular radar/chip indicator
  ctx.strokeStyle = isGoldEdition ? '#f59e0b' : '#0284c7';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 20, 0, Math.PI * 2);
  ctx.stroke();

  // Radial telemetry dashes
  ctx.setLineDash([3, 4]);
  ctx.beginPath();
  ctx.arc(0, 0, 26, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Central chip square
  ctx.fillStyle = isGoldEdition ? '#fbbf24' : '#0284c7';
  ctx.fillRect(-6, -6, 12, 12);

  // Center pulse dot
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.fill();

  // Sensor label
  ctx.font = 'bold 8px monospace';
  ctx.fillStyle = isGoldEdition ? '#fef08a' : '#0369a1';
  ctx.textAlign = 'center';
  ctx.fillText('CONNECTED BALL', 0, 36);
  ctx.font = 'bold 7px monospace';
  ctx.fillStyle = isGoldEdition ? '#fcd34d' : '#0284c7';
  ctx.fillText('500Hz SENSOR CHIP', 0, 46);

  ctx.restore();
}

function drawFIFAQualityProSeal(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number, isGold: boolean) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Rounded rectangle seal
  ctx.strokeStyle = isGold ? '#fbbf24' : '#0f172a';
  ctx.lineWidth = 2.5;
  ctx.fillStyle = isGold ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.9)';

  const w = 48;
  const h = 56;
  const r = 6;
  ctx.beginPath();
  ctx.roundRect(-w / 2, -h / 2, w, h, r);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = isGold ? '#fbbf24' : '#0f172a';

  ctx.font = '900 13px sans-serif';
  ctx.fillText('FIFA', 0, -12);

  ctx.font = 'bold 8px sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('QUALITY', 0, 0);

  ctx.font = '900 10px sans-serif';
  ctx.fillText('PRO', 0, 13);

  ctx.font = '6px monospace';
  ctx.fillStyle = isGold ? '#fef08a' : '#64748b';
  ctx.fillText('1004286', 0, 22);

  ctx.restore();
}

// ---------------------------------------------------------------------------
// 2. Render Official TRIONDA Match Ball
// ---------------------------------------------------------------------------

function renderTriondaOfficial(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // 1. Pearl White Base with subtle iridescence
  const baseGrad = ctx.createLinearGradient(0, 0, width, height);
  baseGrad.addColorStop(0, '#f8fafc');
  baseGrad.addColorStop(0.3, '#f1f5f9');
  baseGrad.addColorStop(0.7, '#ffffff');
  baseGrad.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle pearlescent hexagon micro-mesh
  ctx.strokeStyle = 'rgba(203, 213, 225, 0.25)';
  ctx.lineWidth = 1;
  const hexSize = 24;
  for (let y = 0; y < height; y += hexSize * 1.5) {
    for (let x = 0; x < width; x += hexSize * 1.732) {
      const offsetX = ((y / (hexSize * 1.5)) % 2) * (hexSize * 0.866);
      ctx.strokeRect(x + offsetX, y, hexSize, hexSize);
    }
  }

  // 2. Wave Panel Ribbons across 4 quadrants (representing 4 interlocking panels)
  const numPanels = 4;
  const panelWidth = width / numPanels;

  for (let p = 0; p < numPanels; p++) {
    const startX = p * panelWidth;

    // --- Wave 1: CANADA CRIMSON RED WAVE ---
    ctx.save();
    const canGrad = ctx.createLinearGradient(startX, 0, startX + panelWidth, height);
    canGrad.addColorStop(0, '#ef4444');
    canGrad.addColorStop(0.5, '#dc2626');
    canGrad.addColorStop(1, '#991b1b');

    ctx.fillStyle = canGrad;
    ctx.beginPath();
    ctx.moveTo(startX, 120);
    ctx.bezierCurveTo(startX + 120, 260, startX + 220, 180, startX + 340, 360);
    ctx.bezierCurveTo(startX + 420, 480, startX + 460, 380, startX + 512, 540);
    ctx.lineTo(startX + 512, 420);
    ctx.bezierCurveTo(startX + 400, 320, startX + 320, 220, startX + 240, 120);
    ctx.bezierCurveTo(startX + 160, 40, startX + 80, 80, startX, 120);
    ctx.closePath();
    ctx.fill();

    // Metallic Gold contour edge
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Canada Maple Leaves inside the crimson wave
    drawMapleLeaf(ctx, startX + 160, 180, 0.75, '#ffffff');
    drawMapleLeaf(ctx, startX + 360, 380, 0.9, 'rgba(255, 255, 255, 0.85)');
    drawMapleLeaf(ctx, startX + 240, 260, 0.55, '#fef08a');
    ctx.restore();

    // --- Wave 2: MEXICO EMERALD GREEN WAVE ---
    ctx.save();
    const mexGrad = ctx.createLinearGradient(startX, height, startX + panelWidth, 0);
    mexGrad.addColorStop(0, '#10b981');
    mexGrad.addColorStop(0.5, '#059669');
    mexGrad.addColorStop(1, '#047857');

    ctx.fillStyle = mexGrad;
    ctx.beginPath();
    ctx.moveTo(startX + 40, height - 80);
    ctx.bezierCurveTo(startX + 180, height - 220, startX + 260, height - 160, startX + 380, height - 340);
    ctx.bezierCurveTo(startX + 460, height - 440, startX + 480, height - 320, startX + 512, height - 460);
    ctx.lineTo(startX + 512, height - 340);
    ctx.bezierCurveTo(startX + 420, height - 240, startX + 340, height - 120, startX + 220, height - 60);
    ctx.bezierCurveTo(startX + 140, height - 20, startX + 80, height - 40, startX + 40, height - 80);
    ctx.closePath();
    ctx.fill();

    // Gold trim
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Mexico Aztec Eagle Icons
    drawAztecEagle(ctx, startX + 260, height - 160, 0.65, '#ffffff');
    drawAztecEagle(ctx, startX + 420, height - 320, 0.75, '#fef08a');
    ctx.restore();

    // --- Wave 3: USA ROYAL BLUE & CELESTIAL STARS WAVE ---
    ctx.save();
    const usaGrad = ctx.createLinearGradient(startX, 0, startX + panelWidth, height);
    usaGrad.addColorStop(0, '#2563eb');
    usaGrad.addColorStop(0.5, '#1d4ed8');
    usaGrad.addColorStop(1, '#1e3a8a');

    ctx.fillStyle = usaGrad;
    ctx.beginPath();
    ctx.moveTo(startX + 100, 320);
    ctx.bezierCurveTo(startX + 220, 480, startX + 320, 520, startX + 440, 680);
    ctx.bezierCurveTo(startX + 490, 750, startX + 500, 680, startX + 512, 780);
    ctx.lineTo(startX + 512, 680);
    ctx.bezierCurveTo(startX + 400, 580, startX + 300, 440, startX + 200, 360);
    ctx.closePath();
    ctx.fill();

    // Gold contour edge
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 4;
    ctx.stroke();

    // White & Gold USA Stars
    drawStar(ctx, startX + 220, 420, 5, 14, 6, '#ffffff', '#fbbf24');
    drawStar(ctx, startX + 320, 500, 5, 12, 5, '#ffffff');
    drawStar(ctx, startX + 380, 560, 5, 16, 7, '#fef08a', '#d97706');
    drawStar(ctx, startX + 450, 640, 5, 11, 4.5, '#ffffff');
    ctx.restore();
  }

  // 3. Deep 4-Panel Aerodynamic Wave Seams (Thermo-Bonded Grooves)
  ctx.save();
  for (let p = 0; p < numPanels; p++) {
    const x0 = p * panelWidth;
    const x1 = (p + 1) * panelWidth;

    // Seam line outer shadow
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x0, 0);
    ctx.bezierCurveTo(x0 + 160, 300, x1 - 160, 700, x1, 1024);
    ctx.stroke();

    // Deep recessed core seam
    ctx.strokeStyle = '#090d16';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x0, 0);
    ctx.bezierCurveTo(x0 + 160, 300, x1 - 160, 700, x1, 1024);
    ctx.stroke();

    // Highlight ridge beside the seam
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x0 + 3, 0);
    ctx.bezierCurveTo(x0 + 163, 300, x1 - 157, 700, x1 + 3, 1024);
    ctx.stroke();
  }
  ctx.restore();

  // 4. Official Brand Marks, Typographic Badges & Badging

  // Panel 1: Main "TRIONDA" Title + Adidas Performance
  const p1X = panelWidth * 0.5;
  const p1Y = height * 0.46;

  // Adidas 3-Bars Logo
  drawAdidasLogo(ctx, p1X, p1Y - 95, 1.25, '#0f172a');

  // "TRIONDA" official bold wordmark
  ctx.save();
  ctx.font = '900 52px "Chakra Petch", "Arial Black", sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '6px';
  // Gold gradient fill for TRIONDA text
  const textGrad = ctx.createLinearGradient(p1X - 150, p1Y - 20, p1X + 150, p1Y + 20);
  textGrad.addColorStop(0, '#0f172a');
  textGrad.addColorStop(0.5, '#1e293b');
  textGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = textGrad;
  ctx.fillText('TRIONDA', p1X, p1Y - 15);

  // Subtitle: OFFICIAL MATCH BALL
  ctx.font = 'bold 13px sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillStyle = '#b45309';
  ctx.fillText('OFFICIAL MATCH BALL', p1X, p1Y + 14);

  ctx.font = 'bold 10px sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillStyle = '#475569';
  ctx.fillText('FIFA WORLD CUP 2026', p1X, p1Y + 30);
  ctx.restore();

  // Panel 2: Official FIFA World Cup 2026 Emblem + Connected Ball Sensor
  const p2X = panelWidth * 1.5;
  const p2Y = height * 0.5;
  drawFIFA2026Logo(ctx, p2X, p2Y - 50, 1.2, false);
  drawConnectedBallBadge(ctx, p2X, p2Y + 80, 1.0, false);

  // Panel 3: FIFA Quality Pro Seal + Host Nations Typography
  const p3X = panelWidth * 2.5;
  const p3Y = height * 0.48;
  drawFIFAQualityProSeal(ctx, p3X, p3Y - 40, 1.15, false);

  ctx.save();
  ctx.font = '900 24px "Chakra Petch", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#dc2626';
  ctx.fillText('CANADA', p3X - 90, p3Y + 65);
  ctx.fillStyle = '#059669';
  ctx.fillText('MEXICO', p3X, p3Y + 65);
  ctx.fillStyle = '#2563eb';
  ctx.fillText('USA', p3X + 90, p3Y + 65);

  ctx.font = 'bold 9px sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillStyle = '#64748b';
  ctx.fillText('4-PANEL AERODYNAMIC TECHNOLOGY', p3X, p3Y + 90);
  ctx.restore();

  // Panel 4: Second TRIONDA + Adidas Badge with Gold Trophy accent
  const p4X = panelWidth * 3.5;
  const p4Y = height * 0.5;
  drawAdidasLogo(ctx, p4X, p4Y - 80, 1.1, '#0f172a');
  drawFIFA2026Logo(ctx, p4X, p4Y + 45, 1.0, false);
}

// ---------------------------------------------------------------------------
// 3. Render TRIONDA FINAL (Decisive Stage / Final Gold Edition)
// ---------------------------------------------------------------------------

function renderTriondaFinal(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Obsidian Black Base
  ctx.fillStyle = '#09090b';
  ctx.fillRect(0, 0, width, height);

  // Dark metallic weave
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  const gridSize = 20;
  for (let y = 0; y < height; y += gridSize) {
    for (let x = 0; x < width; x += gridSize) {
      ctx.strokeRect(x, y, gridSize, gridSize);
    }
  }

  const numPanels = 4;
  const panelWidth = width / numPanels;

  for (let p = 0; p < numPanels; p++) {
    const startX = p * panelWidth;

    // Glowing 24K Gold Waves
    ctx.save();
    const goldGrad = ctx.createLinearGradient(startX, 0, startX + panelWidth, height);
    goldGrad.addColorStop(0, '#fef08a');
    goldGrad.addColorStop(0.3, '#fbbf24');
    goldGrad.addColorStop(0.7, '#f59e0b');
    goldGrad.addColorStop(1, '#b45309');

    ctx.fillStyle = goldGrad;
    ctx.beginPath();
    ctx.moveTo(startX, 150);
    ctx.bezierCurveTo(startX + 150, 300, startX + 250, 200, startX + 380, 420);
    ctx.bezierCurveTo(startX + 460, 520, startX + 490, 420, startX + 512, 580);
    ctx.lineTo(startX + 512, 440);
    ctx.bezierCurveTo(startX + 400, 340, startX + 300, 220, startX + 200, 120);
    ctx.closePath();
    ctx.fill();

    // Hot Crimson / Pink accent glow ribbon (characteristic of Trionda Final)
    const pinkGrad = ctx.createLinearGradient(startX, height, startX + panelWidth, 0);
    pinkGrad.addColorStop(0, '#f43f5e');
    pinkGrad.addColorStop(0.5, '#e11d48');
    pinkGrad.addColorStop(1, '#be123c');

    ctx.fillStyle = pinkGrad;
    ctx.beginPath();
    ctx.moveTo(startX + 50, height - 120);
    ctx.bezierCurveTo(startX + 200, height - 260, startX + 280, height - 180, startX + 420, height - 380);
    ctx.bezierCurveTo(startX + 480, height - 460, startX + 500, height - 360, startX + 512, height - 480);
    ctx.lineTo(startX + 512, height - 380);
    ctx.bezierCurveTo(startX + 420, height - 280, startX + 320, height - 140, startX + 180, height - 80);
    ctx.closePath();
    ctx.fill();

    // Gold leaf trims
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();
  }

  // Deep Seam Grooves
  ctx.save();
  for (let p = 0; p < numPanels; p++) {
    const x0 = p * panelWidth;
    const x1 = (p + 1) * panelWidth;

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x0, 0);
    ctx.bezierCurveTo(x0 + 160, 300, x1 - 160, 700, x1, 1024);
    ctx.stroke();

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x0 + 2, 0);
    ctx.bezierCurveTo(x0 + 162, 300, x1 - 158, 700, x1 + 2, 1024);
    ctx.stroke();
  }
  ctx.restore();

  // Branding: TRIONDA FINAL
  const p1X = panelWidth * 0.5;
  const p1Y = height * 0.46;
  drawAdidasLogo(ctx, p1X, p1Y - 95, 1.25, '#fbbf24');

  ctx.save();
  ctx.font = '900 50px "Chakra Petch", sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '6px';
  ctx.fillStyle = '#fef08a';
  ctx.fillText('TRIONDA', p1X, p1Y - 15);

  ctx.font = '900 20px "Chakra Petch", sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillStyle = '#f43f5e';
  ctx.fillText('FINAL', p1X, p1Y + 12);

  ctx.font = 'bold 9px sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText('NEW YORK/NJ • DALLAS • MIAMI • ATLANTA', p1X, p1Y + 34);
  ctx.restore();

  // Panel 2: Gold Trophy 26 Emblem
  drawFIFA2026Logo(ctx, panelWidth * 1.5, height * 0.48, 1.3, true);
  drawConnectedBallBadge(ctx, panelWidth * 1.5, height * 0.72, 1.0, true);

  // Panel 3: FIFA Quality Pro in Gold
  drawFIFAQualityProSeal(ctx, panelWidth * 2.5, height * 0.48, 1.2, true);

  // Panel 4: Second Emblem
  drawFIFA2026Logo(ctx, panelWidth * 3.5, height * 0.5, 1.15, true);
}

// ---------------------------------------------------------------------------
// 4. Render Bump Map & Aerodynamic Dimples
// ---------------------------------------------------------------------------

function renderBumpAndDimples(ctx: CanvasRenderingContext2D, width: number, height: number, isFinal: boolean) {
  // Neutral mid-gray base for bump map (128, 128, 128)
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, width, height);

  // Stippled Aerodynamic Micro-Dimples (like modern golf/soccer balls)
  const step = 8;
  for (let y = 4; y < height; y += step) {
    for (let x = 4; x < width; x += step) {
      const offsetX = ((y / step) % 2) * (step * 0.5);
      // Small indented dimple: darker center with lighter edge
      ctx.fillStyle = '#686868';
      ctx.beginPath();
      ctx.arc(x + offsetX, y, 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#9c9c9c';
      ctx.beginPath();
      ctx.arc(x + offsetX + 0.6, y + 0.6, 0.9, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Deep Panel Grooves (Thermo-bonded seams - deeply recessed = dark values in bump map)
  const numPanels = 4;
  const panelWidth = width / numPanels;

  ctx.save();
  for (let p = 0; p < numPanels; p++) {
    const x0 = p * panelWidth;
    const x1 = (p + 1) * panelWidth;

    // Outer groove falloff
    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(x0, 0);
    ctx.bezierCurveTo(x0 + 80, 150, x1 - 80, 350, x1, 512);
    ctx.stroke();

    // Deep groove trench
    ctx.strokeStyle = '#101010';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x0, 0);
    ctx.bezierCurveTo(x0 + 80, 150, x1 - 80, 350, x1, 512);
    ctx.stroke();

    // Raised ridge adjacent to groove (light highlight)
    ctx.strokeStyle = '#b8b8b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x0 + 4, 0);
    ctx.bezierCurveTo(x0 + 84, 150, x1 - 76, 350, x1 + 4, 512);
    ctx.stroke();
  }
  ctx.restore();
}
