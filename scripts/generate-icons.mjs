import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const iconsDir = join(root, 'public', 'icons');
const svg = await readFile(join(iconsDir, 'icon.svg'));

await sharp(svg).resize(192, 192).png().toFile(join(iconsDir, 'icon-192.png'));
await sharp(svg).resize(512, 512).png().toFile(join(iconsDir, 'icon-512.png'));
// maskable: same art with safe-zone padding on a solid background
await sharp(svg)
  .resize(410, 410)
  .extend({ top: 51, bottom: 51, left: 51, right: 51, background: '#ffd166' })
  .png()
  .toFile(join(iconsDir, 'icon-maskable-512.png'));

console.log('icons generated');
