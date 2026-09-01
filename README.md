# 将棋・GitHub Pages専用版

GitHub Pages上で直接動作する、1人対コンピューター用の将棋です。Scratch、SB3、TurboWarp、外部API、サーバー処理は使用しません。

## 5段階の強さ

- **初心者** — 軽量な1手評価。少し手加減するランダム性あり。
- **中級者** — 3手探索。短い待ち時間で遊べる標準設定。
- **上級者** — ランダム性を廃止し、全合法手を対象に反復深化、αβ探索、PVS、LMR、置換表、静止探索、王手延長、玉の安全度評価を使用。
- **猛者** — 上級者より長い思考時間と深い静止探索を使用し、7手詰め探索も先に実行。
- **勇者** — 将棋専用USIエンジン **YaneuraOu** のシングルスレッドWASM版。ブラウザーが対応していればSIMD版、未対応ならnosimd版を自動選択。

上級者・猛者は候補手数による枝刈りを廃止したため、従来より読み抜けを減らしています。最大深度は制限値であり、実際の到達深度は局面と端末性能によって変わります。

## GitHub Pagesで公開する

1. ZIPを展開し、中身をそのままGitHubリポジトリへアップロードします。`engine`サブフォルダーも必ず含めてください。
2. GitHubの **Settings → Pages** を開きます。
3. **Deploy from a branch** を選び、公開ブランチの `/ (root)` を指定します。
4. 発行されたURLを開きます。初回に「勇者」を選んだ時だけ約2.8MBのエンジンを読み込みます。

ビルド、APIキー、COOP/COEPヘッダーの設定は不要です。ローカルで確認する場合は`file://`で直接開かず、HTTPサーバーを使ってください。

## ファイル構成

- `index.html` — ゲーム画面
- `styles.css` — 盤面とレスポンシブ表示
- `perspective.css` — 3Dバードビューと難易度ボタン
- `mobile-3d.css` — 立体駒、先手背面表示、スマホ全画面固定
- `app.js` — 将棋ルール、内蔵AI、SFEN/USI変換
- `engine/hero-worker.js` — UIを止めずに勇者エンジンを動かすWeb Worker
- `engine/yaneuraou/` — SIMD版・nosimd版の単一スレッドWASM
- `engine/source/` — 配布バイナリに対応するYaneuraOuソースアーカイブ
- `engine/source-build/` — 単一スレッドWASMの再ビルド用ファイル
- `assets/` — 盤と赤／青の武将キャラクター画像
- `docs/AI_CHANGELOG.md` — 変更履歴
- `THIRD_PARTY_NOTICES.md` — エンジンの出典、版、再ビルド情報
- `LICENSE` — GNU GPL v3

## 対応している将棋ルール

合法手、王手回避、駒取り、成り、持ち駒、駒打ち、二歩、打ち歩詰め、行き所のない駒、千日手、連続王手の千日手、500手持将棋を判定します。捕獲した駒は再配置時に捕獲側の赤／青衣装へ変わります。

## ライセンス

本配布物はYaneuraOuを同梱するためGNU GPL v3で配布します。エンジンの正確な出典と対応ソースは[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)を参照してください。
