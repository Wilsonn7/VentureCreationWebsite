import fs from 'node:fs';
import sharp from 'sharp';
import jsQR from 'jsqr';

const input = 'public/BarcodePublicles.jpeg';
const output = 'public/QRPublicles-crop.png';

if (!fs.existsSync(input)) throw new Error(`QR source missing: ${input}`);

const source = sharp(input);
const { width, height } = await source.metadata();
const full = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

function decode(buffer, w, h) {
  return jsQR(new Uint8ClampedArray(buffer), w, h, { inversionAttempts: 'attemptBoth' });
}

async function decodeCrop(left, top, size) {
  const raw = await sharp(input)
    .extract({ left, top, width: size, height: size })
    .resize({ width: 360, height: 360, fit: 'fill', kernel: 'nearest' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return decode(raw.data, raw.info.width, raw.info.height);
}

let found = null;
const candidates = new Set();
const minSide = Math.min(width, height);

for (let sizeRatio of [0.72, 0.62, 0.52, 0.44, 0.36, 0.28]) {
  const size = Math.round(minSide * sizeRatio);
  const step = Math.round(size * 0.12);
  for (let top = Math.round(height * 0.05); top <= height - size; top += step) {
    for (let left = Math.round(width * 0.05); left <= width - size; left += step) {
      const key = `${left}:${top}:${size}`;
      if (candidates.has(key)) continue;
      candidates.add(key);
      const decoded = await decodeCrop(left, top, size);
      if (decoded?.data && /instagram\.com\/publicles|instagram:.*publicles/i.test(decoded.data)) {
        found = { left, top, size, data: decoded.data };
        break;
      }
    }
    if (found) break;
  }
  if (found) break;
}

if (!found) {
  if (fs.existsSync(output)) fs.rmSync(output);
  throw new Error('Tidak ada crop yang dapat didekode sebagai Instagram @publicles');
}

const margin = 16;
const expandedSize = found.size + margin * 2;
const left = Math.max(0, Math.min(width - expandedSize, found.left - margin));
const top = Math.max(0, Math.min(height - expandedSize, found.top - margin));
const finalSize = Math.min(expandedSize, width - left, height - top);

await sharp(input)
  .extract({ left, top, width: finalSize, height: finalSize })
  .flatten({ background: '#ffffff' })
  .png()
  .toFile(output);

const verify = await sharp(output).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const result = decode(verify.data, verify.info.width, verify.info.height);
if (!result?.data || !/instagram\.com\/publicles|instagram:.*publicles/i.test(result.data)) {
  fs.rmSync(output);
  throw new Error(`Crop tersimpan tapi verifikasi jsQR gagal: ${result?.data || 'no decode'}`);
}

console.log(`QR valid: ${result.data}`);
console.log(`Crop: ${output} (${finalSize}px x ${finalSize}px)`);
