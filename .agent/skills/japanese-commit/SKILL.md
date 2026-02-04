---
name: Japanese Commit
description: This skill should be used when the user asks to "commit changes", "create commits", "make a commit", "split into commits", "commit with a message", "make logical commits", or when they want to organize changes into meaningful units with Japanese commit messages. Use this skill when git changes need to be analyzed and grouped by feature or functionality before committing.
version: 0.1.0
---

# Japanese Commit Skill

This skill helps organize and commit code changes in logical, meaningful units with clear Japanese commit messages that anyone can understand at a glance.

## Purpose

When working on features or fixes, changes often span multiple files and involve different concerns. Rather than committing everything at once, this skill analyzes the changes, groups them by feature or functionality, and creates a series of focused commits with descriptive Japanese messages.

## When to Use

Use this skill when:

- Multiple files need to be committed together
- Changes should be split into separate commits by functionality
- Commit messages should be clear and understandable in Japanese
- Want to maintain a clean, logical commit history
- Changes span different features or concerns that should be separate commits

## Core Workflow

### 1. Analyze Current Changes

Start by examining the git changes:

```bash
git status
git diff
```

This reveals what has changed and identifies opportunities to group related changes together.

### 2. Identify Logical Units

Group changes by feature or functionality:

- **UI Changes**: All changes related to presentation or components
- **Logic/Functionality**: Business logic or feature implementation
- **Bug Fixes**: Specific bug corrections
- **Configuration**: Settings, build config, dependencies
- **Documentation**: README, comments, docs updates
- **Tests**: Test additions or modifications
- **Refactoring**: Code structure improvements without behavior changes

Each logical unit becomes one commit.

### 3. Stage and Commit by Unit

For each logical unit:

1. Stage specific files that belong together:
   ```bash
   git add path/to/file1 path/to/file2
   ```

2. Create the commit with a clear Japanese message:
   ```bash
   git commit -m "タイトル

   詳細な説明"
   ```

### 4. Japanese Message Format

Use a simple, two-part format:

**タイトル** (1行 - 何をしたか)
```
機能名を追加
バグを修正
UIをリデザイン
```

**説明** (詳細 - なぜそうしたか、どのように実装したか)
```
ユーザーが設定ページでプロフィール画像を変更できるようにした。
新しいAPIエンドポイントを使用して画像をアップロード。
```

## Message Composition Tips

### Good Titles

Write titles that clearly describe what changed:

- ✅ ユーザー認証機能を実装
- ✅ ログイン画面のバグを修正
- ✅ データベーススキーマを更新
- ✅ テスト環境の設定を追加
- ✅ 不要なコードを削除

### Poor Titles

Avoid vague or technical titles:

- ❌ いろいろ修正
- ❌ ファイル更新
- ❌ wip（work in progress）
- ❌ fix stuff
- ❌ update

### Description Content

The description should explain:

1. **What changed**: What files or components were modified
2. **Why it changed**: The motivation or requirement
3. **How it works**: Key implementation details if needed

Example:

```
ページネーション機能を追加

APIレスポンスのページネーション対応に合わせて、
フロントエンドでページング機能を実装した。
ユーザーが最初のページ、次ページ、前ページ、最後のページへ移動できるようになった。
```

## Working with Multiple Changes

When you have multiple unrelated changes:

1. Review all changes with `git status` and `git diff`
2. Identify each distinct feature or fix
3. Use `git add` to stage files for each commit
4. Create commits in order from foundational changes to dependent changes
5. Verify with `git log` that each commit is logical and self-contained

## Tips for Success

- **Small, focused commits**: Each commit should represent one logical change
- **Reviewable commits**: Someone should understand the full change by reading the message and diff
- **Descriptive titles**: Titles should be specific enough to appear in project history
- **Consistent tense**: Use present tense (「を追加」instead of「を追加した」) in titles, past tense in descriptions
- **No empty messages**: Always include both title and description for clarity
- **Verify before pushing**: Review commits with `git log` before pushing to remote

## References

For detailed patterns and examples of well-organized commits, see:

- **`references/commit-patterns.md`** - Common commit patterns and structures
- **`references/japanese-style-guide.md`** - Japanese writing conventions for commits

## Examples

Working examples of organized commits are available in:

- **`examples/example-commits.txt`** - Real commit message examples
- **`examples/multi-commit-flow.md`** - Step-by-step workflow example
