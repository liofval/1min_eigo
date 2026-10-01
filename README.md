# Daily English Reading Video

Remotion で縦型の音読練習動画を作るプロジェクトです。毎日 `npm run daily` を実行すると、その日の英語日常会話テキストを生成し、文章が縦にゆっくり流れる動画と日本語キャプション案を `out/` 配下の実行ごとのディレクトリに出力します。

## Setup

```bash
npm install
```

## Preview

```bash
npm run generate
npm run studio
```

## Render

```bash
npm run daily
```

生成される本文は `data/today-reading.json`、直近の日本語キャプション案は `data/today-captions-ja.txt` です。Claude Code で毎日走らせる場合も、このコマンドだけで本文生成から動画レンダリングまで完了します。

```bash
npm run daily
```

毎回の成果物は次のようなディレクトリにまとまります。

```text
out/2026-10-01-124355-a-quiet-lunch-with-a-coworker/
  daily-english-reading.mp4
  captions-ja.txt
  reading.json
```

動画仕様:

- 1080 x 1920 の縦型
- 30fps / 70 秒
- A2-B1 程度の日常会話を含む短いストーリー
- 画面内にある間に読ませるため、本文が下から上へゆっくり流れる構成

## Homepage / PWA

GitHub Pages で公開できる静的ホームページを `docs/` に用意しています。

```bash
npm run serve:homepage
```

ローカル確認:

```text
http://127.0.0.1:8777/
```

含まれるもの:

- 今日の縦型音読動画
- 動画内の表示の意味の説明
- 日本語キャプション案
- ニュース出典リンク
- 問い合わせ先
- PWA用 `manifest.webmanifest` と Service Worker

GitHub Pages で公開する場合は、リポジトリの Settings → Pages で Source を `Deploy from a branch`、Branch を `main`、Folder を `/docs` に設定してください。

問い合わせ先は `docs/index.html` の `hello@example.com` を実際の連絡先に差し替えてください。
