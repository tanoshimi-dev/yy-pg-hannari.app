# 🤖📱📊 LINEとスプレッドシートでボットを作ろう！

> 〜 日記ボット ＆ お小遣い帳ボット 〜

---

## 📌 この資料でわかること

- ✅ LINEボットってなに？
- ✅ Google スプレッドシートとどうつながるの？
- ✅ 日記ボットをどう作るの？
- ✅ お小遣い帳ボットをどう作るの？
- ✅ 実際のコード（プログラム）を見てみよう！

---

## 1️⃣ LINEボットってなに？

LINEボットとは、LINEの「友だち」として追加できる **自動返信プログラム** のことです。
あなたがメッセージを送ると、ロボット（プログラム）が自動で返事をしてくれます！

### 🌟 LINEボットでできること

- ✅ 「今日の天気は？」と聞くと答えてくれる
- ✅ 「500円使った」と送ると自動で記録してくれる
- ✅ 毎朝決まった時間に「おはよう！」と送ってくれる
- ✅ 勉強時間を記録してグラフにしてくれる

### 🔧 どんな仕組みで動くの？

LINEボットは、以下の3つのパーツがつながって動きます：

```
📱 LINEアプリ  →  ⚙️ GAS（プログラム）  →  📊 スプレッドシート
```

> **💡 GAS（ジーエーエス）とは？**
>
> Google Apps Script（グーグル・アップス・スクリプト）の略です。
> Googleのサービスを自動化できる無料のプログラミング環境です。
> JavaScriptという言語を使って書きます。
> インターネット上で動くので、パソコンへのインストールは不要！

---

## 2️⃣ 全体の流れ（仕組み図）

LINEとスプレッドシートは、以下のように連携します：

| ステップ | 説明 |
|---------|------|
| ① 📱 | あなたがLINEでメッセージを送る（例：「今日のお昼 500円 ラーメン」） |
| ② 🔀 | LINE Messaging API がメッセージを受け取って、GASに転送する |
| ③ ⚙️ | GAS（プログラム）がメッセージを解析して、スプレッドシートに書き込む |
| ④ 📊 | スプレッドシートにデータが記録される！ |
| ⑤ 📱 | GASがLINEに返信する（例：「500円を記録したよ！今月の合計：3,200円」） |

---

## 3️⃣ 日記ボットを作ろう！ 📔

LINEに今日あったことを送ると、自動でスプレッドシートに日記として保存されるボットです。

### ✨ どんな動きをするの？

```
あなた  → 「今日は算数のテストで100点とった！うれしかった😊」

ボット  → 「📔 日記を記録したよ！
            📅 日付：2024年4月15日（月）
            ✅ スプレッドシートに保存しました！」
```

### 📊 スプレッドシートはこうなる

| A列：日付 | B列：時刻 | C列：日記の内容 |
|----------|---------|--------------|
| 4月15日（月） | 20:34 | 今日は算数のテストで100点とった！うれしかった😊 |
| 4月16日（火） | 21:12 | サッカーの練習で初めてシュートが決まった！ |
| 4月17日（水） | 20:55 | 給食のカレーがおいしかった。明日も学校行きたい |

### 🛠️ 作り方のステップ

| ステップ | 内容 |
|---------|------|
| STEP 1 | **LINE Developersでアカウントを作る**<br>https://developers.line.biz/ にアクセスして、LINEアカウントでログインしよう。「Messaging API」チャネルを作成する。 |
| STEP 2 | **Google スプレッドシートを作る**<br>Googleドライブで新しいスプレッドシートを作成。A1に「日付」、B1に「時刻」、C1に「内容」と入力しておこう。 |
| STEP 3 | **Google Apps Scriptを書く**<br>スプレッドシートの「拡張機能」→「Apps Script」を開いてプログラムを書く。 |
| STEP 4 | **WebhookのURLをLINEに登録する**<br>GASをウェブアプリとして公開して、URLをLINE DevelopersのWebhook URLに貼り付ける。 |
| STEP 5 | **テストしてみよう！**<br>LINEでボットにメッセージを送って、スプレッドシートに記録されるか確かめよう！ |

