# プロジェクト概要

子供向けの学習アプリ「Hannari」のバックエンドAPIを構築するプロジェクトです。ユーザーは、クイズやゲームを通じて楽しく学ぶことができます。

## 機能要件

- ユーザー登録と認証 Google OAuthのみ
- コンテンツを読んでクイズに答える機能
- 学習進捗のトラッキング

## コンテンツ

以下のようなコンテンツを想定していますが、実際の内容は柔軟に変更可能です。
E:\dev\vs_code\products\hannari.app\yy-pg\doc\contents
今後、随時追加していく予定です。
将来的に管理者がコンテンツを追加できるようにすることも検討しています。

## 技術スタック

- Vue.js
- NestJS
- TypeScript
- PostgreSQL
- Prisma

## テスト

必ずE2Eテストを実装すること
Playrightを使用して、ユーザーの操作をシミュレートし、アプリケーションの動作を検証する

## 開発環境

- ローカルPCではDockerを使用して開発環境を構築
- 本番環境もDockerを使用してデプロイ

## ディレクトリ構成

```hannari-app/
├── backend/
│   ├── src/
│   ├── Dockerfile
│   └── ...
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── ...
├── docker-compose.yml
└── README.md
```

## 参考UI

https://techzaa.in/larkon/admin/layouts-dark-topnav.html

## 開発フロー

はじめに必ず、開発計画を作成してください。開発計画はE:\dev\vs_code\products\hannari.app\yy-pg\doc\dev-plan.mdに記載してください。
必要に応じて、開発計画を更新してください。
また、適宜E:\dev\vs_code\products\hannari.app\yy-pg\doc\tipsにもドキュメントを追加してください。
