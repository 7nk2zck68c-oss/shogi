# Third-party notices

## YaneuraOu / SuishoPetite

「勇者」難易度には、USI対応将棋エンジンYaneuraOuのシングルスレッドWebAssemblyビルドを同梱しています。

- YaneuraOu公式リポジトリ: https://github.com/yaneurao/YaneuraOu
- ライセンス: GNU General Public License version 3
- エンジン系統: mizar/YaneuraOu v7.6.3 SuishoPetite WASM
- 単一スレッドビルドの取得元: https://github.com/yuki-keio/shogi/tree/273d154103bde5d96f0f9feb4eb70f6556a37749
- 取得元コミット: `273d154103bde5d96f0f9feb4eb70f6556a37749`
- 本プロジェクトへの収録日: 2026-09-01

実行バイナリは次の4ファイルです。

- `engine/yaneuraou/sse42/yaneuraou.js`
- `engine/yaneuraou/sse42/yaneuraou.wasm`
- `engine/yaneuraou/nosimd/yaneuraou.js`
- `engine/yaneuraou/nosimd/yaneuraou.wasm`

対応する完全なソース配布物は`engine/source/SuishoPetite-YaneuraOu-v7.6.3-wasm.zip`に同梱しています。単一スレッド化に使用したMakefile、差し替えソース、Dockerビルド手順は`engine/source-build/`に同梱しています。再現方法は`engine/README.md`を参照してください。

本プロジェクトの`LICENSE`にはGNU GPL v3全文を収録しています。上流アーカイブ内の著作権表示とライセンス文書も保持しています。