### 💻 日記ボットのコード例（Google Apps Script）

> **📖 コードの読み方**
> - `//` で始まる行はコメント（説明文）です。プログラムとしては動きません。
> - コードは上から順番に実行されます。
> - まずは「なんとなく何をやっているか」を読んでみよう！

```javascript
// 📌 LINEへの返信に必要な情報
const CHANNEL_ACCESS_TOKEN = 'ここにLINEのトークンを入力';

// 📌 LINEからメッセージが届いたときに動く関数
function doPost(e) {
  // メッセージの内容を受け取る
  const json = JSON.parse(e.postData.contents);
  const event = json.events[0];
  const message = event.message.text; // ユーザーが送った文字
  const replyToken = event.replyToken;

  // 📊 スプレッドシートに書き込む
  const sheet = SpreadsheetApp.getActiveSheet();
  const now  = new Date();
  const date = Utilities.formatDate(now, 'Asia/Tokyo', 'M月d日(EEE)');
  const time = Utilities.formatDate(now, 'Asia/Tokyo', 'HH:mm');
  sheet.appendRow([date, time, message]); // 行を追加！

  // 📱 LINEに返信する
  const reply = '📔 日記を記録したよ！\n📅 ' + date + '\n✅ 保存完了！';
  replyToLine(replyToken, reply);
}

// 📌 LINEに返信を送る関数
function replyToLine(replyToken, text) {
  UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN },
    payload: JSON.stringify({
      replyToken: replyToken,
      messages: [{ type: 'text', text: text }]
    })
  });
}
```

---

## 4️⃣ お小遣い帳ボットを作ろう！ 💰

LINEに使ったお金を送ると、スプレッドシートに自動記録して残高まで教えてくれるボットです！

### ✨ どんな動きをするの？

```
あなた → 「500 ラーメン」

ボット → 「💰 記録したよ！
          📝 支出：500円（ラーメン）
          💳 今月の残高：2,500円
          📊 今月の合計支出：1,500円」

あなた → 「のこり」

ボット → 「今月の残高は 2,500円 だよ！」
```

### 📊 スプレッドシートはこうなる

| A列：日付 | B列：金額 | C列：項目 | D列：残高 |
|----------|---------|---------|---------|
| 4月1日 | 3,000 | （今月のお小遣い） | 3,000円 |
| 4月3日 | -200 | 駄菓子屋 | 2,800円 |
| 4月8日 | -500 | ラーメン | 2,300円 |
| 4月12日 | -300 | マンガ | 2,000円 |

### 🛠️ 作り方のステップ

| ステップ | 内容 |
|---------|------|
| STEP 1 | **LINE Developersでアカウントを作る**<br>日記ボットと同じ。すでに作った場合はそのまま使えるよ！ |
| STEP 2 | **お小遣い帳用のスプレッドシートを作る**<br>A1に「日付」、B1に「金額」、C1に「項目」、D1に「残高」と入力。最初の行に今月のお小遣い額を入力しよう。 |
| STEP 3 | **Google Apps Scriptを書く**<br>「500 ラーメン」のような形式のメッセージを解析して、スプレッドシートに記録するプログラムを書く。 |
| STEP 4 | **残高を計算する機能を追加する**<br>スプレッドシートの最後の行から現在の残高を読み取って、LINEに返信するように改良しよう。 |
| STEP 5 | **「のこり」コマンドに対応させる**<br>「のこり」と送ったら残高を教えてくれるように、条件分岐（if文）を追加しよう！ |

### 💡 メッセージの送り方のルール

