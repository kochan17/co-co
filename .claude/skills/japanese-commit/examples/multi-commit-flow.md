# 複数ファイルの変更を複数コミットに分割するワークフロー

## 状況

複数の異なる機能や修正に関連する変更が mixed status にある場合、
これらを論理的なコミットに分割する手順。

## 初期状態：複雑な変更が混在している

```bash
$ git status

Changes not staged for commit:
  modified:   src/pages/LoginPage.tsx
  modified:   src/pages/ProfilePage.tsx
  modified:   src/components/Button.tsx
  modified:   src/api/auth.ts
  modified:   src/styles/theme.css
  modified:   src/hooks/useAuth.ts
  modified:   README.md

Untracked files:
  src/components/ThemeToggle.tsx
  src/styles/dark-mode.css
```

変更を確認：
```bash
$ git diff
```

## ステップ 1：変更の分類

変更を見直して、論理的にグループ分け：

### グループ 1：認証機能の改善
- `src/pages/LoginPage.tsx` - ログイン画面にバリデーション追加
- `src/api/auth.ts` - 新しい認証API追加
- `src/hooks/useAuth.ts` - 認証ロジックをカスタムフック化

### グループ 2：ダークモード対応
- `src/components/Button.tsx` - ダークモード対応
- `src/components/ThemeToggle.tsx` - テーマ切り替えコンポーネント（新規）
- `src/styles/theme.css` - ダークモード用のCSS追加
- `src/styles/dark-mode.css` - ダークモードスタイル（新規）

### グループ 3：ドキュメント更新
- `README.md` - 新しいAPI使用方法を記載

## ステップ 2：最初のコミット（認証機能）

まず認証関連の変更だけをステージング：

```bash
$ git add src/pages/LoginPage.tsx src/api/auth.ts src/hooks/useAuth.ts

$ git status
Changes to be committed:
  modified:   src/pages/LoginPage.tsx
  modified:   src/api/auth.ts
  modified:   src/hooks/useAuth.ts

Changes not staged for commit:
  modified:   src/pages/ProfilePage.tsx
  modified:   src/components/Button.tsx
  modified:   src/styles/theme.css
  modified:   README.md

Untracked files:
  src/components/ThemeToggle.tsx
  src/styles/dark-mode.css
```

コミット：

```bash
$ git commit -m "ログイン機能を改善：バリデーションとカスタムフック化

ログイン画面の入力値バリデーションを強化し、
認証ロジックをカスタムフック（useAuth）として抽出した。

主な変更：
- LoginPage でメール形式とパスワード長のバリデーション実装
- 新しい APIエンドポイント POST /api/auth/login 対応
- useAuth カスタムフック作成（ログイン状態管理を一元化）

これにより、複数のページで認証ロジックを再利用できるようになった。"
```

## ステップ 3：2番目のコミット（ダークモード）

ダークモード関連の変更をステージング：

```bash
$ git add src/components/Button.tsx src/components/ThemeToggle.tsx \
           src/styles/theme.css src/styles/dark-mode.css

$ git status
Changes to be committed:
  modified:   src/components/Button.tsx
  new file:   src/components/ThemeToggle.tsx
  modified:   src/styles/theme.css
  new file:   src/styles/dark-mode.css

Changes not staged for commit:
  modified:   src/pages/ProfilePage.tsx
  modified:   README.md
```

コミット：

```bash
$ git commit -m "ダークモード対応をサイト全体に追加

ユーザーのシステム設定に基づいてダークモード自動適用、
またはユーザーが手動で切り替えられるようにした。

主な変更：
- ThemeToggle コンポーネント新規作成（テーマ切り替えUI）
- Button コンポーネントのスタイルをダークモード対応
- CSS変数を使用してカラースキーム管理（theme.css, dark-mode.css）

ブラウザの prefers-color-scheme に対応し、
システムダークモード設定との同期も実装した。"
```

## ステップ 4：3番目のコミット（ドキュメント）

ドキュメント関連の変更をステージング：

```bash
$ git add README.md

$ git status
Changes to be committed:
  modified:   README.md

Changes not staged for commit:
  modified:   src/pages/ProfilePage.tsx
```

コミット：

```bash
$ git commit -m "READMEを更新：新しい認証APIの使用方法を記載

新しく追加した useAuth カスタムフックの使用方法と、
POST /api/auth/login エンドポイントの仕様をドキュメント化した。

新しい開発者がすぐに認証機能を使用できるようにした。"
```

## ステップ 5：残りの変更を処理

まだ `src/pages/ProfilePage.tsx` が modified のままです。
どうするかを判断：

**オプション A：修正内容が小さい場合は別のコミット**

```bash
$ git add src/pages/ProfilePage.tsx

$ git commit -m "プロフィールページのダークモード対応

既存のプロフィールページをダークモード対応した。"
```

**オプション B：修正内容が大きい場合は確認**

```bash
$ git diff src/pages/ProfilePage.tsx
```

内容に応じて、適切なグループに追加するか、新しいコミットにするか判断。

## ステップ 6：結果確認

すべてのコミットが完了したら、ログを確認：

```bash
$ git log --oneline -n 4

abc1234 READMEを更新：新しい認証APIの使用方法を記載
def5678 ダークモード対応をサイト全体に追加
ghi9012 ログイン機能を改善：バリデーションとカスタムフック化
jkl3456 (前回のコミット)
```

各コミットが独立した、自己完結した変更を表しています。

## Tips

### 変更内容を確認しながら進める

```bash
# ファイルごとの変更を確認
$ git diff src/pages/LoginPage.tsx

# ステージング済みの変更を確認
$ git diff --cached
```

### ステージング解除したい場合

```bash
# 特定のファイルだけをステージング解除
$ git reset src/pages/SomePage.tsx

# すべてのファイルをステージング解除
$ git reset
```

### 間違えてコミットした場合

最新のコミットを修正する（まだ push していない場合）：

```bash
# コミットメッセージだけ修正
$ git commit --amend -m "新しいメッセージ"

# ファイルを追加・削除して修正
$ git add/rm files
$ git commit --amend
```

## まとめ

複数のグループに分けて、段階的にコミットすることで：

1. ✅ 各コミットが明確な目的を持つ
2. ✅ プロジェクト履歴が読みやすくなる
3. ✅ 問題が発生した時に特定の機能だけをロールバック可能
4. ✅ コードレビュー時に変更の意図が明確になる
5. ✅ git blame で変更理由を追跡しやすくなる
