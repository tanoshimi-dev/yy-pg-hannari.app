# ⚙️📊📧 Google Apps Script (GAS) でスプレッドシート分析 & Gmail送信

---

## 📌 この教材でできるようになること

- ✅ スプレッドシートのデータを自動で集計・分析する
- ✅ 分析結果をGmailで自動送信する
- ✅ 定期実行（トリガー）を設定する
- ✅ 条件分岐（if文）とループ（for文）を使いこなす
- ✅ HTMLメールを作成して見やすいレポートを送る

---

## 1️⃣ GASって何ができるの？

GAS（Google Apps Script）は、Googleのサービスをプログラムで自動化できる無料ツールです。
JavaScriptという言語を使って書きます。ブラウザだけで動き、インストール不要！

### 🌟 GASでできることリスト

| サービス | できること | 使い道の例 |
|---------|-----------|----------|
| 📊 Sheets | データ読み書き・集計・グラフ作成 | 成績表の自動集計 |
| 📧 Gmail | メール送信・受信・検索 | レポートをメールで自動送信 |
| 📅 Calendar | 予定の追加・取得 | 授業スケジュールを自動登録 |
| 📁 Drive | ファイル作成・コピー・共有 | バックアップを自動作成 |
| 📝 Docs | 文書の作成・編集 | テンプレートから書類を自動生成 |
| 🌐 外部API | 外部サービスと通信 | 天気情報を取得してメール送信 |

---

## 2️⃣ スプレッドシートを分析しよう！ 📊

テストの成績表を例に、GASでデータを自動分析する方法を学びます。

### 📋 使うデータのイメージ（テスト成績表）

| 名前 | 国語 | 算数 | 理科 | 合計 |
|-----|-----|-----|-----|-----|
| 田中 たろう | 85 | 92 | 78 | 255 |
| 山田 はなこ | 91 | 88 | 95 | 274 |
| 佐藤 けんじ | 72 | 65 | 80 | 217 |
| 鈴木 みか | 88 | 94 | 91 | 273 |

### 📖 よく使うメソッド一覧

| メソッド | 説明 |
|---------|------|
| `sheet.getRange(行, 列).getValue()` | 1つのセルの値を取得 |
| `sheet.getRange(行, 列, 行数, 列数).getValues()` | 範囲のデータを2次元配列で取得 |
| `sheet.appendRow([値1, 値2, ...])` | 最終行の次に行を追加 |
| `sheet.getLastRow()` | データが入っている最後の行番号を取得 |
| `sheet.getRange(行, 列).setValue(値)` | セルに値を書き込む |

### 💻 スプレッドシート分析コード

```javascript
// 📊 成績データを分析する関数
function analyzeScores() {
  const sheet   = SpreadsheetApp.getActiveSheet();
  const lastRow = sheet.getLastRow();

  // 2行目から最終行まで、5列分のデータを一気に取得
  const data = sheet.getRange(2, 1, lastRow - 1, 5).getValues();
  // data[i][0]=名前, [1]=国語, [2]=算数, [3]=理科, [4]=合計

  let totalSum  = 0;
  let maxScore  = 0;
  let topStudent = '';

  // ループで全生徒をチェック
  for (let i = 0; i < data.length; i++) {
    const name  = data[i][0];
    const total = data[i][4];
    totalSum += total; // 合計に加算

    if (total > maxScore) { // 最高点を更新
      maxScore   = total;
      topStudent = name;
    }
  }

  const average = (totalSum / data.length).toFixed(1);

  // 結果をシートに書き込む
  sheet.getRange(lastRow + 2, 1).setValue('クラス平均');
  sheet.getRange(lastRow + 2, 5).setValue(average);
  sheet.getRange(lastRow + 3, 1).setValue('最高得点者');
  sheet.getRange(lastRow + 3, 2).setValue(topStudent + '（' + maxScore + '点）');

  // ポップアップで結果を表示
  SpreadsheetApp.getUi().alert('分析完了！平均: ' + average + '点');
}
```

---

## 3️⃣ Gmailで自動メール送信！ 📧

分析した結果を、Gmailで自動的に送信してみましょう！HTMLメールで見やすく！

### 📧 送るメールのイメージ

```
件名：【自動送信】4月のテスト成績レポート

📊 4月のテスト成績まとめ
クラス人数：4人 ／ クラス平均：254.8点
最高得点者：山田 はなこ（274点）

（HTMLメールなのでカラフルな表が届きます）
```

### 📖 Gmail送信の基本

| メソッド | 説明 |
|---------|------|
| `GmailApp.sendEmail(宛先, 件名, テキスト)` | シンプルなメール送信 |
| `GmailApp.sendEmail(宛先, 件名, テキスト, {htmlBody: ...})` | HTMLメール送信 |

