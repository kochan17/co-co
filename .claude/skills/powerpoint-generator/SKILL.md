# PowerPoint Generator Skill

## Description
自社PowerPointテンプレートをベースに、ヘッダー・フッターを固定してHTMLコンテンツからPPTXスライドを生成するスキル。

## When to Use
- プレゼンテーション資料の作成
- 提案書・企画書の生成
- 技術仕様書のスライド化
- 既存HTMLコンテンツのPowerPoint化

## Tools Available
- Read: テンプレートファイルとHTMLコンテンツの読み取り
- Write: 生成されたPPTXファイルの出力
- Bash: Python-pptx実行とファイル処理

## Setup Requirements

### 1. テンプレートファイル配置
```
.claude/skills/powerpoint-generator/templates/
├── company-template.pptx      # 会社テンプレート
├── presentation-template.pptx # プレゼン用
└── technical-template.pptx    # 技術資料用
```

### 2. 設定ファイル
```json
{
  "defaultTemplate": "company-template.pptx",
  "branding": {
    "companyName": "株式会社CoCo",
    "logoPath": "./assets/logo.png",
    "primaryColor": "#007acc",
    "secondaryColor": "#6c757d"
  },
  "slideSettings": {
    "width": 13.33,
    "height": 7.5,
    "unit": "inches"
  }
}
```

## Usage Instructions

### 1. HTMLからスライド生成
```bash
# HTMLファイルからPPTX生成
python generate_slides.py --input content.html --template company-template.pptx --output presentation.pptx
```

### 2. Markdownからスライド生成
```bash
# Markdownファイルからスライド生成（HTML経由）
python generate_slides.py --input slides.md --format markdown --output presentation.pptx
```

### 3. 複数HTMLファイルから一括生成
```bash
# ディレクトリ内の全HTMLファイルを統合
python generate_slides.py --input-dir ./content/ --output multi-slide.pptx
```

## Input Formats

### HTML Structure
```html
<!-- スライド区切り：<section>タグまたはコメント -->
<section data-slide-title="タイトル">
  <h1>スライドタイトル</h1>
  <p>内容...</p>
  <ul>
    <li>項目1</li>
    <li>項目2</li>
  </ul>
</section>

<!-- 次のスライド -->
<!-- SLIDE: 新しいスライド -->
<h2>別のスライド</h2>
<p>内容...</p>
```

### Markdown Structure
```markdown
# プレゼンテーションタイトル

---

## スライド1
- 項目A
- 項目B

---

## スライド2
![画像](./images/chart.png)

**重要ポイント**
```

## Template Management

### ヘッダー・フッター要素
- 会社ロゴ（固定位置）
- 日付・ページ番号（自動更新）
- コピーライト表示
- ブランドカラー適用

### コンテンツエリア
- HTMLからテキスト抽出
- 画像の自動配置
- リストの箇条書き変換
- テーブルの表形式変換

## Advanced Features

### 1. スタイル変換
- CSS → PowerPointスタイル変換
- フォントサイズ・色の適用
- 背景色・グラデーション対応

### 2. レイアウト自動調整
- コンテンツ量に応じた文字サイズ調整
- 画像の自動リサイズ・配置
- スライド分割（内容が多い場合）

### 3. データ可視化
- HTML table → PowerPointテーブル
- Chart.js → PowerPointグラフ
- SVG → PowerPoint図形

## Output Customization

### ファイル命名規則
```
{project-name}_{template-type}_{YYYYMMDD}.pptx
例: CoCo_company-template_20240120.pptx
```

### メタデータ設定
- 作成者情報
- 会社名・部署名
- 作成日時
- バージョン情報

## Error Handling

### 一般的な問題
- テンプレートファイルが見つからない場合 → デフォルトテンプレート使用
- HTMLパースエラー → エラー箇所をスキップして継続
- 画像ファイルが見つからない場合 → プレースホルダー画像を配置

### ログ出力
```
[INFO] テンプレート読み込み: company-template.pptx
[INFO] HTMLパース完了: 5スライド生成
[WARN] 画像が見つかりません: ./images/missing.png
[INFO] PPTX出力完了: presentation.pptx
```

## Dependencies
```bash
pip install python-pptx beautifulsoup4 markdown pillow
```