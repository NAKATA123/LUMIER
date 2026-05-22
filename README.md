# Bridal Salon LUMIER

会社ホームページ用の静的サイトです。RailsやPostgreSQLは使わず、HTML/CSS/JavaScriptと画像だけで配信できます。

##URL
https://rina-11vp.onrender.com/

## ページ

- `/` トップページ
- `/about/` ルミエールのご紹介
- `/price/` 料金のご案内
- `/privacy/` 個人情報の取り扱いについて

## 内容の変更

- 文章やリンク: 各ページの `index.html`
- デザイン: `assets/styles.css`
- スマホメニューの動き: `assets/site.js`
- 画像: `assets/images/`


## ローカル確認

HTMLファイルをブラウザで開くか、必要なら簡易サーバーで確認できます。

```sh
python3 -m http.server 8000
```
