System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Sprite, SpriteFrame, Label, Color, MockApi, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, Main;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfMockApi(extras) {
    _reporterNs.report("MockApi", "./MockApi", _context.meta, extras);
  }

  function _reportPossibleCrUseOfInitData(extras) {
    _reporterNs.report("InitData", "./MockApi", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlayData(extras) {
    _reporterNs.report("PlayData", "./MockApi", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Node = _cc.Node;
      Sprite = _cc.Sprite;
      SpriteFrame = _cc.SpriteFrame;
      Label = _cc.Label;
      Color = _cc.Color;
    }, function (_unresolved_2) {
      MockApi = _unresolved_2.MockApi;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "aa27a6vcU9KZ50b97DZXPoI", "MainFunctional%20copy", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Sprite', 'SpriteFrame', 'Label', 'Color']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Main", Main = (_dec = ccclass('Main'), _dec2 = property([Sprite]), _dec3 = property([SpriteFrame]), _dec4 = property(Node), _dec5 = property(Label), _dec6 = property(Label), _dec(_class = (_class2 = class Main extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "cells", _descriptor, this);

          _initializerDefineProperty(this, "symbolFrames", _descriptor2, this);

          _initializerDefineProperty(this, "playButtonNode", _descriptor3, this);

          _initializerDefineProperty(this, "winLabel", _descriptor4, this);

          _initializerDefineProperty(this, "balanceLabel", _descriptor5, this);

          this.isInitialized = false;
          this.isSpinning = false;
          this.balance = 0;
          this.betAmount = 0;
        }

        onLoad() {
          (_crd && MockApi === void 0 ? (_reportPossibleCrUseOfMockApi({
            error: Error()
          }), MockApi) : MockApi).onInitData(data => this.handleInitResponse(data));
          (_crd && MockApi === void 0 ? (_reportPossibleCrUseOfMockApi({
            error: Error()
          }), MockApi) : MockApi).onPlayResponse(data => {
            var _anyData$totalWin;

            const anyData = data;
            this.handlePlayResponse(data);
            if (this.winLabel) this.winLabel.string = `Win: ${(_anyData$totalWin = anyData.totalWin) != null ? _anyData$totalWin : 0}`;
          });

          if (this.playButtonNode) {
            this.playButtonNode.on(Node.EventType.TOUCH_END, this.onPlayPressed, this);
            this.setButtonEnabled(false);
          }
        }

        start() {
          (_crd && MockApi === void 0 ? (_reportPossibleCrUseOfMockApi({
            error: Error()
          }), MockApi) : MockApi).init();
        }

        onPlayPressed() {
          if (!this.isInitialized) return;
          if (this.isSpinning) return; // apply bet immediately on play

          if (this.betAmount > 0) {
            this.balance -= this.betAmount;
            this.updateBalanceLabel();
          }

          this.isSpinning = true;
          this.setButtonEnabled(false);
          this.clearHighlights();
          if (this.winLabel) this.winLabel.string = 'Win: 0';
          this.fakeSpin();
          (_crd && MockApi === void 0 ? (_reportPossibleCrUseOfMockApi({
            error: Error()
          }), MockApi) : MockApi).play();
        }

        handleInitResponse(data) {
          var _anyData$defaultReels, _anyData$balance, _anyData$defaultBet;

          const anyData = data;
          const reels = (_anyData$defaultReels = anyData.defaultReels) != null ? _anyData$defaultReels : anyData.reels;
          if (!reels) return;
          this.applyReels(reels); // read initial balance and bet from init payload

          this.balance = (_anyData$balance = anyData.balance) != null ? _anyData$balance : 0;
          this.betAmount = (_anyData$defaultBet = anyData.defaultBet) != null ? _anyData$defaultBet : 0;
          this.updateBalanceLabel();
          this.isInitialized = true;
          this.setButtonEnabled(true);
          if (this.winLabel) this.winLabel.string = 'Win: 0';
        }

        handlePlayResponse(data) {
          var _ref, _anyData$reels, _anyData$totalWin2;

          const anyData = data;
          console.log('reels=', data.reels);
          console.log('winLines=', data.winLines);
          const reels = (_ref = (_anyData$reels = anyData.reels) != null ? _anyData$reels : anyData.resultReels) != null ? _ref : anyData.defaultReels;

          if (!reels) {
            this.isSpinning = false;
            this.setButtonEnabled(true);
            return;
          }

          this.applyReels(reels); // add win amount back to balance

          const win = (_anyData$totalWin2 = anyData.totalWin) != null ? _anyData$totalWin2 : 0;

          if (win > 0) {
            this.balance += win;
            this.updateBalanceLabel();
          } // Use the WinLine objects from MockApi: take the first win and highlight its indexes


          const winLines = data.winLines;

          if (winLines && winLines.length > 0) {
            const first = winLines[0];

            if (first && first.winIndexes && first.winIndexes.length === 3) {
              this.highlightIndexes(first.winIndexes);
            }
          } // I found this method from the Cocos documentation to be a good place to disable the button after spin for 0.15 seconds


          this.scheduleOnce(() => {
            this.isSpinning = false;
            this.setButtonEnabled(true);
          }, 0.15);
        }

        setButtonEnabled(enabled) {
          if (!this.playButtonNode) return;
          const s = this.playButtonNode.getComponent(Sprite);
          if (s) s.grayscale = !enabled;
        }

        fakeSpin() {
          if (!this.symbolFrames.length) return; // this imitates the actual spin by scheduling a random frame for each cell over 6 iterations

          for (let i = 0; i < 6; i++) {
            this.scheduleOnce(() => {
              for (const cell of this.cells) {
                const r = Math.floor(Math.random() * this.symbolFrames.length);
                const f = this.symbolFrames[r];
                if (cell && f) cell.spriteFrame = f;
              }
            }, i * 0.05);
          }
        }

        applyReels(reels) {
          if (this.cells.length !== 9) return;
          if (this.symbolFrames.length < 4) return;

          for (let col = 0; col < 3; col++) {
            for (let row = 0; row < 3; row++) {
              var _reels$col;

              const index = col * 3 + row;
              const symbolId = reels == null || (_reels$col = reels[col]) == null ? void 0 : _reels$col[row];
              const cellSprite = this.cells[index];
              if (!cellSprite) continue;
              const frame = this.symbolFrames[(symbolId != null ? symbolId : 1) - 1];
              if (frame) cellSprite.spriteFrame = frame;
            }
          }
        }

        clearHighlights() {
          for (const s of this.cells) {
            if (!s) continue;
            s.node.setScale(1, 1);
            s.color = Color.WHITE;
          }
        }

        highlightIndexes(indexes) {
          this.clearHighlights();
          const winSet = new Set(indexes);
          this.cells.forEach((s, idx) => {
            if (!s) return;

            if (winSet.has(idx)) {
              s.node.setScale(1.05, 1.05);
              s.color = new Color(255, 230, 120);
            }
          });
        }

        updateBalanceLabel() {
          if (!this.balanceLabel) return;
          this.balanceLabel.string = `Balance: ${this.balance}`;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "cells", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "symbolFrames", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "playButtonNode", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "winLabel", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "balanceLabel", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=948dbc9b14171330088b5b1701151f2b6f3abb06.js.map