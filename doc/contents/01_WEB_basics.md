# 🌐✨ Webページのしくみを学ぼう！

> 〜 HTML・CSS・JavaScript・PHP の基礎をまるごと理解 〜

---

## 📌 この教材でできるようになること

- ✅ Webページがどうやって表示されるのかを理解する
- ✅ HTML でページの骨組みを作る
- ✅ CSS でページをデザインする
- ✅ JavaScript でページに動きをつける
- ✅ PHP でサーバー側の処理を書く
- ✅ 4つの言語の役割の違いを理解する

---

## 1️⃣ Webページってどうやって動いているの？

ブラウザでWebページを見るとき、裏側ではこんなことが起きています。

```
あなたのパソコン（ブラウザ）              インターネットの向こう（サーバー）
┌───────────────────────┐           ┌───────────────────────┐
│                       │  ①リクエスト │                       │
│  「このページ見せて！」  │ ─────────→ │  サーバー（コンピュータ） │
│                       │           │                       │
│  ②ページが届く          │ ←───────── │  HTML/CSS/JSを返す      │
│                       │  レスポンス  │  (PHPが動的に作ることも) │
│  ③ブラウザが表示する     │           │                       │
└───────────────────────┘           └───────────────────────┘
```

### 🏠 Webページを「家」にたとえると

| 技術 | 家でいうと | 役割 |
|-----|----------|------|
| 🌐 HTML | 柱・壁・屋根（骨組み） | ページの構造と内容を作る |
| 🎨 CSS | 壁紙・カーテン・照明（内装） | 見た目やデザインを整える |
| ⚡ JavaScript | 電気・リモコン・センサー（動く仕組み） | ページに動きや対話性をつける |
| 🐘 PHP | 水道・ガスの配管（裏方の仕組み） | サーバー側でデータを処理する |

---

## 2️⃣ HTML ― ページの骨組みを作ろう！

HTML（エイチティーエムエル）は **HyperText Markup Language** の略です。
**タグ** という部品を使って、ページの構造を作ります。

### 📝 HTMLの基本ルール

```html
<タグ名>ここに内容を書く</タグ名>
```

- 開始タグ `<タグ名>` と終了タグ `</タグ名>` で内容を挟む
- タグの種類によって、見出し・段落・画像などになる

### 📦 よく使うHTMLタグ

| タグ | 意味 | 例 |
|-----|------|-----|
| `<h1>` 〜 `<h6>` | 見出し（h1が一番大きい） | `<h1>大見出し</h1>` |
| `<p>` | 段落（文章のかたまり） | `<p>ここに文章</p>` |
| `<a>` | リンク（クリックで移動） | `<a href="https://...">リンク</a>` |
| `<img>` | 画像を表示 | `<img src="cat.jpg" alt="猫">` |
| `<ul>` + `<li>` | 箇条書きリスト | `<ul><li>項目1</li></ul>` |
| `<button>` | ボタン | `<button>押してね</button>` |
| `<input>` | 入力欄 | `<input type="text">` |
| `<div>` | グループ化（レイアウト用） | `<div class="box">...</div>` |

### 💻 はじめてのHTMLファイル

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>はじめてのWebページ</title>
</head>
<body>
  <h1>こんにちは！</h1>
  <p>これは私がはじめて作ったWebページです。</p>

  <h2>好きな食べもの</h2>
  <ul>
    <li>カレーライス</li>
    <li>ラーメン</li>
    <li>お寿司</li>
  </ul>

  <p>
    <a href="https://www.google.com">Googleへ行く</a>
  </p>
</body>
</html>
```

### 📖 コードの読み方

```
<!DOCTYPE html>        ← 「これはHTMLですよ」という宣言
<html lang="ja">       ← ページ全体の始まり（日本語のページ）
  <head>               ← ページの設定（ブラウザには表示されない）
    <title>...</title>  ← ブラウザのタブに表示される名前
  </head>
  <body>               ← ここに書いたものが画面に表示される
    ...
  </body>
