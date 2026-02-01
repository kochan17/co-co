# GitHub Issues & Projects 自動化システム セットアップガイド

このドキュメントは、会議議事録からGitHub IssuesとProjects v2を自動作成するシステムのセットアップ手順です。

## 📋 前提条件

- Python 3.8以上がインストールされていること
- GitHubアカウントと対象リポジトリへのアクセス権限
- Google AI Studio（Gemini API）アカウント

## 🚀 セットアップ手順

### 1. 依存関係のインストール

```bash
pip install -r requirements.txt
```

### 2. 環境変数の設定

`.env`ファイルを作成し、以下の情報を設定します：

```bash
cp .env.example .env
```

`.env`ファイルを編集：

```bash
# Gemini API設定
GOOGLE_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash-exp

# GitHub設定
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=kochan17
GITHUB_REPO=co-co
GITHUB_PROJECT_NUMBER=1  # Projects v2のプロジェクト番号
```

#### 2.1. Gemini APIキーの取得

1. [Google AI Studio](https://aistudio.google.com/app/apikey) にアクセス
2. 「Create API Key」をクリック
3. 生成されたAPIキーをコピーして`.env`の`GOOGLE_API_KEY`に設定

#### 2.2. GitHub Personal Access Tokenの取得

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 「Generate new token (classic)」をクリック
3. 以下のスコープを選択：
   - `repo` (フルアクセス)
   - `project` (フルアクセス)
   - `write:org` (Organizationのプロジェクトを使用する場合)
4. 生成されたトークンをコピーして`.env`の`GITHUB_TOKEN`に設定

**注意**: トークンは一度しか表示されないため、必ず安全な場所に保存してください。

### 3. GitHub Projects v2の作成

#### 3.1. プロジェクトの作成

1. GitHubリポジトリまたはユーザープロフィールから「Projects」タブを開く
2. 「New project」→「Table」を選択
3. プロジェクト名を「Co-Co Product Roadmap」に設定

#### 3.2. カスタムフィールドの追加

以下のフィールドを追加します：

| フィールド名 | 型 | オプション |
|------------|------|-----------|
| **Status** | Single Select | `Backlog`, `Ready`, `In Progress`, `In Review`, `Done`, `Blocked` |
| **Priority** | Single Select | `P0 (Critical)`, `P1 (High)`, `P2 (Medium)`, `P3 (Low)` |
| **Size** | Single Select | `XS (< 1日)`, `S (1-2日)`, `M (3-5日)`, `L (1-2週)`, `XL (2週以上)` |
| **Sprint** | Iteration | 2週間サイクル |
| **Due Date** | Date | - |
| **Type** | Single Select | `Feature`, `Bug`, `Chore`, `Research`, `Meeting Action` |
| **Team** | Single Select | `Product`, `Engineering`, `Sales`, `Operations`, `All` |
| **Business Impact** | Single Select | `High`, `Medium`, `Low` |

#### 3.3. プロジェクト番号の確認

プロジェクトのURLを確認します：
```
https://github.com/users/kochan17/projects/1
                                          ↑
                                    この番号を.envに設定
```

`.env`ファイルの`GITHUB_PROJECT_NUMBER`に設定：
```bash
GITHUB_PROJECT_NUMBER=1
```

### 4. GitHubラベルの作成

リポジトリに以下のラベルを作成します：

```bash
# GitHub web UI で Settings → Labels から作成
```

| ラベル名 | 色 | 説明 |
|---------|-----|------|
| 会議アクション | `#0075ca` | 会議から作成されたアクションアイテム |
| タスク | `#1d76db` | 一般的なタスク |
| 優先度:高 | `#d73a4a` | 高優先度 |
| 優先度:中 | `#fbca04` | 中優先度 |
| 優先度:低 | `#cccccc` | 低優先度 |
| 機能 | `#a2eeef` | 新機能 |
| バグ | `#d73a4a` | バグ修正 |
| 雑務 | `#fef2c0` | メンテナンス作業 |
| 調査 | `#d4c5f9` | リサーチタスク |

## 📝 使用方法

### 基本的な使い方

```bash
# テスト実行（実際には作成しない）
python scripts/auto_create_issues.py --meeting-file "ドキュメント/会議/2026_01_30/2026_01_30_議事録.md" --dry-run

# 実際にIssues/Projectsを作成
python scripts/auto_create_issues.py --meeting-file "ドキュメント/会議/2026_01_30/2026_01_30_議事録.md"
```

### オプション

- `--meeting-file`, `-f`: 議事録ファイルのパス（必須）
- `--dry-run`: Dry-runモード（実際には作成しない）
- `--no-project`: Projects v2には追加しない
- `--output-dir`, `-o`: 中間ファイルの出力ディレクトリ

### `/meeting-docs`ワークフローとの統合

既存の会議ドキュメント整理ワークフローに統合されているため、以下のコマンドで自動実行されます：

```bash
# 会議ドキュメントの整理時に自動でIssue/Projects作成も実行される
# (ワークフロー内のステップ6で自動実行)
```

## 🔍 トラブルシューティング

### Gemini APIエラー

**症状**: `Error: GOOGLE_API_KEY not found`

**解決方法**:
1. `.env`ファイルが存在するか確認
2. `GOOGLE_API_KEY`が正しく設定されているか確認
3. APIキーが有効か確認（[Google AI Studio](https://aistudio.google.com/)で確認）

### GitHub APIエラー

**症状**: `Error: GITHUB_TOKEN not found` または `403 Forbidden`

**解決方法**:
1. `.env`ファイルの`GITHUB_TOKEN`が正しく設定されているか確認
2. トークンのスコープが`repo`, `project`を含んでいるか確認
3. トークンが期限切れになっていないか確認

### Projects v2に追加されない

**症状**: Issueは作成されるが、Projectsに追加されない

**解決方法**:
1. `GITHUB_PROJECT_NUMBER`が正しいか確認
2. プロジェクトがPublicまたはアクセス権限があるか確認
3. GraphQL APIが正しく動作しているか確認

## 📚 参考資料

- [Gemini API Documentation](https://ai.google.dev/docs)
- [GitHub REST API](https://docs.github.com/en/rest)
- [GitHub GraphQL API](https://docs.github.com/en/graphql)
- [GitHub Projects v2 Documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects)

## 🎯 次のステップ

セットアップが完了したら、以下を試してみてください：

1. 既存の議事録でテスト実行
```bash
python scripts/auto_create_issues.py --meeting-file "ドキュメント/会議/2026_01_30/2026_01_30_議事録.md" --dry-run
```

2. 実際にIssue/Projectsを作成
```bash
python scripts/auto_create_issues.py --meeting-file "ドキュメント/会議/2026_01_30/2026_01_30_議事録.md"
```

3. GitHubでIssueとProjectsを確認
