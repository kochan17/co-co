const { createGradientPng } = require('./utils/gradient');
const path = require('path');

async function generateAssets() {
  const assetsDir = path.join(__dirname, '../templates/sales_material_theme/assets');

  // 1. Accent Gradient for Title Slide (Large)
  await createGradientPng(
    '#8A2BE2', '#FF8C00',
    1000, 1000,
    path.join(assetsDir, 'accent_large.png'),
    45
  );

  // 2. Accent Gradient for Section Divider (Full Slide)
  await createGradientPng(
    '#8A2BE2', '#FF8C00',
    960, 540,
    path.join(assetsDir, 'bg_gradient.png'),
    0
  );

  // 3. Thin Accent Line
  await createGradientPng(
    '#8A2BE2', '#FF8C00',
    400, 10,
    path.join(assetsDir, 'accent_line.png'),
    0
  );

  console.log('Gradient assets generated successfully.');
}

generateAssets().catch(console.error);
