# 将棋 — 合法手一覧＋ChatGPT対戦版

Scratchで作成された二人対戦将棋を、人間（先手）対コンピューター（後手）へ変更したプロジェクトです。コンピューターはScratch内で指せる手の一覧を毎回生成し、その一覧と局面をOpenAIへ送り、返された手が候補内にあることを再検査して盤上へ反映します。

## AIの仕組み

1. 後手の全81マスについて駒の移動先を収集し、11〜99以外の盤外座標を除外します。
2. 後手の持ち駒ごとに、空きマス・二歩・行き所のない駒を考慮した打ち先を収集します。
3. 盤上配置、双方の持ち駒、全候補手を中継Workerへ送ります。
4. Workerが先手全駒の利きを計算し、現在狙われている後手駒と、各候補後の危険・守り・交換・王手を分析します。
5. OpenAIの構造化出力で、脅威への対策と先手の最善応手を比較して候補から1手を選びます。
6. Scratch側、拡張側、Worker側で盤内座標と候補内の手かを検査し、合格した場合だけ着手します。
7. 未設定、時間切れ、APIエラー、候補外応答の場合は、全候補を走査して取れる駒を優先する内蔵AIへ自動的に切り替えます。

手の符号は、盤上移動が`M:元マス:先マス`、駒打ちが`D:持駒番号:先マス`です。コンピューター側の成りは元プログラムの処理に合わせて自動です。

## 最初に遊ぶ

`project.sb3`をTurboWarpで開き、カスタム拡張の読み込み確認を許可すれば、AI接続なしでも内蔵評価で対局できます。OpenAIを使う場合は、先に`backend`を配置してGitHub Pagesの画面へWorker URLを設定します。

## OpenAI中継Workerを配置する

APIキーをブラウザやScratchに入れると第三者から閲覧できるため、付属のCloudflare Workerで秘密として保持します。

1. `backend/wrangler.toml.example`を`backend/wrangler.toml`へコピーします。
2. `backend`フォルダーで`npx wrangler secret put OPENAI_API_KEY`を実行します。
3. `npx wrangler deploy`を実行します。
4. 発行されたURLの末尾に`/move`を付けます。
5. GitHub Pagesの「ChatGPT接続設定」にURLを入力し、「保存して再読込」を押します。
6. 画面に `ChatGPT接続OK` と `2.0-threat-aware` が出ることを確認します。別の表示ならChatGPTではなく内蔵AIで動いています。

詳しくは[`backend/README.md`](backend/README.md)を参照してください。OpenAI APIの利用料金は自分のAPIアカウントに発生します。公開時はCloudflare側でRate Limitingを設定してください。

## GitHub Pagesで公開する

1. GitHubで新しいリポジトリを作成し、このフォルダーの中身をすべてアップロードします。
2. `Settings` → `Pages`を開きます。
3. `Build and deployment`で`Deploy from a branch`を選びます。
4. ブランチを`main`、フォルダーを`/(root)`にして保存します。
5. 数分後、Pages欄に表示されるURLを開きます。

ゲーム画面はTurboWarpを埋め込みます。GitHub Pagesは`.sb3`とカスタム拡張を配信し、TurboWarpがURLから読み込みます。

## ファイル構成

| パス | 内容 |
| --- | --- |
| `index.html` | GitHub Pages用ゲーム画面・AI接続設定 |
| `project.sb3` | ChatGPT連携＋内蔵フォールバック版 |
| `project-basic-ai.sb3` | 直前の軽量AI版バックアップ |
| `project-two-players.sb3` | 変更前の二人対戦版バックアップ |
| `ai-extension.js` | TurboWarpとWorkerをつなぐカスタム拡張 |
| `backend/worker.js` | APIキーを秘密に保つOpenAI中継Worker |
| `scratch-src/project.json` | ブロック、変数、リストなどのプロジェクトデータ |
| `scratch-src/*.svg` | 駒や盤面などの画像素材 |
| `scratch-src/*.wav` | 効果音素材 |

`.sb3`はZIP形式です。`scratch-src`には同じ内容を展開してあり、GitHub上でブロック構造の変更を追跡できます。

## プロジェクト概要

- ターゲット: 7（ステージ、マス、先手駒、後手駒、勝敗、持駒、二歩）
- ブロック: 2,385
- 画像: SVG 30点
- 音声: WAV 2点
- TurboWarpカスタム拡張: `chatgptshogi`
- OpenAIモデル既定値: `gpt-5.5`、reasoning effort `high`

## 制約

候補手の正しさは元Scratch作品が実装している将棋ルールを基準にします。二歩、駒の行き所、盤外座標を生成時に除外し、Workerでは標準的な駒の利きから王手放置を追加除外します。ただし打ち歩詰め、千日手、連続王手などは専用将棋エンジンと同等の完全判定ではありません。ChatGPTは専用将棋エンジンではないため、強さは局面やAPI応答により変わります。

## 編集とライセンス

カスタム拡張を含むため、編集・再生にはTurboWarpを推奨します。`scratch-src/project.json`だけを変更しても`.sb3`へは反映されません。

この変換作業は、元作品の著作権や利用条件を変更しません。公開前に、元作品・素材の公開条件とクレジット表記を確認してください。
