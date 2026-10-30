# セキュリティアップデート計画 (2026-10-30)

## 概要

2026-10-30 時点で、Node.js ランタイム・npm 依存パッケージ・Docker イメージ・アプリケーションコードの脆弱性を調査した。
本ドキュメントは調査結果と対応計画をまとめたもの。

### 調査方法

- `npm audit` を `sys/backend` / `sys/frontend` で実行（`sys/e2e` は lockfile が無く監査不可）
- `npm ls` でインストール済みバージョンを確認
- Dockerfile / docker-compose / nginx.conf / 主要ソースコードの目視レビュー

### 調査結果サマリ

| 対象 | Critical | High | Moderate | Low | 合計 |
|------|---------:|-----:|---------:|----:|-----:|
| backend (npm) | 2 | 18 | 9 | 8 | 37 |
| frontend (npm) | 0 | 9 | 1 | 0 | 10 |
| e2e (npm) | - | - | - | - | 監査不可 (lockfile なし) |
| Node.js ランタイム | **EOL** | | | | `node:20-alpine` |

---

## 1. Node.js ランタイム

### 現状

- 全 Dockerfile（backend / frontend, dev / prod）が `node:20-alpine` を使用
- **Node.js 20 は 2026-04-30 に EOL**。以降セキュリティパッチが提供されない
- ローカル PC は Node v22.22.0 / npm 10.9.4（Docker と不一致）
- `@types/node` も backend `^22`、frontend `^24` で不一致

### 対応

- [x] Docker イメージを **`node:24-alpine`（Active/Maintenance LTS）** に更新
  - 対象: `sys/backend/Dockerfile`, `sys/backend/Dockerfile.prod`, `sys/frontend/Dockerfile`, `sys/frontend/Dockerfile.prod`
  - 再現性のため、マイナー/パッチまで固定（例: `node:24.x.y-alpine3.xx`）またはダイジェスト固定を推奨
- [ ] ローカル PC の Node も 24 系 LTS に揃える（`.nvmrc` / `package.json` の `engines` を追加） ※ `.nvmrc` / `engines` は追加済み。ローカル PC への Node 24 インストールは各自で実施
- [x] `@types/node` を `^24` に統一
- [x] `nginx:alpine` / `postgres:16-alpine` も `docker compose pull` で最新パッチに更新し、再ビルド

---

## 2. backend 依存パッケージ (`sys/backend`)

### Critical

| パッケージ | 現在 | 内容 | 経路 / 対応 |
|-----------|------|------|------------|
| proxy-addr | ≤2.0.7 | IPv4-mapped IPv6 による IP 偽装 (GHSA-jqcg-44mw-7w3h) | express 経由。`npm audit fix` で 2.0.8+ へ |
| handlebars | ≤4.7.9 | AST 型混同による JS インジェクション等 多数 | 開発依存 (jest/ts-jest 系) 経由。`npm audit fix` |

### High（本番実行時に影響するもの）

| パッケージ | 現在 | 内容 | 対応 |
|-----------|------|------|------|
| @nestjs/core | 11.1.17 | Injection (GHSA-36xv-jgw5-4q75) + path-to-regexp | 11.1.28 以降へ |
| @nestjs/platform-express | 11.1.17 | multer / path-to-regexp の DoS | 11.1.28 以降へ |
| @nestjs/serve-static | 5.0.4 | path-to-regexp の ReDoS | 5.0.5 以降へ |
| path-to-regexp | 8.3.0 | ReDoS (GHSA-j3q9-mxjg-w52f, GHSA-27v5-c462-wpq7) | 8.4.0 以降（上記更新で解消） |
| body-parser | 2.x | DoS (GHSA-v422-hmwv-36x6, GHSA-27r3-jxmh-p828) | 2.4.0 以降 |
| multer | 2.1.1 | DoS / ファイルサイズ制限バイパス 多数 | 2.5.0 以降（platform-express 更新で解消） |
| qs | ≤6.16.0 | DoS (moderate) | audit fix |
| form-data | 4.0.0-4.0.5 | CRLF インジェクション | 4.0.6 以降 |

### High（開発・ビルド時のみ）

