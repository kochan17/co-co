const sharp = require('sharp');
const path = require('path');

/**
 * Creates a linear gradient PNG image.
 * @param {string} color1 - Start color (e.g., "#8A2BE2")
 * @param {string} color2 - End color (e.g., "#FF8C00")
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} filename - Output path
 * @param {number} rotate - Rotation angle in degrees (default 0, horizontal)
 */
async function createGradientPng(color1, color2, width, height, filename, rotate = 0) {
  const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform="rotate(${rotate})">
                    <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
                    <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grad1)" />
        </svg>
    `;
  await sharp(Buffer.from(svg)).png().toFile(filename);
  return filename;
}

module.exports = { createGradientPng };
