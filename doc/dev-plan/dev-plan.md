# Hannari App 開発計画

## 概要

子供向け学習アプリ「Hannari」のフルスタック開発計画。
コンテンツを読んでクイズに答える形式で、楽しく学習できるプラットフォーム。

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| フロントエンド | Vue.js 3 + TypeScript + Vite |
| バックエンド | NestJS + TypeScript |
| データベース | PostgreSQL + Prisma ORM |
| 認証 | Google OAuth 2.0 |
| テスト | Playwright (E2E) |
| インフラ | Docker + Docker Compose |

## フェーズ1: 基盤構築 --- 完了

### 1.1 プロジェクト初期化
- [x] NestJS バックエンドプロジェクト作成
- [x] Vue.js フロントエンドプロジェクト作成
- [x] Docker Compose 環境構築 (PostgreSQL含む)
- [x] Prisma セットアップ・スキーマ定義

### 1.2 データベース設計
- [x] User: ユーザー情報 (Google OAuth)
- [x] Category: コンテンツカテゴリ
- [x] Content: 学習コンテンツ (タイトル、本文、カテゴリ)
- [x] Quiz: クイズ問題 (コンテンツに紐づく)
- [x] QuizChoice: クイズの選択肢
- [x] UserProgress: ユーザーの学習進捗
- [x] UserQuizAttempt: クイズ回答履歴

### 1.3 認証
- [x] Google OAuth 2.0 による認証フロー
- [x] JWT トークンによるセッション管理
- [x] Guards による API 保護

## フェーズ2: コア機能 --- 完了

### 2.1 コンテンツ管理
- [x] コンテンツ一覧 API (GET /contents)
- [x] コンテンツ詳細 API (GET /contents/:id)
- [x] カテゴリ一覧 API (GET /contents/categories)
- [x] シードデータ (3カテゴリ、3コンテンツ、12クイズ)

### 2.2 クイズ機能
- [x] コンテンツに紐づくクイズ取得 API (GET /quizzes/content/:contentId)
- [x] クイズ回答・採点 API (POST /quizzes/:id/answer)
- [x] 回答履歴の記録

### 2.3 学習進捗
- [x] 進捗記録 API (POST /progress/:contentId)
- [x] 進捗一覧 API (GET /progress)
- [x] ダッシュボード API (GET /progress/dashboard)

## フェーズ3: フロントエンド --- 完了

### 3.1 画面構成
- [x] ログイン画面 (Google OAuth)
- [x] ダッシュボード (学習進捗サマリー)
- [x] コンテンツ一覧画面
- [x] コンテンツ詳細・学習画面
- [x] クイズ画面 (1問ずつ表示、正誤フィードバック)
- [x] クイズ結果画面 (スコア表示、パーフェクト演出)

### 3.2 UI/UXデザイン
- [x] 白テーマベースのクリーンなデザイン
- [x] 子供向けの親しみやすいデザイン
- [x] レスポンシブ対応

## フェーズ4: テスト・デプロイ --- 一部未着手

### 4.1 E2Eテスト (Playwright)
- [x] テストファイル作成済み (login, contents, quiz, progress)
- [ ] テスト実行・動作確認
- [ ] CI環境でのテスト自動実行

### 4.2 本番デプロイ
- [x] 開発用 Dockerfile (backend, frontend)
- [ ] 本番用 Dockerfile (マルチステージビルド)
- [ ] 本番用 Docker Compose 構成
- [ ] 環境変数管理 (本番用)
- [ ] HTTPS/リバースプロキシ設定

## バグ修正履歴

- [x] DTOプロパティ名不一致修正 (selectedChoiceId → choiceId)
- [x] ダッシュボードAPI/フロント型不一致修正
- [x] Docker環境でのViteホットリロード設定 (usePolling)
- [x] docker-compose.yml: version属性削除、env_file設定

## 現在の状況

フェーズ1〜3完了。Docker環境で動作確認済み（Google OAuth認証、コンテンツ閲覧、クイズ回答、ダッシュボード）。
フェーズ4（E2Eテスト実行、本番デプロイ構成）が残タスク。
