const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

/**
 * html2pptx simplified engine based on Anthropic standards.
 * Converts HTML elements to PptxGenJS objects using Playwright for layout calculation.
 */
async function html2pptx(htmlFile, pres, options = {}) {
  const { slide = null } = options;
  const targetSlide = slide || pres.addSlide();

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const filePath = path.isAbsolute(htmlFile) ? htmlFile : path.join(process.cwd(), htmlFile);
    await page.goto(`file://${filePath}`);

    // Set viewport to slide dimensions (approximate 16:9)
    // 720pt x 405pt -> 960px x 540px
    await page.setViewportSize({ width: 960, height: 540 });

    const elements = await page.evaluate(() => {
      const PX_PER_IN = 96;
      const pxToInch = (px) => px / PX_PER_IN;
      const pxToPt = (px) => px * 0.75;
      const rgbToHex = (rgb) => {
        const result = rgb.match(/\d+/g);
        return result ? result.slice(0, 3).map(x => {
          const hex = parseInt(x).toString(16).toUpperCase();
          return hex.length === 1 ? '0' + hex : hex;
        }).join('') : '000000';
      };

      const data = [];
      // Process basic text tags
      const tags = ['H1', 'H2', 'H3', 'P', 'SPAN', 'LI'];
      document.querySelectorAll('*').forEach(el => {
        if (tags.includes(el.tagName)) {
          const rect = el.getBoundingClientRect();
          const computed = window.getComputedStyle(el);

          if (rect.width > 0 && rect.height > 0 && el.innerText.trim()) {
            data.push({
              type: 'text',
              text: el.innerText.trim(),
              x: pxToInch(rect.left),
              y: pxToInch(rect.top),
              w: pxToInch(rect.width),
              h: pxToInch(rect.height),
              style: {
                fontSize: pxToPt(parseFloat(computed.fontSize)),
                fontFace: computed.fontFamily.split(',')[0].replace(/['"]/g, '').trim(),
                color: rgbToHex(computed.color),
                bold: parseInt(computed.fontWeight) >= 600,
                italic: computed.fontStyle === 'italic',
                align: computed.textAlign === 'start' ? 'left' : computed.textAlign
              }
            });
          }
        } else if (el.tagName === 'DIV' && !el.innerText.trim()) {
          // Shapes (Divs without text)
          const rect = el.getBoundingClientRect();
          const computed = window.getComputedStyle(el);
          const bgColor = rgbToHex(computed.backgroundColor);

          if (rect.width > 0 && rect.height > 0 && bgColor !== '00000000') {
            data.push({
              type: 'shape',
              x: pxToInch(rect.left),
              y: pxToInch(rect.top),
              w: pxToInch(rect.width),
              h: pxToInch(rect.height),
              style: {
                fill: { color: bgColor },
                line: computed.borderWidth !== '0px' ? { color: rgbToHex(computed.borderColor), width: parseFloat(computed.borderWidth) } : null,
                rectRadius: parseFloat(computed.borderRadius) / PX_PER_IN
              }
            });
          }
        }
      });
      return data;
    });

    // Map extracted elements to PptxGenJS
    elements.forEach(el => {
      if (el.type === 'text') {
        targetSlide.addText(el.text, {
          x: el.x, y: el.y, w: el.w, h: el.h,
          fontSize: el.style.fontSize,
          fontFace: el.style.fontFace,
          color: el.style.color,
          bold: el.style.bold,
          italic: el.style.italic,
          align: el.style.align
        });
      } else if (el.type === 'shape') {
        targetSlide.addShape(pres.ShapeType.rect, {
          x: el.x, y: el.y, w: el.w, h: el.h,
          fill: el.style.fill,
          line: el.style.line,
          rectRadius: el.style.rectRadius
        });
      }
    });

    return { slide: targetSlide };
  } finally {
    await browser.close();
  }
}

module.exports = html2pptx;
