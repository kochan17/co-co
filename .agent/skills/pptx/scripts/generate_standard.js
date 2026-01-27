const pptxgen = require('pptxgenjs');
const html2pptx = require('./html2pptx');
const path = require('path');

async function createStandardPresentation() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';

  const templateDir = path.join(__dirname, '../templates/sales_material_theme');
  const slides = [
    'title_slide.html',
    'section_divider.html',
    'standard_content.html',
    'two_column.html',
    'data_visualization.html'
  ];

  console.log('Starting PPTX generation using official standards...');

  for (const slideHtml of slides) {
    const filePath = path.join(templateDir, slideHtml);
    console.log(`Converting: ${slideHtml}`);
    try {
      await html2pptx(filePath, pptx);
    } catch (err) {
      console.error(`Error converting ${slideHtml}:`, err.message);
    }
  }

  const outputName = 'sales_presentation_standardized.pptx';
  await pptx.writeFile({ fileName: outputName });
  console.log(`Successfully created standardized PPTX: ${outputName}`);
}

createStandardPresentation().catch(console.error);
