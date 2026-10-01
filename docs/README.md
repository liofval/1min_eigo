# Docs Site

このディレクトリは GitHub Pages で公開する静的サイトのルートです。

公開ページ: https://liofval.github.io/1min_eigo/

## Main Files

```text
docs/index.html              # トップページ、最新動画、キャプション、日本語訳、出典
docs/archive.html            # カレンダー形式の動画一覧
docs/videos/YYYY-MM-DD.html  # 日別の動画詳細ページ
docs/styles.css              # サイト全体のスタイル
docs/app.js                  # コピー、PWA案内、アーカイブモーダル
docs/sw.js                   # PWA用 Service Worker
docs/manifest.webmanifest    # PWA manifest
```

## Assets

最新動画:

```text
docs/assets/daily-english-reading.mp4
docs/assets/video-poster.png
docs/assets/caption.txt
docs/assets/translation-ja.txt
docs/assets/captions-ja.txt
docs/assets/sources.md
```

日別アーカイブ:

```text
docs/assets/videos/YYYY-MM-DD/
  daily-english-reading.mp4
  video-poster.png
  caption.txt
  translation-ja.txt
  captions-ja.txt
  sources.md
```

## Adding A New Day

1. `docs/assets/videos/YYYY-MM-DD/` を作り、動画、ポスター、キャプション、日本語訳、出典を置く
2. `docs/videos/YYYY-MM-DD.html` を追加する
3. `docs/archive.html` のカレンダーに `data-open-day="YYYY-MM-DD"` のボタンを追加する
4. `docs/archive.html` のモーダル内に `data-day-panel="YYYY-MM-DD"` のパネルを追加する
5. 最新分として `docs/assets/` 直下の動画、ポスター、テキストを差し替える
6. `docs/index.html` の動画URL、ポスターURL、キャプション、日本語訳、出典を更新する
7. `docs/sw.js` の `CACHE_NAME` を更新し、`APP_SHELL` に新しい詳細ページとポスターを追加する

## Local Preview

```bash
npm run serve:homepage
```

```text
http://127.0.0.1:8777/
```

## Notes

- `.nojekyll` は GitHub Pages でそのまま静的ファイルを配信するために置いています。
- 動画ファイルは大きいので、日別アーカイブに入れるものだけを commit します。
- PWA のキャッシュ更新を確実にするため、新しい日を追加したら `docs/sw.js` の `CACHE_NAME` を必ず変更します。
