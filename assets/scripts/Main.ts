import { _decorator, Component, Node, Sprite, SpriteFrame, Label, Color } from 'cc';
import { MockApi, InitData, PlayData } from './MockApi';

const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
  @property([Sprite])
  public cells: Sprite[] = [];

  @property([SpriteFrame])
  public symbolFrames: SpriteFrame[] = [];

  @property(Node)
  public playButtonNode: Node | null = null;

  @property(Label)
  public winLabel: Label | null = null;

  @property(Label)
  public balanceLabel: Label | null = null;

  private isInitialized = false;
  private isSpinning = false;
  private balance = 0;
  private betAmount = 0;

  onLoad() {
    MockApi.onInitData((data: InitData) => this.handleInitResponse(data));

    MockApi.onPlayResponse((data: PlayData) => {
      const anyData = data as any;
      this.handlePlayResponse(data);
      if (this.winLabel) this.winLabel.string = `Win: ${anyData.totalWin ?? 0}`;
    });

    if (this.playButtonNode) {
      this.playButtonNode.on(Node.EventType.TOUCH_END, this.onPlayPressed, this);
      this.setButtonEnabled(false);
    }
  }

  start() {
    MockApi.init();
  }

  private onPlayPressed() {
    if (!this.isInitialized) return;
    if (this.isSpinning) return;

    // apply bet immediately on play
    if (this.betAmount > 0) {
      this.balance -= this.betAmount;
      this.updateBalanceLabel();
    }

    this.isSpinning = true;
    this.setButtonEnabled(false);
    this.clearHighlights();
    if (this.winLabel) this.winLabel.string = 'Win: 0';

    this.fakeSpin();
    MockApi.play();
  }

  private handleInitResponse(data: InitData) {
    const anyData = data as any;

    const reels = anyData.defaultReels ?? anyData.reels;
    if (!reels) return;

    this.applyReels(reels);

    // read initial balance and bet from init payload
    this.balance = anyData.balance ?? 0;
    this.betAmount = anyData.defaultBet ?? 0;
    this.updateBalanceLabel();
    this.isInitialized = true;
    this.setButtonEnabled(true);

    if (this.winLabel) this.winLabel.string = 'Win: 0';
  }

  private handlePlayResponse(data: PlayData) {
    const anyData = data as any;

    console.log('reels=', data.reels);
    console.log('winLines=', data.winLines);

    const reels = anyData.reels ?? anyData.resultReels ?? anyData.defaultReels;
    if (!reels) {
      this.isSpinning = false;
      this.setButtonEnabled(true);
      return;
    }

    this.applyReels(reels);

    // add win amount back to balance
    const win = anyData.totalWin ?? 0;
    if (win > 0) {
      this.balance += win;
      this.updateBalanceLabel();
    }

    // Use the WinLine objects from MockApi: take the first win and highlight its indexes
    const winLines = (data as PlayData).winLines;
    if (winLines && winLines.length > 0) {
      const first = winLines[0];
      if (first && first.winIndexes && first.winIndexes.length === 3) {
        this.highlightIndexes(first.winIndexes);
      }
    }

    // I found this method from the Cocos documentation to be a good place to disable the button after spin for 0.15 seconds
    this.scheduleOnce(() => {
      this.isSpinning = false;
      this.setButtonEnabled(true);
    }, 0.15);
  }

  private setButtonEnabled(enabled: boolean) {
    if (!this.playButtonNode) return;
    const s = this.playButtonNode.getComponent(Sprite);
    if (s) s.grayscale = !enabled;
  }

  private fakeSpin() {
    if (!this.symbolFrames.length) return;

    // this imitates the actual spin by scheduling a random frame for each cell over 6 iterations
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

  private applyReels(reels: number[][]) {
    if (this.cells.length !== 9) return;
    if (this.symbolFrames.length < 4) return;

    for (let col = 0; col < 3; col++) {
      for (let row = 0; row < 3; row++) {
        const index = col * 3 + row;
        const symbolId = reels?.[col]?.[row];
        const cellSprite = this.cells[index];
        if (!cellSprite) continue;

        const frame = this.symbolFrames[(symbolId ?? 1) - 1];
        if (frame) cellSprite.spriteFrame = frame;
      }
    }
  }

  private clearHighlights() {
    for (const s of this.cells) {
      if (!s) continue;
      s.node.setScale(1, 1);
      s.color = Color.WHITE;
    }
  }

  private highlightIndexes(indexes: number[]) {
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

  private updateBalanceLabel() {
    if (!this.balanceLabel) return;
    this.balanceLabel.string = `Balance: ${this.balance}`;
  }
}
