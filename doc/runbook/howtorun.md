# Hannari App 起動・デプロイ手順

## 環境の分離

```
sys/
├── docker-compose.yml          ← ローカル開発用
├── docker-compose.prod.yml     ← 本番デプロイ用
├── .env.prod.example           ← 本番用 .env テンプレート
├── backend/
│   ├── Dockerfile              ← ローカル用（ホットリロード、start:dev）
│   ├── Dockerfile.prod         ← 本番用（マルチステージビルド）
│   ├── .env                    ← ローカル用の環境変数 ※Git管理しない
│   ├── .env.example            ← ローカル用 .env テンプレート
│   └── .dockerignore           ← ビルド時に node_modules 等を除外
└── frontend/
    ├── Dockerfile              ← ローカル用（Vite dev server）
    ├── Dockerfile.prod         ← 本番用（ビルド → nginx配信）
    ├── nginx.conf              ← 本番用 nginx設定（SPA対応）
    └── .dockerignore           ← ビルド時に node_modules 等を除外
```

### 設計方針

| 項目 | ローカル開発 | 本番 |
|-----|------------|------|
| Compose ファイル | `docker-compose.yml` | `docker-compose.prod.yml` |
| .env の場所 | `backend/.env`（`env_file`で読み込み） | `sys/.env`（Compose が自動読み込み） |
| Dockerfile | `Dockerfile`（開発モード） | `Dockerfile.prod`（マルチステージビルド） |
| backend 起動 | `npm run start:dev`（ホットリロード） | `node dist/src/main.js`（ビルド済み） |
| frontend 配信 | Vite dev server（:5173） | nginx（:3000、静的ファイル配信） |
| DB | ポート公開（5432） | 内部ネットワークのみ |
| HTTPS | なし（http://localhost） | Traefik + Let's Encrypt |

---

## ローカル開発

### 初回セットアップ

```bash
cd sys

# 1. 環境変数を設定
cp backend/.env.example backend/.env
# backend/.env を編集して GOOGLE_CLIENT_ID 等を設定

# 2. コンテナ起動
docker compose up --build

# 3. DBマイグレーション & シード（別ターミナルで）
docker compose exec backend npx prisma migrate dev --name init
docker compose exec backend npx prisma db seed
```

### 日常の起動

```bash
cd sys
docker compose up
```

### アクセスURL

- フロントエンド: http://localhost:5173
- バックエンドAPI: http://localhost:3000
- PostgreSQL: localhost:5432

### ホットリロード

- backend: `src/` の変更が自動反映
- frontend: `src/` の変更が自動反映（Viteのポーリングモード）
- 反映されない場合: `docker compose restart backend` または `docker compose restart frontend`

### コンテンツ更新後

```bash
docker compose exec backend npx prisma db seed
```

---

## 本番デプロイ

### サーバー側の構成

```
~/traefik/hannari.app/yy-pg/
├── docker-compose.prod.yml
├── .env                        ← .env.prod.example からコピーして作成
├── backend/
│   ├── Dockerfile.prod
│   ├── package.json
│   ├── src/
│   ├── prisma/
│   └── .dockerignore
└── frontend/
    ├── Dockerfile.prod
    ├── nginx.conf
    ├── package.json
    ├── src/
    └── .dockerignore
```

### 初回デプロイ

```bash
# 1. ソースコードをサーバーに配置（Git clone または scp）

# 2. 環境変数を設定
cp .env.prod.example .env
# .env を編集して本番用の値を設定

# 3. ビルド & 起動
docker compose -f docker-compose.prod.yml up --build -d

# 4. DBマイグレーション & シード
docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
docker compose -f docker-compose.prod.yml exec backend npx prisma db seed
```

### 更新デプロイ

```bash
# ソースコードを更新後
docker compose -f docker-compose.prod.yml up --build -d

# シードデータ更新が必要な場合
docker compose -f docker-compose.prod.yml exec backend npx prisma db seed
```

### 本番の .env に必要な変数

| 変数 | 説明 |
|-----|------|
| `POSTGRES_USER` | DBユーザー名 |
| `POSTGRES_PASSWORD` | DBパスワード（強力なものを設定） |
| `POSTGRES_DB` | DB名 |
| `GOOGLE_CLIENT_ID` | Google OAuth クライアントID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth シークレット |
| `JWT_SECRET` | JWTトークン署名用シークレット |

※ `GOOGLE_CALLBACK_URL`、`FRONTEND_URL`、`VITE_API_URL` は `docker-compose.prod.yml` にハードコードされています。
ドメインを変更する場合は `docker-compose.prod.yml` を直接編集してください。

---

## コンテンツ完了の仕組み

1. コンテンツを開く → 進捗が「学習中」として記録
2. クイズに回答していく
3. 最後の問題に回答 → そのコンテンツの全クイズに回答済みか確認
4. 全問回答済みなら「完了」に更新