brace-expansion, picomatch, js-yaml, lodash, defu, browserslist, fast-uri, ajv, @angular-devkit/* (@nestjs/cli 経由) など。
本番イメージには含まれないが、CI/開発環境保護のため更新する。

### Prisma（メジャーアップデート要検討）

- `prisma` 6.19.2 → 修正版は **7.10.1（メジャー）**。原因は `@prisma/config` 経由の `deepmerge-ts` / `effect`（High）
- `prisma` CLI は devDependency のため本番ランタイムへの影響は限定的
- Prisma 7 は `prisma.config.ts` 必須化・generator 変更などの破壊的変更があるため、**別タスクとして移行検証**する
  - 移行するまでは 6 系の最新パッチを使用し、リスク受容として記録

### Jest 系 (Low)

- `deepmerge` のプロトタイプ汚染（jest-config 経由）。audit の提案は jest 25 へのダウングレードで不適切 → **対応保留**（上流修正待ち）

### 対応手順

```bash
cd sys/backend
npm install @nestjs/core@^11 @nestjs/common@^11 @nestjs/platform-express@^11 @nestjs/testing@^11 @nestjs/serve-static@^5
npm audit fix            # semver 範囲内の修正
npm audit                # 残件確認（prisma 7 / jest 由来のみ残る想定）
npm run build && npm test
```

---

## 3. frontend 依存パッケージ (`sys/frontend`)

| パッケージ | 現在 | 内容 | 対応 |
|-----------|------|------|------|
| axios | 1.13.6 | プロトタイプ汚染ガジェット、ヘッダインジェクション、SSRF、DoS など 30 件超 | **1.20.0 以降** |
| vue | 3.5.30 | @vue/server-renderer の XSS (GHSA-g2v6-rqmx-r4w6) | 3.5.42 以降 |
| vite | 8.0.1 | dev サーバの任意ファイル読取・パストラバーサル・fs.deny バイパス・launch-editor のコマンド実行 | **8.1.6 以降** |
| postcss | ≤8.5.22 | XSS / 任意 .map ファイル読取 | vite 更新で解消 |
| nanoid / picomatch / source-map-js / follow-redirects / form-data | - | DoS 等 | audit fix |

> vite の脆弱性は dev サーバ (`npm run dev --host 0.0.0.0`) に関するもの。docker-compose で `5173` を公開しているため、ローカルでも LAN 内から到達可能な点に注意。

### 対応手順

```bash
cd sys/frontend
npm install axios@^1.20.0 vue@^3.5.42 vite@^8.1.6 @vitejs/plugin-vue@latest
npm audit fix
npm audit
npm run build
```

---

## 4. e2e (`sys/e2e`)

- [x] `package-lock.json` が存在しないため監査不可・ビルド再現性なし → `npm install` で lockfile を生成しコミット
- [x] `@playwright/test` `^1.40.0` → 最新 1.x に更新し、`npx playwright install` でブラウザも更新

---

## 5. Docker / インフラ

| # | 問題 | 影響 | 対応 |
|---|------|------|------|
| 5-1 | `Dockerfile.prod` (backend) の本番ステージは `npm ci --omit=dev` のため `prisma` CLI が無く、`npx prisma migrate deploy` が **実行時に npm レジストリから未固定バージョンを取得** | サプライチェーンリスク・Prisma 7 が取得されると起動失敗の恐れ | `prisma` を dependencies へ移すか、builder から CLI をコピー。`npx --no-install` を使用 |
| 5-2 | `npm install -g ts-node typescript` がバージョン未固定 | 同上 | 使用目的（seed?）を確認し、不要なら削除。必要ならバージョン固定 |
| 5-3 | コンテナが root で実行 | コンテナ侵害時の影響拡大 | `USER node` を追加 |
| 5-4 | `docker-compose.yml` で Postgres `5432` をホストに公開、固定パスワード | ローカル開発用だが LAN 露出 | `127.0.0.1:5432:5432` にバインド |
| 5-5 | nginx にセキュリティヘッダが無い | クリックジャッキング・MIME スニッフィング等 | `X-Content-Type-Options`, `X-Frame-Options`/CSP `frame-ancestors`, `Referrer-Policy`, `Content-Security-Policy` を追加。`server_tokens off;` |

---

## 6. アプリケーションコード

| # | 箇所 | 問題 | 優先度 | 対応 |
|---|------|------|--------|------|
| 6-1 | `sys/backend/src/app.module.ts` (`/media`) | `doc/contents` 全体を静的公開しており、`/media/<slug>/quiz.json`（**クイズの正解**）や `lesson.md` が誰でも取得可能。Traefik でも `/media` をルーティング | 高 | 公開対象を `*/assets/` 配下に限定（`rootPath` 変更 or 拡張子フィルタ） |
| 6-2 | `auth.module.ts` / `jwt.strategy.ts` | `JWT_SECRET` 未設定時に固定値 `'hannari_jwt_secret'` にフォールバック | 高 | 未設定時は起動失敗させる |
| 6-3 | `auth.controller.ts` | JWT を `?token=` のクエリでフロントへ渡す → ブラウザ履歴・Referer・アクセスログに残る | 中 | URL フラグメント (`#token=`) 化、または短命の交換コード方式 / HttpOnly Cookie |
| 6-4 | frontend `stores/auth.ts` | JWT を `localStorage` に保存（有効期限 7 日） | 中 | XSS 時に窃取可能。6-5 と併せて有効期限短縮 or HttpOnly Cookie 化を検討 |
| 6-5 | `ContentDetailView.vue` `renderBody` | `marked` の出力をサニタイズせず `v-html`。独自レンダラで `alt`/`title`/`src` をエスケープせず属性に埋め込み | 中 | 現状コンテンツは自前管理だが、**管理者によるコンテンツ追加予定**があるため DOMPurify を導入し属性値をエスケープ |
| 6-6 | `main.ts` | `helmet` 未導入、レート制限なし | 低 | `helmet` と `@nestjs/throttler` を導入 |

