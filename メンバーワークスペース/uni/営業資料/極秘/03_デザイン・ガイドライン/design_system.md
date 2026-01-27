# デザイン定義書：営業資料（div社）に基づくビジュアルアイデンティティ

営業資料（PDF）の視覚情報を分析し、デザインシステムとして定義しました。
今後の資料作成やWeb制作時のガイドラインとして活用できます。

## 1. デザインコンセプト
- **キーワード**: 「信頼」「プロフェッショナル」「先進性（AI）」「誠実」
- **全体のトーン**:
  - ベースは落ち着いた**ネイビー**で知的・誠実な印象を与える。
  - **ホワイト**を広く使い、清潔感と可読性を確保。
  - アクセントに**イエロー/オレンジ**や**レッド**を使用し、重要事項（助成金、Phase分けなど）を強調。
  - 装飾は控えめで、直線的なグリッドレイアウトを基本とするビジネスライクな構成。

---

## 2. カラーパレット

### Primary Colors (ベースカラー)
- **Deep Navy (ディープネイビー)**
  - `Code`: `#0F1E3C` (推定値)
  - `Usage`: 表紙背景、ヘッダー背景、強調テキスト、フッター。
  - `Role`: ブランドの信頼性を担保する最も重要な色。

- **Pure White (ピュアホワイト)**
  - `Code`: `#FFFFFF`
  - `Usage`: 背景全体のベース、ネイビー背景上のテキスト。
  - `Role`: 清潔感、情報の明確化。

### Secondary & Accent Colors (機能色)
- **Vivid Red (ビビッドレッド)**
  - `Code`: `#D32F2F` (推定値)
  - `Usage`: 注釈（「※」など）、強調バッジ（「75%助成」）、重要な矢印。
  - `Role`: 警告、注意喚起、最強調。

- **Highlight Yellow (ハイライトイエロー)**
  - `Code`: `#FBC02D` (推定値)
  - `Usage`: フェーズ2（AI浸透期）の背景色、重要ポイントのマーカー。
  - `Role`: 視線誘導、ポジティブな変化。

- **Process Blue (プロセスブルー)**
  - `Code`: `#1976D2` (推定値)
  - `Usage`: フェーズ1（AI駆動開発）の背景色、リンク、小見出しの装飾。
  - `Role`: 進行、アクション。

- **Light Gray (ライトグレー)**
  - `Code`: `#F5F5F5`
  - `Usage`: 表の偶数行背景、セクションの背景帯。
  - `Role`: 情報の区分け、リズム。

---

## 3. タイポグラフィ (Typography)

### Font Family
- **日本語**: `Noto Sans JP`, `Hiragino Kaku Gothic ProN` (メイリオ, 游ゴシック等)
  - 視認に優れたサンセリフ体（ゴシック体）を使用。明朝体は原則使用しない。
- **欧文/数字**: `Roboto`, `Helvetica Neue`, `Arial`
  - 日本語フォントとの相性が良い、癖のないサンセリフ体。

### Text Styles
- **Main Title (表紙)**
  - Size: 非常に大きい (例: 48px~)
  - Weight: Bold
  - Color: White (Navy背景)
- **Section Title (各スライドヘッダー)**
  - Size: 大きい (例: 32px)
  - Weight: Bold
  - Color: Deep Navy
  - Decoration: 下線や左側のアクセントバーが付くことが多い。
- **Body Text (本文)**
  - Size: 標準 (例: 16px - 18px)
  - Weight: Regular
  - Color: Dark Gray / Black (#333333)
  - Line Height: 1.6 - 1.8 (ゆとりを持たせる)

---

## 4. レイアウト & コンポーネント

### レイアウト原則
- **グリッドシステム**: 左右に十分な余白を取り、情報は整然と配置する。
- **Zの法則**: 左上（見出し）から右下（結論）へ視線が流れるように構成。
- **情報のブロック化**: 関連する情報は「背景色付きのボックス」や「枠線」で囲み、グループ化する。

### 主要コンポーネント
1. **プロセス図 (Phase Flow)**
   - 左から右へ流れる矢印型のフロー図。
   - 各ステップを色分け（青→黄など）して進捗を表現。
2. **比較表 (Feature Table)**
   - ヘッダー行はDeep Navy背景＋白文字。
   - 項目行は白とライトグレーのストライプ（ゼブラ縞）で視認性を向上。
3. **強調バッジ (Badge)**
   - 円形または角丸四角形。
   - 赤やオレンジの塗りに白文字で「75%」「重要」などを記載。
   - ドロップシャドウをつけて浮き立たせる。

---

## 5. デザイン適用イメージ（CSS例）

```css
:root {
  --color-primary: #0F1E3C;
  --color-accent-red: #D32F2F;
  --color-accent-yellow: #FBC02D;
  --color-bg-light: #F5F5F5;
  --text-main: #333333;
  --font-base: "Noto Sans JP", sans-serif;
}

body {
  font-family: var(--font-base);
  color: var(--text-main);
  line-height: 1.6;
}

h1, h2, h3 {
  color: var(--color-primary);
  font-weight: 700;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
  border-radius: 4px; /* 角は少し丸める程度で、ビジネスライクに */
}

.highlight-badge {
  background-color: var(--color-accent-red);
  color: white;
  border-radius: 50%;
  font-weight: bold;
}
```