</html>                ← ページの終わり
```

> **💡 やってみよう！**
>
> 1. パソコンのメモ帳（テキストエディタ）を開く
> 2. 上のコードをコピーして貼り付ける
> 3. ファイル名を `index.html` にして保存
> 4. 保存したファイルをダブルクリック → ブラウザで開く！

---

## 3️⃣ CSS ― ページをデザインしよう！

CSS（シーエスエス）は **Cascading Style Sheets** の略です。
HTMLで作った骨組みに、色・大きさ・配置などの**デザイン**を加えます。

### 📝 CSSの基本ルール

```css
セレクタ {
  プロパティ: 値;
}
```

- **セレクタ** → どの要素にデザインを適用するか（タグ名、クラス名など）
- **プロパティ** → 何を変えるか（色、大きさ、余白など）
- **値** → どう変えるか（赤、20px、中央揃えなど）

### 🎨 よく使うCSSプロパティ

| プロパティ | 意味 | 例 |
|-----------|------|-----|
| `color` | 文字の色 | `color: red;` |
| `background-color` | 背景色 | `background-color: #f0f8ff;` |
| `font-size` | 文字の大きさ | `font-size: 20px;` |
| `font-weight` | 文字の太さ | `font-weight: bold;` |
| `margin` | 外側の余白 | `margin: 10px;` |
| `padding` | 内側の余白 | `padding: 15px;` |
| `border` | 枠線 | `border: 2px solid blue;` |
| `border-radius` | 角を丸くする | `border-radius: 8px;` |
| `text-align` | 文字の揃え方 | `text-align: center;` |
| `width` / `height` | 幅 / 高さ | `width: 300px;` |

### 💻 CSSでデザインする3つの方法

**方法①：HTMLの中に書く（styleタグ）**

```html
<head>
  <style>
    h1 {
      color: #2E75B6;
      text-align: center;
    }
    p {
      font-size: 18px;
      line-height: 1.8;
    }
    .card {
      background-color: white;
      padding: 20px;
      border-radius: 12px;
      border: 1px solid #e0e0e0;
    }
  </style>
</head>
```

**方法②：別ファイルにする（おすすめ！）**

```html
<!-- index.html -->
<head>
  <link rel="stylesheet" href="style.css">
</head>
```

```css
/* style.css */
body {
  font-family: 'メイリオ', sans-serif;
  background-color: #f5f7fa;
  color: #333;
}

h1 {
  color: #7c3aed;
  border-bottom: 3px solid #7c3aed;
  padding-bottom: 8px;
}
```

### 🎯 クラスとIDの使い分け

```html
<!-- class（クラス）→ 同じデザインを複数の要素に使える -->
<div class="card">カード1</div>
<div class="card">カード2</div>

<!-- id（アイディー）→ 1つの要素だけに使う -->
<div id="header">ヘッダー</div>
```

```css
/* classは「.」（ドット）で指定 */
.card {
  background: white;
  padding: 16px;
  border-radius: 8px;
}

/* idは「#」（シャープ）で指定 */
#header {
  background: #7c3aed;
  color: white;
  padding: 20px;
}
```

---

## 4️⃣ JavaScript ― ページに動きをつけよう！

JavaScript（ジャバスクリプト）は、ブラウザの中で動くプログラミング言語です。
ボタンを押したら計算する、クリックで色が変わる、など **「動き」** を作ります。

### 📝 JavaScriptの基本

```javascript
// 変数（データを入れる箱）
let name = 'たろう';
let age = 12;
const PI = 3.14;  // constは変更できない

// 画面にメッセージを表示
alert('こんにちは！');

// ブラウザの開発ツールにログ表示
console.log('デバッグ用のメッセージ');
```

### 🔗 HTMLとJavaScriptの連携

JavaScriptの一番よく使う機能は、**HTMLの要素を操作すること**です。

```html
<h1 id="title">ここがタイトル</h1>
<button onclick="changeTitle()">タイトルを変える</button>

<script>
function changeTitle() {
  // idが"title"の要素を取得する
  let element = document.getElementById('title');
  // テキストを書き換える
  element.textContent = 'タイトルが変わった！';
  // 色も変える
  element.style.color = '#7c3aed';
}
</script>
```

### 🧮 実践：かんたん電卓

