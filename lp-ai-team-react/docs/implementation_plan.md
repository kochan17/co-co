# 実装計画: AIチーム開発支援LP

## ゴール
「AIチーム開発伴走支援」の高品質でレスポンシブなランディングページ（LP）を構築する。
デザインは、ダークモード、3D要素、グラスモーフィズムを使用した「Intellectual Modern（知的でモダン）」な美学に訴求する。

## ユーザーレビュー必須項目
- **フレームワーク:** React + Vite + TypeScript を使用。
- **スタイリング:** TailwindCSS (v3) で迅速なスタイリング。
- **3Dライブラリ:** Heroセクションの背景に Three.js + React Three Fiber を使用。
- **アイコン:** Phosphor Icons (要望通り)。
- **アニメーション:** Framer Motion。

## 提案される変更

### プロジェクトの初期化
- [NEW] `lp-ai-team-react` を Vite (React TypeScript) で初期化。
- [NEW] 依存関係のインストール:
    - `tailwindcss`, `postcss`, `autoprefixer`
    - `framer-motion`
    - `@phosphor-icons/react`
    - `three`, `@types/three`, `@react-three/fiber`, `@react-three/drei`

### コンポーネント構造
#### `src/components`
- `Button.tsx`: グラデーションボーダーなどを持つ再利用可能なボタン。
- `Card.tsx`: グラスモーフィズムカードのコンテナ。
- `Section.tsx`: 標準的なパディング/マージンを持つレイアウト用ラッパー。

#### `src/sections`
- `Hero.tsx`: 3D背景 + 「Intellectual Modern」なコピー。
- `PainPoints.tsx`: 課題カードのグリッド表示。
- `Solution.tsx`: 「ツールではなくチーム」の説明。
- `Curriculum.tsx`: プログラムのタイムライン。
- `UseCases.tsx`: Before/After の比較。
- `CTA.tsx`: 最終的なコンバージョンセクション。

#### `src/App.tsx`
- 各セクションを順序通りに組み立てる。

### スタイリング
- [MODIFY] `tailwind.config.js`: カスタムカラー（Deep Black, Tech Blue/Purple）とフォント（Inter/Outfit）を追加。
- [MODIFY] `index.css`: グローバルなダークモードスタイル。

## 検証計画

### 自動テスト
- ビルドテスト: `npm run build` を実行し、TSエラーがないことを確認。
- リントチェック: `npm run lint` を実行。

### 手動検証
- **ブラウザチェック:**
    - `npm run dev` で起動。
    - Heroセクションの3Dアニメーションがラグなく読み込まれるか確認。
    - レスポンシブ対応（モバイル/デスクトップ）を確認。
    - カードやボタンのホバー状態を確認。
- **ビジュアルレビュー:**
    - 各セクションのスクリーンショットを撮り、「Intellectual Modern」な美学と一致しているか確認。
