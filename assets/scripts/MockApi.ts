export type InitData = {
    /** Mock game id. */
    gameId: string;
    /** Default bet amount for the game. */
    defaultBet: number;
    /** Starting player balance */
    balance: number;
    /**
     * 3x3 starting layout with NO wins.
     * Orientation is columns‑first: defaultReels[col][row]
     * Example: defaultReels[0] is the left reel.
     */
    defaultReels: number[][];
};

export type PlayData = {
    /** Unique round id. */
    roundId: string;
    /**
     * Final landed result for this spin, columns‑first: reels[col][row].
     * Use this to set each symbol shown in your grid.
     */
    reels: number[][];
    /** List of winning lines (empty if no win). */
    winLines: WinLine[];
    /** Sum of all line payouts in this result. */
    totalWin: number;
};

export type WinLine = {
    /** Id of the winning line*/
    lineNumber: number;
    /** Payout for this single line. */
    winAmount: number;
    /**
     * Grid indexes of the 3 cells that form the winning line.
     * Grid is numbered column-first: reel0: 0,1,2; reel1: 3,4,5; reel2: 6,7,8
     * Example: top row = [0,3,6], bottom row = [2,5,8]
     */
    winIndexes: number[];
};

const DEFAULT_WIN_LINES: { lineNumber: number; indexes: number[] }[] = [
    { lineNumber: 1, indexes: [0, 3, 6] },
    { lineNumber: 2, indexes: [1, 4, 7] },
    { lineNumber: 3, indexes: [2, 5, 8] },
    { lineNumber: 4, indexes: [0, 4, 8] },
    { lineNumber: 5, indexes: [2, 4, 6] },
];

const DEFAULT_BET = 10;
const DEFAULT_BALANCE = 1000;
const PAY_PER_LINE = 10;
const PLAY_DELAY_MS = 400;

export class MockApi {
    private static initCallback: ((data: InitData) => void) | null = null;
    private static playCallback: ((data: PlayData) => void) | null = null;

    /**
     * Register a single callback for init data.
     * Call this in your Main.onLoad() BEFORE calling MockApi.init().
     *
     * Example:
     *   MockApi.onInitData(this.handleInit.bind(this));
     */
    public static onInitData(cb: (data: InitData) => void) {
        this.initCallback = cb;
    }

    /**
     * Register a single callback for play results.
     * Call this in your Main.onLoad() BEFORE calling MockApi.play().
     *
     * Example:
     *   MockApi.onPlayResponse(this.handlePlay.bind(this));
     */
    public static onPlayResponse(cb: (data: PlayData) => void) {
        this.playCallback = cb;
    }

    /**
     * Triggers the initial payload immediately (no delay).
     * Call this ONCE during scene load (e.g., in Main.onLoad()).
     */
    public static init() {
        const data: InitData = {
            gameId: "999",
            defaultBet: DEFAULT_BET,
            balance: DEFAULT_BALANCE,
            defaultReels: [
                [1, 2, 3], // reel 0
                [2, 4, 3], // reel 1
                [4, 3, 1], // reel 2
            ],
        };
        this.initCallback?.(data);
    }

    /**
     * Triggers a spin result after a short delay (simulating server latency).
     * Call this when the user presses the Play button.
     */
    public static play() {
        const reels = this.buildRandomReels();          // columns‑first 3x3
        const winLines = this.evaluateWins(reels);      // array of { lineNumber, winAmount, winIndexes }
        const totalWin = winLines.reduce((sum, wl) => sum + wl.winAmount, 0);

        const payload: PlayData = {
            roundId: Date.now().toString(),
            reels,
            winLines,
            totalWin,
        };

        setTimeout(() => this.playCallback?.(payload), PLAY_DELAY_MS);
    }

    private static randIcon(): number {
        return Math.floor(Math.random() * 4) + 1; // 1..4
    }

    private static buildRandomReels(): number[][] {
        return [
            [this.randIcon(), this.randIcon(), this.randIcon()], // col 0
            [this.randIcon(), this.randIcon(), this.randIcon()], // col 1
            [this.randIcon(), this.randIcon(), this.randIcon()], // col 2
        ];
    }

    private static evaluateWins(reels: number[][]): WinLine[] {
        const results: WinLine[] = [];

        for (const line of DEFAULT_WIN_LINES) {
            const [i0, i1, i2] = line.indexes;

            const v0 = this.valueAt(reels, i0);
            const v1 = this.valueAt(reels, i1);
            const v2 = this.valueAt(reels, i2);

            if (v0 === v1 && v1 === v2) {
                results.push({
                    lineNumber: line.lineNumber,
                    winAmount: v0 * PAY_PER_LINE,
                    winIndexes: line.indexes.slice(),
                });
            }
        }

        return results;
    }

    private static valueAt(reels: number[][], idx: number): number {
        const col = Math.floor(idx / 3);
        const row = idx % 3;
        return reels[col][row];
    }
}
