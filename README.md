# 才能鑑定AI

才能鑑定AIは、複数の占術や診断手法を組み合わせて、個人の才能や適性を総合的に分析するアプリケーションです。

## 機能一覧

### 1. 診断機能
- **数秘術診断**: 名前と生年月日から運命数を計算
- **四柱推命診断**: 生年月日と時間から命式を分析
- **算命学診断**: 生年月日から運命を解析
- **MBTI診断**: 質問回答から性格タイプを判定
- **動物占い診断**: 生年月日から動物キャラクターを判定

### 2. 分析・比較機能
- **診断結果の保存**: 各診断結果をデータベースに保存
- **結果の共有**: 診断結果の共有URL生成
- **相性分析**: 複数の診断結果を比較して相性を分析
- **AIフィードバック**: OpenAI APIを使用したパーソナライズされたフィードバック

### 3. 企業向け機能
- **会社登録**: 企業ごとのワークスペース作成
- **従業員管理**: 従業員情報と診断結果の管理
- **チーム分析**: 従業員間の相性やチーム編成の提案

## システム構成

### フロントエンド
- **フレームワーク**: Next.js 14
- **スタイリング**: Tailwind CSS
- **状態管理**: React Hooks

### バックエンド
- **API**: Next.js API Routes
- **データストレージ**: ファイルベースのJSONストレージ
- **外部API**: OpenAI API（GPT-4）

### デプロイメント
- **ホスティング**: Vercel
- **環境変数**: 
  - `OPENAI_API_KEY`: OpenAI APIキー

## API仕様

### 診断API

#### 1. 数秘術診断
```http
POST /api/fortune/numerology
Content-Type: application/json

{
  "name": "string",
  "birthdate": "YYYY-MM-DD",
  "userId": "string (optional)"
}
```

#### 2. 四柱推命診断
```http
POST /api/fortune/fourPillars
Content-Type: application/json

{
  "birthdate": "YYYY-MM-DD",
  "birthtime": "HH:mm",
  "gender": "male|female|other",
  "userId": "string (optional)"
}
```

#### 3. 算命学診断
```http
POST /api/fortune/sanmei
Content-Type: application/json

{
  "birthdate": "YYYY-MM-DD",
  "birthtime": "HH:mm (optional)",
  "gender": "male|female|other",
  "userId": "string (optional)"
}
```

#### 4. MBTI診断
```http
POST /api/fortune/mbti
Content-Type: application/json

{
  "answers": {
    "q1": "e|i",
    "q2": "s|n",
    "q3": "t|f",
    "q4": "j|p"
    // ... その他の質問回答
  },
  "userId": "string (optional)"
}
```

#### 5. 動物占い診断
```http
POST /api/fortune/animalFortune
Content-Type: application/json

{
  "birthdate": "YYYY-MM-DD",
  "gender": "male|female|other",
  "userId": "string (optional)"
}
```

### 結果管理API

#### 診断結果の保存
```http
POST /api/fortune/save
Content-Type: application/json

{
  "type": "numerology|fourPillars|sanmei|mbti|animalFortune",
  "result": object,
  "userId": "string (optional)"
}
```

#### 診断結果の取得
```http
GET /api/fortune/save/{resultId}
```

#### 診断結果の比較
```http
POST /api/compare
Content-Type: application/json

{
  "resultIds": ["string"]
}
```

#### AIフィードバック取得
```http
POST /api/ai-feedback
Content-Type: application/json

{
  "resultId": "string"
}
```

### 企業管理API

#### 会社登録
```http
POST /api/companies
Content-Type: application/json

{
  "name": "string"
}
```

#### 会社情報取得
```http
GET /api/companies
```

#### 従業員追加
```http
POST /api/companies/{companyId}/employees
Content-Type: application/json

{
  "name": "string",
  "email": "string (optional)",
  "department": "string (optional)",
  "position": "string (optional)"
}
```

#### 従業員一覧取得
```http
GET /api/companies/{companyId}/employees
```

## セットアップ手順

1. リポジトリのクローン
```bash
git clone https://github.com/your-username/sainou-kanteiai.git
cd sainou-kanteiai
```

2. 依存関係のインストール
```bash
npm install
```

3. 環境変数の設定
```bash
cp .env.example .env.local
# .env.localを編集してOpenAI APIキーを設定
```

4. 開発サーバーの起動
```bash
npm run dev
```

5. ビルドと本番環境での実行
```bash
npm run build
npm start
```

## 運用マニュアル

### 1. システム要件
- Node.js 18.0.0以上
- npm 9.0.0以上
- OpenAI APIキー

### 2. データバックアップ
- `data`ディレクトリ内のJSONファイルを定期的にバックアップ
- 推奨バックアップ頻度: 毎日
- バックアップ対象:
  - `data/fortune-results/`: 診断結果
  - `data/companies/`: 会社情報
  - `data/settings/`: アプリケーション設定

### 3. エラー対応
- APIエラー: ログを確認し、OpenAI APIキーの有効性を確認
- ストレージエラー: `data`ディレクトリのパーミッションを確認
- 診断エラー: 入力データの形式を確認

### 4. パフォーマンスモニタリング
- APIレスポンス時間の監視
- ストレージ使用量の確認
- OpenAI API使用量の管理

### 5. セキュリティ
- APIキーの定期的な更新
- アクセスログの監視
- データバックアップの暗号化

### 6. メンテナンス手順
1. システムバックアップの実行
2. 依存パッケージの更新確認
3. セキュリティアップデートの適用
4. ログファイルの整理
5. 不要なデータの削除

## 今後の開発予定

### 1. ユーザー認証機能
- OAuth認証の導入
- JWTによるセッション管理
- Firebase Authenticationの統合

### 2. 分析機能の拡充
- 診断結果の統計分析
- チーム適性診断の強化
- AIによる詳細なキャリアアドバイス

### 3. レポート機能
- PDF形式の診断レポート生成
- メールでのレポート送信
- カスタマイズ可能なレポートテンプレート

### 4. UI/UX改善
- モバイル対応の強化
- ダークモードの実装
- アクセシビリティの向上

### 5. データ分析基盤
- 診断データの匿名化分析
- トレンド分析機能
- 機械学習モデルの導入
