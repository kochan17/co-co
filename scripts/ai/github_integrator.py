#!/usr/bin/env python3
"""
GitHub IssuesとProjectsを作成するスクリプト

抽出されたタスクをGitHub IssuesとProjects v2に登録します。
"""

import json
import os
import sys
from typing import List, Dict, Optional
from datetime import datetime
from pathlib import Path

try:
    from github import Github, GithubException
    import requests
    from dotenv import load_dotenv
except ImportError:
    print("Error: Required packages not found. Please run: pip install -r requirements.txt")
    sys.exit(1)

# 環境変数の読み込み
load_dotenv()

# GitHub設定
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_OWNER = os.getenv("GITHUB_OWNER", "kochan17")
GITHUB_REPO = os.getenv("GITHUB_REPO", "co-co")
GITHUB_PROJECT_NUMBER = os.getenv("GITHUB_PROJECT_NUMBER")

if not GITHUB_TOKEN:
    print("Error: GITHUB_TOKEN not found in environment variables")
    sys.exit(1)


class GitHubIntegrator:
    """GitHub IssuesとProjectsを統合するクラス"""

    def __init__(self, token: str, owner: str, repo: str):
        """
        Args:
            token: GitHub Personal Access Token
            owner: リポジトリオーナー
            repo: リポジトリ名
        """
        self.github = Github(token)
        self.token = token
        self.owner = owner
        self.repo = repo
        self.repository = self.github.get_repo(f"{owner}/{repo}")
        
        # 設定ファイルの読み込み
        self.config = self._load_config()
        self.project_config = self._load_project_config()

    def _load_config(self) -> Dict:
        """Issue設定ファイルを読み込む"""
        config_path = Path(__file__).parent.parent.parent / ".github" / "config" / "issue_template.json"
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Warning: Config file not found: {config_path}")
            return {"labels": {}, "assignees_mapping": {}}

    def _load_project_config(self) -> Dict:
        """Projects設定ファイルを読み込む"""
        config_path = Path(__file__).parent.parent.parent / ".github" / "config" / "project_config.json"
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Warning: Project config file not found: {config_path}")
            return {}

    def _map_assignee(self, assignee_name: str) -> Optional[str]:
        """
        担当者名をGitHubユーザー名にマッピング

        Args:
            assignee_name: 議事録に記載された担当者名

        Returns:
            GitHubユーザー名（見つからない場合はNone）
        """
        mapping = self.config.get("assignees_mapping", {})
        
        # 小文字で正規化してマッピング
        assignee_lower = assignee_name.lower().strip()
        for key, value in mapping.items():
            if key.lower() == assignee_lower:
                return value
        
        # マッピングが見つからない場合はそのまま返す
        return assignee_name if assignee_name else None

    def _get_labels(self, task: Dict) -> List[str]:
        """
        タスクから適切なラベルを取得

        Args:
            task: タスク情報

        Returns:
            ラベル名のリスト
        """
        labels = []
        
        # タイプに応じたラベル
        type_labels = self.config.get("type_labels", {})
        task_type = task.get("type", "Meeting Action")
        if task_type in type_labels:
            labels.append(type_labels[task_type])
        
        # 優先度に応じたラベル
        priority_labels = self.config.get("priority_labels", {})
        priority = task.get("priority", "P2 (Medium)")
        if priority in priority_labels:
            labels.append(priority_labels[priority])
        
        return labels

    def create_issue(self, task: Dict, dry_run: bool = False) -> Optional[Dict]:
        """
        GitHub Issueを作成

        Args:
            task: タスク情報
            dry_run: Trueの場合、実際には作成せずログのみ

        Returns:
            作成されたIssue情報（dry_runの場合はNone）
        """
        title = task.get("title", "")
        description = task.get("description", "")
        assignee = self._map_assignee(task.get("assignee", ""))
        labels = self._get_labels(task)
        
        # Issue本文の構築
        body_parts = []
        
        # 説明
        if description:
            body_parts.append(f"## 説明\n\n{description}")
        
        # コンテキスト（会議からの引用）
        if task.get("context"):
            body_parts.append(f"## 会議での言及\n\n> {task['context']}")
        
        # メタデータ
        metadata_parts = []
        metadata_parts.append(f"**優先度**: {task.get('priority', 'P2 (Medium)')}")
        metadata_parts.append(f"**サイズ見積もり**: {task.get('size', 'M (3-5日)')}")
        metadata_parts.append(f"**種類**: {task.get('type', 'Meeting Action')}")
        metadata_parts.append(f"**チーム**: {task.get('team', 'Product')}")
        metadata_parts.append(f"**ビジネスインパクト**: {task.get('business_impact', 'Medium')}")
        
        if task.get("due_date"):
            metadata_parts.append(f"**期限**: {task['due_date']}")
        
        body_parts.append("## メタデータ\n\n" + "\n".join(metadata_parts))
        
        # 依存関係
        if task.get("dependencies"):
            deps = "\n".join([f"- {dep}" for dep in task["dependencies"]])
            body_parts.append(f"## 依存関係\n\n{deps}")
        
        body = "\n\n".join(body_parts)
        
        if dry_run:
            print(f"\n[DRY RUN] Would create issue:")
            print(f"  Title: {title}")
            print(f"  Assignee: {assignee or 'None'}")
            print(f"  Labels: {', '.join(labels) or 'None'}")
            print(f"  Body preview: {body[:100]}...")
            return None
        
        try:
            # Issueの作成
            print(f"Creating issue: {title}")
            
            issue = self.repository.create_issue(
                title=title,
                body=body,
                assignees=[assignee] if assignee else [],
                labels=labels
            )
            
            print(f"✓ Created issue #{issue.number}: {title}")
            
            return {
                "number": issue.number,
                "url": issue.html_url,
                "title": title,
                "node_id": issue.node_id  # Projects v2に追加するために必要
            }
            
        except GithubException as e:
            print(f"Error creating issue: {e}")
            return None

    def add_issue_to_project(self, issue_node_id: str, task: Dict, project_id: str, dry_run: bool = False) -> bool:
        """
        IssueをProjects v2に追加し、カスタムフィールドを設定

        Args:
            issue_node_id: IssueのNode ID
            task: タスク情報
            project_id: Projects v2のNode ID
            dry_run: Trueの場合、実際には追加せずログのみ

        Returns:
            成功した場合True
        """
        if dry_run:
            print(f"[DRY RUN] Would add issue to project and set fields:")
            print(f"  Priority: {task.get('priority')}")
            print(f"  Size: {task.get('size')}")
            print(f"  Type: {task.get('type')}")
            return True

        # GraphQL APIを使用してProjectsに追加
        graphql_url = "https://api.github.com/graphql"
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }

        # Step 1: IssueをProjectに追加
        add_mutation = """
        mutation($projectId: ID!, $contentId: ID!) {
          addProjectV2ItemById(input: {projectId: $projectId, contentId: $contentId}) {
            item {
              id
            }
          }
        }
        """

        variables = {
            "projectId": project_id,
            "contentId": issue_node_id
        }

        try:
            response = requests.post(
                graphql_url,
                headers=headers,
                json={"query": add_mutation, "variables": variables}
            )
            response.raise_for_status()
            
            result = response.json()
            if "errors" in result:
                print(f"Error adding to project: {result['errors']}")
                return False
            
            item_id = result["data"]["addProjectV2ItemById"]["item"]["id"]
            print(f"✓ Added to project (item_id: {item_id})")

            # Step 2: カスタムフィールドを設定
            # 注: 実際のフィールドIDは、プロジェクト作成時に取得する必要があります
            # ここでは簡略化のため、設定をスキップします
            # 本番環境では、フィールドIDを取得して設定する必要があります

            return True

        except Exception as e:
            print(f"Error adding to project: {e}")
            return False

    def get_project_id(self, project_number: int) -> Optional[str]:
        """
        Projects v2のNode IDを取得

        Args:
            project_number: プロジェクト番号

        Returns:
            Project Node ID（見つからない場合はNone）
        """
        graphql_url = "https://api.github.com/graphql"
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }

        query = """
        query($owner: String!, $number: Int!) {
          user(login: $owner) {
            projectV2(number: $number) {
              id
              title
            }
          }
        }
        """

        variables = {
            "owner": self.owner,
            "number": project_number
        }

        try:
            response = requests.post(
                graphql_url,
                headers=headers,
                json={"query": query, "variables": variables}
            )
            response.raise_for_status()
            
            result = response.json()
            if "errors" in result:
                print(f"Error fetching project: {result['errors']}")
                return None
            
            project = result["data"]["user"]["projectV2"]
            if project:
                print(f"Found project: {project['title']} (ID: {project['id']})")
                return project["id"]
            else:
                print(f"Project #{project_number} not found")
                return None

        except Exception as e:
            print(f"Error fetching project: {e}")
            return None

    def create_issues_from_tasks(self, tasks: List[Dict], dry_run: bool = False, add_to_project: bool = True) -> List[Dict]:
        """
        タスクリストからIssuesを一括作成

        Args:
            tasks: タスク情報のリスト
            dry_run: Trueの場合、実際には作成せずログのみ
            add_to_project: Trueの場合、Projects v2にも追加

        Returns:
            作成されたIssue情報のリスト
        """
        created_issues = []
        
        # Projects v2のIDを取得
        project_id = None
        if add_to_project and GITHUB_PROJECT_NUMBER:
            try:
                project_number = int(GITHUB_PROJECT_NUMBER)
                project_id = self.get_project_id(project_number)
            except ValueError:
                print(f"Warning: Invalid project number: {GITHUB_PROJECT_NUMBER}")

        for i, task in enumerate(tasks, 1):
            print(f"\n[{i}/{len(tasks)}] Processing: {task.get('title', 'Untitled')}")
            
            # Issue作成
            issue_info = self.create_issue(task, dry_run=dry_run)
            
            if issue_info:
                created_issues.append(issue_info)
                
                # Projects v2に追加
                if add_to_project and project_id and not dry_run:
                    self.add_issue_to_project(
                        issue_info["node_id"],
                        task,
                        project_id,
                        dry_run=dry_run
                    )
        
        return created_issues


