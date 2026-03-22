# 🌐⚡🐘 HTML・JavaScript・PHP でウェブページを作ろう！

---

## 📌 この教材でできるようになること

- ✅ HTML・CSS でウェブページの見た目を作る
- ✅ JavaScript でページを動かす（ボタン・計算・アニメーション）
- ✅ PHP でサーバー側の処理を書く（フォーム送信・データ保存）
- ✅ HTML + JavaScript + PHP を組み合わせてウェブアプリを作る
- ✅ 3つの言語の役割の違いを理解する

---

## 1️⃣ 3つの言語の役割を理解しよう！

ウェブページは主に3つの言語が協力して動いています。

```
┌─────────────────────────────────────────────────────────┐
│                   ウェブページの仕組み                     │
│                                                         │
│  🌐 HTML         → ページの「骨格・内容」を作る            │
│                    （見出し・文章・画像・ボタンなど）       │
│                                                         │
│  🎨 CSS          → ページの「デザイン・色・レイアウト」     │
│                    （色・大きさ・配置など）                │
│                                                         │
│  ⚡ JavaScript   → ページを「動かす」（ブラウザで動く）     │
│                    （ボタンを押したら計算する、など）       │
│                                                         │
│  🐘 PHP          → サーバーで動く（見えない裏側の処理）    │
│                    （フォームデータを受け取って保存、など） │
└─────────────────────────────────────────────────────────┘
```

### ⚡ JavaScript vs 🐘 PHP：何が違うの？

| | ⚡ JavaScript（フロントエンド） | 🐘 PHP（バックエンド） |
|--|----------------------------|--------------------|
| どこで動く | ブラウザ（見る人のPC） | サーバー（インターネットの向こう） |
| 得意なこと | ページを動かす・計算する | データの保存・ログイン処理 |
| よくある用途 | ボタンのクリック・アニメーション | お問い合わせフォーム・会員サイト |
| 例 | 電卓アプリ・ゲーム | 掲示板・ショッピングサイト |

---

## 2️⃣ HTMLでページを作ろう！ 🌐

HTMLはウェブページの「骨組み」を作る言語です。**タグ** と呼ばれる部品を組み合わせて書きます。

### 📦 よく使うHTMLタグ一覧

| タグ | 意味 | 使い方の例 |
|-----|------|----------|
| `<h1>〜<h6>` | 見出し（大→小） | `<h1>大見出し</h1>` |
| `<p>` | 段落（文章のかたまり） | `<p>ここに文章を書く</p>` |
| `<a href='...'>` | リンク（クリックで移動） | `<a href='https://...'>クリック</a>` |
| `<img src='...'>` | 画像を表示する | `<img src='cat.jpg' alt='猫'>` |
| `<button>` | ボタン | `<button onclick='say()'>押して</button>` |
| `<input>` | 入力欄（テキスト・数字） | `<input type='text' id='name'>` |
| `<div>` | レイアウト用のかたまり | `<div class='box'>...</div>` |
| `<table>` | 表を作る | `<table><tr><td>内容</td></tr></table>` |
| `<form>` | フォーム（送信する仕組み） | `<form action='send.php' method='post'>` |

