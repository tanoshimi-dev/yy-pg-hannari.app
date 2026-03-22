# Hannari - 子供向け学習アプリ

子供がクイズやゲームを通じて楽しく学べる学習アプリケーションです。コンテンツを読み、クイズに答えることで学習の進捗を確認できます。

## 技術スタック

- **フロントエンド**: Vue.js + TypeScript
- **バックエンド**: NestJS + TypeScript
- **データベース**: PostgreSQL
- **ORM**: Prisma
- **認証**: Google OAuth
- **E2Eテスト**: Playwright

## Docker Compose で開発環境を起動する

### 前提条件

- Docker および Docker Compose がインストールされていること
- Google OAuth のクライアントIDとシークレットを取得済みであること

### 環境変数の設定

`sys/.env.example` を参考に `sys/.env` ファイルを作成してください。

```bash
cp sys/.env.example sys/.env
```

必要に応じて値を編集してください。

### 起動

```bash
cd sys
docker compose up --build
```

以下のサービスが起動します:

| サービス | URL |
|----------|-----|
| フロントエンド | http://localhost:5173 |
| バックエンドAPI | http://localhost:3000 |
| PostgreSQL | localhost:5432 |

### データベースのシード

コンテンツデータを投入するには:

```bash
docker compose exec backend npx prisma db seed
```

### 停止

```bash
docker compose down
```

データベースのデータも削除する場合:

```bash
docker compose down -v
```

### 本番環境

```bash
cd sys
docker compose -f docker-compose.prod.yml up --build -d
```

## E2E テストの実行

### セットアップ

```bash
cd sys/e2e
npm install
npx playwright install
```

### テスト実行

```bash
# ヘッドレスモードで実行
npm test

# ブラウザを表示して実行
npm run test:headed

# Playwright UIモードで実行
npm run test:ui
```

### テスト内容

| テストファイル | テスト対象 |
|---------------|-----------|
| `login.spec.ts` | ログインページの表示、Google認証ボタン、OAuthリダイレクト |
| `contents.spec.ts` | コンテンツ一覧の表示、カード情報、詳細ページへの遷移 |
| `quiz.spec.ts` | クイズの質問と選択肢の表示、フィードバック、結果ページ |
| `progress.spec.ts` | 学習進捗のダッシュボード表示、進捗の更新 |

## プロジェクト構成

```
yy-pg/
├── sys/                        # システム（Docker環境）
│   ├── backend/                # NestJS バックエンドAPI
│   │   ├── src/
│   │   ├── prisma/
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── frontend/               # Vue.js フロントエンド
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── e2e/                    # Playwright E2Eテスト
│   │   ├── tests/
│   │   ├── playwright.config.ts
│   │   └── package.json
│   ├── docker-compose.yml      # 開発用
│   ├── docker-compose.prod.yml # 本番用
│   ├── .env.example
│   └── .env.prod.example
├── doc/                        # ドキュメント
│   ├── contents/               # コンテンツ定義
│   ├── dev-plan/               # 開発計画
│   └── tips/                   # 開発Tips
├── .gitignore
├── CLAUDE.md
└── README.md
```
