# セキュリティアップデートの Tips

2026-10-30 のセキュリティアップデート（`doc/dev-plan-security-update/261030/`）で得た知見。

## npm audit fix で直らない推移的依存

親パッケージがバージョンを完全固定している場合（例: `@nestjs/platform-express` が `multer@2.4.0` を固定）、
`npm audit fix` では更新されない。`package.json` の `overrides` で強制する。

```json
"overrides": {
  "multer": "^2.5.0"
}
```

親パッケージ側が修正版に追従したら `overrides` は削除してよい。

## 本番イメージで npx を使うときは --no-install

`npx prisma ...` はローカルに無いとレジストリから**最新版を取得**して実行する。
本番では `prisma` を dependencies に入れ、`npx --no-install prisma ...` で実行する。

## Git Bash で docker run -e にパスを渡すとき

`-e CONTENTS_DIR=/app/doc/contents` が `C:/Program Files/Git/app/...` に変換される。
`MSYS_NO_PATHCONV=1` を付けて実行する。

```bash
MSYS_NO_PATHCONV=1 docker run -e CONTENTS_DIR=/app/doc/contents ...
```

## docker compose のプロジェクト名

`sys/` で `docker compose up` するとプロジェクト名が `sys` になり、ボリュームは `sys_postgres_data`。
同名ディレクトリ `sys/` を持つ他プロジェクトとボリュームが共有され、DB ユーザーが存在しない等の問題が起きる。
対策として `sys/docker-compose.yml` に `name: yy-pg-hannari` を指定済み（ボリュームは `yy-pg-hannari_postgres_data`）。
本番用 `docker-compose.prod.yml` は既存ボリューム名が変わってしまうため変更していない。

検証時は `-p <名前>` で別プロジェクトとして起動すると既存データを壊さずに済む。

```bash
docker compose -p hannari-test up -d
docker compose -p hannari-test down -v   # 片付け（検証用ボリュームも削除）
```

## Prisma 7 の注意点（7.10.1）

- `PrismaClient` にドライバアダプタが必須。PostgreSQL は `@prisma/adapter-pg` の `PrismaPg` を渡す
- DB URL・seed コマンドは `prisma7.config.ts` に書く（`schema.prisma` の `url` と `package.json#prisma` は廃止）
- `prisma-client-js` generator は v7 でも使える。生成先は従来どおり `node_modules/.prisma/client` なので、本番 Dockerfile の `.prisma` コピーは必要
- npm の `latest` タグが 8.0.0 の RC を指していることがあるため、バージョンは明示指定する

## E2E のログイン

`sys/e2e/tests/helpers/auth.ts` の fixture `user` を使うと、テストごとに新規ユーザーが作成されログイン済みになる。

```ts
import { test, expect } from './helpers/auth';

test('...', async ({ page, user }) => {
  await page.goto('/');
});
```

開発環境（`docker compose up`）が起動している必要がある。
