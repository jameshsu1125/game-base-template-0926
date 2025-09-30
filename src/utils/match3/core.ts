// fetch code from https://github.com/rembound/Match-3-Game-HTML5/tree/master
import Match3Manager from "src/managers/match3/manager";
import {
  MATCH3_CONFIG,
  MATCH3_RGB_COLORS,
} from "../../configs/match3/layout.constants";
import {
  Cluster,
  GameState,
  MouseTileResult,
  Move,
  Position,
  TConfig,
  TileCoordinate,
  TState,
} from "./types";

export default class Match3Core {
  private scene: Phaser.Scene;
  private canvas: HTMLCanvasElement;
  private manager: Match3Manager;

  private context: CanvasRenderingContext2D;
  private score: number = 0;

  // Level configuration
  private config: TConfig = {
    x: 0,
    y: 0,
    columns: MATCH3_CONFIG.cols,
    rows: MATCH3_CONFIG.rows,
    tile: {
      width: MATCH3_CONFIG.width,
      height: MATCH3_CONFIG.height,
      data: [],
    },
    selected: { selected: false, column: 0, row: 0 },
  };

  private state: TState = {
    isDrag: false,
    status: GameState.INIT,
    time: { last: 0, count: 0 },
    animation: { state: 0, time: 0, total: MATCH3_CONFIG.transitionDuration },
  };

  // Tile colors in RGB
  private readonly tileColors: number[][] = MATCH3_RGB_COLORS;

  // Game data
  private clusters: Cluster[] = [];
  private moves: Move[] = [];
  private currentMove: Move = { column1: 0, row1: 0, column2: 0, row2: 0 };

  // Features
  private showMoves: boolean = true;
  private aiBot: boolean = true;
  private gameOver: boolean = false;

  private tileSeriesIndex: number = 0;

  constructor(
    scene: Phaser.Scene,
    match3Manager: Match3Manager,
    canvas: HTMLCanvasElement
  ) {
    this.scene = scene;
    this.canvas = canvas;
    this.manager = match3Manager;

    if (!canvas) {
      throw new Error(`Canvas element not found`);
    }

    this.canvas = canvas;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Failed to get 2D context from canvas");
    }
    this.context = context;

