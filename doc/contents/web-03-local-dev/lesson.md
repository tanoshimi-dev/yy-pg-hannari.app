# 💻🏠 ローカルPCでWeb開発環境を作ろう！

> 〜 MAMP / XAMPP を使って自分のパソコンでWebサイトを動かす 〜

---

## 📌 この教材でできるようになること

- ✅ ローカル開発環境とは何かを理解する
- ✅ MAMP（Mac）/ XAMPP（Windows）をインストールする
- ✅ Apache（Webサーバー）と MySQL（データベース）を起動する
- ✅ PHPファイルをローカルサーバーで動かす
- ✅ phpMyAdminでデータベースを操作する
- ✅ テキストエディタ（VS Code）をセットアップする

---

## 1️⃣ ローカル開発環境ってなに？

### 🏠 「ローカル」＝ 自分のパソコンの中

普通のWebサイトはインターネット上のサーバーで動いています。
でも開発中は、**自分のパソコンの中に小さなサーバーを作って**テストします。
これが「ローカル開発環境」です。

```
本番環境（インターネット上）              ローカル環境（自分のPC）
┌───────────────────────┐           ┌───────────────────────┐
│ レンタルサーバー         │           │ 自分のパソコン          │
│  ・Apache（Webサーバー） │           │  ・MAMP / XAMPP        │
│  ・PHP                 │           │  ・Apache + PHP        │
│  ・MySQL               │           │  ・MySQL               │
│  → 世界中からアクセス可能 │           │  → 自分だけがアクセス    │
└───────────────────────┘           └───────────────────────┘
```

### 💡 なぜローカルで開発するの？

| 理由 | 説明 |
|-----|------|
| 🚀 速い | ファイルをアップロードせずに即テストできる |
| 🔒 安全 | ミスしても自分のPC内だけ。世界には影響なし |
| 💰 無料 | レンタルサーバーの契約なしで始められる |
| 🔄 やり直しが簡単 | いくらでも壊して作り直せる |

---

## 2️⃣ MAMP / XAMPP を選ぼう！

### 📊 ローカルサーバーツールの比較

| ツール | 対応OS | 特徴 | おすすめ度 |
|-------|-------|------|----------|
| MAMP | Mac / Windows | シンプルで使いやすい。初心者向け | ★★★ |
| XAMPP | Windows / Mac / Linux | 多機能。利用者が多く情報も多い | ★★★ |
| MAMP PRO | Mac / Windows | MAMPの有料版。バーチャルホスト対応 | ★★ |

> **💡 どっちを選べばいい？**
> - Mac → **MAMP** がおすすめ（インストールが簡単！）
> - Windows → **XAMPP** がおすすめ（利用者が多い！）
> - どちらでもできることは同じです

### 🧰 MAMP / XAMPP に入っているもの

```
┌─── MAMP / XAMPP ─────────────────────────┐
│                                          │
│  🌐 Apache（アパッチ）                     │
│    → Webサーバー。ブラウザからのリクエストを   │
│      受け付けて、HTMLやPHPを返す             │
│                                          │
│  🐘 PHP（ピーエイチピー）                    │
│    → サーバー側のプログラミング言語            │
│    → Apacheと連携して動く                   │
│                                          │
│  🗄️ MySQL（マイエスキューエル）              │
│    → データベース。データを保存・検索する      │
│                                          │
│  📊 phpMyAdmin（ピーエイチピーマイアドミン）   │
│    → MySQLをブラウザで操作するツール          │
│                                          │
└──────────────────────────────────────────┘
```

---

## 3️⃣ MAMP をインストールしよう！（Mac編）

### 📥 ダウンロード & インストール

| ステップ | やること |
|---------|--------|
| STEP 1 | https://www.mamp.info/en/downloads/ にアクセス |
| STEP 2 | 「MAMP & MAMP PRO」の「Free Download」をクリック |
| STEP 3 | ダウンロードしたファイル（.pkg）をダブルクリック |
| STEP 4 | 画面の指示に従ってインストール（「続ける」を押していくだけ） |
| STEP 5 | 「アプリケーション」フォルダに「MAMP」が入ったら完了！ |

### ▶ MAMPを起動する

| ステップ | やること |
|---------|--------|
| STEP 1 | 「アプリケーション」→「MAMP」→「MAMP」を開く（MAMP PROではない方！） |
| STEP 2 | 「Start」ボタンをクリック |
| STEP 3 | Apache と MySQL の横に緑の丸が表示されたらOK！ |
| STEP 4 | ブラウザが自動で開いて、MAMPのスタートページが表示される |

### 📁 ファイルの置き場所

MAMPでは、Webページのファイルを以下のフォルダに置きます：

```
Mac:    /Applications/MAMP/htdocs/
```

このフォルダに置いたファイルは `http://localhost:8888/` でアクセスできます。

### ✅ 動作確認