def main():
    """メイン処理"""
    import argparse

    parser = argparse.ArgumentParser(description="GitHub IssuesとProjectsを作成")
    parser.add_argument("--input", "-i", required=True, help="タスクJSONファイルのパス")
    parser.add_argument("--dry-run", action="store_true", help="Dry-runモード（実際には作成しない）")
    parser.add_argument("--no-project", action="store_true", help="Projects v2には追加しない")
    args = parser.parse_args()

    # タスクの読み込み
    try:
        with open(args.input, 'r', encoding='utf-8') as f:
            data = json.load(f)
            tasks = data.get("tasks", [])
    except FileNotFoundError:
        print(f"Error: File not found: {args.input}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON: {e}")
        sys.exit(1)

    if not tasks:
        print("Error: No tasks found in input file")
        sys.exit(1)

    print(f"Loaded {len(tasks)} tasks from {args.input}")

    # GitHubIntegratorの初期化
    integrator = GitHubIntegrator(GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO)

    # Issuesの作成
    add_to_project = not args.no_project
    created_issues = integrator.create_issues_from_tasks(
        tasks,
        dry_run=args.dry_run,
        add_to_project=add_to_project
    )

    # 結果のサマリー
    print("\n" + "="*80)
    print("結果サマリー:")
    print("="*80)
    
    if args.dry_run:
        print(f"[DRY RUN] {len(tasks)}個のIssueが作成される予定です")
    else:
        print(f"✓ {len(created_issues)}個のIssueを作成しました")
        
        if created_issues:
            print("\n作成されたIssue:")
            for issue in created_issues:
                print(f"  - #{issue['number']}: {issue['title']}")
                print(f"    {issue['url']}")


if __name__ == "__main__":
    main()