- 支出を記録：`金額 メモ` の形で送る（例：`500 ラーメン`、`300 マンガ`）
- 残高を確認：`のこり` と送る
- 今月の記録一覧：`りれき` と送る

### 💻 お小遣い帳ボットのコード例

```javascript
const CHANNEL_ACCESS_TOKEN = 'ここにLINEのトークンを入力';

function doPost(e) {
  const json = JSON.parse(e.postData.contents);
  const event = json.events[0];
  const message = event.message.text;
  const replyToken = event.replyToken;
  const sheet = SpreadsheetApp.getActiveSheet();

  // 📊 「のこり」と送ったら残高を返す
  if (message === 'のこり') {
    const lastRow = sheet.getLastRow();
    const balance = sheet.getRange(lastRow, 4).getValue();
    replyToLine(replyToken, '💳 残高：' + balance + '円');
    return;
  }

  // 💰 「500 ラーメン」のような形式を解析する
  const parts  = message.split(' ');  // スペースで分割
  const amount = parseInt(parts[0]);  // 数字部分
  const memo   = parts[1] || '';      // メモ部分

  if (isNaN(amount)) {
    replyToLine(replyToken, '⚠️ 「500 ラーメン」の形で送ってね！');
    return;
  }

  // 前の残高を取得して、新しい残高を計算
  const lastRow    = sheet.getLastRow();
  const prevBalance = sheet.getRange(lastRow, 4).getValue();
  const newBalance  = prevBalance - amount; // 残高を引く

  // スプレッドシートに追記
  const now  = new Date();
  const date = Utilities.formatDate(now, 'Asia/Tokyo', 'M月d日');
  sheet.appendRow([date, -amount, memo, newBalance]);

  // LINEに返信
  const reply = '💰 記録したよ！\n📝 支出：' + amount + '円（' + memo + '）\n💳 残高：' + newBalance + '円';
  replyToLine(replyToken, reply);
}

function replyToLine(replyToken, text) {
  UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN },
    payload: JSON.stringify({
      replyToken: replyToken,
      messages: [{ type: 'text', text: text }]
    })
  });
}
```

---

## 5️⃣ もっとよくするアイデア！ 🚀

基本のボットが完成したら、以下のような機能を追加してみよう！

### 🎯 日記ボットの改良アイデア

- 📸 写真も一緒に送れるようにする（画像をGoogle Driveに保存）
- 😊 今日の気分を1〜5の数字で記録できるようにする
- 📅 「先週の日記」と送ると過去の日記を読み返せるようにする
- 🌟 毎晩21時に「今日の日記を書こう！」とリマインドを送ってくれるようにする

### 🎯 お小遣い帳ボットの改良アイデア

- 📊 「グラフ」と送ると月ごとの支出グラフを作成する
- ⚠️ 残高が500円を切ったら「残高が少なくなってるよ！」と警告する
- 🗂️ 「食費」「文房具」などのカテゴリ別に集計する
- 💡 月末に自動で「今月の合計支出レポート」を送ってくれるようにする

### 📚 勉強するとできるようになること

| 学ぶこと | できるようになること |
|---------|-----------------|
| 変数（へんすう） | データを一時的に保存できる。お金の計算などに使う。 |
| if文（条件分岐） | 「〇〇なら△△する」という条件で処理を分けられる。 |
| 関数（かんすう） | よく使う処理をまとめて名前をつけられる。 |
| 配列（はいれつ） | 複数のデータをまとめて管理できる。 |
| API連携 | LINEなど外部サービスとプログラムをつなげられる。 |

---

> 🎉 **まとめ**
>
> LINEボット作りは、プログラミングの基礎がぎゅっとつまった最高の教材です！
>
> まずは「日記ボット」から作り始めて、動いたら「お小遣い帳ボット」に挑戦してみよう！
> エラーが出ても大丈夫。エラーメッセージを読んで、少しずつ直していくのがプログラミングの醍醐味です 💪

---

*📝 はんなりdev 制作*
