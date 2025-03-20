# 才能鑑定AI

AIを活用した総合的な才能診断システム

## 機能

- MBTI性格診断
- 動物占い
- 数秘術
- 四柱推命
- 算命学
- AIによる総合分析
- PDFレポート生成
- データ分析ダッシュボード

## 技術スタック

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- OpenAI API (GPT-4, DALL-E 3)
- Vercel

## ローカル開発

```bash
# リポジトリのクローン
git clone https://github.com/Ghost3nexus/sainou-kanteiai-app.git
cd sainou-kanteiai-app

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## 環境変数

`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```
OPENAI_API_KEY=your_api_key_here
```

## デプロイ

このプロジェクトはVercelにデプロイされています。

### デプロイ手順

1. [Vercel](https://vercel.com)にアカウントを作成
2. GitHubリポジトリと連携
3. 新規プロジェクトを作成
4. 環境変数を設定
   - `OPENAI_API_KEY`: OpenAI APIキー
5. デプロイを実行

デプロイ後、以下のURLでアクセス可能です：
https://sainou-kanteiai.vercel.app

## デモ用設定

現在、以下の機能がモックデータを使用しています：

- 診断結果の保存/取得
- 各占術タイプの診断処理

実際のデータベースやAPIサービスとの連携は、今後実装予定です。

## ライセンス

MIT License
