(function (Scratch) {
  "use strict";

  const scriptSource = typeof document !== "undefined" && document.currentScript
    ? document.currentScript.src
    : (typeof location !== "undefined" ? location.href : "https://invalid.local/");
  const scriptUrl = new URL(scriptSource);
  const endpoint = scriptUrl.searchParams.get("endpoint") || "";
  const REQUEST_TIMEOUT_MS = 90000;

  function splitList(value) {
    if (Array.isArray(value)) return value.map(String).filter(Boolean);
    const text = Scratch.Cast.toString(value).trim();
    return text ? text.split(/\s+/).filter(Boolean) : [];
  }

  function parseBoard(value) {
    return splitList(value)
      .filter((item) => /^[1-9]{2}.+/.test(item))
      .map((item) => ({ square: item.slice(0, 2), piece: item.slice(2) }));
  }

  function parseHand(value) {
    const items = splitList(value);
    if (items.length > 1) return items;
    return items.length === 1 ? Array.from(items[0]) : [];
  }

  class ChatGPTShogi {
    constructor() {
      this.reason = "";
    }

    getInfo() {
      return {
        id: "chatgptshogi",
        name: "ChatGPT将棋",
        color1: "#8b2e24",
        color2: "#6f211a",
        blocks: [
          {
            opcode: "chooseMove",
            blockType: Scratch.BlockType.REPORTER,
            text: "AIに指し手を聞く 先手盤 [SENTE_BOARD] 後手盤 [GOTE_BOARD] 先手持駒 [SENTE_HAND] 後手持駒 [GOTE_HAND] 合法手 [LEGAL_MOVES]",
            arguments: {
              SENTE_BOARD: { type: Scratch.ArgumentType.STRING, defaultValue: "" },
              GOTE_BOARD: { type: Scratch.ArgumentType.STRING, defaultValue: "" },
              SENTE_HAND: { type: Scratch.ArgumentType.STRING, defaultValue: "" },
              GOTE_HAND: { type: Scratch.ArgumentType.STRING, defaultValue: "" },
              LEGAL_MOVES: { type: Scratch.ArgumentType.STRING, defaultValue: "" }
            }
          },
          {
            opcode: "lastReason",
            blockType: Scratch.BlockType.REPORTER,
            text: "AIの理由"
          }
        ]
      };
    }

    async chooseMove(args) {
      const legalMoves = splitList(args.LEGAL_MOVES).filter((move) =>
        /^M:[1-9]{2}:[1-9]{2}$/.test(move) || /^D:\d{2}:[1-9]{2}$/.test(move)
      );
      this.reason = "";

      if (!legalMoves.length) {
        this.reason = "合法手がありません";
        return "ERROR:NO_LEGAL_MOVE";
      }
      if (!endpoint) {
        this.reason = "AI接続先が未設定のため、内蔵評価で選びます";
        return "ERROR:NO_ENDPOINT";
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      try {
        const response = await Scratch.fetch(endpoint, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            board: {
              sente: parseBoard(args.SENTE_BOARD),
              gote: parseBoard(args.GOTE_BOARD)
            },
            hands: {
              sente: parseHand(args.SENTE_HAND),
              gote: parseHand(args.GOTE_HAND)
            },
            legal_moves: legalMoves
          }),
          signal: controller.signal
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.error || `HTTP ${response.status}`);
        }
        if (!legalMoves.includes(data.move)) {
          throw new Error("AIが候補外の手を返しました");
        }

        this.reason = Scratch.Cast.toString(data.reason || "AIが局面を評価して選択しました").slice(0, 240);
        return data.move;
      } catch (error) {
        const message = error && error.name === "AbortError" ? "AI応答が時間切れになりました" : String(error.message || error);
        this.reason = `${message}。内蔵評価で選びます`;
        return error && error.name === "AbortError" ? "ERROR:TIMEOUT" : "ERROR:REQUEST_FAILED";
      } finally {
        clearTimeout(timeoutId);
      }
    }

    lastReason() {
      return this.reason;
    }
  }

  Scratch.extensions.register(new ChatGPTShogi());
})(Scratch);
