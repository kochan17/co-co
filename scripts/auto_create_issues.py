#!/usr/bin/env python3
"""
会議議事録からGitHub IssuesとProjectsを自動作成するメインスクリプト

議事録ファイルを読み込み、Gemini APIでタスクを抽出し、
GitHub IssuesとProjects v2に自動登録します。
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime
import argparse

# スクリプトのディレクトリをパスに追加
sys.path.insert(0, str(Path(__file__).parent / "ai"))

try:
    from meeting_analyzer import MeetingAnalyzer
    from github_integrator import GitHubIntegrator
    from dotenv import load_dotenv
except ImportError as e:
    print(f"Error: Failed to import required modules: {e}")
    print("Please run: pip install -r requirements.txt")
    sys.exit(1)

# 環境変数の読み込み
load_dotenv()

# GitHub設定
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_OWNER = os.getenv("GITHUB_OWNER", "kochan17")
GITHUB_REPO = os.getenv("GITHUB_REPO", "co-co")


def append_issues_to_meeting_notes(meeting_file: str, issues: list) -> None:
    """
    作成されたIssueのリンクを議事録に追記

    Args:
        meeting_file: 議事録ファイルのパス
        issues: 作成されたIssue情報のリスト
    """
    if not issues:
        return

    try:
        with open(meeting_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # 既にIssuesセクションがある場合は追記しない
        if "## 作成されたGitHub Issues" in content:
            print("Note: Issues section already exists in meeting notes")
            return

        # Issuesセクションを追加
        issues_section = "\n\n## 作成されたGitHub Issues\n\n"
        issues_section += f"_自動生成: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}_\n\n"
        
        for issue in issues:
            issues_section += f"- #{issue['number']}: [{issue['title']}]({issue['url']})\n"

        with open(meeting_file, 'a', encoding='utf-8') as f:
            f.write(issues_section)

        print(f"✓ Updated meeting notes with {len(issues)} issue links")

    except Exception as e:
        print(f"Warning: Failed to update meeting notes: {e}")


def main():
    """メイン処理"""
    parser = argparse.ArgumentParser(
        description="会議議事録からGitHub IssuesとProjectsを自動作成"
    )
    parser.add_argument(
        "--meeting-file",
        "-f",
        required=True,
        help="議事録ファイルのパス"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Dry-runモード（実際には作成しない）"
    )
    parser.add_argument(
        "--no-project",
        action="store_true",
        help="Projects v2には追加しない"
    )
    parser.add_argument(
        "--output-dir",
        "-o",
        help="中間ファイル（抽出されたタスクJSON）の出力ディレクトリ（デフォルト: 一時ディレクトリ）"
    )
    args = parser.parse_args()

    print("="*80)
    print("会議議事録 → GitHub Issues & Projects 自動作成")
    print("="*80)
    print(f"議事録: {args.meeting_file}")
    print(f"Dry-run: {args.dry_run}")
    print(f"Projects追加: {not args.no_project}")
    print("="*80)

    # 環境変数のチェック
    if not os.getenv("GOOGLE_API_KEY"):
        print("Error: GOOGLE_API_KEY not found in environment variables")
        print("Please set it in .env file or export it")
        sys.exit(1)

    if not GITHUB_TOKEN:
        print("Error: GITHUB_TOKEN not found in environment variables")
        print("Please set it in .env file or export it")
        sys.exit(1)

    # ステップ1: 議事録からタスクを抽出
    print("\n[Step 1/3] 議事録からタスクを抽出しています...")
    print("-"*80)
    
    analyzer = MeetingAnalyzer()
    meeting_notes = analyzer.read_meeting_notes(args.meeting_file)
    tasks = analyzer.extract_tasks(meeting_notes)

    if not tasks:
        print("Error: No tasks extracted from meeting notes")
        sys.exit(1)

    normalized_tasks = analyzer.validate_and_normalize_tasks(tasks)
    
    print(f"✓ {len(normalized_tasks)}個のタスクを抽出しました")

    # タスクの一時保存
    output_dir = Path(args.output_dir) if args.output_dir else Path(args.meeting_file).parent
    output_file = output_dir / f"{Path(args.meeting_file).stem}_tasks.json"
    
    task_data = {
        "source_file": args.meeting_file,
        "extracted_at": datetime.now().isoformat(),
        "tasks": normalized_tasks
    }
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(task_data, f, ensure_ascii=False, indent=2)
    
    print(f"✓ タスクを保存しました: {output_file}")

    # ステップ2: GitHub IssuesとProjectsを作成
    print("\n[Step 2/3] GitHub IssuesとProjectsを作成しています...")
    print("-"*80)
    
    integrator = GitHubIntegrator(GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO)
    
    created_issues = integrator.create_issues_from_tasks(
        normalized_tasks,
        dry_run=args.dry_run,
        add_to_project=not args.no_project
    )

    # ステップ3: 議事録にIssueリンクを追記
    if not args.dry_run and created_issues:
        print("\n[Step 3/3] 議事録にIssueリンクを追記しています...")
        print("-"*80)
        
        append_issues_to_meeting_notes(args.meeting_file, created_issues)

    # 最終サマリー
    print("\n" + "="*80)
    print("完了サマリー:")
    print("="*80)
    
    if args.dry_run:
        print(f"[DRY RUN] {len(normalized_tasks)}個のIssueが作成される予定です")
    else:
        print(f"✓ {len(created_issues)}個のIssueを作成しました")
        
        if created_issues:
            print("\n作成されたIssue:")
            for issue in created_issues:
                print(f"  #{issue['number']}: {issue['title']}")
                print(f"  → {issue['url']}")

    print("\n✓ すべての処理が完了しました")


if __name__ == "__main__":
    main()
