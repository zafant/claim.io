import Phaser from 'phaser';

const CELL = 20;
const COLS = 40;
const ROWS = 24;
const WIDTH = COLS * CELL;
const HEIGHT = ROWS * CELL;

const EMPTY = 0;
const OWNED = 1;
const TRAIL = 2;

type Cell = typeof EMPTY | typeof OWNED | typeof TRAIL;

type Dir = { x: number; y: number };

class ClaimScene extends Phaser.Scene {
  private grid: Cell[][] = [];
  private playerX = 0;
  private playerY = 0;
  private direction: Dir = { x: 1, y: 0 };
  private queuedDirection: Dir = { x: 1, y: 0 };
  private trail: Array<[number, number]> = [];
  private lastStep = 0;
  private readonly stepMs = 90;
  private graphics!: Phaser.GameObjects.Graphics;
  private scoreText!: Phaser.GameObjects.Text;
  private gameOverText!: Phaser.GameObjects.Text;
  private ownedCells = 0;

  constructor() {
    super('claim');
  }

  create(): void {
    this.graphics = this.add.graphics();
    this.scoreText = this.add.text(12, 8, '', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#ffffff',
    });
    this.gameOverText = this.add.text(WIDTH / 2, HEIGHT / 2, '', {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5);

    this.resetGame();

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === 'arrowup' || key === 'w') this.queueDirection(0, -1);
      if (key === 'arrowdown' || key === 's') this.queueDirection(0, 1);
      if (key === 'arrowleft' || key === 'a') this.queueDirection(-1, 0);
      if (key === 'arrowright' || key === 'd') this.queueDirection(1, 0);
      if (key === 'r' && this.gameOverText.text) this.resetGame();
    });

    this.draw();
  }

  update(time: number): void {
    if (this.gameOverText.text || time - this.lastStep < this.stepMs) return;
    this.lastStep = time;

    this.direction = this.queuedDirection;
    const nextX = this.playerX + this.direction.x;
    const nextY = this.playerY + this.direction.y;

    if (nextX < 0 || nextX >= COLS || nextY < 0 || nextY >= ROWS) {
      this.die();
      return;
    }

    const nextCell = this.grid[nextY][nextX];
    if (nextCell === TRAIL) {
      this.die();
      return;
    }

    this.playerX = nextX;
    this.playerY = nextY;

    if (nextCell === OWNED) {
      if (this.trail.length > 0) this.captureTerritory();
    } else {
      this.grid[nextY][nextX] = TRAIL;
      this.trail.push([nextX, nextY]);
    }

    this.draw();
  }

  private queueDirection(x: number, y: number): void {
    if (x === -this.direction.x && y === -this.direction.y) return;
    this.queuedDirection = { x, y };
  }

  private resetGame(): void {
    this.grid = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => EMPTY as Cell),
    );

    const minX = 15;
    const maxX = 24;
    const minY = 8;
    const maxY = 15;

    for (let y = minY; y <= maxY; y += 1) {
      for (let x = minX; x <= maxX; x += 1) {
        this.grid[y][x] = OWNED;
      }
    }

    this.playerX = 20;
    this.playerY = 12;
    this.direction = { x: 1, y: 0 };
    this.queuedDirection = { x: 1, y: 0 };
    this.trail = [];
    this.lastStep = 0;
    this.gameOverText.setText('');
    this.recountOwned();
    this.draw();
  }

  private captureTerritory(): void {
    for (const [x, y] of this.trail) this.grid[y][x] = OWNED;

    // Flood-fill empty space from the outside. Any remaining EMPTY cell is enclosed.
    const visited = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
    const queue: Array<[number, number]> = [];

    const visit = (x: number, y: number): void => {
      if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return;
      if (visited[y][x] || this.grid[y][x] !== EMPTY) return;
      visited[y][x] = true;
      queue.push([x, y]);
    };

    for (let x = 0; x < COLS; x += 1) {
      visit(x, 0);
      visit(x, ROWS - 1);
    }
    for (let y = 0; y < ROWS; y += 1) {
      visit(0, y);
      visit(COLS - 1, y);
    }

    for (let i = 0; i < queue.length; i += 1) {
      const [x, y] = queue[i];
      visit(x + 1, y);
      visit(x - 1, y);
      visit(x, y + 1);
      visit(x, y - 1);
    }

    for (let y = 0; y < ROWS; y += 1) {
      for (let x = 0; x < COLS; x += 1) {
        if (this.grid[y][x] === EMPTY && !visited[y][x]) {
          this.grid[y][x] = OWNED;
        }
      }
    }

    this.trail = [];
    this.recountOwned();
  }

  private recountOwned(): void {
    this.ownedCells = this.grid.flat().filter((cell) => cell === OWNED).length;
  }

  private die(): void {
    this.gameOverText.setText(`CLAIM LOST\n\nTerritory: ${this.percentOwned()}%\n\nPress R to restart`);
  }

  private percentOwned(): number {
    return Math.round((this.ownedCells / (COLS * ROWS)) * 100);
  }

  private draw(): void {
    this.graphics.clear();

    for (let y = 0; y < ROWS; y += 1) {
      for (let x = 0; x < COLS; x += 1) {
        const cell = this.grid[y][x];
        if (cell === OWNED) this.graphics.fillStyle(0x2563eb, 0.9);
        else if (cell === TRAIL) this.graphics.fillStyle(0x60a5fa, 1);
        else this.graphics.fillStyle(0x111827, 1);
        this.graphics.fillRect(x * CELL, y * CELL, CELL - 1, CELL - 1);
      }
    }

    this.graphics.fillStyle(0xfacc15, 1);
    this.graphics.fillCircle(this.playerX * CELL + CELL / 2, this.playerY * CELL + CELL / 2, CELL * 0.38);

    this.scoreText.setText(`CLAIM.IO   Territory: ${this.percentOwned()}%   |   WASD / Arrows`);
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: '#030712',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: ClaimScene,
});
