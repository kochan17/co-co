# PowerPoint テンプレート配置ガイド

このディレクトリに自社のPowerPointテンプレートファイルを配置してください。

## テンプレートファイルの配置

### 1. 基本テンプレート
```
templates/
├── company-template.pptx      # メインの会社テンプレート（必須）
├── technical-template.pptx    # 技術資料用
├── proposal-template.pptx     # 提案書用
└── simple-template.pptx       # シンプル版
```

### 2. テンプレート作成のポイント

#### ヘッダー・フッター要素
- **スライドマスター**を使用してヘッダー・フッター領域を定義
- **プレースホルダー**でロゴ、会社名、日付、ページ番号の位置を設定
- **固定要素**（ロゴ、コピーライト等）は埋め込み済みにする

#### レイアウト構成
1. **タイトルスライド**: 表紙用（会社ロゴ、タイトル、日付）
2. **タイトル+コンテンツ**: 標準的な内容スライド
3. **2カラム**: 画像とテキストの並列表示
4. **画像メイン**: 図表中心のスライド
5. **終了スライド**: お疲れ様でした、質疑応答等

#### スタイル設定
- **フォント**: 日本語（游ゴシック、メイリオ）と英語（Calibri、Arial）
- **カラーパレット**: ブランドカラーを設定（最大10色）
- **マージン**: コンテンツエリアの余白を適切に設定

### 3. テンプレート変換例

#### 既存PowerPointからテンプレート作成
```bash
# 既存ファイルをテンプレート形式で保存
# PowerPoint → ファイル → テンプレートとして保存 → .pptx形式
```

#### プレースホルダー設定
```
表示 → スライドマスター → プレースホルダーの挿入
- タイトル: {{SLIDE_TITLE}}
- コンテンツ: {{SLIDE_CONTENT}}
- 画像: {{SLIDE_IMAGE}}
- ページ番号: {{PAGE_NUMBER}}
- 日付: {{DATE}}
```

### 4. カスタムプロパティ設定

#### config.jsonでテンプレート固有設定
```json
{
  "templates": {
    "your-template": {
      "name": "カスタムテンプレート",
      "brandColors": {
        "primary": "#ff6600",
        "secondary": "#333333"
      },
      "fonts": {
        "japanese": "游ゴシック",
        "english": "Calibri"
      },
      "logoPosition": {
        "x": 0.5,
        "y": 0.2,
        "width": 1.5,
        "height": 0.6
      }
    }
  }
}
```

### 5. テンプレートテスト

#### 生成テスト用HTMLファイル
```html
<!DOCTYPE html>
<html>
<body>
  <section data-slide-title="テストスライド1">
    <h1>テンプレートテスト</h1>
    <p>このスライドでテンプレートの動作確認を行います。</p>
    <ul>
      <li>ヘッダー表示確認</li>
      <li>フッター表示確認</li>
      <li>コンテンツレイアウト確認</li>
    </ul>
  </section>
</body>
</html>
```

#### テスト実行
```bash
python scripts/generate_slides.py \
  --input test.html \
  --template templates/company-template.pptx \
  --output test-result.pptx
```

### 6. トラブルシューティング

#### よくある問題
- **フォントが正しく表示されない** → システムにフォントがインストールされているか確認
- **画像が配置されない** → 画像ファイルパスとファイル形式を確認
- **レイアウトが崩れる** → プレースホルダーのサイズと位置を調整

#### ログ確認
```bash
# デバッグモードで実行
python scripts/generate_slides.py --debug --input content.html --output debug.pptx
```

### 7. サンプルテンプレート

#### 最小構成のテンプレート
PowerPointで以下を設定したサンプルテンプレートを作成：

1. **スライドマスター設定**
   - ヘッダー: 会社ロゴ + 日付
   - フッター: ページ番号 + コピーライト
   - 背景: ブランドカラーグラデーション

2. **レイアウト**
   - タイトルスライド
   - タイトル + コンテンツ
   - 2カラムレイアウト

このテンプレートを `company-template.pptx` として保存してください。