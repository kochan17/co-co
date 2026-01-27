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
    'data_visualization.html',
    'process_diagram.html'
  ];

  console.log('Starting PPTX generation using official standards...');

  for (const slideHtml of slides) {
    const filePath = path.join(templateDir, slideHtml);
    console.log(`Converting: ${slideHtml}`);
    try {
      const { slide, placeholders } = await html2pptx(filePath, pptx);
      console.log(`Slide ${slideHtml} has ${placeholders.length} placeholders:`, JSON.stringify(placeholders));

      // Add chart if it's the data visualization slide
      if (slideHtml === 'data_visualization.html') {
        const chartArea = placeholders.find(p => p.id === 'main-chart');
        if (chartArea) {
          console.log('Adding chart to main-chart placeholder...');
          const chartData = [
            {
              name: '実績',
              labels: ['1月', '2月', '3月', '4月', '5月'],
              values: [120, 150, 180, 210, 250]
            }
          ];
          slide.addChart(pptx.charts.BAR, chartData, {
            x: chartArea.x,
            y: chartArea.y,
            w: chartArea.w,
            h: chartArea.h,
            barDir: 'col',
            chartColors: ['8A2BE2'],
            showTitle: false,
            showLegend: false,
            showCatAxisTitle: true,
            catAxisTitle: '月別推移',
            showValAxisTitle: true,
            valAxisTitle: '売上 (万円)'
          });
        }
      }
    } catch (err) {
      console.error(`Error converting ${slideHtml}:`, err.message);
    }
  }

  const outputName = 'sales_presentation_standardized.pptx';
  await pptx.writeFile({ fileName: outputName });
  console.log(`Successfully created standardized PPTX: ${outputName}`);
}

createStandardPresentation().catch(console.error);