---

## 7. 実施スケジュール

### フェーズ A: 即時対応（Critical / High・低リスク）

- [x] backend: NestJS 11 系最新化 + `npm audit fix`
- [x] frontend: axios / vue / vite 更新 + `npm audit fix`
- [x] 6-1 `/media` 公開範囲の制限
- [x] 6-2 JWT_SECRET フォールバック削除
- [x] 5-1 / 5-2 本番 Dockerfile の未固定 npx / npm -g 解消

### フェーズ B: ランタイム更新

- [ ] Node 20 → 24 LTS（Dockerfile 4 ファイル、ローカル環境、`engines`、`@types/node`） ※ ローカル PC の Node インストールのみ未実施
- [x] e2e lockfile 作成と Playwright 更新
- [x] ベースイメージ再取得・再ビルド、`USER node` 化

### フェーズ C: ハードニング

- [x] 6-3〜6-6（トークン受け渡し、DOMPurify、helmet、throttler）
- [x] 5-4 / 5-5（Postgres バインド、nginx セキュリティヘッダ）

### フェーズ D: 別タスク

- [x] Prisma 6 → 7 移行（7.10.1。下記「実施結果 (2)」参照）
- [ ] jest 系 deepmerge の上流修正を待って更新 ※ 2026-10-30 時点で修正版なし（最新 4.3.1 が脆弱範囲）。引き続きリスク受容
- [x] Dependabot 導入、CI (GitHub Actions) で `npm audit --audit-level=high` を実行

---

## 8. 検証

各フェーズ完了時に以下を実施する。

- [x] `npm audit` で残件が「リスク受容済み」のみであること
- [x] `npm run build`（backend / frontend）成功
- [x] `docker compose up --build` でローカル起動確認
- [x] Playwright E2E テスト（`sys/e2e`）全件パス（20 件）
  - 6-1 対応後: `/media/<slug>/quiz.json` が 404 になり、画像・動画は表示されることを確認するテストを追加
  - 6-3 対応後: ログインフローの E2E を更新
- [ ] 本番デプロイ後、`docker compose -f docker-compose.prod.yml` で再ビルド・動作確認

---

## 付録: 残存リスク（受容予定）

| パッケージ | 重大度 | 理由 |
|-----------|--------|------|
| ~~prisma / @prisma/config / deepmerge-ts / effect~~ | ~~High~~ | **解消済み**（Prisma 7.10.1 へ移行） |
| jest / @nestjs/cli / deepmerge | Low | 修正版が存在しない（deepmerge 最新 4.3.1 が脆弱範囲）。開発ツールのみで使用 |

---

## 実施結果 (2026-10-30)

フェーズ A〜C を実施。フェーズ D（Prisma 7 移行、jest 系、Dependabot/CI）は未着手。

### npm audit

