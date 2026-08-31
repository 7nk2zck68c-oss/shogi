# 将棋 — Scratchプロジェクト

Scratchで作成された将棋ゲームを、GitHubで管理・閲覧しやすい形に展開したリポジトリです。元のScratchファイルもそのまま収録しています。

## GitHub Pagesで遊べるようにする

1. GitHubで新しいリポジトリを作成し、このフォルダーの**中身をすべて**アップロードします。
2. リポジトリの `Settings` → `Pages` を開きます。
3. `Build and deployment` で `Deploy from a branch` を選びます。
4. ブランチを `main`、フォルダーを `/(root)` にして保存します。
5. 数分後、Pages欄に表示されるURLを開きます。

再生画面は [TurboWarp](https://turbowarp.org/) を利用するため、インターネット接続が必要です。GitHub Pagesは `.sb3` ファイルをCORS対応で配信するため、TurboWarpから直接読み込めます。

## ファイル構成

| パス | 内容 |
| --- | --- |
| `index.html` | GitHub Pages用のゲーム画面 |
| `project.sb3` | Scratchで直接開ける元プロジェクト |
| `scratch-src/project.json` | ブロック、変数、リストなどのプロジェクトデータ |
| `scratch-src/*.svg` | 駒や盤面などの画像素材 |
| `scratch-src/*.wav` | 効果音素材 |

`.sb3` はZIP形式のファイルです。`scratch-src` にはその内容を展開してあり、GitHub上で変更履歴を確認できます。

## プロジェクト概要

- ターゲット: 7（ステージ、マス、先手駒、後手駒、勝敗、持駒、二歩）
- ブロック: 2,205
- 画像: SVG 30点
- 音声: WAV 2点
- Scratch拡張機能: なし

## Scratchで編集する

`project.sb3` を [Scratch](https://scratch.mit.edu/projects/editor/) またはTurboWarpで開きます。編集後は同じ名前で保存し、GitHub上の `project.sb3` を差し替えてください。

GitHub上でも内部データの変更を比較したい場合は、新しい `.sb3` のコピーを `.zip` に変更して展開し、`scratch-src` の内容も差し替えます。Scratchが読み込むファイルは `project.sb3` なので、展開済みソースだけを編集してもゲームには反映されません。

## ライセンスについて

この変換作業は、元作品の著作権や利用条件を変更しません。公開リポジトリにする前に、元作品・素材の公開条件とクレジット表記を確認してください。
