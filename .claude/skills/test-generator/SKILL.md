# Test Generator Skill

## Description
関数やクラスに対して包括的なテストコードを自動生成するスキル。

## When to Use
- 新機能のテスト作成
- 既存コードのテストカバレッジ向上
- リファクタリング後のテスト更新

## Tools Available
- Read: 対象コードの分析
- Write: テストファイルの作成
- Bash: テスト実行とカバレッジ確認

## Instructions
以下の手順でテストを生成してください：

1. **対象コードの分析**
   - 関数/クラスの仕様を理解
   - 引数・戻り値の型を確認
   - 依存関係を把握

2. **テストケースの設計**
   - ハッピーパス
   - エッジケース
   - エラーケース
   - 境界値テスト

3. **モックとスタブ**
   - 外部依存のモック化
   - データベース接続のスタブ
   - API呼び出しのモック

4. **アサーション**
   - 戻り値の検証
   - 副作用の確認
   - 例外処理の検証

## Test Framework Detection
プロジェクトのテストフレームワークを自動検出：
- Jest (JavaScript/TypeScript)
- PyTest (Python)
- RSpec (Ruby)
- xUnit (C#)
- JUnit (Java)

## Example Output
```javascript
describe('calculateTotal', () => {
  test('正常な計算', () => {
    expect(calculateTotal([10, 20, 30])).toBe(60);
  });

  test('空配列の場合', () => {
    expect(calculateTotal([])).toBe(0);
  });

  test('負の数を含む場合', () => {
    expect(calculateTotal([10, -5, 15])).toBe(20);
  });
});
```