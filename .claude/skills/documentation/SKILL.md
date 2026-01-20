# Documentation Generator Skill

## Description
コード、API、プロジェクトの包括的なドキュメントを自動生成するスキル。

## When to Use
- API仕様書の作成
- 関数・クラスのドキュメント生成
- プロジェクトのREADME更新
- 技術仕様書の作成

## Tools Available
- Read: ソースコードの分析
- Write: ドキュメントファイルの作成
- Grep: コードパターンの検索

## Instructions

### 1. API Documentation
```markdown
## API Endpoint: POST /api/users

### Description
新しいユーザーを作成します。

### Request
- **URL**: `/api/users`
- **Method**: `POST`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`

### Request Body
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

### Response
```json
{
  "id": "number",
  "name": "string",
  "email": "string",
  "createdAt": "string"
}
```
```

### 2. Function Documentation
```javascript
/**
 * ユーザーの年齢を計算する関数
 *
 * @param {Date} birthDate - 生年月日
 * @param {Date} [currentDate=new Date()] - 基準日（省略時は現在日時）
 * @returns {number} 年齢（満年齢）
 *
 * @example
 * const age = calculateAge(new Date('1990-05-15'));
 * console.log(age); // 現在の年齢
 *
 * @throws {Error} 生年月日が未来の場合
 */
function calculateAge(birthDate, currentDate = new Date()) {
  // 実装...
}
```

### 3. Class Documentation
```typescript
/**
 * ユーザー管理を行うクラス
 *
 * @class UserManager
 * @description データベースとのやり取りやバリデーションを担当
 */
class UserManager {
  /**
   * @constructor
   * @param {Database} db - データベース接続インスタンス
   */
  constructor(db: Database) {}
}
```

## Output Formats
- **Markdown**: README、仕様書
- **JSDoc**: JavaScript/TypeScript関数
- **Docstring**: Python関数・クラス
- **XML Doc**: C#メソッド
- **Javadoc**: Javaメソッド

## Best Practices
- 日本語と英語の併記
- コード例の提供
- エラーケースの説明
- 使用方法の明示