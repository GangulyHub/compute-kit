/**
 * ComputeKit Example - Mandelbrot Set
 * Demonstrates heavy parallel computation in AssemblyScript
 */

// Color palette for visualization
const PALETTE_SIZE: i32 = 256;

/**
 * Calculate Mandelbrot set for a given viewport
 * @param width - Image width
 * @param height - Image height
 * @param zoom - Zoom level
 * @param panX - X offset (real axis)
 * @param panY - Y offset (imaginary axis)
 * @param maxIter - Maximum iterations
 * @returns Uint32Array of RGBA pixels
 */
export function mandelbrot(
  width: i32,
  height: i32,
  zoom: f64,
  panX: f64,
  panY: f64,
  maxIter: i32
): Uint32Array {
  const buffer = new Uint32Array(width * height);

  const w2: f64 = <f64>width / 2.0;
  const h2: f64 = <f64>height / 2.0;
  const scale: f64 = 1.0 / zoom;

  for (let y: i32 = 0; y < height; y++) {
    const cIm: f64 = (<f64>y - h2) * scale + panY;

    for (let x: i32 = 0; x < width; x++) {
      const cRe: f64 = (<f64>x - w2) * scale + panX;

      let zRe: f64 = cRe;
      let zIm: f64 = cIm;
      let n: i32 = 0;

      for (; n < maxIter; n++) {
        const zRe2: f64 = zRe * zRe;
        const zIm2: f64 = zIm * zIm;

        if (zRe2 + zIm2 > 4.0) {
          break;
        }

        zIm = 2.0 * zRe * zIm + cIm;
        zRe = zRe2 - zIm2 + cRe;
      }

      // Color calculation (ABGR format for little-endian)
      let color: u32;
      if (n === maxIter) {
        color = 0xFF000000; // Black for points in the set
      } else {
        // Smooth coloring
        const hue: f64 = <f64>n / <f64>maxIter;
        color = hslToRgb(hue, 1.0, 0.5);
      }

      unchecked(buffer[y * width + x] = color);
    }
  }

  return buffer;
}

/**
 * Convert HSL to RGB (returns ABGR u32)
 */
function hslToRgb(h: f64, s: f64, l: f64): u32 {
  let r: f64, g: f64, b: f64;

  if (s === 0.0) {
    r = g = b = l;
  } else {
    const q: f64 = l < 0.5 ? l * (1.0 + s) : l + s - l * s;
    const p: f64 = 2.0 * l - q;
    r = hueToRgb(p, q, h + 1.0 / 3.0);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1.0 / 3.0);
  }

  const ri: u32 = <u32>(r * 255.0);
  const gi: u32 = <u32>(g * 255.0);
  const bi: u32 = <u32>(b * 255.0);

  return 0xFF000000 | (bi << 16) | (gi << 8) | ri;
}

function hueToRgb(p: f64, q: f64, t: f64): f64 {
  if (t < 0.0) t += 1.0;
  if (t > 1.0) t -= 1.0;
  if (t < 1.0 / 6.0) return p + (q - p) * 6.0 * t;
  if (t < 1.0 / 2.0) return q;
  if (t < 2.0 / 3.0) return p + (q - p) * (2.0 / 3.0 - t) * 6.0;
  return p;
}

/**
 * Calculate Julia set
 */
export function julia(
  width: i32,
  height: i32,
  cRe: f64,
  cIm: f64,
  zoom: f64,
  maxIter: i32
): Uint32Array {
  const buffer = new Uint32Array(width * height);

  const w2: f64 = <f64>width / 2.0;
  const h2: f64 = <f64>height / 2.0;
  const scale: f64 = 1.0 / zoom;

  for (let y: i32 = 0; y < height; y++) {
    for (let x: i32 = 0; x < width; x++) {
      let zRe: f64 = (<f64>x - w2) * scale;
      let zIm: f64 = (<f64>y - h2) * scale;
      let n: i32 = 0;

      for (; n < maxIter; n++) {
        const zRe2: f64 = zRe * zRe;
        const zIm2: f64 = zIm * zIm;

        if (zRe2 + zIm2 > 4.0) {
          break;
        }

        const newZRe: f64 = zRe2 - zIm2 + cRe;
        zIm = 2.0 * zRe * zIm + cIm;
        zRe = newZRe;
      }

      let color: u32;
      if (n === maxIter) {
        color = 0xFF000000;
      } else {
        const hue: f64 = <f64>n / <f64>maxIter;
        color = hslToRgb(hue * 0.7 + 0.5, 0.9, 0.5);
      }

      unchecked(buffer[y * width + x] = color);
    }
  }

  return buffer;
}
