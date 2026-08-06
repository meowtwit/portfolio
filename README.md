# 早雲楓人 Portfolio

## 開発とビルド

```sh
npm run dev
npm run typecheck
SITE_URL=https://your-domain.example npm run build:site
```

`npm run build` は TypeScript と Vite、`npm run build:site` はそれに続けて `scripts/prerender.mjs` を実行します。後者はトップ、作品一覧、作品詳細12件、人物、連絡、404の実HTMLと `sitemap.xml` / `robots.txt` を `dist/` に生成します。本番サイト生成では `SITE_URL` を必ず公開originへ設定してください。未指定時のcanonicalは `https://portfolio.example.com` です。

GitHub Pagesのサブパスへ出す場合は、公開URL全体を `SITE_URL`、リポジトリ部分を `GHPAGES_BASE` に渡します。例: `SITE_URL=https://user.github.io/repository GHPAGES_BASE=/repository/ npm run build:site`。

## 作品写真の差し込み

1. 写真は `public/images/works/<slug>/cover.webp` に置きます。例: `public/images/works/tsukuyomi/cover.webp`。
2. `src/data/works.ts` の該当作品へ `coverImage: '/images/works/<slug>/cover.webp'` を追加します。
3. 推奨サイズは 1920×1080px（16:9）、最低1600×900pxです。WebPまたはAVIFを推奨し、1枚あたり500KB前後を目安に圧縮します。
4. 作品名や文字を画像内へ焼き込まず、重要な被写体は中央寄りに置いてください。詳細ページと一覧→詳細遷移の両方で同じ画像を使います。

一覧プレビュー用動画の予約枠は `Work.previewVideo?: string` です。写真確定後に使う場合は `public/videos/works/<slug>/preview.mp4` の命名を推奨します（現時点では描画しない空スロットです）。

OG画像は現在 `public/og-frame.svg` が枠だけの仮画像です。写真確定後、1200×630pxの画像へ置き換え、`scripts/prerender.mjs` の `ogImage` を最終ファイル名へ変更してください。
