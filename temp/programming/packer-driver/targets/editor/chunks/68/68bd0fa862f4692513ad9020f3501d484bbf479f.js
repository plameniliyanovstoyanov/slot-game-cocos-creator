System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, MockApi, _crd, DEFAULT_WIN_LINES, DEFAULT_BET, DEFAULT_BALANCE, PAY_PER_LINE, PLAY_DELAY_MS;

  _export("MockApi", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c4842RrjINGz7vMiH1iZEKi", "MockApi", undefined);

      DEFAULT_WIN_LINES = [{
        lineNumber: 1,
        indexes: [0, 3, 6]
      }, {
        lineNumber: 2,
        indexes: [1, 4, 7]
      }, {
        lineNumber: 3,
        indexes: [2, 5, 8]
      }, {
        lineNumber: 4,
        indexes: [0, 4, 8]
      }, {
        lineNumber: 5,
        indexes: [2, 4, 6]
      }];
      DEFAULT_BET = 10;
      DEFAULT_BALANCE = 1000;
      PAY_PER_LINE = 10;
      PLAY_DELAY_MS = 400;

      _export("MockApi", MockApi = class MockApi {
        /**
         * Register a single callback for init data.
         * Call this in your Main.onLoad() BEFORE calling MockApi.init().
         *
         * Example:
         *   MockApi.onInitData(this.handleInit.bind(this));
         */
        static onInitData(cb) {
          this.initCallback = cb;
        }
        /**
         * Register a single callback for play results.
         * Call this in your Main.onLoad() BEFORE calling MockApi.play().
         *
         * Example:
         *   MockApi.onPlayResponse(this.handlePlay.bind(this));
         */


        static onPlayResponse(cb) {
          this.playCallback = cb;
        }
        /**
         * Triggers the initial payload immediately (no delay).
         * Call this ONCE during scene load (e.g., in Main.onLoad()).
         */


        static init() {
          var _this$initCallback;

          const data = {
            gameId: "999",
            defaultBet: DEFAULT_BET,
            balance: DEFAULT_BALANCE,
            defaultReels: [[1, 2, 3], // reel 0
            [2, 4, 3], // reel 1
            [4, 3, 1] // reel 2
            ]
          };
          (_this$initCallback = this.initCallback) == null || _this$initCallback.call(this, data);
        }
        /**
         * Triggers a spin result after a short delay (simulating server latency).
         * Call this when the user presses the Play button.
         */


        static play() {
          const reels = this.buildRandomReels(); // columns‑first 3x3

          const winLines = this.evaluateWins(reels); // array of { lineNumber, winAmount, winIndexes }

          const totalWin = winLines.reduce((sum, wl) => sum + wl.winAmount, 0);
          const payload = {
            roundId: Date.now().toString(),
            reels,
            winLines,
            totalWin
          };
          setTimeout(() => {
            var _this$playCallback;

            return (_this$playCallback = this.playCallback) == null ? void 0 : _this$playCallback.call(this, payload);
          }, PLAY_DELAY_MS);
        }

        static randIcon() {
          return Math.floor(Math.random() * 4) + 1; // 1..4
        }

        static buildRandomReels() {
          return [[this.randIcon(), this.randIcon(), this.randIcon()], // col 0
          [this.randIcon(), this.randIcon(), this.randIcon()], // col 1
          [this.randIcon(), this.randIcon(), this.randIcon()] // col 2
          ];
        }

        static evaluateWins(reels) {
          const results = [];

          for (const line of DEFAULT_WIN_LINES) {
            const [i0, i1, i2] = line.indexes;
            const v0 = this.valueAt(reels, i0);
            const v1 = this.valueAt(reels, i1);
            const v2 = this.valueAt(reels, i2);

            if (v0 === v1 && v1 === v2) {
              results.push({
                lineNumber: line.lineNumber,
                winAmount: v0 * PAY_PER_LINE,
                winIndexes: line.indexes.slice()
              });
            }
          }

          return results;
        }

        static valueAt(reels, idx) {
          const col = Math.floor(idx / 3);
          const row = idx % 3;
          return reels[col][row];
        }

      });

      MockApi.initCallback = null;
      MockApi.playCallback = null;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=68bd0fa862f4692513ad9020f3501d484bbf479f.js.map