#!/bin/bash

# PowerPoint Generator Skill - 実行例スクリプト

echo "=== PowerPoint Generator Skill 実行例 ==="
echo ""

# 必要なパッケージのインストール確認
echo "1. 依存パッケージのインストール確認"
python -m pip install python-pptx beautifulsoup4 markdown pillow --quiet
if [ $? -eq 0 ]; then
    echo "✅ 必要なパッケージがインストールされています"
else
    echo "❌ パッケージのインストールに失敗しました"
    exit 1
fi

echo ""

# スクリプトディレクトリに移動
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
cd "$SCRIPT_DIR"

# 実行権限付与
chmod +x scripts/generate_slides.py

echo "2. HTMLからPowerPoint生成テスト"
echo "入力: examples/sample-content.html"
echo "出力: output/sample-presentation-html.pptx"

mkdir -p output

python scripts/generate_slides.py \
    --input examples/sample-content.html \
    --output output/sample-presentation-html.pptx \
    --config config.json \
    --format html

if [ $? -eq 0 ]; then
    echo "✅ HTML → PPTX変換成功"
else
    echo "❌ HTML → PPTX変換失敗"
fi

echo ""

echo "3. MarkdownからPowerPoint生成テスト"
echo "入力: examples/sample-content.md"
echo "出力: output/sample-presentation-md.pptx"

python scripts/generate_slides.py \
    --input examples/sample-content.md \
    --output output/sample-presentation-md.pptx \
    --config config.json \
    --format markdown

if [ $? -eq 0 ]; then
    echo "✅ Markdown → PPTX変換成功"
else
    echo "❌ Markdown → PPTX変換失敗"
fi

echo ""

echo "4. テンプレート指定での生成テスト（テンプレートがある場合）"
if [ -f "templates/company-template.pptx" ]; then
    echo "入力: examples/sample-content.html"
    echo "テンプレート: templates/company-template.pptx"
    echo "出力: output/sample-with-template.pptx"

    python scripts/generate_slides.py \
        --input examples/sample-content.html \
        --output output/sample-with-template.pptx \
        --template templates/company-template.pptx \
        --config config.json

    if [ $? -eq 0 ]; then
        echo "✅ テンプレート使用でのPPTX生成成功"
    else
        echo "❌ テンプレート使用でのPPTX生成失敗"
    fi
else
    echo "⚠️  テンプレートファイルが見つかりません"
    echo "   templates/company-template.pptxを配置してテンプレート機能をテストできます"
fi

echo ""
echo "=== 生成結果 ==="
echo "以下のファイルが生成されました："
ls -la output/ 2>/dev/null || echo "出力ディレクトリがありません"

echo ""
echo "=== 使用方法 ==="
echo ""
echo "基本的な使用方法："
echo "python scripts/generate_slides.py --input [HTMLまたはMDファイル] --output [出力PPTXファイル]"
echo ""
echo "テンプレート指定："
echo "python scripts/generate_slides.py --input content.html --template templates/your-template.pptx --output result.pptx"
echo ""
echo "設定ファイル指定："
echo "python scripts/generate_slides.py --input content.html --config custom-config.json --output result.pptx"
echo ""
echo "=== 次のステップ ==="
echo ""
echo "1. templates/ディレクトリに自社PowerPointテンプレートを配置"
echo "2. config.jsonでブランドカラー・会社情報を設定"
echo "3. HTMLまたはMarkdownコンテンツを準備"
echo "4. スクリプトを実行してPowerPoint生成"
echo ""
echo "詳細な設定方法は templates/README.md を参照してください。"