| 対象 | 実施前 | 実施後 | 残件 |
|------|--------|--------|------|
| backend | 37 (Critical 2 / High 18) | 11 (High 3 / Low 8) | Prisma 7 系 (`prisma`, `@prisma/config`, `deepmerge-ts`, `effect`)、jest 系 `deepmerge` → 付録のとおりリスク受容 |
| frontend | 10 (High 9) | **0** | - |
| e2e | 監査不可 | **0** | - |

主な更新バージョン:

- backend: `@nestjs/*` 11.1.17 → 11.2.8、`multer` 2.5.0（`overrides` で強制。platform-express が 2.4.0 を固定しているため）、`prisma` / `@prisma/client` 6.19.3
- backend: `@nestjs/serve-static` を削除（6-1 の独自コントローラに置き換え）、`helmet` 8 / `@nestjs/throttler` 6 を追加
- frontend: `axios` 1.20 系、`vue` 3.5.44、`vite` 8.3.5、`dompurify` 3.4.17 を追加
- e2e: `@playwright/test` 1.64.1、`package-lock.json` 作成
- `@types/node` を全パッケージで `^24` に統一、`engines.node >=24`、リポジトリ直下に `.nvmrc` (24)

### 変更内容

| 項目 | 対応 |
|------|------|
| Node.js | 全 Dockerfile を `node:24.22.2-alpine` に固定 |
| 5-1 / 5-2 | `prisma` を dependencies に移動し `npx --no-install` で実行。本番 seed はビルド済み `dist/prisma/seed.js` を使用（Dockerfile.prod 内で `npm pkg set prisma.seed=...`）。`npm install -g ts-node typescript` を削除 |
| 5-3 | backend (dev/prod)・frontend (dev) コンテナを `USER node` で実行。frontend 本番は nginx（ワーカーは非 root）のまま |
| 5-4 | 開発用 Postgres を `127.0.0.1:5432` にバインド |
| 5-5 | nginx に `server_tokens off` と CSP / X-Frame-Options / nosniff / Referrer-Policy / Permissions-Policy を追加 |
| 6-1 | `src/media/media.controller.ts` を新設。`/media/:slug/assets/:file` のみ配信し、名前を正規表現で検証。`quiz.json` / `lesson.md` / `categories.json` は 404 |
| 6-2 | `src/auth/jwt-secret.ts` で `JWT_SECRET` 未設定時は起動エラー |
| 6-3 | OAuth コールバックのトークンを `?token=` → `#token=`（フラグメント）に変更。フロントの router も追従 |
| 6-4 | localStorage 保存・有効期限 7 日は**現状維持**（HttpOnly Cookie 化は CSRF 対策含め設計変更が大きいため別タスク） |
| 6-5 | `marked` 出力を DOMPurify でサニタイズ、独自レンダラの属性値を HTML エスケープ |
| 6-6 | `helmet`（CORP は `same-site`）と `ThrottlerGuard`（300 req/分/IP、`/media` は除外）を導入。本番は `TRUST_PROXY_HOPS=1` で Traefik 経由の実 IP を使用 |

### 検証

- `npm run build`（backend / frontend）成功
- 開発用 `docker compose up --build`: Node 24.22.2 / `node` ユーザーで起動、マイグレーション・seed 成功
- 本番イメージ (`Dockerfile.prod`) を単体で検証: `prisma migrate deploy` / `prisma db seed`（ts-node なし）成功、`JWT_SECRET` 未設定で起動失敗、アセット 200・`quiz.json` 404、helmet / レート制限ヘッダ付与
- 本番 frontend イメージ: セキュリティヘッダ付与を確認
- Playwright E2E: 新規 `tests/security.spec.ts` 6 件すべてパス
  - 既存 9 件（contents / progress / quiz / login の Google リダイレクト）は失敗するが、**変更前のコードでも同じ 9 件が失敗**することを確認済み（リグレッションなし）
  - 原因: `helpers/auth.ts` の `mockLogin` が偽トークンを設定するだけのため API が 401 を返しログイン画面へ戻る。Google リダイレクトのテストは popup 待ちがタイムアウトする。テスト基盤の修正は別タスク
- 変更前のコードで `/media/gas-01-basics/quiz.json` が 200（正解が公開）だったことを確認

### 残タスク