1. `/Applications/MAMP/htdocs/` に `test.php` を作成
2. 以下の内容を書いて保存：

```php
<?php
echo '<h1>MAMPが動いています！</h1>';
echo '<p>現在時刻：' . date('Y年m月d日 H:i:s') . '</p>';
echo '<p>PHPバージョン：' . phpversion() . '</p>';
?>
```

3. ブラウザで `http://localhost:8888/test.php` を開く
4. 画面に「MAMPが動いています！」と表示されたら成功！

---

## 4️⃣ XAMPP をインストールしよう！（Windows編）

### 📥 ダウンロード & インストール

| ステップ | やること |
|---------|--------|
| STEP 1 | https://www.apachefriends.org/ にアクセス |
| STEP 2 | 「XAMPP for Windows」をダウンロード |
| STEP 3 | ダウンロードしたファイル（.exe）をダブルクリック |
| STEP 4 | コンポーネント選択では Apache, MySQL, PHP, phpMyAdmin にチェック |
| STEP 5 | インストール先はデフォルトのまま（C:\xampp）でOK |
| STEP 6 | インストール完了！ |

> **⚠️ Windowsの注意点**
> - ウイルス対策ソフトの警告が出たら「許可」する
> - 「Windowsファイアウォール」の警告も「アクセスを許可する」
> - ユーザーアカウント制御（UAC）の警告も「はい」

### ▶ XAMPPを起動する

| ステップ | やること |
|---------|--------|
| STEP 1 | スタートメニューから「XAMPP Control Panel」を開く |
| STEP 2 | Apache の横の「Start」をクリック |
| STEP 3 | MySQL の横の「Start」をクリック |
| STEP 4 | 両方が緑色になったらOK！ |

### 📁 ファイルの置き場所

```
Windows:  C:\xampp\htdocs\
```

このフォルダに置いたファイルは `http://localhost/` でアクセスできます。

### ✅ 動作確認

1. `C:\xampp\htdocs\` に `test.php` を作成
2. 以下の内容を書いて保存：

```php
<?php
echo '<h1>XAMPPが動いています！</h1>';
echo '<p>現在時刻：' . date('Y年m月d日 H:i:s') . '</p>';
echo '<p>PHPバージョン：' . phpversion() . '</p>';
?>
```

3. ブラウザで `http://localhost/test.php` を開く
4. 画面に「XAMPPが動いています！」と表示されたら成功！

---

## 5️⃣ テキストエディタを準備しよう！

プログラムを書くには「テキストエディタ」が必要です。
メモ帳でも書けますが、専用エディタを使うととても便利です。

### 🏆 おすすめ：Visual Studio Code（VS Code）

| 特徴 | 説明 |
|-----|------|
| 💰 無料 | Microsoftが無料で提供 |
| 🎨 色分け表示 | コードが色分けされて読みやすい |
| 📝 自動補完 | タグや関数を途中まで打つと候補が出る |
| 🔌 拡張機能 | プラグインで機能を追加できる |

### 📥 VS Codeのインストール

| ステップ | やること |
|---------|--------|
| STEP 1 | https://code.visualstudio.com/ にアクセス |
| STEP 2 | 「Download」をクリック（自分のOSが自動判定される） |
| STEP 3 | ダウンロードしたファイルでインストール |
| STEP 4 | 起動してみよう！ |

### 🔌 入れておきたい拡張機能

VS Codeの左側にある四角いアイコン（拡張機能）から検索してインストール：

| 拡張機能 | 説明 |
|---------|------|
| Japanese Language Pack | VS Codeを日本語化する |
| PHP Intelephense | PHPの自動補完とエラー表示 |
| Live Server | HTMLファイルを保存すると自動でブラウザが更新される |
| Prettier | コードを自動で整形してくれる |

---

## 6️⃣ phpMyAdmin でデータベースを使ってみよう！

phpMyAdminは、MySQLデータベースをブラウザで操作できるツールです。
MAMP / XAMPP に最初から入っています。

### 🌐 phpMyAdminの開き方

| ツール | URL |
|-------|-----|
| MAMP | http://localhost:8888/phpMyAdmin/ |
| XAMPP | http://localhost/phpmyadmin/ |

### 📊 データベースを作ってみよう

| ステップ | やること |
|---------|--------|
| STEP 1 | phpMyAdminを開く |
| STEP 2 | 左メニューの「新規作成」をクリック |
| STEP 3 | データベース名を入力（例：`my_first_db`） |
| STEP 4 | 照合順序は `utf8mb4_general_ci` を選ぶ |
| STEP 5 | 「作成」をクリック |

### 📋 テーブルを作ってみよう

データベースの中にテーブル（表）を作ります。

| ステップ | やること |
|---------|--------|
| STEP 1 | 作ったデータベース名をクリック |
| STEP 2 | テーブル名に `students` と入力、カラム数を `4` にする |
| STEP 3 | 「実行」をクリック |
| STEP 4 | カラムを以下のように設定 |

