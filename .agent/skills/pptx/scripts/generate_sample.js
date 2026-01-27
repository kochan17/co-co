const pptxgen = require('pptxgenjs');

// Create a new presentation
const pptx = new pptxgen();

// Theme Tokens
const COLORS = {
    purple: "8A2BE2",
    orange: "FF8C00",
    textPrimary: "1A0A2A",
    textSecondary: "585060",
    bgWhite: "FFFFFF",
    grayLight: "F5F5F5",
    divider: "E0E0E0"
};

const FONTS = {
    main: "Noto Sans JP"
};

// --- Slide 1: Title Slide ---
let slide1 = pptx.addSlide();
// Background shape (Gradient-ish)
slide1.addShape(pptx.ShapeType.rect, {
    x: 7.0, y: 3.5, w: 4.0, h: 4.0,
    fill: { type: 'linear', color: COLORS.purple, rotate: 45 },
    rotate: -15,
    rectRadius: 0.5
});

slide1.addText("タイトルをここに入力", {
    x: 0.5, y: 1.5, w: 8.0, h: 1.0,
    fontSize: 54, fontFace: FONTS.main, color: COLORS.textPrimary, bold: true,
    align: pptx.AlignH.left
});

slide1.addText("サブタイトル・資料の目的を記述します", {
    x: 0.5, y: 2.5, w: 8.0, h: 0.5,
    fontSize: 24, fontFace: FONTS.main, color: COLORS.textSecondary,
    align: pptx.AlignH.left,
    border: { type: 'solid', color: COLORS.purple, pt: 4, left: true }
});

slide1.addText("株式会社ユニ\n2026年1月27日", {
    x: 0.5, y: 4.0, w: 4.0, h: 1.0,
    fontSize: 14, fontFace: FONTS.main, color: COLORS.textSecondary
});

// --- Slide 2: Section Divider ---
let slide2 = pptx.addSlide();
slide2.background = { fill: COLORS.purple }; // Plain purple for now as fallback for gradient
slide2.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: '100%', h: '100%',
    fill: { type: 'linear', color: COLORS.purple, color2: COLORS.orange, rotate: 0 }
});

slide2.addText("01. セクションタイトル", {
    x: 0, y: 2.0, w: '100%', h: 1.0,
    fontSize: 40, fontFace: FONTS.main, color: 'FFFFFF', bold: true,
    align: pptx.AlignH.center
});
slide2.addShape(pptx.ShapeType.line, {
    x: 4.0, y: 3.2, w: 2.0, h: 0,
    line: { color: 'FFFFFF', width: 2 }
});

// --- Slide 3: Standard Content ---
let slide3 = pptx.addSlide();
slide3.addText("標準コンテンツのタイトル", {
    x: 0.5, y: 0.4, w: 9.0, h: 0.6,
    fontSize: 32, fontFace: FONTS.main, color: COLORS.textPrimary, bold: true
});
slide3.addShape(pptx.ShapeType.line, {
    x: 0.5, y: 1.0, w: 1.0, h: 0,
    line: { color: COLORS.purple, width: 3 }
});

slide3.addText(
    [
        { text: "重要なポイントの1つ目をここに記述します。", options: { bullet: true, color: COLORS.textPrimary } },
        { text: "2つ目のポイントも同様に、簡潔にまとめます。", options: { bullet: true, color: COLORS.textPrimary } },
        { text: "情報の詰め込みすぎを避け、余白を活かした配置を心がけます。", options: { bullet: true, color: COLORS.textPrimary } }
    ],
    { x: 0.5, y: 1.5, w: 9.0, h: 2.5, fontSize: 18, fontFace: FONTS.main, lineSpacing: 30 }
);

slide3.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 4.2, w: 9.0, h: 1.0,
    fill: { color: COLORS.grayLight },
    line: { color: COLORS.purple, width: 5, left: true }
});
slide3.addText("ここにはスライド全体を通して伝えたい「結論」や「キーメッセージ」を記述します。", {
    x: 0.7, y: 4.2, w: 8.5, h: 1.0,
    fontSize: 18, fontFace: FONTS.main, color: COLORS.textPrimary, bold: true, align: pptx.AlignH.left
});

// --- Save the presentation ---
pptx.writeFile({ fileName: 'sample_sales_theme.pptx' })
    .then(fileName => {
        console.log(`Created file: ${fileName}`);
    })
    .catch(err => {
        console.error(err);
    });