```html
<h2>かんたん電卓</h2>
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

<script>
function calculate() {
  let a = parseFloat(document.getElementById('num1').value);
  let b = parseFloat(document.getElementById('num2').value);
  let op = document.getElementById('operator').value;
  let result;

  if (op === '+') result = a + b;
  else if (op === '-') result = a - b;
  else if (op === '*') result = a * b;
  else if (op === '/') {
    if (b === 0) { alert('0では割れません！'); return; }
    result = a / b;
  }

  document.getElementById('answer').textContent = '答え：' + result;
}
</script>
```

### 📊 JavaScriptの基本文法まとめ

| 文法 | 書き方 | 説明 |
|-----|--------|------|
| 変数 | `let x = 10;` | データを保存する箱 |
| 定数 | `const PI = 3.14;` | 変更できない箱 |
| if文 | `if (条件) { 処理 }` | 条件分岐 |
| for文 | `for (let i=0; i<5; i++) { }` | 繰り返し処理 |
| 関数 | `function 名前() { }` | 処理をまとめる |
| 要素取得 | `document.getElementById('id')` | HTMLの要素を取得 |
| テキスト変更 | `.textContent = '新しい文字'` | 要素の文字を変更 |
| スタイル変更 | `.style.color = 'red'` | CSSを変更 |

---

## 5️⃣ PHP ― サーバー側の処理を書こう！

PHP（ピーエイチピー）は、**サーバー** で動くプログラミング言語です。
ブラウザでは見えない「裏側」で、データの保存やページの組み立てを行います。

### ⚡ JavaScript と PHP の違い

```
JavaScript → ブラウザ（見る人のパソコン）で動く
   ボタンを押す → その場で計算 → 結果を表示

PHP → サーバー（インターネットの向こうのコンピュータ）で動く
   フォームを送信 → サーバーで処理 → 結果のHTMLを返す
```

| | JavaScript | PHP |
|--|-----------|-----|
| 動く場所 | ブラウザ | サーバー |
| 得意なこと | 画面の操作・アニメーション | データの保存・ログイン処理 |
| ファイル拡張子 | `.js` | `.php` |
| 変数の書き方 | `let name = '太郎';` | `$name = '太郎';` |

### 📝 PHPの基本文法

```php
<?php
// 変数（$マークを必ずつける！）
$name = 'たろう';
$age = 12;

// 画面に文字を表示する
echo '<h1>こんにちは、' . $name . 'さん！</h1>';
echo "<p>年齢：{$age}歳</p>";

// if文
if ($age >= 13) {
  echo '<p>中学生以上です</p>';
} else {
  echo '<p>小学生以下です</p>';
}

// 配列とループ
$fruits = ['りんご', 'みかん', 'バナナ'];
echo '<ul>';
foreach ($fruits as $fruit) {
  echo '<li>' . $fruit . '</li>';
}
echo '</ul>';

// 関数
function greet($name) {
  return 'こんにちは、' . $name . '！';
}
echo greet('はなこ');
?>
```

### 📬 フォームデータを受け取る

PHPの一番よくある使い方は、フォームで送信されたデータを受け取ることです。

**HTMLのフォーム（form.html）：**

```html
<form action="receive.php" method="post">
  <label>名前：<input type="text" name="name"></label>
  <label>メッセージ：<textarea name="message"></textarea></label>
  <button type="submit">送信する</button>
</form>
```

**PHPの受け取り処理（receive.php）：**

```php
<?php
// フォームのデータを安全に受け取る
$name = htmlspecialchars($_POST['name'], ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($_POST['message'], ENT_QUOTES, 'UTF-8');

// 空チェック
if (empty($name) || empty($message)) {
  echo '<p>名前とメッセージを入力してください</p>';
  exit;
}

// ファイルに保存する
$date = date('Y-m-d H:i:s');
$line = $date . ' / ' . $name . ' / ' . $message . "\n";
file_put_contents('messages.txt', $line, FILE_APPEND);

echo '<h2>送信完了！</h2>';
echo '<p>' . $name . 'さんのメッセージを保存しました。</p>';
?>
```

> **⚠️ セキュリティのポイント**
>
> `htmlspecialchars()` を使って、ユーザーの入力を安全にしています。
> これをしないと、悪意のあるコード（スクリプト）を埋め込まれる危険があります。
> フォームのデータは必ずこの関数を通しましょう！

