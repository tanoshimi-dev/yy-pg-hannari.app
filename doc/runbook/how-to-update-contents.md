# コンテンツの更新手順

## 概要

Hannariアプリのコンテンツ（学習教材・クイズ）を追加・更新する手順です。

## ファイル構成

```
doc/contents/          ← コンテンツ原稿（Markdownファイル）
sys/backend/prisma/
  └── seed.ts          ← シードデータ（DB投入用）
```

## 手順

### 1. コンテンツ原稿を作成する

`doc/contents/` にMarkdownファイルを作成します。

```
doc/contents/
  ├── 01_GAS_BASIC.md          ← 番号_カテゴリ_内容.md
  ├── 02_LINE_bot_basics.md
  └── 01_WEB_basics.md
```

命名規則: `連番_カテゴリ略称_内容.md`

### 2. シードデータに追加する

`sys/backend/prisma/seed.ts` を編集します。

#### 2-1. 新しいカテゴリが必要な場合

```typescript
const categoryNew = await prisma.category.create({
  data: {
    name: "カテゴリ名",
    description: "カテゴリの説明",
    sortOrder: 4, // 表示順
  },
});
```

#### 2-2. コンテンツを追加

```typescript
const newContent = await prisma.content.create({
  data: {
    title: "コンテンツのタイトル",
    description: "一覧画面に表示される説明文",
    body: `ここにコンテンツ本文（Markdown形式）を記載`,
    categoryId: categoryXXX.id, // 紐づけるカテゴリ
    sortOrder: 1, // カテゴリ内の表示順
  },
});
```

#### 2-3. クイズを追加

1問につき Quiz + QuizChoice（4択）を作成します。

```typescript
const quiz1 = await prisma.quiz.create({
  data: {
    contentId: newContent.id,
    question: "問題文",
    explanation: "解説文（回答後に表示される）",
    sortOrder: 1,
  },
});
await prisma.quizChoice.createMany({
  data: [
    { quizId: quiz1.id, text: "選択肢1", isCorrect: false, sortOrder: 1 },
    {
      quizId: quiz1.id,
      text: "選択肢2（正解）",
      isCorrect: true,
      sortOrder: 2,
    },
    { quizId: quiz1.id, text: "選択肢3", isCorrect: false, sortOrder: 3 },
    { quizId: quiz1.id, text: "選択肢4", isCorrect: false, sortOrder: 4 },
  ],
});
```

#### 2-4. コードブロックの書き方（注意！）

seed.ts内のテンプレートリテラル（`` ` ``）の中でコードブロックを書くときは、バッククォートをエスケープする必要があります。

````
正しい: \`\`\`javascript
間違い: ```javascript        ← テンプレートリテラルが壊れる
間違い: \\\`\\\`\\\`javascript  ← エスケープしすぎ
````

### 3. シードを実行する

```bash
cd sys
docker compose exec backend npx prisma db seed
```

**注意:** シード実行時に既存データはすべて削除されて再作成されます（ユーザーのクイズ回答履歴・進捗も消えます）。

### 4. 動作確認

ブラウザで http://localhost:5173 を開いて確認します。

- コンテンツ一覧に新しいコンテンツが表示されるか
- コンテンツ詳細でコードブロックが正しく表示されるか
- クイズが正しく出題・採点されるか

## 本番環境でのコンテンツ更新

本番環境でも同じ手順です。

```bash
docker compose -f docker-compose.prod.yml exec backend npx prisma db seed
```

## チェックリスト

```
□ doc/contents/ にMarkdownファイルを作成した
□ seed.ts にコンテンツ・クイズを追加した
□ コードブロックのバッククォートを正しくエスケープした
□ sortOrder を適切に設定した（カテゴリ内の表示順）
□ クイズの isCorrect: true が各問1つだけ設定されている
□ docker compose exec backend npx prisma db seed を実行した
□ ブラウザで表示・クイズ動作を確認した
```
