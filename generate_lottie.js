const fs = require('fs');
const path = require('path');

// Generate a valid Lottie animation JSON with 180 frames (60fps = 3 seconds or 30fps = 6 seconds)
// Theme: Luminous Oasis (Deep Green #003223, Vibrant Lime #8CC74F, Soft Mint #CFE8B5)
// It features multiple fluid organic ambient shapes and geometric circles rotating, pulsing, and translating.

function createLottieData() {
  const totalFrames = 180;
  const frameRate = 30;
  const width = 1920;
  const height = 1080;

  // Helpers for Lottie colors: [r, g, b, 1] (0 to 1)
  const limeColor = [140 / 255, 199 / 255, 79 / 255, 1];     // #8CC74F
  const mintColor = [207 / 255, 232 / 255, 181 / 255, 1];    // #CFE8B5
  const deepGreen = [0 / 255, 50 / 255, 35 / 255, 1];        // #003223
  const darkEmerald = [11 / 255, 67 / 255, 49 / 255, 1];     // #0B4331
  const warmCream = [245 / 255, 235 / 255, 225 / 255, 1];    // #F5EBE1

  function createShapeLayer(index, name, shapeType, color, size, startPos, endPos, startRot, endRot, startScale, endScale, opacity) {
    let shapeContent = [];
    if (shapeType === 'circle') {
      shapeContent = [
        {
          ty: 'el', // ellipse
          d: 1,
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [size, size] }
        },
        {
          ty: 'fl', // fill
          c: { a: 0, k: color },
          o: { a: 0, k: 100 },
          r: 1
        },
        {
          ty: 'tr', // transform
          p: { a: 0, k: [0, 0] },
          a: { a: 0, k: [0, 0] },
          s: { a: 0, k: [100, 100] },
          r: { a: 0, k: 0 },
          o: { a: 0, k: 100 }
        }
      ];
    } else if (shapeType === 'rect') {
      shapeContent = [
        {
          ty: 'rc', // rectangle
          d: 1,
          s: { a: 0, k: [size, size] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: size * 0.3 } // rounded corner
        },
        {
          ty: 'fl',
          c: { a: 0, k: color },
          o: { a: 0, k: 100 },
          r: 1
        },
        {
          ty: 'tr',
          p: { a: 0, k: [0, 0] },
          a: { a: 0, k: [0, 0] },
          s: { a: 0, k: [100, 100] },
          r: { a: 0, k: 0 },
          o: { a: 0, k: 100 }
        }
      ];
    }

    return {
      ddd: 0,
      ind: index,
      ty: 4, // shape layer
      nm: name,
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [opacity * 0.7], e: [opacity], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
            { t: 90, s: [opacity], e: [opacity * 0.7], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
            { t: totalFrames, s: [opacity * 0.7] }
          ]
        },
        r: {
          a: 1,
          k: [
            { t: 0, s: [startRot], e: [endRot], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
            { t: totalFrames, s: [endRot] }
          ]
        },
        p: {
          a: 1,
          k: [
            { t: 0, s: startPos, e: endPos, i: { x: [0.4, 0.4, 0.4], y: [1, 1, 1] }, o: { x: [0.6, 0.6, 0.6], y: [0, 0, 0] } },
            { t: totalFrames, s: endPos }
          ]
        },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: startScale, e: endScale, i: { x: [0.4, 0.4, 0.4], y: [1, 1, 1] }, o: { x: [0.6, 0.6, 0.6], y: [0, 0, 0] } },
            { t: 90, s: endScale, e: startScale, i: { x: [0.4, 0.4, 0.4], y: [1, 1, 1] }, o: { x: [0.6, 0.6, 0.6], y: [0, 0, 0] } },
            { t: totalFrames, s: startScale }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: shapeContent,
          nm: name + '_group',
          np: 3,
          cix: 2,
          ix: 1,
          mn: 'ADBE Vector Group',
          hd: false
        }
      ],
      ip: 0,
      op: totalFrames,
      st: 0,
      bm: 0
    };
  }

  const layers = [
    // Layer 1: Massive ambient lime glow
    createShapeLayer(1, 'Ambient_Lime_Orb_1', 'circle', limeColor, 850, [1400, 300, 0], [1200, 700, 0], 0, 90, [100, 100, 100], [130, 130, 100], 65),
    // Layer 2: Deep green anchor orb
    createShapeLayer(2, 'Deep_Green_Orb_2', 'circle', deepGreen, 950, [300, 200, 0], [500, 800, 0], 0, -60, [100, 100, 100], [120, 120, 100], 70),
    // Layer 3: Soft mint drifting polygon/rounded square
    createShapeLayer(3, 'Mint_Rounded_3', 'rect', mintColor, 600, [960, 600, 0], [1050, 400, 0], 15, 120, [90, 90, 100], [115, 115, 100], 60),
    // Layer 4: Vibrant lime fluid accent orb
    createShapeLayer(4, 'Lime_Pulse_Orb_4', 'circle', limeColor, 500, [200, 900, 0], [450, 400, 0], 0, 180, [100, 100, 100], [140, 140, 100], 55),
    // Layer 5: Dark emerald secondary orb
    createShapeLayer(5, 'Emerald_Orb_5', 'circle', darkEmerald, 700, [1700, 900, 0], [1400, 300, 0], 0, -90, [110, 110, 100], [85, 85, 100], 60),
    // Layer 6: Soft mint top accent
    createShapeLayer(6, 'Mint_Top_Orb_6', 'circle', mintColor, 550, [700, -100, 0], [900, 300, 0], -30, 60, [100, 100, 100], [125, 125, 100], 50),
    // Layer 7: Cream warm glow
    createShapeLayer(7, 'Cream_Warm_Orb_7', 'circle', warmCream, 650, [1100, 1000, 0], [800, 600, 0], 0, 45, [100, 100, 100], [120, 120, 100], 45),
    // Layer 8: Floating rounded square
    createShapeLayer(8, 'Lime_Floating_Rect_8', 'rect', limeColor, 400, [400, 700, 0], [200, 200, 0], 45, 225, [80, 80, 100], [110, 110, 100], 50)
  ];

  return {
    v: '5.7.4',
    fr: frameRate,
    ip: 0,
    op: totalFrames,
    w: width,
    h: height,
    nm: 'HU_Luminous_Oasis_Background',
    ddd: 0,
    assets: [],
    layers: layers
  };
}

const lottieData = createLottieData();
const targetPath = path.join(__dirname, 'assets', 'hu-background.json');
fs.writeFileSync(targetPath, JSON.stringify(lottieData, null, 2));
console.log('Saved assets/hu-background.json (size:', fs.statSync(targetPath).size, 'bytes)');

// Also generate a js file that exposes it as window.HU_LOTTIE_DATA for zero-CORS file:// double-click compatibility
const jsDataPath = path.join(__dirname, 'assets', 'hu-background-data.js');
fs.writeFileSync(jsDataPath, 'window.HU_LOTTIE_DATA = ' + JSON.stringify(lottieData) + ';\n');
console.log('Saved assets/hu-background-data.js for instant file:// execution');
