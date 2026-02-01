#!/usr/bin/env python3
"""
会議議事録からタスクを抽出するスクリプト

Gemini 2.5 Proを使用して、会議議事録のMarkdownファイルから
実行可能なアクションアイテムを抽出し、構造化されたJSONで返却します。
"""

import json
import os
import sys
from pathlib import Path
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import re

try:
    import google.generativeai as genai
    from dotenv import load_dotenv
except ImportError:
    print("Error: Required packages not found. Please run: pip install -r requirements.txt")
    sys.exit(1)

# 環境変数の読み込み
load_dotenv()

# Gemini APIの設定
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash-exp")

if not GOOGLE_API_KEY:
    print("Error: GOOGLE_API_KEY not found in environment variables")
    sys.exit(1)

genai.configure(api_key=GOOGLE_API_KEY)

# プロンプトテンプレート
EXTRACTION_PROMPT = """あなたは経験豊富なプロジェクトマネージャーです。
以下の会議議事録から、実行可能なアクションアイテムを抽出してください。

<議事録>
{meeting_notes}
</議事録>

以下の形式でJSON配列として返してください：

[
  {{
    "title": "具体的なタスクのタイトル（動詞で始める）",
    "description": "詳細な説明。背景・目的・成果物を含む",
    "assignee": "担当者名（議事録から自動判別）",
    "priority": "P0/P1/P2/P3（ビジネスインパクトで判断）",
    "size": "XS/S/M/L/XL（作業時間の見積もり）",
    "due_date": "YYYY-MM-DD形式（議事録に期限があれば、なければnull）",
    "type": "Feature/Bug/Chore/Research/Meeting Action",
    "team": "Product/Engineering/Sales/Operations/All",
    "business_impact": "High/Medium/Low",
    "dependencies": ["依存する他のタスク（あれば）"],
    "context": "会議の該当部分の引用"
  }}
]

ルール:
1. タイトルは動詞で始め、SMART原則に従う（Specific, Measurable, Achievable, Relevant, Time-bound）
2. 曖昧な表現（「検討する」「考える」）は避け、具体的なアクション（「作成する」「実装する」「決定する」）を使う
3. 優先度はビジネスインパクトと緊急度のマトリクスで判断
   - P0: クリティカル、すぐに対応が必要
   - P1: 高優先度、今週中に対応
   - P2: 中優先度、今月中に対応
   - P3: 低優先度、バックログ
4. サイズは実装の複雑さではなく、実際の作業時間で見積もる
   - XS: 1日未満
   - S: 1-2日
   - M: 3-5日
   - L: 1-2週間
   - XL: 2週間以上
5. 「未解決の質問」セクションは、Research typeのタスクとして扱う
6. 複数人に関連するタスクは、メインの担当者を1人選ぶ
7. 「アクションアイテム」セクションを優先的に抽出する
8. 純粋なJSON配列のみを返す（マークダウンのコードブロック等で囲まない）

担当者名のマッピング:
- kotaishida, ishida → kotaishida
- tim, tim kazuki, kazuki → tim kazuki
- sat, sato → sat
"""