| カラム名 | 型 | 長さ | その他 |
|---------|-----|------|--------|
| id | INT | | A_I（自動連番）にチェック |
| name | VARCHAR | 100 | |
| age | INT | | |
| score | INT | | |

### 💻 PHPからデータベースに接続する

```php
<?php
// データベースに接続する
$host = 'localhost';
$dbname = 'my_first_db';
$username = 'root';       // MAMPもXAMPPもデフォルトは root
$password = 'root';       // MAMP: root / XAMPP: 空欄('')

try {
  $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
  echo '<p>データベースに接続成功！</p>';
} catch (PDOException $e) {
  echo '<p>接続エラー：' . $e->getMessage() . '</p>';
  exit;
}

// データを取得する
$stmt = $pdo->query('SELECT * FROM students');
$students = $stmt->fetchAll(PDO::FETCH_ASSOC);

// 表示する
echo '<h2>生徒一覧</h2>';
echo '<table border="1" cellpadding="8">';
echo '<tr><th>ID</th><th>名前</th><th>年齢</th><th>点数</th></tr>';
foreach ($students as $s) {
  echo '<tr>';
  echo '<td>' . $s['id'] . '</td>';
  echo '<td>' . htmlspecialchars($s['name']) . '</td>';
  echo '<td>' . $s['age'] . '</td>';
  echo '<td>' . $s['score'] . '</td>';
  echo '</tr>';
}
echo '</table>';
?>
```

---

## 7️⃣ 実践：ローカルで動くWebアプリを作ろう！

MAMP / XAMPP の `htdocs` フォルダに以下の構成でファイルを作りましょう。

### 📁 ファイル構成

```
htdocs/
  └── my-app/
      ├── index.html      ← トップページ
      ├── style.css        ← デザイン
      ├── script.js        ← JavaScriptの処理
      └── save.php         ← PHPのサーバー処理
```

### 📝 ひとこと日記アプリの例

**index.html:**
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>ひとこと日記</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>ひとこと日記</h1>
  <form action="save.php" method="post">
    <input type="text" name="diary" placeholder="今日のひとことを書こう" required>
    <button type="submit">保存する</button>
  </form>
</body>
</html>
```

**style.css:**
```css
body {
  font-family: 'メイリオ', sans-serif;
  max-width: 500px;
  margin: 40px auto;
  background: #f5f7fa;
}
h1 { color: #7c3aed; }
input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 10px;
}
button {
  background: #7c3aed;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}
```

**save.php:**
```php
<?php
$diary = htmlspecialchars($_POST['diary'], ENT_QUOTES, 'UTF-8');
if (empty($diary)) {
  echo '<p>内容を入力してください</p>';
  exit;
}

$date = date('Y/m/d H:i');
$line = $date . ' | ' . $diary . "\n";
file_put_contents('diary.txt', $line, FILE_APPEND);

echo '<h2>保存しました！</h2>';
echo '<p>' . $date . '：' . $diary . '</p>';
echo '<p><a href="index.html">戻る</a></p>';
?>
```

ブラウザで `http://localhost:8888/my-app/`（MAMP）または `http://localhost/my-app/`（XAMPP）を開いて試そう！

---

## 8️⃣ トラブルシューティング

| 問題 | 原因 | 解決方法 |
|-----|------|---------|
| Apache が起動しない | ポートが他のアプリに使われている | MAMP: 設定でポートを変更 / XAMPP: Skypeなどを終了 |
| ブラウザに「アクセスできません」 | サーバーが起動していない | MAMP/XAMPPでApacheが緑色か確認 |
| PHPが動かず コードがそのまま表示される | `.html` で保存している | ファイル拡張子を `.php` にする |
| 文字化けする | 文字コードの設定が違う | ファイルをUTF-8で保存する |
| phpMyAdmin が開けない | MySQL が起動していない | MySQLもStartする |

---

## 📚 まとめ

| やったこと | 内容 |
|-----------|------|
| ローカル環境の理解 | 自分のPC内でWebサーバーを動かす仕組み |
| MAMP / XAMPP導入 | Apache + PHP + MySQL をワンパッケージでインストール |
| VS Code | コードを書くためのエディタをセットアップ |
| PHPの動作確認 | ローカルサーバーでPHPファイルを実行 |
| phpMyAdmin | ブラウザでデータベースを操作 |
| Webアプリ作成 | HTML + CSS + PHP でひとこと日記アプリ |

---

> 🎉 **おつかれさま！**
>
> ローカル開発環境ができれば、いつでもWebアプリを作ってテストできます。
> インターネットに公開する前に、まずはローカルでしっかり動くものを作りましょう！
> 次のステップは、完成したWebサイトをレンタルサーバーに公開することです 💪

---

*📝 はんなりdev 制作*
