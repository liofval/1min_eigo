# Daily English Reading

Remotion で縦型の英語音読動画を作り、GitHub Pages で公開するためのプロジェクトです。英文が画面内にあるうちに声に出して読むことで、日常会話やニュースを英語で説明する瞬発力を練習します。

公開ページ: https://liofval.github.io/1min_eigo/

## What This Includes

- 1080 x 1920 の縦型 Remotion 動画
- 30fps / 70秒
- A2-B1 程度のやさしい英語本文
- 投稿キャプション案、日本語訳、出典メモ
- GitHub Pages 用の静的サイト
- PWA 用 `manifest.webmanifest` と Service Worker
- カレンダー形式の動画アーカイブ

## Setup

```bash
npm install
```

## Local Preview

Remotion Studio:

```bash
npm run generate
npm run studio
```

GitHub Pages 用ホームページ:

```bash
npm run serve:homepage
```

ローカル確認:

```text
http://127.0.0.1:8777/
```

## Daily Render

```bash
npm run daily
```

このコマンドは次を実行します。

1. `scripts/generate-reading.mjs` で当日分の音読本文、キャプション案、日本語訳を生成
2. `scripts/render-latest.mjs` で Remotion 動画をレンダリング
3. 実行ごとの成果物を `out/` 配下に保存

生成される主なファイル:

```text
data/today-reading.json
data/today-caption.txt
data/today-translation-ja.txt
data/today-captions-ja.txt
data/latest-run.json
```

`data/` と `out/` はローカル生成物です。公開用に残す動画は `docs/assets/videos/YYYY-MM-DD/` にコピーして管理します。

## Output Structure

毎回の成果物は `out/` にまとまります。

```text
out/2026-10-05-flood-maps-for-more-places/
  daily-english-reading.mp4
  caption.txt
  translation-ja.txt
  captions-ja.txt
  reading.json
  sources.md
```

公開サイト用の保存先:

```text
docs/assets/videos/2026-10-05/
  daily-english-reading.mp4
  video-poster.png
  caption.txt
  translation-ja.txt
  captions-ja.txt
  sources.md

docs/videos/2026-10-05.html
```

トップページで表示する最新動画は次のファイルです。

```text
docs/assets/daily-english-reading.mp4
docs/assets/video-poster.png
docs/assets/caption.txt
docs/assets/translation-ja.txt
docs/assets/sources.md
```

## Published Archive

現在は 2026-10-01 から 2026-10-05 までの5日分を保存済みです。

| Date | Title |
| --- | --- |
| 2026-10-01 | Wallpaper That Makes Power |
| 2026-10-02 | Roman Sees First Light |
| 2026-10-03 | PRIMA Opens A New Window |
| 2026-10-04 | Learning In More Languages |
| 2026-10-05 | Flood Maps For More Places |

アーカイブページ:

```text
https://liofval.github.io/1min_eigo/archive.html
```

## Publishing Workflow

1. 音読本文、キャプション案、日本語訳、出典を作る
2. Remotion で `daily-english-reading.mp4` をレンダリングする
3. `ffmpeg` で冒頭フレームの `video-poster.png` を作る
4. 日別アセットを `docs/assets/videos/YYYY-MM-DD/` に保存する
5. 日別詳細ページを `docs/videos/YYYY-MM-DD.html` に追加する
6. `docs/archive.html` のカレンダーとモーダルに日付を追加する
7. 最新分を `docs/assets/` 直下へコピーする
8. `docs/index.html` の最新動画、キャプション、日本語訳、出典を更新する
9. `docs/sw.js` のキャッシュ名と `APP_SHELL` を更新する
10. GitHub Pages に反映するため `main` に push する

## Checks

最低限の確認:

```bash
node --check docs/app.js
node --check docs/sw.js
```

動画仕様の確認:

```bash
ffprobe -v error \
  -select_streams v:0 \
  -show_entries stream=width,height,r_frame_rate \
  -show_entries format=duration,size \
  -of default=noprint_wrappers=1 \
  docs/assets/videos/2026-10-05/daily-english-reading.mp4
```

公開確認:

```bash
curl -L https://liofval.github.io/1min_eigo/
curl -L https://liofval.github.io/1min_eigo/archive.html
```

## Docs Directory

`docs/` は GitHub Pages の公開ルートです。詳しい構成は [docs/README.md](docs/README.md) を参照してください。

GitHub Pages の設定:

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/docs`

問い合わせ先は `docs/index.html` の `hello@example.com` を実際の連絡先に差し替えてください。