### 💻 Gmail送信コード

```javascript
// 📧 成績レポートをHTMLメールで送信する
function sendScoreReport() {
  const sheet   = SpreadsheetApp.getActiveSheet();
  const lastRow = sheet.getLastRow();
  const data    = sheet.getRange(2, 1, lastRow - 1, 5).getValues();

  let totalSum = 0, maxScore = 0, topName = '';
  let tableRows = ''; // HTMLのテーブル行を組み立てる

  data.forEach(function(row) {
    const [name, jpn, math, sci, total] = row; // 分割代入
    totalSum += total;
    if (total > maxScore) { maxScore = total; topName = name; }
    // HTMLテーブルの1行を作る
    tableRows += `<tr><td>${name}</td><td>${jpn}</td>`;
    tableRows += `<td>${math}</td><td>${sci}</td><td><b>${total}</b></td></tr>`;
  });

  const avg = (totalSum / data.length).toFixed(1);

  // HTMLメール本文をテンプレートリテラルで作成
  const htmlBody = `
    <h2 style='color:#2E75B6'>📊 テスト成績レポート</h2>
    <p>クラス平均: <b>${avg}点</b>　最高得点: <b>${topName}(${maxScore}点)</b></p>
    <table border='1' cellpadding='8' style='border-collapse:collapse'>
      <tr style='background:#2E75B6;color:white'>
        <th>名前</th><th>国語</th><th>算数</th><th>理科</th><th>合計</th>
      </tr>
      ${tableRows}
    </table>`;

  // Gmailで送信！
  GmailApp.sendEmail(
    'your-email@gmail.com',        // 送信先
    '【自動送信】テスト成績レポート', // 件名
    'HTMLメールをご確認ください',    // テキスト版
    { htmlBody: htmlBody }          // HTMLメール
  );
  Logger.log('メール送信完了！');
}
```

---

## 4️⃣ 自動実行（トリガー）を設定しよう！ ⏰

GASでは決まった時間に自動実行する「トリガー」を設定できます。

### ⏰ よく使うトリガーの種類

| 種類 | タイミング | 使い道の例 |
|-----|----------|----------|
| ⏱️ 時間ベース | 毎日・毎週・毎月など | 毎月曜に成績レポートをメール送信 |
| 📝 フォーム送信時 | Googleフォームが送られたとき | アンケートが来たら通知メールを送る |
| 📂 ファイル編集時 | スプレッドシートが変更されたとき | データが変わったら自動集計する |

### 💻 トリガー設定コード

```javascript
// ⏰ 毎週月曜9時に sendScoreReport を実行するトリガーを設定
function setWeeklyTrigger() {
  // まず既存トリガーを全削除（重複防止）
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));

  ScriptApp.newTrigger('sendScoreReport')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY) // 毎週月曜
    .atHour(9)                           // 9時台に実行
    .create();
  Logger.log('毎週月曜トリガー設定完了！');
}

// 📂 セルが編集されたら自動で合計を再計算（特殊なトリガー関数）
function onEdit(e) {
  const col = e.range.getColumn();
  const row = e.range.getRow();
  if (col >= 2 && col <= 4) { // B〜D列が変更されたら
    const s    = e.source.getActiveSheet();
    const jpn  = s.getRange(row, 2).getValue();
    const math = s.getRange(row, 3).getValue();
    const sci  = s.getRange(row, 4).getValue();
    s.getRange(row, 5).setValue(jpn + math + sci); // 合計を自動更新！
  }
}
```

---

## 5️⃣ チャレンジ課題！ 🚀

### 🎯 課題1：成績アラートメール

テストの点数が50点以下の生徒がいたら、「赤点アラート」メールを自動送信するプログラムを作ってみよう！

> **ヒント：** if文で点数が50以下かどうか確認 → `GmailApp.sendEmail` で送信

### 🎯 課題2：毎日の自動レポート

毎日夜8時にその日のデータをGmailで自動送信するトリガーを作ろう！

> **ヒント：** `setDailyTrigger()` を作って `.atHour(20)` を使おう

### 🎯 課題3：スプレッドシートに自動グラフ作成

`EmbeddedChartBuilder` を使って成績の棒グラフを自動生成しよう！

> **ヒント：** `sheet.newChart()` → `setChartType()` → `addRange()` → `build()` → `insertChart()`

---

## 📚 参考リンク

- 📖 Google Apps Script 公式ドキュメント：https://developers.google.com/apps-script
- 🔍 Qiita「Google Apps Script 入門」で検索！
- ▶️ YouTube「GAS スプレッドシート 自動化」で動画学習もできます

---

*📝 はんなりdev 制作*