    this.init();
  }

  private onPointerDown(pointer: Phaser.Input.Pointer) {
    const pos = this.getPointerPos(pointer);

    if (!this.state.isDrag) {
      const mt = this.getMouseTile(pos);

      if (mt.valid) {
        let swapped = false;
        if (this.config.selected.selected) {
          if (
            mt.x === this.config.selected.column &&
            mt.y === this.config.selected.row
          ) {
            this.config.selected.selected = false;
            this.state.isDrag = true;
            return;
          } else if (
            this.canSwap(
              mt.x,
              mt.y,
              this.config.selected.column,
              this.config.selected.row
            )
          ) {
            this.mouseSwap(
              mt.x,
              mt.y,
              this.config.selected.column,
              this.config.selected.row
            );
            swapped = true;
          }
        }

        if (!swapped) {
          this.config.selected.column = mt.x;
          this.config.selected.row = mt.y;
          this.config.selected.selected = true;
        }
      } else {
        this.config.selected.selected = false;
      }

      this.state.isDrag = true;
    }
  }

  private onPointerMove(pointer: Phaser.Input.Pointer): void {
    const pos = this.getPointerPos(pointer);
    if (this.state.isDrag && this.config.selected.selected) {
      const mt = this.getMouseTile(pos);
      if (mt.valid) {
        if (
          this.canSwap(
            mt.x,
            mt.y,
            this.config.selected.column,
            this.config.selected.row
          )
        ) {
          this.mouseSwap(
            mt.x,
            mt.y,
            this.config.selected.column,
            this.config.selected.row
          );
        }
      }
    }
  }

  private onPointerUp(): void {
    this.state.isDrag = false;
  }

  private getPointerPos(e: Phaser.Input.Pointer): Position {
    return {
      x: e.x - MATCH3_CONFIG.x,
      y: e.y - MATCH3_CONFIG.y,
    };
  }

  private init(): void {
    this.scene.input.on("pointerdown", this.onPointerDown, this);
    this.scene.input.on("pointermove", this.onPointerMove, this);
    this.scene.input.on("pointerup", this.onPointerUp, this);
    this.scene.input.on("pointerout", this.onPointerUp, this);

    this.canvas.width = this.config.columns * this.config.tile.width;
    this.canvas.height = this.config.rows * this.config.tile.height;
    this.canvas.style.width = `${
      this.canvas.width * this.scene.scale.displayScale.x
    }px`;
    this.canvas.style.height = `${
      this.canvas.height * this.scene.scale.displayScale.y
    }px`;
    this.context.imageSmoothingEnabled = false;
    const scale = 120 / this.canvas.width;
    this.canvas.style.transform = `scale(${scale})`;

    // Initialize the two-dimensional tile array
    for (let i = 0; i < this.config.columns; i++) {
      this.config.tile.data[i] = [];
      for (let j = 0; j < this.config.rows; j++) {
        this.config.tile.data[i][j] = {
          type: 0,
          shift: 0,
          name: `t${this.tileSeriesIndex++}`,
        };
      }
    }

    // Start new game
    this.newGame();

    // Enter main loop
    this.main(0);
  }

  private main = (delta: number): void => {
    window.requestAnimationFrame(this.main);
    this.update(delta);
    this.render();
  };

  private update(delta: number): void {
    const dt = (delta - this.state.time.last) / 1000;
    this.state.time.last = delta;

    if (this.state.status === GameState.READY) {
      // Game is ready for player input
      if (this.moves.length <= 0) {
        this.gameOver = true;
      }

      // AI bot logic
      if (this.aiBot) {
        this.state.animation.time += dt;
        if (this.state.animation.time > this.state.animation.total) {
          this.findMoves();

          if (this.moves.length > 0) {
            const move =
              this.moves[Math.floor(Math.random() * this.moves.length)];
            this.mouseSwap(move.column1, move.row1, move.column2, move.row2);
          }
          this.state.animation.time = 0;
        }
      }
    } else if (this.state.status === GameState.RESOLVE) {
      this.state.animation.time += dt;

      if (this.state.animation.state === 0) {
        if (this.state.animation.time > this.state.animation.total) {
          this.findClusters();

          if (this.clusters.length > 0) {
            // Add points to score
            for (const cluster of this.clusters) {
              this.score += 100 * (cluster.length - 2);
              this.manager.addScore(cluster.length - 2);
            }

            this.removeClusters();
            this.state.animation.state = 1;
          } else {
            this.state.status = GameState.READY;
          }
          this.state.animation.time = 0;
        }
      } else if (this.state.animation.state === 1) {
        if (this.state.animation.time > this.state.animation.total) {
          this.shiftTiles();
          this.state.animation.state = 0;
          this.state.animation.time = 0;

          this.findClusters();
          if (this.clusters.length <= 0) {
            this.state.status = GameState.READY;
          }
        }
      } else if (this.state.animation.state === 2) {
        if (this.state.animation.time > this.state.animation.total) {
          this.swap(
            this.currentMove.column1,
            this.currentMove.row1,
            this.currentMove.column2,
            this.currentMove.row2
          );

          this.findClusters();
          if (this.clusters.length > 0) {
            this.state.animation.state = 0;
            this.state.animation.time = 0;
            this.state.status = GameState.RESOLVE;
          } else {
            this.state.animation.state = 3;
            this.state.animation.time = 0;
          }

          this.findMoves();
          this.findClusters();
        }
      } else if (this.state.animation.state === 3) {
        if (this.state.animation.time > this.state.animation.total) {
          this.swap(
            this.currentMove.column1,
            this.currentMove.row1,
            this.currentMove.column2,
            this.currentMove.row2
          );
          this.state.status = GameState.READY;
        }
      }

      this.findMoves();
      this.findClusters();
    }
  }

  private render(): void {
    // Draw level background
    const levelWidth = this.config.columns * this.config.tile.width;
    const levelHeight = this.config.rows * this.config.tile.height;
    this.context.fillStyle = "#000000";
    this.context.fillRect(
      this.config.x,
      this.config.y,
      levelWidth,
      levelHeight
    );

    this.renderTiles();
    this.renderClusters();

    if (
      this.showMoves &&
      this.clusters.length <= 0 &&
      this.state.status === GameState.READY
    ) {
      this.renderMoves();
    }

    // Game Over overlay
    if (this.gameOver) {
      this.manager.gameOver();
    }
  }

  private renderTiles(): void {
    this.manager.hideAllTiles();

    for (let i = 0; i < this.config.columns; i++) {
      for (let j = 0; j < this.config.rows; j++) {
        const name = this.config.tile.data[i][j].name;

        const shift = this.config.tile.data[i][j].shift;
        const coord = this.getTileCoordinate(
          i,
          j,
          0,
          (this.state.animation.time / this.state.animation.total) * shift
        );

        if (this.config.tile.data[i][j].type >= 0) {
          const col = this.tileColors[this.config.tile.data[i][j].type];
          this.drawTile(coord.x, coord.y, col[0], col[1], col[2], name);
        }

        if (this.config.selected.selected) {
          if (
            this.config.selected.column === i &&
            this.config.selected.row === j
          ) {
            // TODO: Draw selection
            this.drawTile(coord.x, coord.y, 255, 0, 0, name);
          }
        }
      }
    }

    // Render swap animation
    if (
      this.state.status === GameState.RESOLVE &&
      (this.state.animation.state === 2 || this.state.animation.state === 3)
    ) {
      const shiftX = this.currentMove.column2 - this.currentMove.column1;
      const shiftY = this.currentMove.row2 - this.currentMove.row1;

      const coord1 = this.getTileCoordinate(
        this.currentMove.column1,
        this.currentMove.row1,
        0,
        0
      );
      const coord1shift = this.getTileCoordinate(
        this.currentMove.column1,
        this.currentMove.row1,
        (this.state.animation.time / this.state.animation.total) * shiftX,
        (this.state.animation.time / this.state.animation.total) * shiftY
      );
      const col1 =
        this.tileColors[
          this.config.tile.data[this.currentMove.column1][this.currentMove.row1]
            .type
        ];

      const coord2 = this.getTileCoordinate(
        this.currentMove.column2,
        this.currentMove.row2,
        0,
        0
      );
      const coord2shift = this.getTileCoordinate(
        this.currentMove.column2,
        this.currentMove.row2,
        (this.state.animation.time / this.state.animation.total) * -shiftX,
        (this.state.animation.time / this.state.animation.total) * -shiftY
      );
      const col2 =
        this.tileColors[
          this.config.tile.data[this.currentMove.column2][this.currentMove.row2]
            .type
        ];

      const name1 =
        this.config.tile.data[this.currentMove.column1][this.currentMove.row1]
          .name;
      const name2 =
        this.config.tile.data[this.currentMove.column2][this.currentMove.row2]
          .name;

      this.drawTile(coord1.x, coord1.y, 0, 0, 0, name1);
      this.drawTile(coord2.x, coord2.y, 0, 0, 0, name1);

      if (this.state.animation.state === 2) {
        this.drawTile(
          coord1shift.x,
          coord1shift.y,
          col1[0],
          col1[1],
          col1[2],
          name2,
          true
        );
        this.drawTile(
          coord2shift.x,
          coord2shift.y,
          col2[0],
          col2[1],
          col2[2],
          name1
        );
      } else {
        this.drawTile(
          coord2shift.x,
          coord2shift.y,
          col2[0],
          col2[1],
          col2[2],
          name2
        );
        this.drawTile(
          coord1shift.x,
          coord1shift.y,
          col1[0],
          col1[1],
          col1[2],
          name1
        );
      }
    }
  }

  private getTileCoordinate(
    column: number,
    row: number,
    columnOffset: number,
    rowOffset: number
  ): TileCoordinate {
    const x = 0 + (column + columnOffset) * this.config.tile.width;
    const y = 0 + (row + rowOffset) * this.config.tile.height;
    return { x, y };
  }

  private drawTile(
    x: number,
    y: number,
    r: number,
    g: number,
    b: number,
    name: string,
    upper: boolean = false
  ): void {
    this.manager.drawTile({ x, y, r, g, b, name, upper });
    this.context.fillStyle = `rgb(${r},${g},${b})`;
    this.context.fillRect(
      x,
      y,
      this.config.tile.width,
      this.config.tile.height
    );
  }

  private renderClusters(): void {
    for (const cluster of this.clusters) {
      const coord = this.getTileCoordinate(cluster.column, cluster.row, 0, 0);

      if (cluster.is2x2) {
        // 為 2x2 群集繪製特殊標記（正方形邊框）
        this.context.strokeStyle = "#ff00ff"; // 紫色邊框表示 2x2
        this.context.lineWidth = 3;
        this.context.strokeRect(
          coord.x,
          coord.y,
          this.config.tile.width * 2,
          this.config.tile.height * 2
        );
      } else if (cluster.horizontal) {
        this.context.fillStyle = "#00ff00";
        this.context.fillRect(
          coord.x + this.config.tile.width / 2,
          coord.y + this.config.tile.height / 2,
          (cluster.length - 1) * this.config.tile.width,
          8
        );
      } else {
        this.context.fillStyle = "#0000ff";
        this.context.fillRect(
          coord.x + this.config.tile.width / 2,
          coord.y + this.config.tile.height / 2,
          8,
          (cluster.length - 1) * this.config.tile.height
        );
      }
    }
  }

  private renderMoves(): void {
    for (const move of this.moves) {
      const coord1 = this.getTileCoordinate(move.column1, move.row1, 0, 0);
      const coord2 = this.getTileCoordinate(move.column2, move.row2, 0, 0);

      this.context.strokeStyle = "#ff0000";
      this.context.beginPath();
      this.context.moveTo(
        coord1.x + this.config.tile.width / 2,
        coord1.y + this.config.tile.height / 2
      );
      this.context.lineTo(
        coord2.x + this.config.tile.width / 2,
        coord2.y + this.config.tile.height / 2
      );
      this.context.stroke();
    }
  }

  public newGame(): void {
    this.score = 0;
    this.state.status = GameState.READY;
    this.gameOver = false;
    this.createLevel();
    this.findMoves();
    this.findClusters();
  }

  private createLevel(): void {
    let done = false;

    while (!done) {
      for (let i = 0; i < this.config.columns; i++) {
        for (let j = 0; j < this.config.rows; j++) {
          this.config.tile.data[i][j].type = this.getRandomTile();
        }
      }

      this.resolveClusters();
      this.findMoves();

      if (this.moves.length > 0) {
        done = true;
      }
    }
  }

  private getRandomTile(): number {
    return Math.floor(Math.random() * this.tileColors.length);
  }

  private resolveClusters(): void {
    this.findClusters();

    while (this.clusters.length > 0) {
      this.removeClusters();
      this.shiftTiles();
      this.findClusters();
    }
  }

  private findClusters(): void {
    this.clusters = [];

    // Find L-shaped clusters
    this.findLShapedClusters();

    // Find 2x2 clusters
    this.find2x2Clusters();

    this.findHorizontalClusters();
    this.findVerticalClusters();
  }

  private findVerticalClusters(): void {
    // Find vertical clusters
    for (let i = 0; i < this.config.columns; i++) {
      let matchLength = 1;
      for (let j = 0; j < this.config.rows; j++) {
        let checkCluster = false;

        if (j === this.config.rows - 1) {
          checkCluster = true;
        } else {
          if (
            this.config.tile.data[i][j].type ===
              this.config.tile.data[i][j + 1].type &&
            this.config.tile.data[i][j].type !== -1
          ) {
            matchLength += 1;
          } else {
            checkCluster = true;
          }
        }

        if (checkCluster) {
          if (matchLength >= 3) {
            this.clusters.push({
              column: i,
              row: j + 1 - matchLength,
              length: matchLength,
              horizontal: false,
            });
          }
          matchLength = 1;
        }
      }
    }
  }

  private findHorizontalClusters(): void {
    // Find horizontal clusters
    for (let j = 0; j < this.config.rows; j++) {
      let matchLength = 1;
      for (let i = 0; i < this.config.columns; i++) {
        let checkCluster = false;

        if (i === this.config.columns - 1) {
          checkCluster = true;
        } else {
          if (
            this.config.tile.data[i][j].type ===
              this.config.tile.data[i + 1][j].type &&
            this.config.tile.data[i][j].type !== -1
          ) {
            matchLength += 1;
          } else {
            checkCluster = true;
          }
        }

        if (checkCluster) {
          if (matchLength >= 3) {
            this.clusters.push({
              column: i + 1 - matchLength,
              row: j,
              length: matchLength,
              horizontal: true,
            });
          }
          matchLength = 1;
        }
      }
    }
  }

  private findLShapedClusters(): void {
    for (let i = 0; i < this.config.columns - 1; i++) {
      for (let j = 0; j < this.config.rows - 2; j++) {
        const t = this.config.tile.data[i][j].type;
        if (
          t !== -1 &&
          t === this.config.tile.data[i][j + 1].type &&
          t === this.config.tile.data[i][j + 2].type &&
          t === this.config.tile.data[i + 1][j + 2].type &&
          t === this.config.tile.data[i + 1][j + 1].type
        ) {
          this.clusters.push({
            column: i,
            row: j,
            length: 5,
            horizontal: false,
            isLShape: true,
            shape: "L-down-right",
          });
        }
      }
    }
    for (let i = 0; i < this.config.columns - 2; i++) {
      for (let j = 0; j < this.config.rows - 1; j++) {
        const t = this.config.tile.data[i][j].type;
        if (
          t !== -1 &&
          t === this.config.tile.data[i + 1][j].type &&
          t === this.config.tile.data[i + 2][j].type &&
          t === this.config.tile.data[i + 2][j + 1].type &&
          t === this.config.tile.data[i + 1][j + 1].type
        ) {
          this.clusters.push({
            column: i,
            row: j,
            length: 5,
            horizontal: true,
            isLShape: true,
            shape: "L-right-down",
          });
        }
      }
    }
    // Mirror L shapes
    for (let i = 1; i < this.config.columns; i++) {
      for (let j = 0; j < this.config.rows - 2; j++) {
        const t = this.config.tile.data[i][j].type;
        if (
          t !== -1 &&
          t === this.config.tile.data[i][j + 1].type &&
          t === this.config.tile.data[i][j + 2].type &&
          t === this.config.tile.data[i - 1][j + 2].type &&
          t === this.config.tile.data[i - 1][j + 1].type
        ) {
          this.clusters.push({
            column: i - 1,
            row: j,
            length: 5,
            horizontal: false,
            isLShape: true,
            shape: "L-down-left",
          });
        }
      }
    }
    for (let i = 0; i < this.config.columns - 2; i++) {
      for (let j = 1; j < this.config.rows; j++) {
        const t = this.config.tile.data[i][j].type;
        if (
          t !== -1 &&
          t === this.config.tile.data[i + 1][j].type &&
          t === this.config.tile.data[i + 2][j].type &&
          t === this.config.tile.data[i + 2][j - 1].type &&
          t === this.config.tile.data[i + 1][j - 1].type
        ) {
          this.clusters.push({
            column: i,
            row: j - 1,
            length: 5,
            horizontal: true,
            isLShape: true,
            shape: "L-right-up",
          });
        }
      }
    }
  }

  /**
   * 檢測 2x2 群集
   */
  private find2x2Clusters(): void {
    for (let i = 0; i < this.config.columns - 1; i++) {
      for (let j = 0; j < this.config.rows - 1; j++) {
        const topLeft = this.config.tile.data[i][j].type;
        const topRight = this.config.tile.data[i + 1][j].type;
        const bottomLeft = this.config.tile.data[i][j + 1].type;
        const bottomRight = this.config.tile.data[i + 1][j + 1].type;

        // 檢查是否所有四個方塊都是相同顏色且不是空的(-1)
        if (
          topLeft !== -1 &&
          topLeft === topRight &&
          topLeft === bottomLeft &&
          topLeft === bottomRight
        ) {
          this.clusters.push({
            column: i,
            row: j,
            length: 4, // 2x2 有 4 個方塊
            horizontal: true, // 對於 2x2，我們可以設為 true
            is2x2: true,
          });
        }
      }
    }
  }

  private findMoves(): void {
    this.moves = [];

    // Check horizontal swaps
    for (let j = 0; j < this.config.rows; j++) {
      for (let i = 0; i < this.config.columns - 1; i++) {
        this.swap(i, j, i + 1, j);
        this.findClusters();
        this.swap(i, j, i + 1, j);

        if (this.clusters.length > 0) {
          this.moves.push({ column1: i, row1: j, column2: i + 1, row2: j });
        }
      }
    }

    // Check vertical swaps
    for (let i = 0; i < this.config.columns; i++) {
      for (let j = 0; j < this.config.rows - 1; j++) {
        this.swap(i, j, i, j + 1);
        this.findClusters();
        this.swap(i, j, i, j + 1);

        if (this.clusters.length > 0) {
          this.moves.push({ column1: i, row1: j, column2: i, row2: j + 1 });
        }
      }
    }

    this.clusters = [];
  }

  private loopClusters(
    func: (index: number, column: number, row: number, cluster: Cluster) => void
  ): void {
    for (let i = 0; i < this.clusters.length; i++) {
      const cluster = this.clusters[i];

      if (cluster.is2x2) {
        // 處理 2x2 群集：四個位置
        func(i, cluster.column, cluster.row, cluster); // 左上
        func(i, cluster.column + 1, cluster.row, cluster); // 右上
        func(i, cluster.column, cluster.row + 1, cluster); // 左下
        func(i, cluster.column + 1, cluster.row + 1, cluster); // 右下
        // TODO: 剩下的
        this.config.tile.data[cluster.column][cluster.row + 1].type = 0; // 測試用
      } else if (cluster.isLShape) {
        // 處理 L 形群集
        if (cluster.shape === "L-down-right") {
          func(i, cluster.column, cluster.row, cluster);
          func(i, cluster.column, cluster.row + 1, cluster);
          func(i, cluster.column, cluster.row + 2, cluster);
          func(i, cluster.column + 1, cluster.row + 1, cluster);
          func(i, cluster.column + 1, cluster.row + 2, cluster);
        } else if (cluster.shape === "L-right-down") {
          func(i, cluster.column, cluster.row, cluster);
          func(i, cluster.column + 1, cluster.row, cluster);
          func(i, cluster.column + 2, cluster.row, cluster);
          func(i, cluster.column + 1, cluster.row + 1, cluster);
          func(i, cluster.column + 2, cluster.row + 1, cluster);
        } else if (cluster.shape === "L-down-left") {
          func(i, cluster.column + 1, cluster.row, cluster);
          func(i, cluster.column + 1, cluster.row + 1, cluster);
          func(i, cluster.column + 1, cluster.row + 2, cluster);
          func(i, cluster.column, cluster.row + 1, cluster);
          func(i, cluster.column, cluster.row + 2, cluster);
        } else if (cluster.shape === "L-right-up") {
          func(i, cluster.column, cluster.row + 1, cluster);
          func(i, cluster.column + 1, cluster.row + 1, cluster);
          func(i, cluster.column + 2, cluster.row + 1, cluster);
          func(i, cluster.column + 1, cluster.row, cluster);
          func(i, cluster.column + 2, cluster.row, cluster);
        }
      } else {
        // 處理線性群集（水平或垂直）
        let colOffset = 0;
        let rowOffset = 0;
        for (let j = 0; j < cluster.length; j++) {
          func(i, cluster.column + colOffset, cluster.row + rowOffset, cluster);

          if (cluster.horizontal) {
            colOffset++;
          } else {
            rowOffset++;
          }
        }
      }
    }
  }

  private removeClusters(): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.loopClusters((_index, column, row, _cluster) => {
      this.config.tile.data[column][row].type = -1;
    });

    for (let i = 0; i < this.config.columns; i++) {
      let shift = 0;
      for (let j = this.config.rows - 1; j >= 0; j--) {
        if (this.config.tile.data[i][j].type === -1) {
          shift++;
          this.config.tile.data[i][j].shift = 0;
        } else {
          this.config.tile.data[i][j].shift = shift;
        }
      }
    }
  }

  private shiftTiles(): void {
    for (let i = 0; i < this.config.columns; i++) {
      for (let j = this.config.rows - 1; j >= 0; j--) {
        if (this.config.tile.data[i][j].type === -1) {
          this.config.tile.data[i][j].type = this.getRandomTile();
        } else {
          const shift = this.config.tile.data[i][j].shift;
          if (shift > 0) {
            this.swap(i, j, i, j + shift);
          }
        }
        this.config.tile.data[i][j].shift = 0;
      }
    }
  }

  private getMouseTile(pos: Position): MouseTileResult {
    const tx = Math.floor((pos.x - this.config.x) / this.config.tile.width);
    const ty = Math.floor((pos.y - this.config.y) / this.config.tile.height);

    if (
      tx >= 0 &&
      tx < this.config.columns &&
      ty >= 0 &&
      ty < this.config.rows
    ) {
      return { valid: true, x: tx, y: ty };
    }

    return { valid: false, x: 0, y: 0 };
  }

  private canSwap(x1: number, y1: number, x2: number, y2: number): boolean {
    if (
      (Math.abs(x1 - x2) === 1 && y1 === y2) ||
      (Math.abs(y1 - y2) === 1 && x1 === x2)
    ) {
      return true;
    }
    return false;
  }

  private swap(x1: number, y1: number, x2: number, y2: number): void {
    const type = this.config.tile.data[x1][y1].type;
    this.config.tile.data[x1][y1].type = this.config.tile.data[x2][y2].type;
    this.config.tile.data[x2][y2].type = type;
  }

  private mouseSwap(c1: number, r1: number, c2: number, r2: number): void {
    this.currentMove = { column1: c1, row1: r1, column2: c2, row2: r2 };
    this.config.selected.selected = false;
    this.state.animation.state = 2;
    this.state.animation.time = 0;
    this.state.status = GameState.RESOLVE;
  }

  // Public methods for external control
  public getScore(): number {
    return this.score;
  }

  public isGameOver(): boolean {
    return this.gameOver;
  }
}
