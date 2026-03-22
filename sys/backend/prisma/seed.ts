import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.userQuizAttempt.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.quizChoice.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.content.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create categories
  const categoryLineBot = await prisma.category.create({
    data: {
      name: 'LINEボット',
      description:
        'LINEボットとGoogle Apps Scriptを使ったチャットボット開発を学びます',
      sortOrder: 1,
    },
  });

  const categoryGAS = await prisma.category.create({
    data: {
      name: 'Google Apps Script',
      description:
        'Google Apps Scriptを使ったスプレッドシートのデータ分析を学びます',
      sortOrder: 2,
    },
  });

  const categoryWeb = await prisma.category.create({
    data: {
      name: 'Webプログラミング',
      description: 'HTML・JavaScript・PHPを使ったWebアプリケーション開発を学びます',
      sortOrder: 3,
    },
  });

  // ===== LINE Bot Basics Content =====
  const lineBotBasicsContent = await prisma.content.create({
    data: {
      title: 'LINEボット開発の準備をしよう！',
      description:
        'LINE Developerアカウントの作成からMessaging APIの設定まで、ボット開発の準備を学びます。',
      body: `# LINEボット開発の準備をしよう！

## LINEボット開発に必要なもの
LINEボットを作るには、以下の準備が必要です（すべて無料！）：
- LINEアカウント（普段使っているものでOK）
- LINE Developerアカウント（開発者用アカウント）
- Googleアカウント（GASを使うため）

## LINE Developerアカウントの作り方
1. https://developers.line.biz/ にアクセス
2. 「ログイン」→「LINEアカウントでログイン」
3. メールアドレスとパスワードを入力
4. LINEアプリに届く認証コードを入力
5. 開発者情報を入力して完了！

## プロバイダーとチャネル
- プロバイダー = ボットの「持ち主」（個人名やチーム名）
- チャネル = 1つのボット（日記ボット、クイズボットなど）
- 1つのプロバイダーの中に複数のチャネルを作れます

## Messaging APIチャネルの作成
1. コンソールで「新規チャネル作成」をクリック
2. 種類は「Messaging API」を選ぶ（重要！）
3. チャネル名・説明などを入力して作成

## 2つの大事なカギ
- チャネルシークレット：メッセージが本物か確認するためのカギ
- チャネルアクセストークン：ボットからLINEに返信するためのカギ
- ⚠️ どちらも絶対に他人に見せない！SNSに載せない！

## Webhookの設定
Webhookとは、ユーザーがメッセージを送ったときにプログラムに知らせる仕組みです。
1. 応答メッセージ → オフ
2. Webhook → オン
3. Webhook URLにGASのWebアプリURLを設定

## GASの最小テンプレート
\`\`\`javascript
const ACCESS_TOKEN = 'ここにアクセストークンを貼り付け';

function doPost(e) {
  const json = JSON.parse(e.postData.contents);
  const event = json.events[0];
  const userMessage = event.message.text;
  const reply = 'あなたは「' + userMessage + '」と言いました！';
  replyToLine(event.replyToken, reply);
}

function replyToLine(replyToken, message) {
  UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + ACCESS_TOKEN
    },
    payload: JSON.stringify({
      replyToken: replyToken,
      messages: [{type: 'text', text: message}]
    })
  });
}
\`\`\`

この設定は最初の1回だけ！準備が整ったら、次は実際にボットの機能を作りましょう！`,
      categoryId: categoryLineBot.id,
      sortOrder: 1,
    },
  });

  // LINE Bot Basics Quizzes
  const lineBotBasicsQuiz1 = await prisma.quiz.create({
    data: {
      contentId: lineBotBasicsContent.id,
      question: 'LINEボットを作るために必要なチャネルの種類はどれですか？',
      explanation:
        'LINEボットを作るには「Messaging API」チャネルを選びます。「LINEログイン」は別の用途（WebサイトにLINEログイン機能をつけるとき）に使います。',
      sortOrder: 1,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      { quizId: lineBotBasicsQuiz1.id, text: 'LINEログイン', isCorrect: false, sortOrder: 1 },
      { quizId: lineBotBasicsQuiz1.id, text: 'Messaging API', isCorrect: true, sortOrder: 2 },
      { quizId: lineBotBasicsQuiz1.id, text: 'LINE MINI App', isCorrect: false, sortOrder: 3 },
      { quizId: lineBotBasicsQuiz1.id, text: 'LINE Pay', isCorrect: false, sortOrder: 4 },
    ],
  });

  const lineBotBasicsQuiz2 = await prisma.quiz.create({
    data: {
      contentId: lineBotBasicsContent.id,
      question: 'チャネルアクセストークンは何のために使いますか？',
      explanation:
        'チャネルアクセストークンは、ボットからLINEにメッセージを送信するときの認証に使います。APIリクエストのAuthorizationヘッダーに含めます。',
      sortOrder: 2,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      { quizId: lineBotBasicsQuiz2.id, text: 'ボットの名前を変更するため', isCorrect: false, sortOrder: 1 },
      { quizId: lineBotBasicsQuiz2.id, text: 'ボットからLINEにメッセージを送るため', isCorrect: true, sortOrder: 2 },
      { quizId: lineBotBasicsQuiz2.id, text: 'ボットのアイコンを設定するため', isCorrect: false, sortOrder: 3 },
      { quizId: lineBotBasicsQuiz2.id, text: 'LINEアカウントを作成するため', isCorrect: false, sortOrder: 4 },
    ],
  });

  const lineBotBasicsQuiz3 = await prisma.quiz.create({
    data: {
      contentId: lineBotBasicsContent.id,
      question: 'Webhookとは何ですか？',
      explanation:
        'Webhookは、ユーザーがボットにメッセージを送ったときに、LINEがあなたのプログラムに通知を送る仕組みです。この通知を受け取って処理を行います。',
      sortOrder: 3,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      { quizId: lineBotBasicsQuiz3.id, text: 'ボットのデザインを変える機能', isCorrect: false, sortOrder: 1 },
      { quizId: lineBotBasicsQuiz3.id, text: 'ボットを友だちに追加する方法', isCorrect: false, sortOrder: 2 },
      { quizId: lineBotBasicsQuiz3.id, text: 'メッセージが届いたことをプログラムに知らせる仕組み', isCorrect: true, sortOrder: 3 },
      { quizId: lineBotBasicsQuiz3.id, text: 'ボットの料金プランのこと', isCorrect: false, sortOrder: 4 },
    ],
  });

  const lineBotBasicsQuiz4 = await prisma.quiz.create({
    data: {
      contentId: lineBotBasicsContent.id,
      question: 'チャネルシークレットやアクセストークンの取り扱いとして正しいものはどれですか？',
      explanation:
        'チャネルシークレットとアクセストークンは、ボットを操作するための重要な情報です。漏れると第三者にボットを悪用される可能性があるため、絶対に公開してはいけません。',
      sortOrder: 4,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      { quizId: lineBotBasicsQuiz4.id, text: 'SNSで共有して友だちにも使ってもらう', isCorrect: false, sortOrder: 1 },
      { quizId: lineBotBasicsQuiz4.id, text: 'GitHubの公開リポジトリにアップする', isCorrect: false, sortOrder: 2 },
      { quizId: lineBotBasicsQuiz4.id, text: '絶対に他人に見せず、安全に管理する', isCorrect: true, sortOrder: 3 },
      { quizId: lineBotBasicsQuiz4.id, text: 'ボットの説明文に記載しておく', isCorrect: false, sortOrder: 4 },
    ],
  });

  // ===== LINE Bot Content =====
  const lineBotContent = await prisma.content.create({
    data: {
      title: 'LINEボットを作ろう！',
      description:
        'Google Apps Scriptを使って、LINEで動くチャットボットを作る方法を学びます。',
      body: `# LINEボットを作ろう！

## LINEボットってなに？
LINEボットとは、LINEアプリの中で自動的にメッセージを返してくれるプログラムのことです。
お店の予約ボットや天気予報ボットなど、いろいろな種類があります。

## 必要なもの
- LINEアカウント
- LINE Developersアカウント
- Googleアカウント（Google Apps Scriptを使うため）

## 作り方の流れ
1. LINE Developersでチャネルを作成する
2. Google Apps Scriptでプログラムを書く
3. WebhookのURLを設定する
4. テストする

## Google Apps Scriptのコード例
\`\`\`javascript
function doPost(e) {
  var json = JSON.parse(e.postData.contents);
  var replyToken = json.events[0].replyToken;
  var userMessage = json.events[0].message.text;

  var replyMessage = "あなたは「" + userMessage + "」と言いました！";

  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + ACCESS_TOKEN
    },
    payload: JSON.stringify({
      replyToken: replyToken,
      messages: [{type: "text", text: replyMessage}]
    })
  });
}
\`\`\`

## ポイント
- doPost関数はLINEからメッセージが届いたときに自動で呼ばれます
- replyTokenを使って返信します
- ACCESS_TOKENはLINE Developersで取得できます`,
      categoryId: categoryLineBot.id,
      sortOrder: 2,
    },
  });

  // LINE Bot Quizzes
  const lineBotQuiz1 = await prisma.quiz.create({
    data: {
      contentId: lineBotContent.id,
      question: 'LINEボットとは何ですか？',
      explanation:
        'LINEボットは、LINEアプリの中で自動的にメッセージを返してくれるプログラムです。人が手動で返信するのではなく、プログラムが自動で応答します。',
      sortOrder: 1,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      {
        quizId: lineBotQuiz1.id,
        text: 'LINEで自動的にメッセージを返すプログラム',
        isCorrect: true,
        sortOrder: 1,
      },
      {
        quizId: lineBotQuiz1.id,
        text: 'LINEのスタンプを作るツール',
        isCorrect: false,
        sortOrder: 2,
      },
      {
        quizId: lineBotQuiz1.id,
        text: 'LINEの友だちを自動で追加する機能',
        isCorrect: false,
        sortOrder: 3,
      },
      {
        quizId: lineBotQuiz1.id,
        text: 'LINEのグループを管理するアプリ',
        isCorrect: false,
        sortOrder: 4,
      },
    ],
  });

  const lineBotQuiz2 = await prisma.quiz.create({
    data: {
      contentId: lineBotContent.id,
      question:
        'LINEボットを作るときに使うGoogle Apps Scriptの関数名は何ですか？',
      explanation:
        'doPost関数は、LINEからWebhookでメッセージが送られてきたときに自動的に呼び出される関数です。POSTリクエストを受け取る役割があります。',
      sortOrder: 2,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      {
        quizId: lineBotQuiz2.id,
        text: 'doGet',
        isCorrect: false,
        sortOrder: 1,
      },
      {
        quizId: lineBotQuiz2.id,
        text: 'doPost',
        isCorrect: true,
        sortOrder: 2,
      },
      {
        quizId: lineBotQuiz2.id,
        text: 'onMessage',
        isCorrect: false,
        sortOrder: 3,
      },
      {
        quizId: lineBotQuiz2.id,
        text: 'sendReply',
        isCorrect: false,
        sortOrder: 4,
      },
    ],
  });

  const lineBotQuiz3 = await prisma.quiz.create({
    data: {
      contentId: lineBotContent.id,
      question: 'LINEボットがメッセージを返信するために必要なものは何ですか？',
      explanation:
        'replyTokenは、LINEから送られてくるイベントに含まれるトークンで、このトークンを使って返信を送ります。一度使うと無効になります。',
      sortOrder: 3,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      {
        quizId: lineBotQuiz3.id,
        text: 'ユーザーのパスワード',
        isCorrect: false,
        sortOrder: 1,
      },
      {
        quizId: lineBotQuiz3.id,
        text: 'replyToken（リプライトークン）',
        isCorrect: true,
        sortOrder: 2,
      },
      {
        quizId: lineBotQuiz3.id,
        text: 'ユーザーの電話番号',
        isCorrect: false,
        sortOrder: 3,
      },
      {
        quizId: lineBotQuiz3.id,
        text: 'LINEのスタンプID',
        isCorrect: false,
        sortOrder: 4,
      },
    ],
  });

  const lineBotQuiz4 = await prisma.quiz.create({
    data: {
      contentId: lineBotContent.id,
      question:
        'LINE Developersで取得する、ボットの認証に使うものは何ですか？',
      explanation:
        'アクセストークン（ACCESS_TOKEN）は、LINE Developersのチャネル設定で取得できます。APIリクエストの認証に使用します。',
      sortOrder: 4,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      {
        quizId: lineBotQuiz4.id,
        text: 'アクセストークン',
        isCorrect: true,
        sortOrder: 1,
      },
      {
        quizId: lineBotQuiz4.id,
        text: 'メールアドレス',
        isCorrect: false,
        sortOrder: 2,
      },
      {
        quizId: lineBotQuiz4.id,
        text: 'クレジットカード番号',
        isCorrect: false,
        sortOrder: 3,
      },
      {
        quizId: lineBotQuiz4.id,
        text: 'IPアドレス',
        isCorrect: false,
        sortOrder: 4,
      },
    ],
  });

  // ===== GAS Basic Content =====
  const gasBasicContent = await prisma.content.create({
    data: {
      title: 'GASをはじめよう！',
      description:
        'Google Apps Script（GAS）の基礎をゼロから学びます。変数・条件分岐・ループ・関数・スプレッドシート操作まで。',
      body: `# GASをはじめよう！

## GASってなに？
GAS（Google Apps Script）は、Googleが無料で提供しているプログラミング環境です。
JavaScriptという言語を使って、スプレッドシートやGmailなどのGoogleサービスを自動操作できます。

## GASのすごいところ
- 完全無料でGoogleアカウントがあれば誰でも使える
- ブラウザだけで動く。インストール不要！
- スプレッドシート・Gmail・カレンダーなどと連携できる

## はじめてのプログラム
\`\`\`javascript
function myFirstProgram() {
  Logger.log('Hello World!');
  Logger.log('はじめてのプログラム、成功！');
}
\`\`\`

## 変数（へんすう）
変数はデータを入れる箱です。
\`\`\`javascript
let name = 'たろう';    // 文字を入れる
let age = 12;           // 数字を入れる
const PI = 3.14;        // constは変更できない定数
\`\`\`

## 条件分岐（if文）
\`\`\`javascript
if (score >= 80) {
  Logger.log('よくできました！');
} else if (score >= 60) {
  Logger.log('がんばりました！');
} else {
  Logger.log('もっとがんばろう！');
}
\`\`\`

## ループ（for文）
\`\`\`javascript
for (let i = 1; i <= 5; i++) {
  Logger.log(i + '回目のループ');
}
\`\`\`

## 関数
処理をまとめて名前をつけたものです。
\`\`\`javascript
function greet(name) {
  return 'こんにちは、' + name + 'さん！';
}
\`\`\`

## スプレッドシート操作
\`\`\`javascript
let sheet = SpreadsheetApp.getActiveSheet();
sheet.getRange('A1').setValue('こんにちは');
let value = sheet.getRange('A1').getValue();
\`\`\`

基本がしっかり分かっていれば、どんなプログラムも作れるようになります！`,
      categoryId: categoryGAS.id,
      sortOrder: 1,
    },
  });

  // GAS Basic Quizzes
  const gasBasicQuiz1 = await prisma.quiz.create({
    data: {
      contentId: gasBasicContent.id,
      question: 'GAS（Google Apps Script）はどの言語をベースにしていますか？',
      explanation:
        'GASはJavaScriptをベースにしたプログラミング言語です。JavaScriptの文法がそのまま使えます。',
      sortOrder: 1,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      { quizId: gasBasicQuiz1.id, text: 'Python', isCorrect: false, sortOrder: 1 },
      { quizId: gasBasicQuiz1.id, text: 'JavaScript', isCorrect: true, sortOrder: 2 },
      { quizId: gasBasicQuiz1.id, text: 'Ruby', isCorrect: false, sortOrder: 3 },
      { quizId: gasBasicQuiz1.id, text: 'PHP', isCorrect: false, sortOrder: 4 },
    ],
  });

  const gasBasicQuiz2 = await prisma.quiz.create({
    data: {
      contentId: gasBasicContent.id,
      question: 'GASでログを出力するために使うメソッドはどれですか？',
      explanation:
        'Logger.log()は、GASで実行結果やデバッグ情報をログに出力するためのメソッドです。',
      sortOrder: 2,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      { quizId: gasBasicQuiz2.id, text: 'console.log()', isCorrect: false, sortOrder: 1 },
      { quizId: gasBasicQuiz2.id, text: 'print()', isCorrect: false, sortOrder: 2 },
      { quizId: gasBasicQuiz2.id, text: 'Logger.log()', isCorrect: true, sortOrder: 3 },
      { quizId: gasBasicQuiz2.id, text: 'echo()', isCorrect: false, sortOrder: 4 },
    ],
  });

  const gasBasicQuiz3 = await prisma.quiz.create({
    data: {
      contentId: gasBasicContent.id,
      question: '変数を作るときに使うキーワードで、あとから中身を変えられるのはどれですか？',
      explanation:
        'letで作った変数はあとから値を変更できます。constで作った変数（定数）は変更できません。',
      sortOrder: 3,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      { quizId: gasBasicQuiz3.id, text: 'const', isCorrect: false, sortOrder: 1 },
      { quizId: gasBasicQuiz3.id, text: 'let', isCorrect: true, sortOrder: 2 },
      { quizId: gasBasicQuiz3.id, text: 'fixed', isCorrect: false, sortOrder: 3 },
      { quizId: gasBasicQuiz3.id, text: 'static', isCorrect: false, sortOrder: 4 },
    ],
  });

  const gasBasicQuiz4 = await prisma.quiz.create({
    data: {
      contentId: gasBasicContent.id,
      question: 'スプレッドシートのA1セルに値を書き込むコードとして正しいものはどれですか？',
      explanation:
        "getRange('A1').setValue('値') で、指定したセルに値を書き込むことができます。",
      sortOrder: 4,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      { quizId: gasBasicQuiz4.id, text: "sheet.write('A1', '値')", isCorrect: false, sortOrder: 1 },
      { quizId: gasBasicQuiz4.id, text: "sheet.getRange('A1').setValue('値')", isCorrect: true, sortOrder: 2 },
      { quizId: gasBasicQuiz4.id, text: "sheet.cell('A1').set('値')", isCorrect: false, sortOrder: 3 },
      { quizId: gasBasicQuiz4.id, text: "sheet.put('A1', '値')", isCorrect: false, sortOrder: 4 },
    ],
  });

  const gasBasicQuiz5 = await prisma.quiz.create({
    data: {
      contentId: gasBasicContent.id,
      question: 'for文の「for (let i = 1; i <= 5; i++)」で、ループは何回実行されますか？',
      explanation:
        'iが1から始まり、5以下の間ループするので、i=1,2,3,4,5の合計5回実行されます。',
      sortOrder: 5,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      { quizId: gasBasicQuiz5.id, text: '4回', isCorrect: false, sortOrder: 1 },
      { quizId: gasBasicQuiz5.id, text: '5回', isCorrect: true, sortOrder: 2 },
      { quizId: gasBasicQuiz5.id, text: '6回', isCorrect: false, sortOrder: 3 },
      { quizId: gasBasicQuiz5.id, text: '1回', isCorrect: false, sortOrder: 4 },
    ],
  });

  // ===== GAS Content =====
  const gasContent = await prisma.content.create({
    data: {
      title: 'スプレッドシートのデータを分析しよう！',
      description:
        'Google Apps Scriptを使って、スプレッドシートのデータを自動で分析する方法を学びます。',
      body: `# スプレッドシートのデータを分析しよう！

## Google Apps Script（GAS）ってなに？
Google Apps Script（GAS）は、Googleのサービス（スプレッドシート、Gmail、カレンダーなど）を
プログラムで操作できるツールです。JavaScriptをベースにしています。

## スプレッドシートとの連携
GASを使うと、スプレッドシートのデータを読み取ったり、書き込んだり、分析したりできます。

## 基本的なコード
\`\`\`javascript
function analyzeData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();

  // ヘッダーを除いたデータ
  var rows = data.slice(1);

  // 合計を計算
  var total = 0;
  for (var i = 0; i < rows.length; i++) {
    total += rows[i][1]; // 2列目の値を合計
  }

  // 平均を計算
  var average = total / rows.length;

  // 結果を出力
  Logger.log("合計: " + total);
  Logger.log("平均: " + average);
}
\`\`\`

## よく使うメソッド
- \`getActiveSpreadsheet()\` - 今開いているスプレッドシートを取得
- \`getActiveSheet()\` - 今開いているシートを取得
- \`getDataRange()\` - データが入っている範囲を取得
- \`getValues()\` - セルの値を2次元配列として取得
- \`setValue()\` / \`setValues()\` - セルに値を書き込む

## トリガー機能
GASでは「トリガー」を設定して、決まった時間に自動でプログラムを実行できます。
例えば、毎朝9時にデータを集計してメールで送る、といったことができます。`,
      categoryId: categoryGAS.id,
      sortOrder: 2,
    },
  });

  // GAS Quizzes
  const gasQuiz1 = await prisma.quiz.create({
    data: {
      contentId: gasContent.id,
      question: 'Google Apps Script（GAS）は何の言語をベースにしていますか？',
      explanation:
        'Google Apps ScriptはJavaScriptをベースにしたプログラミング言語です。JavaScriptの文法がそのまま使えます。',
      sortOrder: 1,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      {
        quizId: gasQuiz1.id,
        text: 'Python',
        isCorrect: false,
        sortOrder: 1,
      },
      {
        quizId: gasQuiz1.id,
        text: 'JavaScript',
        isCorrect: true,
        sortOrder: 2,
      },
      { quizId: gasQuiz1.id, text: 'Ruby', isCorrect: false, sortOrder: 3 },
      { quizId: gasQuiz1.id, text: 'Java', isCorrect: false, sortOrder: 4 },
    ],
  });

  const gasQuiz2 = await prisma.quiz.create({
    data: {
      contentId: gasContent.id,
      question:
        'スプレッドシートのデータを取得するメソッドはどれですか？',
      explanation:
        'getValues()メソッドは、指定した範囲のセルの値を2次元配列として取得します。getDataRange().getValues()のように組み合わせて使います。',
      sortOrder: 2,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      {
        quizId: gasQuiz2.id,
        text: 'getData()',
        isCorrect: false,
        sortOrder: 1,
      },
      {
        quizId: gasQuiz2.id,
        text: 'fetchData()',
        isCorrect: false,
        sortOrder: 2,
      },
      {
        quizId: gasQuiz2.id,
        text: 'getValues()',
        isCorrect: true,
        sortOrder: 3,
      },
      {
        quizId: gasQuiz2.id,
        text: 'readCells()',
        isCorrect: false,
        sortOrder: 4,
      },
    ],
  });

  const gasQuiz3 = await prisma.quiz.create({
    data: {
      contentId: gasContent.id,
      question: 'GASのトリガー機能でできることは何ですか？',
      explanation:
        'トリガー機能を使うと、決まった時間や条件でプログラムを自動実行できます。毎日・毎週など定期実行の設定が可能です。',
      sortOrder: 3,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      {
        quizId: gasQuiz3.id,
        text: 'スプレッドシートの色を変える',
        isCorrect: false,
        sortOrder: 1,
      },
      {
        quizId: gasQuiz3.id,
        text: '決まった時間にプログラムを自動実行する',
        isCorrect: true,
        sortOrder: 2,
      },
      {
        quizId: gasQuiz3.id,
        text: 'Googleアカウントを作成する',
        isCorrect: false,
        sortOrder: 3,
      },
      {
        quizId: gasQuiz3.id,
        text: 'パソコンの電源を切る',
        isCorrect: false,
        sortOrder: 4,
      },
    ],
  });

  const gasQuiz4 = await prisma.quiz.create({
    data: {
      contentId: gasContent.id,
      question:
        'GASでログを出力するために使うメソッドはどれですか？',
      explanation:
        'Logger.log()は、GASでデバッグ情報やメッセージをログに出力するためのメソッドです。実行ログで確認できます。',
      sortOrder: 4,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      {
        quizId: gasQuiz4.id,
        text: 'console.log()',
        isCorrect: false,
        sortOrder: 1,
      },
      {
        quizId: gasQuiz4.id,
        text: 'print()',
        isCorrect: false,
        sortOrder: 2,
      },
      {
        quizId: gasQuiz4.id,
        text: 'Logger.log()',
        isCorrect: true,
        sortOrder: 3,
      },
      {
        quizId: gasQuiz4.id,
        text: 'System.out()',
        isCorrect: false,
        sortOrder: 4,
      },
    ],
  });

  // ===== Web Basics Content =====
  const webBasicsContent = await prisma.content.create({
    data: {
      title: 'Webページのしくみを学ぼう！',
      description:
        'Webページを支える4つの技術（HTML・CSS・JavaScript・PHP）の基礎と役割を学びます。',
      body: `# Webページのしくみを学ぼう！

## Webページって何でできているの？
Webページは主に4つの技術が協力して動いています：
- HTML → ページの構造（骨組み）を作る
- CSS → 見た目やデザインを整える
- JavaScript → ブラウザ上で動きをつける
- PHP → サーバー側でデータを処理する

## HTML ― ページの骨組み
HTMLはタグを使ってページの構造を作ります。
\`\`\`html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>はじめてのWebページ</title>
</head>
<body>
  <h1>こんにちは！</h1>
  <p>これは私のWebページです。</p>
  <ul>
    <li>カレーライス</li>
    <li>ラーメン</li>
  </ul>
</body>
</html>
\`\`\`

よく使うタグ：
- h1〜h6 → 見出し
- p → 段落
- a → リンク
- img → 画像
- button → ボタン
- input → 入力欄

## CSS ― 見た目のデザイン
CSSでHTMLにデザインを加えます。
\`\`\`css
h1 {
  color: #7c3aed;
  text-align: center;
}
.card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}
\`\`\`

セレクタの種類：
- タグ名（h1, pなど）→ そのタグ全部に適用
- .クラス名 → classで指定した要素に適用
- #ID名 → idで指定した1つの要素に適用

## JavaScript ― ページの動き
JavaScriptでボタンのクリックや計算処理を作ります。
\`\`\`javascript
function greet() {
  let name = document.getElementById('myName').value;
  document.getElementById('result').textContent = 'こんにちは、' + name + '！';
}
\`\`\`

基本文法：let（変数）、const（定数）、if文、for文、function（関数）

## PHP ― サーバー側の処理
PHPはサーバーで動く言語です。フォームのデータを受け取って保存できます。
\`\`\`php
<?php
$name = htmlspecialchars($_POST['name'], ENT_QUOTES, 'UTF-8');
echo 'こんにちは、' . $name . 'さん！';

$date = date('Y-m-d H:i:s');
file_put_contents('data.txt', $date . ' / ' . $name . "\\n", FILE_APPEND);
?>
\`\`\`

- 変数は $ マーク付き（$name）
- echo で画面に出力
- $_POST でフォームデータを受け取る
- htmlspecialchars() でセキュリティ対策

## まとめ
HTML（構造）+ CSS（デザイン）+ JavaScript（動き）+ PHP（サーバー処理）の4つを組み合わせて、本格的なWebアプリケーションが作れます！`,
      categoryId: categoryWeb.id,
      sortOrder: 1,
    },
  });

  // Web Basics Quizzes
  const webBasicsQuiz1 = await prisma.quiz.create({
    data: {
      contentId: webBasicsContent.id,
      question: 'HTMLの役割として正しいものはどれですか？',
      explanation:
        'HTMLはWebページの構造（骨組み）を作るための言語です。見出し・段落・画像・リンクなどの配置を定義します。',
      sortOrder: 1,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      { quizId: webBasicsQuiz1.id, text: 'ページのデザイン（色や大きさ）を決める', isCorrect: false, sortOrder: 1 },
      { quizId: webBasicsQuiz1.id, text: 'ページの構造（骨組み）を作る', isCorrect: true, sortOrder: 2 },
      { quizId: webBasicsQuiz1.id, text: 'ページに動きをつける', isCorrect: false, sortOrder: 3 },
      { quizId: webBasicsQuiz1.id, text: 'サーバーでデータを処理する', isCorrect: false, sortOrder: 4 },
    ],
  });

  const webBasicsQuiz2 = await prisma.quiz.create({
    data: {
      contentId: webBasicsContent.id,
      question: 'CSSで文字の色を赤にするプロパティはどれですか？',
      explanation:
        'colorプロパティは文字の色を指定します。background-colorは背景色、font-sizeは文字サイズです。',
      sortOrder: 2,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      { quizId: webBasicsQuiz2.id, text: 'background-color: red;', isCorrect: false, sortOrder: 1 },
      { quizId: webBasicsQuiz2.id, text: 'font-color: red;', isCorrect: false, sortOrder: 2 },
      { quizId: webBasicsQuiz2.id, text: 'color: red;', isCorrect: true, sortOrder: 3 },
      { quizId: webBasicsQuiz2.id, text: 'text-color: red;', isCorrect: false, sortOrder: 4 },
    ],
  });

  const webBasicsQuiz3 = await prisma.quiz.create({
    data: {
      contentId: webBasicsContent.id,
      question: 'JavaScriptはどこで動くプログラミング言語ですか？',
      explanation:
        'JavaScriptはブラウザ（見る人のパソコン）で動きます。ボタンのクリック処理やアニメーションなど、リアルタイムにページを操作できます。',
      sortOrder: 3,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      { quizId: webBasicsQuiz3.id, text: 'サーバー', isCorrect: false, sortOrder: 1 },
      { quizId: webBasicsQuiz3.id, text: 'ブラウザ', isCorrect: true, sortOrder: 2 },
      { quizId: webBasicsQuiz3.id, text: 'データベース', isCorrect: false, sortOrder: 3 },
      { quizId: webBasicsQuiz3.id, text: 'メールサーバー', isCorrect: false, sortOrder: 4 },
    ],
  });

  const webBasicsQuiz4 = await prisma.quiz.create({
    data: {
      contentId: webBasicsContent.id,
      question: 'PHPの変数の書き方として正しいものはどれですか？',
      explanation:
        'PHPの変数は必ず$（ドルマーク）をつけて書きます。JavaScriptのようにletやconstは使いません。',
      sortOrder: 4,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      { quizId: webBasicsQuiz4.id, text: 'let name = "太郎";', isCorrect: false, sortOrder: 1 },
      { quizId: webBasicsQuiz4.id, text: '$name = "太郎";', isCorrect: true, sortOrder: 2 },
      { quizId: webBasicsQuiz4.id, text: 'var name = "太郎";', isCorrect: false, sortOrder: 3 },
      { quizId: webBasicsQuiz4.id, text: 'name := "太郎";', isCorrect: false, sortOrder: 4 },
    ],
  });

  const webBasicsQuiz5 = await prisma.quiz.create({
    data: {
      contentId: webBasicsContent.id,
      question: 'Webページを作る4つの技術の組み合わせとして正しいものはどれですか？',
      explanation:
        'HTML（構造）、CSS（デザイン）、JavaScript（ブラウザ側の動き）、PHP（サーバー側の処理）が正しい組み合わせです。',
      sortOrder: 5,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      { quizId: webBasicsQuiz5.id, text: 'HTML=構造、CSS=デザイン、JavaScript=動き、PHP=サーバー処理', isCorrect: true, sortOrder: 1 },
      { quizId: webBasicsQuiz5.id, text: 'HTML=デザイン、CSS=構造、JavaScript=サーバー、PHP=動き', isCorrect: false, sortOrder: 2 },
      { quizId: webBasicsQuiz5.id, text: '4つとも同じ役割で、好きなものを1つ選べばよい', isCorrect: false, sortOrder: 3 },
      { quizId: webBasicsQuiz5.id, text: 'HTML=動き、CSS=サーバー処理、JavaScript=構造、PHP=デザイン', isCorrect: false, sortOrder: 4 },
    ],
  });

  // ===== Web Programming Content =====
  const webContent = await prisma.content.create({
    data: {
      title: 'Webページを作ってみよう！',
      description:
        'HTML・JavaScript・PHPを使って、動きのあるWebページを作る方法を学びます。',
      body: `# Webページを作ってみよう！

## HTMLってなに？
HTML（HyperText Markup Language）は、Webページの構造を作るための言語です。
タグを使って、見出し、段落、画像、リンクなどを配置します。

## HTMLの基本
\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <title>はじめてのWebページ</title>
</head>
<body>
  <h1>こんにちは！</h1>
  <p>これは私のWebページです。</p>
  <button onclick="sayHello()">クリックしてね</button>
</body>
</html>
\`\`\`

## JavaScriptで動きをつけよう
JavaScriptを使うと、ボタンをクリックしたときにメッセージを表示したり、
ページの内容を動的に変えたりできます。

\`\`\`javascript
function sayHello() {
  alert("こんにちは！ボタンが押されました！");
}

// ページの内容を変える
document.getElementById("message").textContent = "新しいメッセージ";
\`\`\`

## PHPでサーバー側の処理
PHPは、サーバー側で動くプログラミング言語です。
フォームのデータを受け取ったり、データベースと連携したりできます。

\`\`\`php
<?php
// フォームからデータを受け取る
$name = $_POST["name"];
echo "こんにちは、" . $name . "さん！";

// 現在の日時を表示
echo "今は " . date("Y年m月d日 H:i") . " です。";
?>
\`\`\`

## まとめ
- **HTML** → ページの構造（骨組み）
- **JavaScript** → ページの動き（ブラウザ側）
- **PHP** → サーバー側の処理（データの保存や取得）

この3つを組み合わせることで、本格的なWebアプリケーションが作れます！`,
      categoryId: categoryWeb.id,
      sortOrder: 2,
    },
  });

  // Web Programming Quizzes
  const webQuiz1 = await prisma.quiz.create({
    data: {
      contentId: webContent.id,
      question: 'HTMLは何の略ですか？',
      explanation:
        'HTMLはHyperText Markup Languageの略で、Webページの構造を定義するためのマークアップ言語です。',
      sortOrder: 1,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      {
        quizId: webQuiz1.id,
        text: 'Hyper Transfer Markup Language',
        isCorrect: false,
        sortOrder: 1,
      },
      {
        quizId: webQuiz1.id,
        text: 'HyperText Markup Language',
        isCorrect: true,
        sortOrder: 2,
      },
      {
        quizId: webQuiz1.id,
        text: 'High Tech Modern Language',
        isCorrect: false,
        sortOrder: 3,
      },
      {
        quizId: webQuiz1.id,
        text: 'Home Tool Markup Language',
        isCorrect: false,
        sortOrder: 4,
      },
    ],
  });

  const webQuiz2 = await prisma.quiz.create({
    data: {
      contentId: webContent.id,
      question: 'JavaScriptでアラートを表示するメソッドはどれですか？',
      explanation:
        'alert()は、ブラウザにポップアップでメッセージを表示するJavaScriptのメソッドです。',
      sortOrder: 2,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      {
        quizId: webQuiz2.id,
        text: 'message()',
        isCorrect: false,
        sortOrder: 1,
      },
      {
        quizId: webQuiz2.id,
        text: 'popup()',
        isCorrect: false,
        sortOrder: 2,
      },
      {
        quizId: webQuiz2.id,
        text: 'alert()',
        isCorrect: true,
        sortOrder: 3,
      },
      {
        quizId: webQuiz2.id,
        text: 'show()',
        isCorrect: false,
        sortOrder: 4,
      },
    ],
  });

  const webQuiz3 = await prisma.quiz.create({
    data: {
      contentId: webContent.id,
      question: 'PHPはどこで動くプログラミング言語ですか？',
      explanation:
        'PHPはサーバーサイドのプログラミング言語です。Webサーバー上で実行され、HTMLを生成してブラウザに送信します。',
      sortOrder: 3,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      {
        quizId: webQuiz3.id,
        text: 'ブラウザ（クライアント側）',
        isCorrect: false,
        sortOrder: 1,
      },
      {
        quizId: webQuiz3.id,
        text: 'サーバー側',
        isCorrect: true,
        sortOrder: 2,
      },
      {
        quizId: webQuiz3.id,
        text: 'スマートフォンの中',
        isCorrect: false,
        sortOrder: 3,
      },
      {
        quizId: webQuiz3.id,
        text: 'メールソフトの中',
        isCorrect: false,
        sortOrder: 4,
      },
    ],
  });

  const webQuiz4 = await prisma.quiz.create({
    data: {
      contentId: webContent.id,
      question:
        'HTMLで一番大きな見出しを作るタグはどれですか？',
      explanation:
        '<h1>タグは、HTMLで最も大きな見出し（レベル1）を表示するためのタグです。h1からh6まであり、数字が小さいほど大きな見出しになります。',
      sortOrder: 4,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      {
        quizId: webQuiz4.id,
        text: '<title>',
        isCorrect: false,
        sortOrder: 1,
      },
      {
        quizId: webQuiz4.id,
        text: '<header>',
        isCorrect: false,
        sortOrder: 2,
      },
      { quizId: webQuiz4.id, text: '<h1>', isCorrect: true, sortOrder: 3 },
      { quizId: webQuiz4.id, text: '<big>', isCorrect: false, sortOrder: 4 },
    ],
  });

  const webQuiz5 = await prisma.quiz.create({
    data: {
      contentId: webContent.id,
      question:
        'Webページを作るときの3つの技術の役割として正しいものはどれですか？',
      explanation:
        'HTMLはページの構造（骨組み）、JavaScriptはページの動き（ブラウザ側の動的処理）、PHPはサーバー側の処理を担当します。',
      sortOrder: 5,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      {
        quizId: webQuiz5.id,
        text: 'HTML=動き、JavaScript=構造、PHP=デザイン',
        isCorrect: false,
        sortOrder: 1,
      },
      {
        quizId: webQuiz5.id,
        text: 'HTML=構造、JavaScript=動き、PHP=サーバー処理',
        isCorrect: true,
        sortOrder: 2,
      },
      {
        quizId: webQuiz5.id,
        text: 'HTML=サーバー処理、JavaScript=デザイン、PHP=構造',
        isCorrect: false,
        sortOrder: 3,
      },
      {
        quizId: webQuiz5.id,
        text: '3つとも同じ役割',
        isCorrect: false,
        sortOrder: 4,
      },
    ],
  });

  // ===== Web Local Dev Content =====
  const webLocalDevContent = await prisma.content.create({
    data: {
      title: 'ローカルPCでWeb開発環境を作ろう！',
      description:
        'MAMP・XAMPPを使って自分のパソコンにWebサーバーを構築し、PHPやデータベースを動かす方法を学びます。',
      body: `# ローカルPCでWeb開発環境を作ろう！

## ローカル開発環境とは？
自分のパソコンの中に小さなWebサーバーを作って、PHPやデータベースをテストできる環境のことです。
インターネットに公開せず、安全に開発・テストができます。

## MAMP / XAMPP とは？
Apache（Webサーバー）+ PHP + MySQL（データベース）をまとめてインストールできるツールです。
- Mac → MAMP がおすすめ
- Windows → XAMPP がおすすめ

## インストール方法
- MAMP: https://www.mamp.info/ からダウンロード
- XAMPP: https://www.apachefriends.org/ からダウンロード
インストーラーの指示に従うだけ！

## ファイルの置き場所
- MAMP: /Applications/MAMP/htdocs/
- XAMPP: C:\\\\xampp\\\\htdocs/
ここにHTMLやPHPファイルを置くと、ブラウザでアクセスできます。

## 動作確認
htdocsフォルダに test.php を作成：
\`\`\`php
<?php
echo '<h1>サーバーが動いています！</h1>';
echo '<p>PHPバージョン：' . phpversion() . '</p>';
?>
\`\`\`
ブラウザで http://localhost:8888/test.php (MAMP) または http://localhost/test.php (XAMPP) を開こう。

## テキストエディタ
おすすめは Visual Studio Code（VS Code）。無料で高機能。
- コードの色分け表示
- 自動補完機能
- 拡張機能で機能追加

## phpMyAdmin
データベースをブラウザで操作するツール。MAMP/XAMPPに標準搭載。
テーブルの作成、データの追加・編集・削除がマウス操作でできます。

## PHPからデータベースに接続
\`\`\`php
<?php
$pdo = new PDO('mysql:host=localhost;dbname=my_db;charset=utf8mb4', 'root', 'root');
$stmt = $pdo->query('SELECT * FROM students');
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($rows as $row) {
  echo $row['name'] . ': ' . $row['score'] . '点<br>';
}
?>
\`\`\`

ローカル環境ができれば、いつでもWebアプリを作ってテストできます！`,
      categoryId: categoryWeb.id,
      sortOrder: 3,
    },
  });

  // Web Local Dev Quizzes
  const webLocalQuiz1 = await prisma.quiz.create({
    data: {
      contentId: webLocalDevContent.id,
      question: 'ローカル開発環境の説明として正しいものはどれですか？',
      explanation:
        'ローカル開発環境は、自分のパソコンの中にWebサーバーを作って開発・テストする環境です。インターネットに公開せずに安全に開発できます。',
      sortOrder: 1,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      { quizId: webLocalQuiz1.id, text: 'インターネット上のサーバーを借りること', isCorrect: false, sortOrder: 1 },
      { quizId: webLocalQuiz1.id, text: '自分のPCの中にWebサーバーを作って開発する環境', isCorrect: true, sortOrder: 2 },
      { quizId: webLocalQuiz1.id, text: 'スマートフォンでWebサイトを見ること', isCorrect: false, sortOrder: 3 },
      { quizId: webLocalQuiz1.id, text: 'クラウドサービスにコードを保存すること', isCorrect: false, sortOrder: 4 },
    ],
  });

  const webLocalQuiz2 = await prisma.quiz.create({
    data: {
      contentId: webLocalDevContent.id,
      question: 'MAMP / XAMPP に含まれていないものはどれですか？',
      explanation:
        'MAMP/XAMPPにはApache（Webサーバー）、PHP、MySQL（データベース）が含まれています。Photoshopは画像編集ソフトで、Web開発ツールではありません。',
      sortOrder: 2,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      { quizId: webLocalQuiz2.id, text: 'Apache（Webサーバー）', isCorrect: false, sortOrder: 1 },
      { quizId: webLocalQuiz2.id, text: 'PHP', isCorrect: false, sortOrder: 2 },
      { quizId: webLocalQuiz2.id, text: 'MySQL（データベース）', isCorrect: false, sortOrder: 3 },
      { quizId: webLocalQuiz2.id, text: 'Photoshop（画像編集）', isCorrect: true, sortOrder: 4 },
    ],
  });

  const webLocalQuiz3 = await prisma.quiz.create({
    data: {
      contentId: webLocalDevContent.id,
      question: 'XAMPPでWebページのファイルを置くフォルダはどこですか？',
      explanation:
        'XAMPPではC:\\\\xampp\\\\htdocs/フォルダにファイルを置くと、http://localhost/ でアクセスできます。',
      sortOrder: 3,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      { quizId: webLocalQuiz3.id, text: 'C:\\\\Program Files\\\\', isCorrect: false, sortOrder: 1 },
      { quizId: webLocalQuiz3.id, text: 'C:\\\\xampp\\\\htdocs\\\\', isCorrect: true, sortOrder: 2 },
      { quizId: webLocalQuiz3.id, text: 'C:\\\\Users\\\\Desktop\\\\', isCorrect: false, sortOrder: 3 },
      { quizId: webLocalQuiz3.id, text: 'C:\\\\Windows\\\\System32\\\\', isCorrect: false, sortOrder: 4 },
    ],
  });

  const webLocalQuiz4 = await prisma.quiz.create({
    data: {
      contentId: webLocalDevContent.id,
      question: 'phpMyAdminは何をするためのツールですか？',
      explanation:
        'phpMyAdminは、MySQLデータベースをブラウザのGUI（画面）で操作するためのツールです。テーブルの作成やデータの編集がマウス操作でできます。',
      sortOrder: 4,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      { quizId: webLocalQuiz4.id, text: 'PHPのコードを書くエディタ', isCorrect: false, sortOrder: 1 },
      { quizId: webLocalQuiz4.id, text: '画像を編集するツール', isCorrect: false, sortOrder: 2 },
      { quizId: webLocalQuiz4.id, text: 'データベースをブラウザで操作するツール', isCorrect: true, sortOrder: 3 },
      { quizId: webLocalQuiz4.id, text: 'メールを送受信するアプリ', isCorrect: false, sortOrder: 4 },
    ],
  });

  // ===== Web Server Deploy Content =====
  const webDeployContent = await prisma.content.create({
    data: {
      title: 'レンタルサーバーにWebサイトを公開しよう！',
      description:
        'FTPツール（FileZilla）の使い方を学び、ローカルで作ったWebサイトをレンタルサーバーにアップロードして公開します。',
      body: `# レンタルサーバーにWebサイトを公開しよう！

## Webサイトを公開するとは？
ローカルPC（自分のパソコン）で作ったWebサイトを、レンタルサーバーにアップロードすると世界中からアクセスできるようになります。

## 公開に必要なもの
- レンタルサーバー（月500〜1,500円）
- FTPクライアント（FileZilla、無料）
- ドメイン（サーバーの初期ドメインでもOK）

## おすすめレンタルサーバー
- ロリポップ!（月220円〜、初心者向け）
- エックスサーバー（月990円〜、高性能）
- さくらのレンタルサーバ（月500円〜、老舗）

## FTPとは？
FTP（File Transfer Protocol）は、自分のPCからサーバーにファイルを転送する仕組みです。
本番環境ではFTPS（暗号化あり）を使いましょう。

## FileZilla の使い方
FileZillaは世界で最も使われている無料FTPクライアントです。
https://filezilla-project.org/ からダウンロード。

画面の構成：
- 左半分 → 自分のPCのファイル
- 右半分 → サーバーのファイル
- 左から右にドラッグ → アップロード
- 右から左にドラッグ → ダウンロード

## サーバーへの接続
サイトマネージャーに接続情報を登録：
- ホスト名（例：ftp.example.com）
- ユーザー名
- パスワード
- ポート（FTP:21 / SFTP:22）

## アップロードの手順
1. FileZillaでサーバーに接続
2. 右側でpublic_htmlフォルダを開く
3. 左側でアップロードしたいファイルを選択
4. ドラッグ&ドロップでアップロード
5. ブラウザでURLを開いて確認！

## ドメインとURL
- 初期ドメイン：サーバー契約時に無料でもらえる
- 独自ドメイン：自分だけの住所（年1,000円〜）
- 学習段階では初期ドメインで十分！

## ファイル更新
1. ローカルでファイルを修正
2. FileZillaで変更ファイルだけ再アップロード
3. ブラウザでCtrl+F5して確認

## パーミッション（権限）
- HTMLファイル：644
- フォルダ：755
- 書き込み用フォルダ：707

ローカルで開発 → テスト → サーバーに公開。この流れができれば立派なWeb開発者です！`,
      categoryId: categoryWeb.id,
      sortOrder: 4,
    },
  });

  // Web Server Deploy Quizzes
  const webDeployQuiz1 = await prisma.quiz.create({
    data: {
      contentId: webDeployContent.id,
      question: 'FTPとは何の略ですか？',
      explanation:
        'FTPはFile Transfer Protocol（ファイル転送プロトコル）の略です。自分のPCからサーバーにファイルを送るための仕組みです。',
      sortOrder: 1,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      { quizId: webDeployQuiz1.id, text: 'Fast Text Program', isCorrect: false, sortOrder: 1 },
      { quizId: webDeployQuiz1.id, text: 'File Transfer Protocol', isCorrect: true, sortOrder: 2 },
      { quizId: webDeployQuiz1.id, text: 'Free Tool Package', isCorrect: false, sortOrder: 3 },
      { quizId: webDeployQuiz1.id, text: 'Form Template Page', isCorrect: false, sortOrder: 4 },
    ],
  });

  const webDeployQuiz2 = await prisma.quiz.create({
    data: {
      contentId: webDeployContent.id,
      question: 'FileZillaでファイルをアップロードするにはどうしますか？',
      explanation:
        'FileZillaでは、左側（自分のPC）のファイルを右側（サーバー）にドラッグ&ドロップするとアップロードできます。',
      sortOrder: 2,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      { quizId: webDeployQuiz2.id, text: 'メールにファイルを添付して送る', isCorrect: false, sortOrder: 1 },
      { quizId: webDeployQuiz2.id, text: '左側から右側にドラッグ&ドロップする', isCorrect: true, sortOrder: 2 },
      { quizId: webDeployQuiz2.id, text: 'USBメモリをサーバーに差し込む', isCorrect: false, sortOrder: 3 },
      { quizId: webDeployQuiz2.id, text: 'ブラウザのアドレスバーにファイル名を入力する', isCorrect: false, sortOrder: 4 },
    ],
  });

  const webDeployQuiz3 = await prisma.quiz.create({
    data: {
      contentId: webDeployContent.id,
      question: 'レンタルサーバーでWebページのファイルを置くフォルダ名として一般的なものはどれですか？',
      explanation:
        'public_htmlは多くのレンタルサーバーで使われている公開フォルダ名です。このフォルダに置いたファイルがWebサイトとして公開されます。',
      sortOrder: 3,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      { quizId: webDeployQuiz3.id, text: 'my_documents', isCorrect: false, sortOrder: 1 },
      { quizId: webDeployQuiz3.id, text: 'public_html', isCorrect: true, sortOrder: 2 },
      { quizId: webDeployQuiz3.id, text: 'downloads', isCorrect: false, sortOrder: 3 },
      { quizId: webDeployQuiz3.id, text: 'desktop', isCorrect: false, sortOrder: 4 },
    ],
  });

  const webDeployQuiz4 = await prisma.quiz.create({
    data: {
      contentId: webDeployContent.id,
      question: 'FTPの接続情報として他人に見せてはいけないものはどれですか？',
      explanation:
        'FTPパスワードが漏れると、第三者にサーバーのファイルを改ざん・削除される危険があります。ホスト名やユーザー名と合わせて厳重に管理しましょう。',
      sortOrder: 4,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      { quizId: webDeployQuiz4.id, text: 'レンタルサーバーの会社名', isCorrect: false, sortOrder: 1 },
      { quizId: webDeployQuiz4.id, text: '月額料金', isCorrect: false, sortOrder: 2 },
      { quizId: webDeployQuiz4.id, text: 'FTPパスワード', isCorrect: true, sortOrder: 3 },
      { quizId: webDeployQuiz4.id, text: '公開したWebサイトのURL', isCorrect: false, sortOrder: 4 },
    ],
  });

  const webDeployQuiz5 = await prisma.quiz.create({
    data: {
      contentId: webDeployContent.id,
      question: 'HTMLファイルの推奨パーミッション（権限）設定はどれですか？',
      explanation:
        '644は「所有者が読み書き可能、その他のユーザーは読み取りのみ」という権限です。Webページの公開に適した設定です。',
      sortOrder: 5,
    },
  });
  await prisma.quizChoice.createMany({
    data: [
      { quizId: webDeployQuiz5.id, text: '777', isCorrect: false, sortOrder: 1 },
      { quizId: webDeployQuiz5.id, text: '644', isCorrect: true, sortOrder: 2 },
      { quizId: webDeployQuiz5.id, text: '000', isCorrect: false, sortOrder: 3 },
      { quizId: webDeployQuiz5.id, text: '999', isCorrect: false, sortOrder: 4 },
    ],
  });

  console.log('Seed data created successfully!');
  console.log(`Categories: 3`);
  console.log(`Contents: 8`);
  console.log(
    `Quizzes: ${await prisma.quiz.count()} (with ${await prisma.quizChoice.count()} choices)`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