- [ ] ローカル PC の Node を 24 LTS に更新
- [ ] 本番デプロイ・動作確認（Google ログイン → `#token=` での受け渡しを実機で確認）
- [x] E2E の認証モック修正（テスト用 JWT 発行 or API モック）
- [x] フェーズ D（deepmerge は上流修正待ちで継続受容）

---

## 実施結果 (2) (2026-10-30)

残タスクのうち、ローカル PC の Node 更新・本番デプロイ以外を実施。

### npm audit（最終）

| 対象 | 当初 | 最終 | 残件 |
|------|------|------|------|
| backend | 37 (Critical 2 / High 18) | **8 (Low 8)** | `deepmerge`（jest / @nestjs/cli 経由、修正版なし） |
| frontend | 10 (High 9) | **0** | - |
| e2e | 監査不可 | **0** | - |

### Prisma 6.19 → 7.10.1

- `@prisma/adapter-pg` を追加し、`PrismaService` と `prisma/seed.ts` で `PrismaPg` アダプタを渡す（v7 ではドライバアダプタ必須）
- `sys/backend/prisma7.config.ts` を新設（7.10.1 の `prisma init` が生成するファイル名。旧名 `prisma.config.ts` も読み込まれる）
  - `datasource.url`（schema.prisma の `url = env(...)` を削除して移動）
  - `migrations.seed`（`package.json#prisma` を削除して移動）。`NODE_ENV=production` ではビルド済み `dist/prisma/seed.js`、それ以外は `ts-node prisma/seed.ts`
- generator は `prisma-client-js` のまま（`@prisma/client` の import と CommonJS 出力を維持）
- `Dockerfile.prod`: `ENV NODE_ENV=production`、`prisma7.config.ts` をコピー、`npm pkg set prisma.seed` を削除
- `tsconfig.build.json` で `prisma7.config.ts` をビルド対象から除外
- npm の `latest` タグは `8.0.0-rc.29`（RC）のため、7.10.1 を明示指定

### E2E テストの修正

- `tests/helpers/auth.ts`: 偽トークンをやめ、テストごとに DB へテストユーザーを作成し `sys/.env` の `JWT_SECRET` で署名した JWT でログインする Playwright fixture (`user`) に変更。テスト終了時にユーザーと進捗を削除
  - 接続先は `E2E_DATABASE_URL`（既定: ローカル docker compose の DB）、`JWT_SECRET` は環境変数で上書き可
- contents / quiz / progress / login の各 spec を実際の UI（日本語ラベル、UUID の URL、`.content-card` / `.choice-btn` 等）に合わせて書き直し
  - クイズ読込中は `.quiz-counter` が `1 / 0` になるため、選択肢の表示を待ってから問題数を取得
  - Google ログインは外部に出ないよう、ボタン → `/auth/google` へのリクエストと、backend の 302 `Location`（`redirect_uri` / `response_type`）を別々に検証
- 追加: 未ログイン時のリダイレクト、レッスン画像が `/media/.../assets/` から表示されること
- 結果: **20 件すべてパス**（`--repeat-each=3` で 60/60、Prisma 7 移行後も `--repeat-each=2` で 40/40）
- 注意: E2E は docker compose の開発環境が起動している前提（Playwright の `webServer` フォールバックはホスト上で backend を起動するが、`JWT_SECRET` 等が無いため起動しない）

### CI / Dependabot

- `.github/dependabot.yml`: npm（backend / frontend / e2e、minor+patch はグループ化）、Docker（Node のメジャー更新は除外）、GitHub Actions
- `.github/workflows/security-audit.yml`: push / PR / 毎週月曜に `npm audit --audit-level=high` と backend / frontend のビルド。ローカルで同じコマンドが成功することを確認済み（GitHub 上ではまだ未実行）

### ベースイメージ

- `postgres:16-alpine`（16.15）/ `nginx:alpine` / `node:24.22.2-alpine` を pull して再ビルド

### 本番イメージ検証（Prisma 7）

- `prisma migrate deploy` / `prisma db seed`（`node dist/prisma/seed.js`）/ 起動 / API 応答を確認

### 残タスク（手動）

- [ ] ローカル PC の Node を 24 LTS に更新
- [ ] コミット・push 後、GitHub Actions の初回実行結果を確認
- [ ] 本番デプロイ・動作確認（Google ログイン → `#token=` 受け渡し、`prisma migrate deploy`）
- [ ] deepmerge の修正版リリース時に更新（Dependabot で検知）
