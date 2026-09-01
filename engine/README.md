# 勇者エンジン

このフォルダーは、GitHub Pagesで追加ヘッダーなしに動く「A方式」の単一スレッドYaneuraOu WASMを収録しています。Web Worker内で動作するため、エンジン思考中も画面のメインスレッドを占有しません。

## 動作

`hero-worker.js`がWebAssembly SIMD対応を検査し、次のいずれかを遅延読込します。

- `yaneuraou/sse42/` — WebAssembly SIMD対応ブラウザー用
- `yaneuraou/nosimd/` — 互換用

両方とも`Threads=1`です。SharedArrayBuffer、pthread、COOP/COEPレスポンスヘッダーを必要としません。

## 再ビルド

Dockerが利用できるLinux環境で次を実行します。

```sh
cd engine/source-build
./build_wasm.sh
```

スクリプトはEmscripten 3.1.24を使い、`../yaneuraou/sse42`と`../yaneuraou/nosimd`へ成果物を出力します。ビルド入力の完全な上流ソースアーカイブは`../source/SuishoPetite-YaneuraOu-v7.6.3-wasm.zip`にも保存しています。

由来とライセンスはリポジトリ直下の`THIRD_PARTY_NOTICES.md`と`LICENSE`を参照してください。