### 💡 PHPを動かすには？

PHPはサーバーが必要です。以下のどれかを使いましょう：

| 方法 | 説明 | おすすめ度 |
|-----|------|----------|
| XAMPP | Windows/Macで使える無料のローカルサーバー | ★★★ |
| MAMP | Mac向けのローカルサーバー | ★★ |
| paiza.io | ブラウザ上でPHPを試せる無料サイト | ★★★（手軽！） |

---

## 6️⃣ 4つの技術を組み合わせてみよう！

実際のWebサイトでは、HTML・CSS・JavaScript・PHPを組み合わせて使います。

### 🌟 例：メッセージボードアプリ

```
┌──────── ブラウザ ────────┐     ┌──── サーバー ────┐
│                         │     │                 │
│  HTML → ページの構造      │     │  PHP            │
│  CSS  → デザイン          │ ──→ │  ・データを受け取る │
│  JS   → 入力チェック      │     │  ・ファイルに保存   │
│         送信処理          │ ←── │  ・結果を返す      │
│                         │     │                 │
└─────────────────────────┘     └─────────────────┘
```

| 役割 | 担当する技術 | 具体的にやること |
|-----|------------|--------------|
| ページの構造 | HTML | フォーム、メッセージ一覧の枠を作る |
| デザイン | CSS | 色・レイアウト・ボタンの見た目を整える |
| 入力チェック | JavaScript | 空欄チェック、文字数制限をリアルタイムで確認 |
| データ保存 | PHP | 送信されたメッセージをサーバーに保存 |
| データ表示 | PHP + HTML | 保存されたメッセージを読み込んで一覧表示 |

---

## 7️⃣ チャレンジ課題！ 🚀

### 🎯 課題1：自己紹介ページ

HTMLとCSSだけで自己紹介ページを作ろう！

- 名前、趣味、好きな教科を書く
- 背景色や文字色をCSSでデザインする
- 写真やイラスト（`<img>`タグ）も入れてみよう

### 🎯 課題2：クイズアプリ

HTML + JavaScriptでクイズアプリを作ろう！

- 問題文をHTMLで表示
- ボタンをクリックしたら正解/不正解を判定（JavaScript）
- 正解数をカウントして最後に結果を表示

> **ヒント：** `let score = 0;` で正解数を管理 → if文で判定 → `score++` でカウントアップ

### 🎯 課題3：お問い合わせフォーム

HTML + CSS + PHPでお問い合わせフォームを作ろう！

- HTMLでフォーム（名前・メール・メッセージ）を作る
- CSSでフォームをきれいにデザイン
- PHPでデータを受け取ってファイルに保存

> **ヒント：** `<form action="save.php" method="post">` → PHPで `$_POST` で受け取る

---

## 📚 まとめ

| 技術 | 正式名称 | 役割 | ファイル拡張子 |
|-----|---------|------|-------------|
| HTML | HyperText Markup Language | ページの構造を作る | `.html` |
| CSS | Cascading Style Sheets | 見た目をデザインする | `.css` |
| JavaScript | JavaScript | ブラウザで動きをつける | `.js` |
| PHP | PHP: Hypertext Preprocessor | サーバーで処理する | `.php` |

### 🗺️ 学習ロードマップ

```
STEP 1: HTML（ページの骨組みを作れる）
  ↓
STEP 2: CSS（見た目をきれいにできる）
  ↓
STEP 3: JavaScript（動きのあるページが作れる）
  ↓
STEP 4: PHP（データの保存・ログイン機能が作れる）
  ↓
GOAL: 本格的なWebアプリケーションが作れる！
```

---

> 🎉 **まとめ**
>
> Webページは HTML（構造）+ CSS（デザイン）+ JavaScript（動き）+ PHP（サーバー処理）の
> 4つの技術が協力して動いています。
>
> まずはHTMLとCSSから始めて、少しずつJavaScriptとPHPを加えていきましょう。
> 1つずつ覚えていけば、自分だけのWebアプリケーションが作れるようになります 💪

---

*📝 はんなりdev 制作*