class MeetingAnalyzer:
    """会議議事録を解析してタスクを抽出するクラス"""

    def __init__(self, model_name: str = GEMINI_MODEL):
        """
        Args:
            model_name: 使用するGeminiモデル名
        """
        self.model = genai.GenerativeModel(model_name)

    def read_meeting_notes(self, file_path: str) -> str:
        """
        議事録ファイルを読み込む

        Args:
            file_path: 議事録ファイルのパス

        Returns:
            議事録の内容
        """
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except FileNotFoundError:
            print(f"Error: File not found: {file_path}")
            sys.exit(1)
        except Exception as e:
            print(f"Error reading file: {e}")
            sys.exit(1)

    def extract_tasks(self, meeting_notes: str, retry_count: int = 3) -> List[Dict]:
        """
        議事録からタスクを抽出する

        Args:
            meeting_notes: 議事録の内容
            retry_count: リトライ回数

        Returns:
            抽出されたタスクのリスト
        """
        prompt = EXTRACTION_PROMPT.format(meeting_notes=meeting_notes)

        for attempt in range(retry_count):
            try:
                print(f"Gemini APIにリクエスト中... (試行 {attempt + 1}/{retry_count})")
                
                response = self.model.generate_content(
                    prompt,
                    generation_config=genai.types.GenerationConfig(
                        temperature=0.2,  # 一貫性のある出力のため低めに設定
                    )
                )

                # レスポンステキストの取得
                response_text = response.text.strip()
                
                # マークダウンのコードブロックを除去
                response_text = re.sub(r'^```json\s*', '', response_text)
                response_text = re.sub(r'^```\s*', '', response_text)
                response_text = re.sub(r'\s*```$', '', response_text)
                response_text = response_text.strip()

                # JSONパース
                tasks = json.loads(response_text)

                if not isinstance(tasks, list):
                    raise ValueError("Response is not a JSON array")

                print(f"✓ {len(tasks)}個のタスクを抽出しました")
                return tasks

            except json.JSONDecodeError as e:
                print(f"Warning: JSON parse error (試行 {attempt + 1}/{retry_count}): {e}")
                if attempt < retry_count - 1:
                    print("リトライします...")
                    continue
                else:
                    print("Error: Failed to parse Gemini response as JSON")
                    print(f"Response: {response_text[:500]}...")
                    return []

            except Exception as e:
                print(f"Error: Gemini API request failed: {e}")
                if attempt < retry_count - 1:
                    print("リトライします...")
                    continue
                else:
                    return []

        return []

    def validate_and_normalize_tasks(self, tasks: List[Dict]) -> List[Dict]:
        """
        タスクのバリデーションと正規化

        Args:
            tasks: 抽出されたタスクのリスト

        Returns:
            バリデーション・正規化されたタスクのリスト
        """
        normalized_tasks = []

        valid_priorities = ["P0 (Critical)", "P1 (High)", "P2 (Medium)", "P3 (Low)"]
        valid_sizes = ["XS (< 1日)", "S (1-2日)", "M (3-5日)", "L (1-2週)", "XL (2週以上)"]
        valid_types = ["Feature", "Bug", "Chore", "Research", "Meeting Action"]
        valid_teams = ["Product", "Engineering", "Sales", "Operations", "All"]
        valid_impacts = ["High", "Medium", "Low"]

        for i, task in enumerate(tasks):
            # 必須フィールドのチェック
            if not task.get("title"):
                print(f"Warning: Task {i+1} missing title, skipping")
                continue

            # デフォルト値の設定
            normalized_task = {
                "title": task.get("title", "").strip(),
                "description": task.get("description", "").strip(),
                "assignee": task.get("assignee", "").strip(),
                "priority": task.get("priority", "P2 (Medium)"),
                "size": task.get("size", "M (3-5日)"),
                "due_date": task.get("due_date"),
                "type": task.get("type", "Meeting Action"),
                "team": task.get("team", "Product"),
                "business_impact": task.get("business_impact", "Medium"),
                "dependencies": task.get("dependencies", []),
                "context": task.get("context", "").strip()
            }

            # バリデーション
            if normalized_task["priority"] not in valid_priorities:
                print(f"Warning: Invalid priority '{normalized_task['priority']}' for task '{normalized_task['title']}', using default")
                normalized_task["priority"] = "P2 (Medium)"

            if normalized_task["size"] not in valid_sizes:
                print(f"Warning: Invalid size '{normalized_task['size']}' for task '{normalized_task['title']}', using default")
                normalized_task["size"] = "M (3-5日)"

            if normalized_task["type"] not in valid_types:
                print(f"Warning: Invalid type '{normalized_task['type']}' for task '{normalized_task['title']}', using default")
                normalized_task["type"] = "Meeting Action"

            if normalized_task["team"] not in valid_teams:
                print(f"Warning: Invalid team '{normalized_task['team']}' for task '{normalized_task['title']}', using default")
                normalized_task["team"] = "Product"

            if normalized_task["business_impact"] not in valid_impacts:
                print(f"Warning: Invalid impact '{normalized_task['business_impact']}' for task '{normalized_task['title']}', using default")
                normalized_task["business_impact"] = "Medium"

            # due_dateのバリデーション
            if normalized_task["due_date"]:
                try:
                    datetime.strptime(normalized_task["due_date"], "%Y-%m-%d")
                except ValueError:
                    print(f"Warning: Invalid date format '{normalized_task['due_date']}' for task '{normalized_task['title']}', setting to None")
                    normalized_task["due_date"] = None

            normalized_tasks.append(normalized_task)

        return normalized_tasks


def main():
    """メイン処理"""
    import argparse

    parser = argparse.ArgumentParser(description="会議議事録からタスクを抽出")
    parser.add_argument("--file", "-f", required=True, help="議事録ファイルのパス")
    parser.add_argument("--output", "-o", help="出力JSONファイルのパス（省略時は標準出力）")
    parser.add_argument("--test", action="store_true", help="テストモード（結果を表示のみ）")
    args = parser.parse_args()

    # MeetingAnalyzerの初期化
    analyzer = MeetingAnalyzer()

    # 議事録の読み込み
    print(f"議事録を読み込んでいます: {args.file}")
    meeting_notes = analyzer.read_meeting_notes(args.file)

    # タスクの抽出
    print("タスクを抽出しています...")
    tasks = analyzer.extract_tasks(meeting_notes)

    if not tasks:
        print("Error: No tasks extracted")
        sys.exit(1)

    # バリデーションと正規化
    print("タスクを検証・正規化しています...")
    normalized_tasks = analyzer.validate_and_normalize_tasks(tasks)

    # 結果の出力
    output_data = {
        "source_file": args.file,
        "extracted_at": datetime.now().isoformat(),
        "tasks": normalized_tasks
    }

    if args.test:
        print("\n" + "="*80)
        print("抽出されたタスク:")
        print("="*80)
        for i, task in enumerate(normalized_tasks, 1):
            print(f"\n[{i}] {task['title']}")
            print(f"    担当者: {task['assignee']}")
            print(f"    優先度: {task['priority']} | サイズ: {task['size']} | 種類: {task['type']}")
            print(f"    期限: {task['due_date'] or 'なし'}")
            print(f"    説明: {task['description'][:100]}..." if len(task['description']) > 100 else f"    説明: {task['description']}")

    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, ensure_ascii=False, indent=2)
        print(f"\n結果を保存しました: {args.output}")
    else:
        print(json.dumps(output_data, ensure_ascii=False, indent=2))

    print(f"\n✓ 完了: {len(normalized_tasks)}個のタスクを抽出しました")


if __name__ == "__main__":
    main()
