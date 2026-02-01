# GitHub自動化システム

会議議事録から自動的にGitHub IssuesとProjects v2を作成するシステムです。

## 🎯 概要

Gemini 2.5 Pro APIを使用して会議議事録を解析し、アクションアイテムを抽出してGitHub IssuesとProjects v2に自動登録します。

## ✨ 主な機能

- 📝 議事録からのタスク自動抽出（Gemini 2.5 Pro）
- 🎯 SMART原則に基づくタスク定義
- 🏷️ GitHub Issuesの自動作成
- 📊 Projects v2への自動追加
- 🔗 議事録へのIssueリンク自動追記

## 🚀 クイックスタート

### 1. インストール

```bash
pip install -r requirements.txt
```

### 2. 環境変数の設定

```bash
cp .env.example .env
# .envを編集してAPIキーとトークンを設定
```

### 3. 実行

```bash
# Dry-runテスト
python scripts/auto_create_issues.py \
  --meeting-file "ドキュメント/会議/2026_01_30/2026_01_30_議事録.md" \
  --dry-run

# 実際に作成
python scripts/auto_create_issues.py \
  --meeting-file "ドキュメント/会議/2026_01_30/2026_01_30_議事録.md"
```

## 📚 ドキュメント

詳細なセットアップ手順は [docs/GITHUB_AUTOMATION_SETUP.md](docs/GITHUB_AUTOMATION_SETUP.md) を参照してください。

## 🛠️ 必要な設定

- Gemini APIキー
- GitHub Personal Access Token（スコープ: `repo`, `project`）
- GitHub Projects v2の作成とカスタムフィールド設定

## 📝 ライセンス

MIT License