### 📄 HTMLの基本テンプレート（index.html）

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>はじめてのウェブページ</title>
  <style>
    body { font-family: 'メイリオ', sans-serif; background: #f0f8ff; }
    h1   { color: #2E75B6; text-align: center; }
    .box { background: white; padding: 20px; border-radius: 8px; }
  </style>
</head>
<body>
  <h1>🌟 はじめてのウェブページ</h1>
  <div class="box">
    <p>名前を入力してね：</p>
    <input type="text" id="myName" placeholder="名前を入力">
    <button onclick="greet()">あいさつする</button>
    <p id="result"></p>
  </div>
  <script src="script.js"></script>
</body>
</html>
```

---

## 3️⃣ JavaScriptでページを動かそう！ ⚡

JavaScriptはブラウザ上で動くプログラム言語です。
ボタンを押したら何かが起きる、入力値を使って計算する、など「動き」を加えられます。

### 📄 JavaScript基本文法まとめ（script.js）

```javascript
// ① 変数（値を入れる箱）
let name  = '太郎';   // let: 変更できる変数
const pi  = 3.14;     // const: 変更できない定数

// ② HTMLの要素を取得・変更
const el = document.getElementById('result'); // idで取得
el.textContent = 'こんにちは！';               // テキストを書き換え
el.style.color = 'red';                       // CSSを変更

// ③ 関数（処理をまとめる）
function greet() {
  const name = document.getElementById('myName').value; // 入力値を取得
  if (name === '') {
    alert('名前を入力してね！');
    return; // ここで処理を止める
  }
  document.getElementById('result').textContent = 'こんにちは、' + name + '！';
}

// ④ 配列とループ（リストを処理する）
const fruits = ['りんご', 'みかん', 'バナナ'];
fruits.forEach(function(fruit) {
  console.log(fruit); // ブラウザの開発ツールに表示
});

// ⑤ イベントリスナー（クリック・入力を検知）
document.getElementById('myName').addEventListener('input', function() {
  console.log('入力値：' + this.value); // 入力のたびに実行
});
```

### 🧮 実践：電卓アプリを作ろう！

```html
<!-- HTML部分 (calc.html) -->
<h2>🧮 かんたん電卓</h2>
<input type="number" id="num1" placeholder="数字1">
<select id="operator">
  <option value="+">＋</option>
  <option value="-">－</option>
  <option value="*">×</option>
  <option value="/">÷</option>
</select>
<input type="number" id="num2" placeholder="数字2">
<button onclick="calculate()">計算する</button>
<p id="answer"></p>
```

```javascript
// JavaScript部分 (script.js)
function calculate() {
  const a  = parseFloat(document.getElementById('num1').value);
  const b  = parseFloat(document.getElementById('num2').value);
  const op = document.getElementById('operator').value;
  let result;

  if      (op === '+') result = a + b;
  else if (op === '-') result = a - b;
  else if (op === '*') result = a * b;
  else if (op === '/') {
    if (b === 0) { alert('0では割れません！'); return; }
    result = a / b;
  }

  document.getElementById('answer').textContent = '答え：' + result;
}
```

---

## 4️⃣ PHPでサーバー処理を書こう！ 🐘

PHPはサーバー側で動くプログラム言語です。フォームのデータを受け取ってファイルに保存したり、HTMLを動的に作ったりできます。

> **💡 PHPを動かすには？**
>
> PHPはサーバーが必要です。以下のどれかを使おう！
> - **XAMPP**（Windows/Mac用の無料ローカルサーバー）
> - **MAMP**（Mac用）
> - **オンライン環境**：https://paiza.io など（ブラウザで試せる）
>
> ファイル名は必ず `.php` にする（例：hello.php）

### 📄 PHPの基本文法まとめ（hello.php）

```php
<?php
// ① 変数（$ マークを必ずつける！）
$name = '太郎';
$age  = 12;
$pi   = 3.14;

// ② 文字列を出力（HTMLに表示）
echo '<h1>こんにちは、' . $name . '！</h1>';
echo "<p>年齢：{$age}歳</p>";  // ダブルクォートは変数展開できる

// ③ if文（条件分岐）
if ($age >= 13) {
  echo '<p>中学生以上です</p>';
} else {
  echo '<p>小学生以下です</p>';
}

// ④ 配列とループ
$fruits = ['りんご', 'みかん', 'バナナ'];
foreach ($fruits as $fruit) {
  echo '<li>' . $fruit . '</li>';
}

// ⑤ 関数
function greet($name) {
  return 'こんにちは、' . $name . '！';
}
echo greet('はなこ'); // → こんにちは、はなこ！
?>
```

### 📬 フォームデータを受け取る（HTML→PHP）

```html
<!-- フォーム（form.html） -->
<form action="save.php" method="post">
  <label>名前：<input type="text" name="name"></label>
  <label>感想：<textarea name="message"></textarea></label>
  <button type="submit">送信する</button>
</form>
```

```php
<?php // 受け取り処理（save.php）

// POSTデータを受け取る（セキュリティ対策で htmlspecialchars を使う！）
$name    = htmlspecialchars($_POST['name'],    ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($_POST['message'], ENT_QUOTES, 'UTF-8');

// 入力チェック
if (empty($name) || empty($message)) {
  echo '<p>⚠️ 名前と感想を入力してください</p>';
  exit;
}

// ファイルに保存（簡易データベースの代わり）
$date = date('Y-m-d H:i:s'); // 現在時刻を取得
$line = $date . ' / ' . $name . ' / ' . $message . "\n";
file_put_contents('messages.txt', $line, FILE_APPEND); // 追記保存

echo '<h2>✅ 送信完了！</h2>';
echo '<p>' . $name . 'さんの感想を保存しました。</p>';
?>
```

---

## 5️⃣ 3つを組み合わせた実践プロジェクト！ 🚀

HTML・JavaScript・PHPを組み合わせて、実際に動くウェブアプリを作ってみましょう！

### 🌟 プロジェクト：かんたん日記ウェブアプリ

> **作るもの**
> 1. 日記を入力して「保存する」ボタンを押す（HTML + JavaScript）
> 2. JavaScriptがサーバーにデータを送る（fetch API）
> 3. PHPがデータを受け取ってファイルに保存（PHP）
> 4. 保存した日記の一覧をページに表示する（PHP + HTML）

#### 📄 ① ページの見た目（diary.html）

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>📔 日記アプリ</title>
  <style>
    body     { font-family: 'メイリオ'; max-width: 600px; margin: 30px auto; }
    textarea { width: 100%; height: 100px; margin: 10px 0; }
    #entries { background: #f9f9f9; padding: 15px; margin-top: 20px; }
  </style>
</head>
<body>
  <h1>📔 日記アプリ</h1>
  <textarea id="diary" placeholder="今日のことを書こう..."></textarea>
  <button onclick="saveDiary()">💾 保存する</button>
  <div id="message"></div>
  <h2>📚 過去の日記</h2>
  <div id="entries">読み込み中...</div>
  <script src="diary.js"></script>
</body>
</html>
```

#### 📄 ② JavaScriptで保存・表示（diary.js）

```javascript
// ① ページが開いたとき、過去の日記を読み込む
window.onload = function() { loadDiaries(); };

// ② 日記を保存する（PHPに送る）
async function saveDiary() {
  const text = document.getElementById('diary').value;
  if (text.trim() === '') {
    document.getElementById('message').textContent = '⚠️ 何か書いてね！';
    return;
  }

  // fetch() でPHPにデータを送る（Ajaxと呼ぶ）
  const response = await fetch('diary_save.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'text=' + encodeURIComponent(text)
  });
  const result = await response.text();
  document.getElementById('message').textContent = result;
  document.getElementById('diary').value = ''; // 入力欄をクリア
  loadDiaries(); // 一覧を再読み込み
}

// ③ 日記一覧を読み込む
async function loadDiaries() {
  const response = await fetch('diary_list.php');
  const html     = await response.text();
  document.getElementById('entries').innerHTML = html;
}
```

#### 📄 ③ PHPで保存・一覧表示

```php
<?php // diary_save.php：保存処理
$text = htmlspecialchars($_POST['text'], ENT_QUOTES, 'UTF-8');
if (empty($text)) { echo '⚠️ テキストが空です'; exit; }
$date = date('Y/m/d H:i');
$line = $date . '|' . $text . "\n";
file_put_contents('diary.txt', $line, FILE_APPEND);
echo '✅ 日記を保存しました！';
?>
```

```php
<?php // diary_list.php：一覧表示
if (!file_exists('diary.txt')) { echo '<p>日記がまだありません</p>'; exit; }
$lines = array_reverse(file('diary.txt', FILE_IGNORE_NEW_LINES));
foreach ($lines as $line) {
  if (empty($line)) continue;
  [$date, $text] = explode('|', $line, 2); // '|' で分割
  echo "<div style='border-bottom:1px solid #ccc; padding:10px'>";
  echo "  <small>{$date}</small>";
  echo "  <p>{$text}</p>";
  echo "</div>";
}
?>
```

---

## 6️⃣ チャレンジ課題！ 🌟

### 🎯 課題1（JavaScript）：クイズアプリ

JavaScriptだけで動くクイズアプリを作ろう！
問題を配列に入れておいて、正解/不正解を判定する。

> **ヒント：** 問題の配列 → ランダムに出題（`Math.random()`）→ 正誤チェック（if文）

### 🎯 課題2（PHP）：アンケートフォーム

PHPでお問い合わせフォームを作ろう！
名前・メールアドレス・メッセージを受け取って、テキストファイルに保存する。

> **ヒント：** `<form method="post">` → `$_POST` → `file_put_contents()`

### 🎯 課題3（組み合わせ）：お小遣い帳ウェブアプリ

HTML + JavaScript + PHP でお小遣い帳ウェブアプリを作ろう！

| パート | 担当 |
|-------|------|
| HTML | 入力フォームと一覧表示の見た目 |
| JavaScript | 入力バリデーションとfetch送信 |
| PHP | データ保存・読み込み・合計計算 |

> **ヒント：** 第5章の日記アプリをベースに改造してみよう！

---

## 📚 さらに学ぶための参考リソース

- 📖 MDN Web Docs（HTMLとJSの公式解説）：https://developer.mozilla.org/ja/
- 🐘 PHP公式マニュアル：https://www.php.net/manual/ja/
- 💻 paiza.io（ブラウザでPHPを試せる）：https://paiza.io/ja/projects/new?language=php
- 🎓 progate（初心者向け学習サイト）：https://prog-8.com/

---

*📝 はんなりdev 制作*
